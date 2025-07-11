import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    info: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Replies with Pong!'),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply('Pong!');
    }
}