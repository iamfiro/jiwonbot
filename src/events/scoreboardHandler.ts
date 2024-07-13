import { ButtonInteraction, Interaction, Colors, EmbedBuilder } from "discord.js";
import prisma from "../lib/prisma";
import Logger from "../lib/logger";
import { SCOREBOARD_ERROR_MESSAGES } from "../constant/scoreboard";
import { createScoreboardEmbed } from "../commands/scoreboard";

const logger = new Logger();

/**
 * Handles button interactions for the scoreboard.
 * @param {Interaction} interaction - The interaction object.
 */
export async function handleScoreboardButton(interaction: Interaction): Promise<void> {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    const [, action, messageId, team] = customId.split('-');

    try {
        const scoreboard = await prisma.scoreBoard.findUnique({
            where: { messageId }
        });

        if (!scoreboard) {
            await interaction.reply({ content: '스코어보드를 찾을 수 없습니다.', ephemeral: true });
            return;
        }

        if(interaction.user.id !== scoreboard.interactionId) {
            await interaction.reply({ content: '이 스코어보드를 수정할 권한이 없습니다.', ephemeral: true });
        }


        logger.info(`Handling button interaction for scoreboard: ${action} ${messageId} ${team}`);

        if (action === 'close') {
            await prisma.scoreBoard.delete({
                where: { messageId }
            });

            const embed = createScoreboardEmbed({
                name: scoreboard.name,
                red: { redName: scoreboard.redName, redScore: scoreboard.redScore },
                blue: { blueName: scoreboard.blueName, blueScore: scoreboard.blueScore },
                footer: `스코어보드가 종료되었습니다`
            });
            
            await interaction.update({ components: [], embeds: [embed] });
            return;
        }

        const updatedScores = {
            redScore: scoreboard.redScore,
            blueScore: scoreboard.blueScore,
        };

        if (team === 'red' || team === 'blue') {
            if (action === 'increment') {
                updatedScores[`${team}Score`] += 1;
            } else if (action === 'decrement') {
                updatedScores[`${team}Score`] = Math.max(0, updatedScores[`${team}Score`] - 1);
            }
        }

        await prisma.scoreBoard.update({
            where: { messageId },
            data: updatedScores
        });

        const originalUser = await interaction.client.users.fetch(scoreboard.interactionId);

        const embed = createScoreboardEmbed({
            name: scoreboard.name,
            red: { redName: scoreboard.redName, redScore: updatedScores.redScore },
            blue: { blueName: scoreboard.blueName, blueScore: updatedScores.blueScore },
            footer: `${originalUser.displayName}에 의해 생성됨`
        });

        await interaction.update({ embeds: [embed] });
    } catch (error) {
        logger.error(`Failed to handle button interaction: ${error}`);
        await interaction.reply({ content: SCOREBOARD_ERROR_MESSAGES.UPDATE_ERROR, ephemeral: true });
    }
}