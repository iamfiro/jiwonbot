import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    info: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Pong!");
    }
}