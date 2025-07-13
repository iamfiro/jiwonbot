import {
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
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

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Flipping a coin...')
					.setColor(Colors.Yellow)
					.setFooter({
						text: 'Please wait...',
						iconURL: interaction.user.displayAvatarURL(),
					}),
			],
		});

		// 1.5 seconds delay to simulate coin flip
		await new Promise((resolve) => setTimeout(resolve, 1500));

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`🪙 ${coin} !`)
					.setDescription('Coin Flip')
					.setColor(Colors.Yellow)
					.setFooter({
						text: `Flipped by ${interaction.user.tag}`,
						iconURL: interaction.user.displayAvatarURL(),
					}),
			],
		});
	},
};
