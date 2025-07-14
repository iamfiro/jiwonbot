import { EmbedCoinFlip } from '@/fragments/minigame/coin-flip';
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('coin-flip')
		.setNameLocalizations({
			ko: '동전던지기',
		})
		.setDescription("Flips a coin and tells you if it's heads or tails!")
		.setDescriptionLocalizations({
			ko: '동전을 던져서 앞면인지 뒷면인지 알려드려요!',
		}),
	execute: async (interaction: ChatInputCommandInteraction) => {
		const coin = Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails';
		const embed = new EmbedCoinFlip(interaction.guildId!);

		await interaction.reply({
			embeds: [await embed.flipping(interaction.user)],
		});

		await new Promise((resolve) => setTimeout(resolve, 1500));

		await interaction.editReply({
			embeds: [await embed.result(coin, interaction.user)],
		});
	},
};