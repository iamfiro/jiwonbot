import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("⚒️ 지원봇 개발자")
                .setDescription('- 피로 (iam.firo)')
                .setFooter({
                    text: "지원봇을 만든 사람이에요",
                })
                .setColor(Colors.Blue)
        ]
    })
}

export default {
    info: new SlashCommandBuilder().setName("개발자").setDescription("지원봇을 만든 개발자를 보여줘요"),
    handler
}