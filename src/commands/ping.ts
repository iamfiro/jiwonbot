import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    info: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong with latency information!")
        .setDescriptionLocalizations({
            "ko": "봇의 현재 Ping을 알려드려요!",
        }),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const latency = reply.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#0099ff")
                    .setTitle("Pong!")
                    .addFields(
                        { name: "🛜 API Latency", value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                        { name: "💬 Message Latency", value: `${latency}ms`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }),
            ],
        });
    }
}