import { Colors, EmbedBuilder } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';

interface Args {
	mapName: string;
    ext: string;
}

export class EmbedRandomMap extends BaseFragment {
	async create({
		mapName,
        ext
	}: Args): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		let displayMapName = mapName;
        
		if (this.language !== 'ko') {
			const match = mapName.match(/\(([^)]+)\)/);
			if (match && match[1]) {
				displayMapName = match[1].trim();
			}
		}
		return new EmbedBuilder()
			.setTitle(this.t('components.random_map.selected'))
			.addFields([{ name: this.t('components.random_map.selected_map'), value: `🗺️ ${displayMapName}` }])
			.setThumbnail(`attachment://map.${ext}`)
			.setImage(`attachment://banner.${ext}`);
	}
}
