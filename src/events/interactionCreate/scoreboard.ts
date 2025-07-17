import { EmbedScoreboard } from "@/fragments/scoreboard";
import { Events, Interaction, MessageFlags } from "discord.js";

export default {
    name: Events.InteractionCreate,
    execute: async (interaction: Interaction) => {
        if(!interaction.isButton()) return;

        if(!interaction.customId.startsWith('scoreboard-')) return;

        try {
            await EmbedScoreboard.handleScoreboardInteraction(
                interaction, interaction.guildId!
            );
        } catch (error) {
            console.error('Error handling scoreboard interaction: ', error)

            const errorMessage = {
                content: 'An error occurred while updating the scoreboard. Please try again.',
                flag: MessageFlags.Ephemeral
            }

            if(interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage)
            }
        }
    }
}