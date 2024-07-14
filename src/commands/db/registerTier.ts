import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder 
} from "discord.js";
import { SupportGame, Tier } from "../../types/constant";
import GameTierList from "../../constant/tier";
import Logger from "../../lib/logger";
import prisma from "../../lib/prisma";

const logger = new Logger();

/**
 * Split tiers into groups for better user selection experience
 * @param tiers - Array of tier objects
 * @param groupSize - Number of tiers per group
 * @returns Array of tier groups
 */
function splitTiersIntoGroups(tiers: StringSelectMenuOptionBuilder[], groupSize: number): StringSelectMenuOptionBuilder[][] {
    const groups: StringSelectMenuOptionBuilder[][] = [];
    for (let i = 0; i < tiers.length; i += groupSize) {
        groups.push(tiers.slice(i, i + groupSize));
    }
    return groups;
}

/**
 * Create an action row with pagination buttons
 * @param currentPage - The current page index
 * @param totalPages - The total number of pages
 * @returns Action row with pagination buttons
 */
function createPaginationButtons(currentPage: number, totalPages: number) {
    const buttons = new ActionRowBuilder<ButtonBuilder>();

    buttons.addComponents(
        new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('⬅️ 이전 티어 보기')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('➡️ 다음 티어 보기')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1)
    );

    return buttons;
}

/**
 * Handle the interaction for tier registration
 * @param interaction - The interaction object from Discord
 */
async function handler(interaction: ChatInputCommandInteraction) {
    const selectGame = interaction.options.getString('게임') as SupportGame;
    const TierList: Tier[] = GameTierList[selectGame];
    const groupSize = 10; // Define the size of each group
    const stringSelectMenuOptions: StringSelectMenuOptionBuilder[] = TierList.map(tier => 
        new StringSelectMenuOptionBuilder().setLabel(tier.label).setValue(tier.value).setEmoji(tier.emoji)
    );
    const tierGroups = splitTiersIntoGroups(stringSelectMenuOptions, groupSize);
    const totalPages = tierGroups.length;

    // Initialize with the first page
    let currentPage = 0;

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('tier-register')
        .setPlaceholder('티어를 선택해주세요')
        .addOptions(...tierGroups[currentPage]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    const paginationButtons = createPaginationButtons(currentPage, totalPages);

    await interaction.reply({
        content: "🛡️ 티어를 선택해주세요",
        components: [row, paginationButtons],
        ephemeral: true
    });

    // Create a collector to handle button interactions
    const collector = interaction.channel?.createMessageComponentCollector({ time: 60000 });

    collector?.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) return;

        if (i.isStringSelectMenu() && i.customId === 'tier-register') {
            const selectedTier = i.values[0];
            const fieldToUpdate = selectGame === SupportGame.Valorant ? 'valorantTier' : 'lolTier';

            try {
                await prisma.tier.upsert({
                    where: { userId: interaction.user.id },
                    update: { [fieldToUpdate]: selectedTier },
                    create: { userId: interaction.user.id, [fieldToUpdate]: selectedTier }
                });

                logger.info(`Tier registered successfully: ${selectedTier} for ${interaction.user.id}`);

                await i.update({
                    content: `✅ ${selectGame === SupportGame.Valorant ? '발로란트' : '롤'} 티어가 성공적으로 등록되었습니다: ${TierList.find(tier => tier.value === selectedTier)?.emoji} ${TierList.find(tier => tier.value === selectedTier)?.label}`,
                    components: [],
                });
                
                collector.stop();
            } catch (error) {
                logger.error(`Failed to register tier: ${error}`);
                await i.update({
                    content: `❌ 티어 등록에 실패했습니다.`,
                    components: []
                });
                collector.stop();
            }
        } else if (i.isButton()) {
            if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (i.customId === 'previous' && currentPage > 0) {
                currentPage--;
            }

            const updatedSelectMenu = new StringSelectMenuBuilder()
                .setCustomId('tier-register')
                .setPlaceholder('티어를 선택해주세요')
                .addOptions(...tierGroups[currentPage]);

            const updatedRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(updatedSelectMenu);
            const updatedPaginationButtons = createPaginationButtons(currentPage, totalPages);

            await i.update({
                content: "🛡️ 티어를 선택해주세요",
                components: [updatedRow, updatedPaginationButtons],
            });
        }
    });
}

export default {
    info: new SlashCommandBuilder()
        .setName("티어등록")
        .setDescription("지원봇에 티어를 등록합니다")
        .addStringOption(option =>
            option
                .setName("게임")
                .setDescription("게임을 선택해주세요")
                .setRequired(true)
                .addChoices([
                    {
                        name: '발로란트',
                        value: SupportGame.Valorant
                    },
                    {
                        name: '리그 오브 레전드',
                        value: SupportGame["League of Legends"]
                    }
                ])
        ),
    handler
};