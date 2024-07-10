import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelType, 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, 
    VoiceChannel,
    EmbedBuilder,
    PermissionFlagsBits,
    Colors
} from "discord.js";
import Logger from "../../lib/logger";
import prisma from "../../lib/prisma";

const logger = new Logger();

/**
 * Handle the interaction for tier registration
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord
 */
async function handler(interaction: ChatInputCommandInteraction): Promise<void> {
    // 관리자 권한 확인
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('권한 없음')
                    .setDescription('이 명령어를 사용할 권한이 없습니다.')
                    .setColor(Colors.Red)
            ],
        });
        return;
    }
    
    // Fetch the red and blue team voice channels from the interaction options
    const redChannel = interaction.options.getChannel("레드팀채널") as VoiceChannel;
    const blueChannel = interaction.options.getChannel("블루팀채널") as VoiceChannel;

    // Check if both channels are provided
    if (!redChannel || !blueChannel) {
        await interaction.reply({
            content: "채널을 찾을 수 없습니다. 다시 시도해주세요.",
            ephemeral: true
        });
        return;
    }

    // Upsert the voice channel data into the database
    await prisma.voiceChannel.upsert({
        where: {
            guildId: interaction.guildId || ''
        },
        update: {
            redChannel: redChannel.id,
            blueChannel: blueChannel.id
        },
        create: {
            guildId: interaction.guildId || '',
            redChannel: redChannel.id,
            blueChannel: blueChannel.id
        }
    });

    logger.info(`Voice channels registered successfully for guild ${interaction.guildId}`);

    // Create an embed message for the reply
    const embed = new EmbedBuilder()
        .setTitle("🔊 채널 등록 완료")
        .setDescription("음성 채널이 등록되었습니다.")
        .setColor(0x00AE86)
        .addFields(
            { name: "레드팀 채널", value: `<#${redChannel.id}>`, inline: true },
            { name: "블루팀 채널", value: `<#${blueChannel.id}>`, inline: true }
        );

    // Reply with the embed message
    await interaction.reply({
        embeds: [embed]
    });
}

export default {
    info: new SlashCommandBuilder()
        .setName("배정채널등록")
        .setDescription("밸런스 기능의 자동 배정을 위한 음성 채널을 등록합니다")
        .addChannelOption(option =>
            option
                .setName("레드팀채널")
                .setDescription("레드팀의 음성 채널을 선택해주세요")
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("블루팀채널")
                .setDescription("블루팀의 음성 채널을 선택해주세요")
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        ),
    handler
};