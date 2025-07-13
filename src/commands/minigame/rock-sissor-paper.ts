import { EmbedRSP } from '@/fragments/minigame/rock-scissor-paper';
import {
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
	User,
} from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('rsp')
		.setNameLocalizations({
			ko: '가위바위보',
		})
		.setDescription('Play Rock Paper Scissors!')
		.setDescriptionLocalizations({
			ko: '가위바위보 게임을 합니다!',
		})
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('choose a user to play Rock Paper Scissors with')
				.setDescriptionLocalizations({
					ko: '가위바위보를 할 상대방을 선택하세요',
				})
				.setRequired(true)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		console.log(interaction.guildId!);
		const targetUser = interaction.options.getUser('user') as User;
		const challenger = interaction.user;

		const embed = new EmbedRSP(interaction.guildId!);

		if (targetUser.id === challenger.id) {
			return await interaction.reply({
				embeds: [await embed.cannotAlone()],
				flags: MessageFlags.Ephemeral,
			});
		}

		if (targetUser.bot) {
			return await interaction.reply({
				embeds: [await embed.cannotBot()],
				flags: MessageFlags.Ephemeral,
			});
		}

		const choices = ['rock', 'paper', 'scissors'];

		const challengerChoice = Math.floor(Math.random() * 3);
		const targetChoice = Math.floor(Math.random() * 3);

		let result: 'tie' | 'challenger' | 'target';

		if (challengerChoice === targetChoice) {
			result = 'tie';
		} else if (
			(challengerChoice === 0 && targetChoice === 2) || // Rock vs Scissors
			(challengerChoice === 1 && targetChoice === 0) || // Paper vs Rock
			(challengerChoice === 2 && targetChoice === 1) // Scissors vs Paper
		) {
			result = 'challenger';
		} else {
			result = 'target';
		}

		const gameResult = await embed.gameResult(
			challenger,
			targetUser,
			choices[challengerChoice],
			choices[targetChoice],
			result
		);

		await interaction.reply({
			embeds: [gameResult],
		});
	},
};
