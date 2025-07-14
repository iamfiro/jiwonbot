import { setUserTier } from '@/database/tier-register';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
	User,
	MessageComponentInteraction,
} from 'discord.js';
import { BaseFragment } from '../base/baseEmbed';
import { SupportGameTier } from '@/constants/game';
import { GameTierList } from '@/constants/tier';
import { SupportedLanguage } from '@/utils/language';

interface TierSelectionState {
	currentPage: number;
	totalPages: number;
	tierGroups: StringSelectMenuOptionBuilder[][];
	selectedGame: SupportGameTier;
}

export class EmbedTierRegister extends BaseFragment {
	private static readonly TIERS_PER_PAGE = 10;
	private static readonly COLLECTOR_TIMEOUT = 60000;

	async createTierSelection(
		game: SupportGameTier,
		user: User
	): Promise<{ embeds: EmbedBuilder[]; components: ActionRowBuilder<any>[] }> {
		await this.ensureInitialized();

		const tierList = getLocalizedTierList(game, this.language);
		const tierOptions = tierList.map((tier) =>
			new StringSelectMenuOptionBuilder()
				.setLabel(tier.label)
				.setValue(tier.value)
				.setEmoji(tier.emoji)
		);

		const tierGroups = this.splitTiersIntoGroups(tierOptions);
		const state: TierSelectionState = {
			currentPage: 0,
			totalPages: tierGroups.length,
			tierGroups,
			selectedGame: game,
		};

		const embed = this.createSelectionEmbed(game, user, state);
		const components = this.createComponents(state);

		return {
			embeds: [embed],
			components,
		};
	}

	async handleInteractions(
		interaction: ChatInputCommandInteraction,
		selectedGame: SupportGameTier
	): Promise<void> {
		const tierList = getLocalizedTierList(selectedGame, this.language);
		const tierOptions = tierList.map((tier) =>
			new StringSelectMenuOptionBuilder()
				.setLabel(tier.label)
				.setValue(tier.value)
				.setEmoji(tier.emoji)
		);

		const state: TierSelectionState = {
			currentPage: 0,
			totalPages: this.splitTiersIntoGroups(tierOptions).length,
			tierGroups: this.splitTiersIntoGroups(tierOptions),
			selectedGame,
		};

		const collector = interaction.channel?.createMessageComponentCollector({
			time: EmbedTierRegister.COLLECTOR_TIMEOUT,
			filter: (i) => i.user.id === interaction.user.id,
		});

		if (!collector) return;

		collector.on('collect', async (i) => {
			try {
				if (i.isStringSelectMenu() && i.customId === 'tier-select') {
					await this.handleTierSelection(i, tierList, selectedGame);
					collector.stop();
				} else if (i.isButton() && (i.customId === 'tier-prev' || i.customId === 'tier-next')) {
					await this.handlePagination(i, state);
				}
			} catch (error) {
				console.error('Error handling tier register interaction:', error);
				await this.handleError(i);
			}
		});

		collector.on('end', async (collected) => {
			if (collected.size === 0) {
				try {
					await interaction.editReply({
						embeds: [await this.createTimeoutEmbed()],
						components: [],
					});
				} catch (error) {
					console.error('Error handling timeout:', error);
				}
			}
		});
	}

	private createSelectionEmbed(
		game: SupportGameTier,
		user: User,
		state: TierSelectionState
	): EmbedBuilder {
		const gameDisplayName = this.t(`game.${game.toLowerCase().replace(' ', '_')}.name`);
		const gameEmoji = game === SupportGameTier.Valorant ? '🔫' : '⚔️';

		return new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle(this.t('components.tier_register.title', { 
				emoji: gameEmoji, 
				game: gameDisplayName 
			}))
			.setDescription(
				this.t('components.tier_register.description', {
					user: user.displayName,
					game: gameDisplayName,
					currentPage: state.currentPage + 1,
					totalPages: state.totalPages
				})
			)
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setFooter({
				text: this.t('components.tier_register.footer'),
				iconURL: user.displayAvatarURL(),
			});
	}

	private createComponents(state: TierSelectionState): ActionRowBuilder<any>[] {
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('tier-select')
			.setPlaceholder(this.t('components.tier_register.select_placeholder'))
			.addOptions(...state.tierGroups[state.currentPage]);

		const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('tier-prev')
				.setLabel(this.t('components.tier_register.prev_page'))
				.setEmoji('⬅️')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(state.currentPage === 0),
			new ButtonBuilder()
				.setCustomId('tier-next')
				.setLabel(this.t('components.tier_register.next_page'))
				.setEmoji('➡️')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(state.currentPage === state.totalPages - 1)
		);

		return state.totalPages > 1 ? [selectRow, buttonRow] : [selectRow];
	}

	private async handleTierSelection(
		interaction: StringSelectMenuInteraction,
		tierList: any[],
		selectedGame: SupportGameTier
	): Promise<void> {
		const selectedTierValue = interaction.values[0];
		const selectedTier = tierList.find((tier) => tier.value === selectedTierValue);

		if (!selectedTier) {
			await this.handleError(interaction);
			return;
		}

		try {
			await setUserTier(interaction.user.id, selectedGame, selectedTierValue);

			const successEmbed = await this.createSuccessEmbed(selectedGame, selectedTier, interaction.user);
			await interaction.update({
				embeds: [successEmbed],
				components: [],
			});
		} catch (error) {
			console.error('Database error:', error);
			await this.handleError(interaction);
		}
	}

	private async handlePagination(interaction: ButtonInteraction, state: TierSelectionState): Promise<void> {
		if (interaction.customId === 'tier-next' && state.currentPage < state.totalPages - 1) {
			state.currentPage++;
		} else if (interaction.customId === 'tier-prev' && state.currentPage > 0) {
			state.currentPage--;
		}

		const embed = this.createSelectionEmbed(state.selectedGame, interaction.user, state);
		const components = this.createComponents(state);

		await interaction.update({
			embeds: [embed],
			components,
		});
	}

	private async createSuccessEmbed(
		game: SupportGameTier,
		tier: any,
		user: User
	): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		const gameDisplayName = this.t(`game.${game.toLowerCase().replace(' ', '_')}.name`);
		const gameEmoji = game === SupportGameTier.Valorant ? '🔫' : '⚔️';

		return new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle(this.t('components.tier_register.success_title'))
			.setDescription(
				this.t('components.tier_register.success_description', {
					user: user.displayName,
					game: gameDisplayName,
					gameEmoji,
					tierEmoji: tier.emoji,
					tierLabel: tier.label
				})
			)
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setFooter({
				text: this.t('components.tier_register.success_footer'),
			});
	}

	private async createTimeoutEmbed(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle(this.t('components.tier_register.timeout_title'))
			.setDescription(this.t('components.tier_register.timeout_description'))
			.setTimestamp();
	}

	private async createErrorEmbed(): Promise<EmbedBuilder> {
		await this.ensureInitialized();

		return new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(this.t('components.tier_register.error_title'))
			.setDescription(this.t('components.tier_register.error_description'))
			.setTimestamp();
	}

	private async handleError(interaction: MessageComponentInteraction): Promise<void> {
		const errorEmbed = await this.createErrorEmbed();
		
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({
					embeds: [errorEmbed],
					components: [],
				});
			} else {
				await interaction.reply({
					embeds: [errorEmbed],
					components: [],
					ephemeral: true,
				});
			}
		} catch (error) {
			console.error('Error sending error message:', error);
		}
	}

	private splitTiersIntoGroups(
		tiers: StringSelectMenuOptionBuilder[]
	): StringSelectMenuOptionBuilder[][] {
		const groups: StringSelectMenuOptionBuilder[][] = [];
		for (let i = 0; i < tiers.length; i += EmbedTierRegister.TIERS_PER_PAGE) {
			groups.push(tiers.slice(i, i + EmbedTierRegister.TIERS_PER_PAGE));
		}
		return groups;
	}
}

/**
 * 언어에 맞는 티어 옵션 리스트를 반환합니다
 * @param game - 게임 타입
 * @param language - 언어
 * @returns 언어에 맞는 티어 배열
 */
export function getLocalizedTierList(game: SupportGameTier, language: SupportedLanguage): Array<{
	label: string;
	value: string;
	weight: number;
	emoji: string;
}> {
	const tierList = GameTierList[game];
	return tierList.map(tier => ({
		label: tier.label[language],
		value: tier.value,
		weight: tier.weight,
		emoji: tier.emoji
	}));
}