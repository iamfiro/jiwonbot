import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!")
}

export default {
    info: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    handler
}