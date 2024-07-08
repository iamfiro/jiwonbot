import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!")
}

export default {
    info: new SlashCommandBuilder()
        .setName("랜덤맵")
        .setDescription("[ 🗺️ ] 맵을 랜덤으로 선택해줍니다"),
    handler
}