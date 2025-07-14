import { SupportGameTier } from '@/constants/game';
import { EmbedBalanceTeam } from '@/fragments/game/team-balance';
import { EmbedError } from '@/fragments/error/error';
import { TeamBalancer, BalancePlayer } from '@/core/team-balancer';

import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	VoiceChannel,
	GuildMember,
	ChannelType
} from 'discord.js';
import { getUserTiers } from '@/database/balance-team';

export default {
	info: new SlashCommandBuilder()
		.setName('balance-team')
		.setNameLocalizations({
			ko: '팀밸런스',
		})
		.setDescription('Balance teams based on player tiers from voice channel')
		.setDescriptionLocalizations({
			ko: '음성 채널에 있는 플레이어들의 티어를 기반으로 팀을 밸런싱합니다',
		})
		.addStringOption((option) =>
			option
				.setName('game')
				.setNameLocalizations({ ko: '게임' })
				.setDescription('Select the game for team balancing')
				.setDescriptionLocalizations({
					ko: '팀 밸런싱할 게임을 선택하세요',
				})
				.setRequired(true)
				.addChoices(
					{
						name: '🔫 Valorant',
						value: SupportGameTier.Valorant,
					},
					{
						name: '⚔️ League of Legends',
						value: SupportGameTier['League of Legends'],
					}
				)
		)
		.addChannelOption((option) =>
			option
				.setName('voice-channel')
				.setNameLocalizations({ ko: '음성채널' })
				.setDescription('Voice channel to get players from (optional - uses your current channel if not specified)')
				.setDescriptionLocalizations({
					ko: '플레이어를 가져올 음성 채널 (선택사항 - 지정하지 않으면 현재 채널 사용)',
				})
				.setRequired(false)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const selectedGame = interaction.options.getString('game', true) as SupportGameTier;
		const specifiedChannel = interaction.options.getChannel('voice-channel') as VoiceChannel | null;
		const member = interaction.member as GuildMember;
		
		const errorEmbed = new EmbedError(interaction.guildId!);
		const balanceEmbed = new EmbedBalanceTeam(interaction.guildId!);

		// 음성 채널 확인
		let voiceChannel: VoiceChannel;
		
		if (specifiedChannel) {
			if (specifiedChannel.type !== ChannelType.GuildVoice) {
				return interaction.editReply({
					embeds: [await errorEmbed.error({
						content: 'The specified channel must be a voice channel!'
					})]
				});
			}
			voiceChannel = specifiedChannel as VoiceChannel;
		} else {
			if (!member.voice.channel) {
				return interaction.editReply({
					embeds: [await balanceEmbed.notInVoiceChannel()]
				});
			}
			voiceChannel = member.voice.channel as VoiceChannel;
		}

		// 음성 채널의 멤버들 가져오기
		const voiceMembers = Array.from(voiceChannel.members.values())
			.filter(member => !member.user.bot); // 봇 제외

		if (voiceMembers.length < 2) {
			return interaction.editReply({
				embeds: [await balanceEmbed.notEnoughPlayers(voiceMembers.length)]
			});
		}

		if (voiceMembers.length > 10) {
			return interaction.editReply({
				embeds: [await balanceEmbed.tooManyPlayers(voiceMembers.length)]
			});
		}

		try {
			// 데이터베이스에서 각 플레이어의 티어 정보 가져오기
			const userIds = voiceMembers.map(member => member.id);
			const userTierInfos = await getUserTiers(userIds, selectedGame);
			
			const players: BalancePlayer[] = [];
			const unregisteredPlayers: GuildMember[] = [];

			for (const member of voiceMembers) {
				const tierInfo = userTierInfos.find(info => info.userId === member.id);
				
				if (tierInfo?.isRegistered && tierInfo.tier) {
					players.push({
						name: member.displayName,
						tier: tierInfo.tier,
						userId: member.id
					});
				} else {
					unregisteredPlayers.push(member);
				}
			}

			// 등록되지 않은 플레이어가 있는 경우
			if (unregisteredPlayers.length > 0) {
				return interaction.editReply({
					embeds: [
						await balanceEmbed.balanceResult(
							null, 
							selectedGame, 
							voiceChannel.name, 
							players.length + unregisteredPlayers.length,
							unregisteredPlayers
						)
					]
				});
			}

			// 등록된 플레이어가 2명 미만인 경우
			if (players.length < 2) {
				return interaction.editReply({
					embeds: [await balanceEmbed.notEnoughPlayers(players.length)]
				});
			}

			// 팀 밸런싱 실행
			const balancer = new TeamBalancer(selectedGame);
			const solution = balancer.generateOptimalSolution(players);

			return interaction.editReply({
				embeds: [
					await balanceEmbed.balanceResult(
						solution, 
						selectedGame, 
						voiceChannel.name, 
						players.length,
						unregisteredPlayers
					)
				]
			});

		} catch (error) {
			console.error('❌ Error in team balancing:', error);
			
			return interaction.editReply({
				embeds: [await errorEmbed.error({
					content: 'An error occurred while balancing teams. Please try again later.'
				})]
			});
		}
	},
};