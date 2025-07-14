import { Colors, EmbedBuilder, User } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';

export class EmbedCoinFlip extends BaseFragment {
	async flipping(user: User): Promise<EmbedBuilder> {
		await this.ensureInitialized();
		
		return new EmbedBuilder()
			.setTitle(this.t('components.coin_flip.flipping'))
			.setColor(Colors.Yellow)
			.setFooter({
				text: this.t('components.coin_flip.please_wait'),
				iconURL: user.displayAvatarURL(),
			});
	}

	async result(result: 'heads' | 'tails', user: User): Promise<EmbedBuilder> {
		await this.ensureInitialized();
		
		const resultEmoji = result === 'heads' ? '🪙' : '🪙';
		const resultText = this.t(`components.coin_flip.result.${result}`);
		
		return new EmbedBuilder()
			.setTitle(`${resultEmoji} ${resultText}!`)
			.setDescription(this.t('components.coin_flip.title'))
			.setColor(Colors.Yellow)
			.setFooter({
				text: this.t('components.coin_flip.flipped_by', { user: user.tag }),
				iconURL: user.displayAvatarURL(),
			});
	}
}