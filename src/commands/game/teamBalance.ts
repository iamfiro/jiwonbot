import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { balanceTeams } from "../../handler/teamBalance";
import { SupportGame } from "../../types/constant";
import GameTierList from "../../constant/tier";
import prisma from "../../lib/prisma";
import { client } from "../../lib/bot";
import { getDuplicateUsers, getVoiceChannelMembers } from "../../lib/utils";

interface Player {
    userId: string; 
    name: string; 
    tier: string;
}

/**
 * Retrieves user data from the database and maps the tier based on the game type.
 *
 * @param {SupportGame} game - The game type.
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 * @returns {Promise<Array<{ name: string; tier: string; userId: string }>>} The list of users with their corresponding tier.
 */
async function getDatabaseData(game: SupportGame, interaction: ChatInputCommandInteraction): Promise<Array<{ name: string; tier: string; userId: string }>> {
    const users = await prisma.tier.findMany();
    const member = client.users.cache.get(interaction.user.id);

    return users.map(user => ({
        userId: user.userId,
        name: member?.displayName || 'Unknown',
        tier: game === SupportGame.Valorant ? user.valorantTier : user.lolTier
    }));
}

/**
 * Handles the interaction for balancing teams.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 */
async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const voiceChannelMembers = getVoiceChannelMembers(interaction);

    if (!voiceChannelMembers || voiceChannelMembers.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('먼저 음성 채널에 들어가주세요')
                    .setColor(Colors.Red)
            ]
        });
        return;
    }

    const game = interaction.options.getString('게임') as SupportGame;
    const databaseData = await getDatabaseData(game, interaction);
    const channelUserInDatabase = getDuplicateUsers(voiceChannelMembers, databaseData);
        
    const validChannelUserInDatabase = channelUserInDatabase.filter(user => user !== undefined);
    const { teamA, teamB } = balanceTeams(validChannelUserInDatabase as Player[], game);

    const teamAEmbed = new EmbedBuilder()
        .setTitle('A 팀')
        .addFields(teamA.map(player => ({
            name: player.name,
            value: `${GameTierList[game].find(tier => tier.value === player.tier)?.emoji} ${GameTierList[game].find(tier => tier.value === player.tier)?.label}`
        })))
        .setColor(Colors.Red);

    const teamBEmbed = new EmbedBuilder()
        .setTitle('B 팀')
        .addFields(teamB.map(player => ({
            name: player.name,
            value: `${GameTierList[game].find(tier => tier.value === player.tier)?.emoji} ${GameTierList[game].find(tier => tier.value === player.tier)?.label}`
        })))
        .setColor(Colors.Blue);
    
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
}