import { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, 
    Colors, 
    EmbedBuilder, 
    SlashCommandBuilder,
    userMention, 
} from "discord.js";
import prisma from "../lib/prisma";
import Logger from "../lib/logger";

const logger = new Logger();

/**
 * Creates an embed for the scoreboard.
 * @param {string} scoreboardName - The name of the scoreboard.
 * @param {string} redTeamName - The name of the red team.
 * @param {string} blueTeamName - The name of the blue team.
 * @param {string} userDisplayName - The display name of the user who created the scoreboard.
 * @returns {EmbedBuilder} - The constructed EmbedBuilder instance.
 */
function createScoreboardEmbed(scoreboardName: string, redTeamName: string, blueTeamName: string, userDisplayName: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`${scoreboardName} 스코어보드`)
        .setFields([
            { name: `${redTeamName} 팀`, value: "0", inline: true },
            { name: `${blueTeamName} 팀`, value: "0", inline: true }
        ])
        .setFooter({ text: `${userDisplayName} 님이 스코어보드를 생성함` })
        .setColor(Colors.Green);
}

/**
 * Creates scoreboard buttons.
 * @param {string} messageId - The ID of the message associated with the scoreboard.
 * @returns {ActionRowBuilder<ButtonBuilder>} - The action row containing the buttons.
 */
function createScoreboardButtons(messageId: string): ActionRowBuilder<ButtonBuilder> {
    const incrementButton = new ButtonBuilder()
        .setCustomId(`scoreboard-increment-${messageId}`)
        .setLabel("점수 추가")
        .setStyle(ButtonStyle.Success);

    const decrementButton = new ButtonBuilder()
        .setCustomId(`scoreboard-decrement-${messageId}`)
        .setLabel("점수 빼기")
        .setStyle(ButtonStyle.Danger);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(incrementButton, decrementButton);
}

/**
 * Handles the creation of the scoreboard.
 * @param {ChatInputCommandInteraction} interaction - The command interaction object.
 */
async function handler(interaction: ChatInputCommandInteraction): Promise<void> {
    const scoreboardName = interaction.options.getString("이름", true);
    const redTeamName = interaction.options.getString("레드팀이름", true);
    const blueTeamName = interaction.options.getString("블루팀이름", true);

    const embed = createScoreboardEmbed(scoreboardName, redTeamName, blueTeamName, interaction.user.displayName);

    try {
        const message = await interaction.reply({ embeds: [embed] });

        await prisma.scoreBoard.create({
            data: {
                redName: redTeamName,
                blueName: blueTeamName,
                redScore: 0,
                blueScore: 0,
                messageId: message.id,
                guildId: interaction.guildId || ''
            }
        });

        const actionRow = createScoreboardButtons(message.id);

        await message.edit({ components: [actionRow] });
    } catch (error) {
        logger.error(`Failed to create scoreboard: ${error}`);
        await interaction.followUp({ content: '스코어보드 생성에 실패했습니다.', ephemeral: true });
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
        )
        .addStringOption(option =>
            option
                .setName("블루팀이름")
                .setDescription("블루팀 이름을 입력해주세요")
                .setRequired(true)
        ),
    handler
};