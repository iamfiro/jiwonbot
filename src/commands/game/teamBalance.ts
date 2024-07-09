import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { balanceTeams } from "../../handler/teamBalance";
import { SupportGame } from "../../types/constant";
import prisma from "../../lib/prisma";
import { client } from "../../lib/bot";
import { getDuplicateUsers, getVoiceChannelMembers } from "../../lib/utils";
import { createTeamBalanceEmbed } from "../../lib/embed";
import Logger from "../../lib/logger";

const logger = new Logger

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

    return users.map(user => {
        const member = client.users.cache.get(user.userId); 

        return {
            userId: user.userId,
            name: member?.displayName || 'Unknown',
            tier: game === SupportGame.Valorant ? user.valorantTier : user.lolTier
        }
    })
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
    const { teamA, teamB } = balanceTeams(validChannelUserInDatabase as BalancePlayer[], game);

    const teamAEmbed = createTeamBalanceEmbed('A', teamA, game, Colors.Red);
    const teamBEmbed = createTeamBalanceEmbed('B', teamB, game, Colors.Blue);
    
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