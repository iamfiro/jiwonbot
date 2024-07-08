import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    const coin = Math.floor(Math.random() * 2) == 0 ? "앞면" : "뒷면";
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("동전던지기")
                .addFields([{ name: "결과", value: `🪙 ${coin}` }])
                .setColor(Colors.Yellow)
        ]
    });
}

export default {
    info: new SlashCommandBuilder().setName("동전던지기").setDescription("[ 🪙 ] 앞면이 나올까요 뒷면이 나올까요!"),
    handler
}