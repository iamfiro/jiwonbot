import { getGuildLanguage } from '@/database/language';
import { EmbedPing } from '@/fragments/ping';
import { createLangFunction, SupportedLanguage } from '@/utils/language';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong with latency information!')
		.setDescriptionLocalizations({
			ko: '봇의 현재 Ping을 알려드려요!',
		}),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();
		const latency = reply.createdTimestamp - interaction.createdTimestamp;

		const embed = await new EmbedPing(interaction.guildId!).create({
			apiLatency: Math.round(interaction.client.ws.ping),
			messageLatency: latency,
			userTag: interaction.user.tag,
			userAvatar: interaction.user.displayAvatarURL(),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
