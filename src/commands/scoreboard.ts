import { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, 
    Colors, 
    EmbedBuilder, 
    SlashCommandBuilder,
} from "discord.js";
import prisma from "../lib/prisma";
import Logger from "../lib/logger";
import { createButton } from "../lib/button";
import { SCOREBOARD_BUTTON_LABELS, SCOREBOARD_ERROR_MESSAGES } from "../constant/scoreboard";

const logger = new Logger();

interface ScoreboardFunction {
    name: string;
    red: {
        redName: string;
        redScore: number;
    };
    blue: {
        blueName: string;
        blueScore: number;
    };
    footer: string;
}

/**
 * Creates an embed for the scoreboard.
 * @param {string} name - The name of the scoreboard.
 * @param {string} redName - The name of the red team.
 * @param {number} redScore - The score of the red team.
 * @param {string} blueName - The name of the blue team.
 * @param {number} blueScore - The score of the blue team.
 * @param {string} footer - The footer text.
 * @returns {EmbedBuilder} - The constructed EmbedBuilder instance.
 */
export function createScoreboardEmbed({ name, red: { redName, redScore }, blue: { blueName, blueScore }, footer }: ScoreboardFunction): EmbedBuilder {
    const color = redScore === blueScore ? Colors.Yellow : redScore > blueScore ? Colors.Red : Colors.Blue;
    return new EmbedBuilder()
        .setTitle(`${name} 스코어보드`)
        .setFields([
            { name: `${redName} 팀`, value: `String(redScore)`, inline: true },
            { name: 'vs', value: '대', inline: true },
            { name: `${blueName} 팀`, value: `String(blueScore)`, inline: true }
        ])
        .setFooter({ text: footer })
        .setColor(color);
}

/**
 * Creates scoreboard buttons.
 * @param {string} messageId - The ID of the message associated with the scoreboard.
 * @returns {ActionRowBuilder<ButtonBuilder>} - The action row containing the buttons.
 */
function createScoreboardButtons(messageId: string): ActionRowBuilder<ButtonBuilder> {
    const redIncrementButton = createButton(`scoreboard-increment-${messageId}-red`, '', ButtonStyle.Danger, '<:arrowup:1261628294403457114>');
    const redDecrementButton = createButton(`scoreboard-decrement-${messageId}-red`, '', ButtonStyle.Danger, '<:arrowdown:1261628604391886849>');
    const blueIncrementButton = createButton(`scoreboard-increment-${messageId}-blue`, '', ButtonStyle.Primary, '<:arrowup:1261628294403457114>');
    const blueDecrementButton = createButton(`scoreboard-decrement-${messageId}-blue`, '', ButtonStyle.Primary, '<:arrowdown:1261628604391886849>');
    const closeButton = createButton(`scoreboard-close-${messageId}`, SCOREBOARD_BUTTON_LABELS.CLOSE, ButtonStyle.Secondary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(redIncrementButton, redDecrementButton, blueIncrementButton, blueDecrementButton, closeButton);
}

/**
 * Handles the creation of the scoreboard.
 * @param {ChatInputCommandInteraction} interaction - The command interaction object.
 */
async function handler(interaction: ChatInputCommandInteraction): Promise<void> {
    const scoreboardName = interaction.options.getString("이름", true);
    const redTeamName = interaction.options.getString("레드팀이름", true);
    const blueTeamName = interaction.options.getString("블루팀이름", true);

    if (!scoreboardName || !redTeamName || !blueTeamName) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(SCOREBOARD_ERROR_MESSAGES.CREATE_FAILURE)
                    .setDescription(SCOREBOARD_ERROR_MESSAGES.REQUIRED_FIELDS)
                    .setColor(Colors.Red)
            ],
            ephemeral: true
        });
        return;
    }

    const embed = createScoreboardEmbed({
        name: scoreboardName,
        red: { redName: redTeamName, redScore: 0 },
        blue: { blueName: blueTeamName, blueScore: 0 },
        footer: `${interaction.user.displayName}에 의해 생성됨`
    });

    try {
        const message = await interaction.reply({ embeds: [embed] });

        await prisma.scoreBoard.create({
            data: {
                redName: redTeamName,
                blueName: blueTeamName,
                redScore: 0,
                blueScore: 0,
                messageId: message.id,
                name: scoreboardName,
                interactionId: interaction.user.id,
                guildId: interaction.guildId || ''
            }
        });

        const actionRow = createScoreboardButtons(message.id);

        await message.edit({ components: [actionRow] });
    } catch (error) {
        logger.error(`Failed to create scoreboard: ${error}`);
        await interaction.followUp({ content: SCOREBOARD_ERROR_MESSAGES.CREATE_ERROR, ephemeral: true });
    }
}

export default {
    info: new SlashCommandBuilder()
        .setName("스코어보드")
        .setDescription("스코어보드를 생성합니다")
        .addStringOption(option =>
            option
                .setName("이름")
                .setDescription("스코어보드 이름을 입력해주세요")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("레드팀이름")
                .setDescription("레드팀 이름을 입력해주세요")
                .setRequired(true)
                .setMaxLength(8)
        )
        .addStringOption(option =>
            option
                .setName("블루팀이름")
                .setDescription("블루팀 이름을 입력해주세요")
                .setRequired(true)
                .setMaxLength(8)
        ),
    handler
};