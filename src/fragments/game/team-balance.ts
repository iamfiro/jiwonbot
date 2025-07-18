import { Colors, EmbedBuilder, GuildMember } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';
import { BalanceSolution } from '@/core/team-balancer';
import { SupportGameTier } from '@/constants/game';

export class EmbedBalanceTeam extends BaseFragment {
	async notInVoiceChannel(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('🔊 ' + this.t('components.balance_team.errors.not_in_voice'))
			.setDescription(this.t('components.balance_team.errors.not_in_voice_desc'))
			.setTimestamp();
	}

	async notEnoughPlayers(playerCount: number): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle('👥 ' + this.t('components.balance_team.errors.not_enough_players'))
			.setDescription(this.t('components.balance_team.errors.not_enough_players_desc', { 
				current: playerCount.toString(),
				minimum: '2'
			}))
			.setTimestamp();
	}

	async tooManyPlayers(playerCount: number): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle('👥 ' + this.t('components.balance_team.errors.too_many_players'))
			.setDescription(this.t('components.balance_team.errors.too_many_players_desc', { 
				current: playerCount.toString(),
				maximum: '10'
			}))
			.setTimestamp();
	}

	async balanceResult(
		solution: BalanceSolution | null,
		game: SupportGameTier,
		channelName: string,
		totalPlayers: number,
		unregisteredPlayers: GuildMember[] = []
	): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		const gameEmoji = game === SupportGameTier.Valorant ? '🔫' : '⚔️';
		const gameName = this.t(`game.${game.toLowerCase().replace(/\s+/g, '_')}.name`);

		// 등록되지 않은 플레이어가 있는 경우
		if (unregisteredPlayers.length > 0) {
			const unregisteredList = unregisteredPlayers
				.map(member => `• ${member.displayName}`)
				.join('\n');

			return new EmbedBuilder()
				.setColor(Colors.Yellow)
				.setTitle('⚠️ ' + this.t('components.balance_team.partial_result'))
				.setDescription(this.t('components.balance_team.unregistered_players_desc'))
				.addFields(
					{
						name: '🎮 ' + this.t('components.balance_team.game_info'),
						value: `${gameEmoji} ${gameName}`,
						inline: true
					},
					{
						name: '🔊 ' + this.t('components.balance_team.voice_channel'),
						value: `📢 ${channelName}`,
						inline: true
					},
					{
						name: '👥 ' + this.t('components.balance_team.total_players'),
						value: `${totalPlayers}`,
						inline: true
					},
					{
						name: '❌ ' + this.t('components.balance_team.unregistered_players'),
						value: unregisteredList,
						inline: false
					}
				)
				.setFooter({ 
					text: this.t('components.balance_team.register_tier_hint')
				})
				.setTimestamp();
		}

		// 정상적인 밸런싱 결과
		if (!solution) {
			return new EmbedBuilder()
				.setColor(Colors.Red)
				.setTitle('❌ ' + this.t('components.balance_team.balance_failed'))
				.setTimestamp();
		}

		const balanceColor = this.getBalanceColor(solution.balanceType);
		const balanceEmoji = this.getBalanceEmoji(solution.balanceType);

		// 팀 A 정보
		const teamAPlayers = solution.teamA.players
			.map(player => `• **${player.name}** (${player.tier})`)
			.join('\n');

		// 팀 B 정보  
		const teamBPlayers = solution.teamB.players
			.map(player => `• **${player.name}** (${player.tier})`)
			.join('\n');

		return new EmbedBuilder()
			.setColor(balanceColor)
			.setTitle(`${balanceEmoji} ${this.t('components.balance_team.teams_balanced')}`)
			.setDescription(this.t('components.balance_team.balance_desc', {
				channel: channelName,
				game: `${gameEmoji} ${gameName}`
			}))
			.addFields(
				{
					name: '👥 ' + this.t('components.balance_team.total_players'),
					value: `${totalPlayers}`,
					inline: false
				},
				{
					name: '🔵 ' + this.t('components.balance_team.team_a'),
					value: `${teamAPlayers}`,
					inline: true
				},
				{
					name: '🟣 ' + this.t('components.balance_team.team_b'),
					value: `${teamBPlayers}`,
					inline: true
				},
				{
					name: 'ㅤ',
					value: `**${this.t('components.balance_team.balance_grade')}:** ${balanceEmoji} ${this.t(`components.balance_team.grades.${solution.balanceType.toLowerCase()}`)}`,
					inline: false
				},
			)
			.setTimestamp();
	}

	private getBalanceColor(balanceType: string): number {
		switch (balanceType) {
			case 'Perfect': return Colors.Green;
			case 'Excellent': return Colors.Blue;
			case 'Good': return Colors.Yellow;
			case 'Acceptable': return Colors.Orange;
			case 'Poor': return Colors.Red;
			default: return Colors.Grey;
		}
	}

	private getBalanceEmoji(balanceType: string): string {
		switch (balanceType) {
			case 'Perfect': return '🏆';
			case 'Excellent': return '⭐';
			case 'Good': return '👍';
			case 'Acceptable': return '👌';
			case 'Poor': return '😞';
			default: return '❓';
		}
	}
}