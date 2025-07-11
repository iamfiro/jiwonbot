import { Colors, EmbedBuilder } from 'discord.js';
import { BaseEmbed } from '../baseEmbed';

interface Args {
	currentLang: string;
}

export class EmbedLanguage extends BaseEmbed {
	async ChangeSuccess({
		currentLang,
	}: Args): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle(this.t('components.setting_language.title'))
			.setDescription(this.t('components.setting_language.current') + currentLang)
			.setTimestamp()
	}
}
