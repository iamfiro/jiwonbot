import { Colors, EmbedBuilder, User } from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';

export class EmbedRSP extends BaseFragment {
	async cannotAlone(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setTitle(this.t('components.rsp.cannot_alone'))
			.setColor(Colors.Red)
			.setTimestamp();
	}

	async cannotBot(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setTitle(this.t('components.rsp.cannot_bot'))
			.setColor(Colors.Red)
			.setTimestamp();
	}

	async gameResult(
		challenger: User,
		target: User,
		challengerChoice: string,
		targetChoice: string,
		result: 'tie' | 'challenger' | 'target'
	): Promise<EmbedBuilder> {
		await this.ensureInitialized();
		
		const emojis = {
			rock: '🪨',
			paper: '📄',
			scissors: '✂️',
		};

		const choiceNames = {
			rock: this.t('components.rsp.choices.rock'),
			paper: this.t('components.rsp.choices.paper'),
			scissors: this.t('components.rsp.choices.scissors'),
		};

		let resultText: string;
		let color: number;

		switch (result) {
			case 'tie':
				resultText = this.t('components.rsp.result.tie');
				color = Colors.Yellow;
				break;
			case 'challenger':
				resultText = this.t('components.rsp.result.win', {
					winner: challenger.displayName,
				});
				color = Colors.Green;
				break;
			case 'target':
				resultText = this.t('components.rsp.result.win', {
					winner: target.displayName,
				});

				color = Colors.Blue;
				break;
		}

		return new EmbedBuilder()
			.setTitle(resultText)
			.setColor(color)
			.addFields(
				{
					name: challenger.displayName,
					value: `${emojis[challengerChoice as keyof typeof emojis]} ${
						choiceNames[challengerChoice as keyof typeof choiceNames]
					}`,
					inline: true,
				},
				{
					name: 'VS',
					value: '⚔️',
					inline: true,
				},
				{
					name: target.displayName,
					value: `${emojis[targetChoice as keyof typeof emojis]} ${
						choiceNames[targetChoice as keyof typeof choiceNames]
					}`,
					inline: true,
				}
			)
			.setTimestamp();
	}
}
