import { getAllUserTiers } from '@/database/tier-register';
import { EmbedError } from '@/fragments/error/error';
import { EmbedTierRegister } from '@/fragments/game/register-tier';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('tier-info')
		.setNameLocalizations({
			ko: '티어조회',
		})
		.setDescription('Check tier information')
		.setDescriptionLocalizations({
			ko: '티어 정보를 조회합니다',
		})
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({ ko: '사용자' })
				.setDescription('User to check tier info (default: yourself)')
				.setDescriptionLocalizations({
					ko: '티어 정보를 조회할 사용자 (기본값: 본인)',
				})
				.setRequired(false)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser('user') || interaction.user;
		const embed = new EmbedTierRegister(interaction.guildId!);
		const errorEmbed = new EmbedError(interaction.guildId!);

		try {
			const tierData = await getAllUserTiers(targetUser.id);

			const formattedTierData = [];

			if (tierData?.valorantTier) {
				formattedTierData.push({
					game: 'Valorant',
					tier: tierData.valorantTier,
				});
			}

			if (tierData?.lolTier) {
				formattedTierData.push({
					game: 'League of Legends',
					tier: tierData.lolTier,
				});
			}

			return interaction.editReply({
				embeds: [
					await embed.tierInfo({
						user: targetUser,
						tierData: formattedTierData,
					}),
				],
			});
		} catch (error) {
			console.error('Tier info error:', error);
			return interaction.editReply({
				embeds: [
					await errorEmbed.error({
						content:
							'An error occurred while retrieving tier information. Please try again later.',
					}),
				],
			});
		}
	},
};
