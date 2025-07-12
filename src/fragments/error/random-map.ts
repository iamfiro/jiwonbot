import { Colors, EmbedBuilder } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';

export class EmbedErrorRandomMap extends BaseFragment {
	async pleaseSelectMap(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(this.t('error.game.random_map.select'))
			.setTimestamp();
	}
}
