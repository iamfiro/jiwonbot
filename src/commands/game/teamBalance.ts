import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChatInputCommandInteraction, 
    Colors, 
    EmbedBuilder, 
    GuildMember, 
    SlashCommandBuilder, 
    ButtonInteraction, 
    VoiceChannel 
} from "discord.js";
import { balanceTeams } from "../../handler/teamBalance";
import { SupportGame } from "../../types/constant";
import prisma from "../../lib/prisma";
import { client } from "../../lib/bot";
import { getDuplicateUsers, getVoiceChannelMembers } from "../../lib/utils";
import { createTeamBalanceEmbed } from "../../lib/embed";
import Logger from "../../lib/logger";

const logger = new Logger();

/**
 * Retrieves user data from the database and maps the tier based on the game type.
 *
 * @param {SupportGame} game - The game type.
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 * @returns {Promise<Array<{ name: string; tier: string; userId: string }>>} The list of users with their corresponding tier.
 */
async function getDatabaseData(game: SupportGame, interaction: ChatInputCommandInteraction): Promise<Array<{ name: string; tier: string; userId: string }>> {
    const users = await prisma.tier.findMany();
    return users.map(user => {
        const member = client.users.cache.get(user.userId); 
        return {
            userId: user.userId,
            name: member?.displayName || 'Unknown',
            tier: game === SupportGame.Valorant ? user.valorantTier : user.lolTier
        };
    });
} 

/**
 * Retrieves voice channel IDs from the database for the specified guild.
 *
 * @param {string} guildId - The ID of the guild.
 * @returns {Promise<{ redChannelId: string; blueChannelId: string } | null>} The IDs of the red and blue team voice channels, or null if not found.
 */
async function getVoiceChannelIds(guildId: string): Promise<{ redChannelId: string; blueChannelId: string } | null> {
    const channels = await prisma.voiceChannel.findUnique({
        where: { guildId }
    });
    if (!channels) return null;
    return { redChannelId: channels.redChannel, blueChannelId: channels.blueChannel };
}

/**
 * Handles the interaction for balancing teams.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 */
async function handler(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const voiceChannelMembers = await getVoiceChannelMembers(interaction);

    if (!voiceChannelMembers || voiceChannelMembers.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('먼저 음성 채널에 들어가주세요.')
                    .setColor(Colors.Red)
            ]
        });
        return;
    }

    const game = interaction.options.getString('게임') as SupportGame;
    const databaseData = await getDatabaseData(game, interaction);
    const channelUserInDatabase = getDuplicateUsers(voiceChannelMembers, databaseData);
        
    const validChannelUserInDatabase = channelUserInDatabase.filter(user => user !== undefined);
    const { teamA, teamB } = balanceTeams(validChannelUserInDatabase as BalancePlayer[], game);

    const teamAEmbed = createTeamBalanceEmbed('레드', teamA, game, Colors.Red);
    const teamBEmbed = createTeamBalanceEmbed('블루', teamB, game, Colors.Blue, 'TIP: 자신이 보이지 않는다면 `/티어등록` 을 통해서 티어를 등록해주세요!');
    
    const divideVoiceButton = new ButtonBuilder()
        .setCustomId('divideVoice')
        .setLabel('음성 채널 자동 배정')
        .setStyle(ButtonStyle.Success)
        .setEmoji('<:Voice:1260088188475805738>');
         
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(divideVoiceButton);

    await interaction.editReply({
        embeds: [teamAEmbed, teamBEmbed],
        components: [row]
    });

    // Collect button interaction
    const filter = (i: ButtonInteraction<"cached"> | any) => i.customId === 'divideVoice' && i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 600_000 });

    collector?.on('collect', async (i: ButtonInteraction) => {
        if (i.customId === 'divideVoice') {
            const channelIds = await getVoiceChannelIds(interaction.guildId!);
            if (!channelIds) {
                await i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('등록된 음성 채널 정보를 찾을 수 없습니다.')
                            .setDescription('오류가 지속된다면 \`/배정채널등록\` 으로 채널을 설정해주세요')
                            .setColor(Colors.Red)
                    ],
                });
                return;
            }

            const redVoiceChannel = interaction.guild?.channels.cache.get(channelIds.redChannelId) as VoiceChannel;
            const blueVoiceChannel = interaction.guild?.channels.cache.get(channelIds.blueChannelId) as VoiceChannel;

            if (!redVoiceChannel) {
                await i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('레드팀 채널을 찾을 수 없습니다.')
                            .setDescription('등록된 채널을 찾을 수 없습니다. \`/배정채널등록\` 명령어로 채널을 재설정해주세요.')
                            .setColor(Colors.Red)
                    ],
                });
                return;
            }

            if (!blueVoiceChannel) {
                await i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('블루팀 채널을 찾을 수 없습니다.')
                            .setDescription('등록된 채널을 찾을 수 없습니다. \`/배정채널등록\` 명령어로 채널을 재설정해주세요.')
                            .setColor(Colors.Red)
                    ],
                    ephemeral: true
                });
                return;
            }

            await handleDivideVoice(i, teamA, teamB, redVoiceChannel, blueVoiceChannel);
        }
    });
}

/**
 * Handles the button interaction for dividing voice channels.
 *
 * @param {ButtonInteraction} interaction - The button interaction object from Discord.
 * @param {Array<BalancePlayer>} teamA - The players in team A.
 * @param {Array<BalancePlayer>} teamB - The players in team B.
 * @param {VoiceChannel} redVoiceChannel - The voice channel for the red team.
 * @param {VoiceChannel} blueVoiceChannel - The voice channel for the blue team.
 */
async function handleDivideVoice(interaction: ButtonInteraction, teamA: BalancePlayer[], teamB: BalancePlayer[], redVoiceChannel: VoiceChannel, blueVoiceChannel: VoiceChannel): Promise<void> {
    try {
        for (const player of teamA) {
            const member = interaction.guild?.members.cache.get(player.userId);
            if (member && member.voice.channel) {
                await member.voice.setChannel(redVoiceChannel);
            }
        }

        for (const player of teamB) {
            const member = interaction.guild?.members.cache.get(player.userId);
            if (member && member.voice.channel) {
                await member.voice.setChannel(blueVoiceChannel);
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('배정 완료')
                    .setDescription('팀이 성공적으로 음성 채널에 배정되었습니다.')
                    .setColor(Colors.Green)
            ],
        });
    } catch (error) {
        logger.error(`음성 채널 배정 중 오류 발생: ${error}`);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('음성 채널 배정 중 오류가 발생했습니다.')
                    .setDescription('오류가 지속된다면 \`/배정채널등록\` 으로 채널을 설정해주세요')
                    .setColor(Colors.Red)
            ]
        });
    }
}

export default {
    info: new SlashCommandBuilder()
        .setName("밸런스")
        .setDescription("음성 채팅방에 들어가 있는 사람들로 밸런스를 조정합니다")
        .addStringOption(option =>
            option
                .setName("게임")
                .setDescription("게임 종류를 선택해주세요")
                .setRequired(true)
                .addChoices([
                    {
                        name: '🔫 발로란트',
                        value: SupportGame.Valorant
                    },
                    {
                        name: '🎮 리그 오브 레전드',
                        value: SupportGame["League of Legends"]
                    }
                ])
        ),
    handler
};