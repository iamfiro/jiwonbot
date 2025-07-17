import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	Colors,
	EmbedBuilder,
	MessageComponentInteraction,
	MessageFlags,
} from 'discord.js';
import { BaseFragment } from './base/baseEmbed';
import {
	deleteScoreboardData,
	getScoreboardData,
	updateScoreboardData,
} from '@/database/scoreboard';

export interface ScoreboardData {
	name: string;
	redTeam: {
		name: string;
		score: number;
	};
	blueTeam: {
		name: string;
		score: number;
	};
	creator: string;
	isFinished: boolean;
	winner?: 'red' | 'blue' | 'tie';
}

export class EmbedScoreboard extends BaseFragment {
	async create(data: ScoreboardData, messageId: string): Promise<{
		embed: EmbedBuilder;
		components: ActionRowBuilder<ButtonBuilder>[];
	}> {
		await this.ensureInitialized();
		const embed = this.createScoreboardEmbed(data);
		const components = this.createScoreboardButtons(data, messageId);

		return { embed, components };
	}

	async update(data: ScoreboardData, messageId: string): Promise<{
		embed: EmbedBuilder;
		components: ActionRowBuilder<ButtonBuilder>[];
	}> {
		await this.ensureInitialized();

		const embed = this.createScoreboardEmbed(data);
		const components = this.createScoreboardButtons(data, messageId);

		return { embed, components };
	}

	static async handleScoreboardInteraction(
		interaction: ButtonInteraction,
		guildId: string
	): Promise<void> {
		const embed = new EmbedScoreboard(guildId);
		await embed.handleButtonInteraction(interaction);
	}

	private createScoreboardEmbed(data: ScoreboardData): EmbedBuilder {
		let color: number;
		let title: string;

		if (data.isFinished) {
			if (data.winner === 'red') {
				color = Colors.Red;
				title = this.t('components.scoreboard.winner', {
					team: data.redTeam.name,
				});
			} else if (data.winner === 'blue') {
				color = Colors.Blue;
				title = this.t('components.scoreboard.winner', {
					team: data.blueTeam.name,
				});
			} else {
				color = Colors.Yellow;
				title = this.t('components.scoreboard.tie');
			}
		} else {
			if (data.redTeam.score === data.blueTeam.score) {
				color = Colors.Yellow;
			} else if (data.redTeam.score > data.blueTeam.score) {
				color = Colors.Red;
			} else {
				color = Colors.Blue;
			}
			title = this.t('components.scoreboard.title', { name: data.name });
		}

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setColor(color)
			.addFields(
				{
					name: `🔴 ${data.redTeam.name}`,
					value: `**${data.redTeam.score}**`,
					inline: true,
				},
				{
					name: this.t('components.scoreboard.vs'),
					value: '⚔️',
					inline: true,
				},
				{
					name: `🔵 ${data.blueTeam.name}`,
					value: `**${data.blueTeam.score}**`,
					inline: true,
				}
			)
			.setTimestamp();

		if (data.isFinished) {
			embed.setFooter({
				text: this.t('components.scoreboard.game_finished', {
					creator: data.creator,
				}),
			});
		} else {
			embed.setFooter({
				text: this.t('components.scoreboard.created_by', {
					creator: data.creator,
				}),
			});
		}

		return embed;
	}

	private createScoreboardButtons(
		data: ScoreboardData,
		messageId: string
	): ActionRowBuilder<ButtonBuilder>[] {
		if (data.isFinished) {
			const closeButton = new ButtonBuilder()
				.setCustomId(`scoreboard-close-${messageId}`)
				.setLabel(this.t('components.scoreboard.buttons.close'))
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🗑️');

			return [new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)];
		}

		const redIncrementButton = new ButtonBuilder()
			.setCustomId(`scoreboard-increment-${messageId}-red`)
			.setLabel('+1')
			.setEmoji('⬆️')
			.setStyle(ButtonStyle.Danger);

		const redDecrementButton = new ButtonBuilder()
			.setCustomId(`scoreboard-decrement-${messageId}-red`)
			.setLabel('-1')
			.setStyle(ButtonStyle.Danger)
			.setEmoji('⬇️')
			.setDisabled(data.redTeam.score <= 0);

		const blueIncrementButton = new ButtonBuilder()
			.setCustomId(`scoreboard-increment-${messageId}-blue`)
			.setLabel('+1')
			.setStyle(ButtonStyle.Primary)
			.setEmoji('⬆️');

		const blueDecrementButton = new ButtonBuilder()
			.setCustomId(`scoreboard-decrement-${messageId}-blue`)
			.setLabel('-1')
			.setStyle(ButtonStyle.Primary)
			.setEmoji('⬇️')
			.setDisabled(data.blueTeam.score <= 0);

		const resetButton = new ButtonBuilder()
			.setCustomId(`scoreboard-reset-${messageId}`)
			.setLabel(this.t('components.scoreboard.buttons.reset'))
			.setStyle(ButtonStyle.Secondary)
			.setEmoji('🔄');

		const closeButton = new ButtonBuilder()
			.setCustomId(`scoreboard-close-${messageId}`)
			.setLabel(this.t('components.scoreboard.buttons.close'))
			.setStyle(ButtonStyle.Secondary)
			.setEmoji('🗑️');

		return [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				redIncrementButton,
				redDecrementButton,
				blueIncrementButton,
				blueDecrementButton
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				resetButton,
				closeButton
			),
		];
	}

	private async handleButtonInteraction(
		interaction: ButtonInteraction
	): Promise<void> {
		const customId = interaction.customId;
		const messageId = interaction.message.id;
		const [, action, , team] = customId.split('-');

		const currentData = await getScoreboardData(messageId);
		if (!currentData) {
			await this.handleError(interaction);
			return;
		}

		if (currentData.isFinished) {
			if (action === 'close') {
				await interaction.update({
					embeds: [await this.createClosedEmbed(currentData)],
					components: [],
				});
				await deleteScoreboardData(messageId);
			}
			return;
		}

		let newData = { ...currentData };

		switch (action) {
			case 'increment':
				if (team === 'red') {
					newData.redTeam.score++;
				} else if (team === 'blue') {
					newData.blueTeam.score++;
				}
				break;

			case 'decrement':
				if (team === 'red' && newData.redTeam.score > 0) {
					newData.redTeam.score--;
				} else if (team === 'blue' && newData.blueTeam.score > 0) {
					newData.blueTeam.score--;
				}
				break;

			case 'reset':
				newData.redTeam.score = 0;
				newData.blueTeam.score = 0;
				break;

			case 'close':
				await interaction.update({
					embeds: [await this.createClosedEmbed(currentData)],
					components: [],
				});

				await deleteScoreboardData(messageId);
				return;
		}

		await updateScoreboardData(messageId, newData);

		const { embed, components } = await this.update(newData, messageId);
		await interaction.update({
			embeds: [embed],
			components,
		});
	}

	private formatScore(
		score: number,
		targetScore: number | undefined
	): string {
		if (targetScore) {
			const percentage = Math.round((score / targetScore) * 100);
			return `**${score}** / ${targetScore}\n${percentage}%`;
		} else {
			return `**${score}**`;
		}
	}

	private createProgressBar(
		redScore: number,
		blueScore: number,
		targetScore: number
	): string {
		const redPercentage = redScore / targetScore;
		const bluePercentage = blueScore / targetScore;

		const barLength = 20;

		const redBars = Math.round(redPercentage * targetScore);
		const blueBars = Math.round(bluePercentage * barLength);

		const redBar = '🟥'.repeat(Math.min(redBars, barLength));
		const blueBar = '🟦'.repeat(Math.min(blueBars, barLength));

		return `🔴 ${redBar}\n🔵 ${blueBar}`;
	}

	private async createClosedEmbed(data: ScoreboardData): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setTitle(this.t('components.scoreboard.closed_title'))
			.setDescription(this.t('components.scoreboard.closed_description'))
			.setColor(Colors.Grey)
			.addFields({
				name: this.t('components.scoreboard.final_score'),
				value: `🔴 ${data.redTeam.name}: **${data.redTeam.score}**\n🔵 ${data.blueTeam.name}: **${data.blueTeam.score}**`,
				inline: false,
			})
			.setTimestamp();
	}
	
	private async handleError(interaction: MessageComponentInteraction): Promise<void> {
		try {
			const errorEmbed = new EmbedBuilder()
				.setTitle(this.t('components.scoreboard.error_title'))
				.setDescription(this.t('components.scoreboard.error_description'))
				.setColor(Colors.Red)
				.setTimestamp();

			if(interaction.replied || interaction.deferred) {
				await interaction.editReply({
					embeds: [errorEmbed],
					components: []
				});
			} else {
				await interaction.reply({
					embeds: [errorEmbed],
					components: [],
					flags: MessageFlags.Ephemeral
				})
			}
		} catch (error) {
			console.error('Error sending error message: ', error);
		}
	}

	async createLoadingEmbed(): Promise<EmbedBuilder> {
		await this.ensureInitialized();
		
		return new EmbedBuilder()
			.setTitle('⏳ ' + this.t('components.scoreboard.loading_title'))
			.setDescription(this.t('components.scoreboard.loading_description'))
			.setColor(Colors.Yellow)
			.setTimestamp();
	}
}