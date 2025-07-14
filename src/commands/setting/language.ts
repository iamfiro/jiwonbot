import { getGuildLanguage, setGuildLanguage } from '@/database/language';
import { EmbedError } from '@/fragments/error/error';
import { EmbedLanguage } from '@/fragments/setting/language';
import { SupportedLanguage } from '@/utils/language';
import { languageManager } from '@/utils/language-manager';
import prisma from '@/utils/prisma';
import {
	ChatInputCommandInteraction,
	Guild,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	info: new SlashCommandBuilder()
		.setName('set-language')
		.setNameLocalizations({
			ko: '언어설정',
		})
		.setDescription('Set the language for the bot in this server.')
		.setDescriptionLocalizations({
			ko: '지원봇의 언어를 설정해요!',
		})
		.addStringOption((option) =>
			option
				.setName('language')
				.setNameLocalizations({
					ko: '언어',
				})
				.setDescription('The language to set for the bot.')
				.setDescriptionLocalizations({
					ko: '지원봇의 언어를 설정해요!',
				})
				.setRequired(true)
				.addChoices(
					{ name: '🇺🇸 - English', value: 'en' },
					{ name: '🇰🇷 - 한국어', value: 'ko' }
				)
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		const selectedLanguage = interaction.options.getString(
			'language',
			true
		) as SupportedLanguage;

		try {
			await setGuildLanguage(interaction.guildId!, selectedLanguage);

			languageManager.setGuildLanguage(interaction.guildId!, selectedLanguage);

			const embed = await new EmbedLanguage(interaction.guildId!).ChangeSuccess(
				{
					currentLang: selectedLanguage,
				}
			);

			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			const embed = await new EmbedError(interaction.guildId!).error({
				content: error,
			});
			return interaction.reply({ embeds: [embed] });
		}
	},
};
