import { Colors, EmbedBuilder } from 'discord.js';
import { BaseFragment } from './base/baseEmbed';

interface Args {
	apiLatency: number;
	messageLatency: number;
	userTag: string;
	userAvatar: string;
}

export class EmbedPing extends BaseFragment {
	async create({
		apiLatency,
		messageLatency,
		userTag,
		userAvatar,
	}: Args): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle(this.t('components.ping.title'))
			.addFields(
				{
					name: this.t('components.ping.api'),
					value: `${apiLatency}ms`,
					inline: true,
				},
				{
					name: this.t('components.ping.message'),
					value: `${messageLatency}ms`,
					inline: true,
				}
			)
			.setTimestamp()
			.setFooter({ text: `Requested by ${userTag}`, iconURL: userAvatar });
	}
}
