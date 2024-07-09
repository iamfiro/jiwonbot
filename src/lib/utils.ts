import { GuildMember, ChatInputCommandInteraction } from "discord.js";

/**
 * Retrieves the members in the voice channel of the interaction user.
 * 
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 * @returns {Array<GuildMember>} The list of members in the voice channel.
 */
export function getVoiceChannelMembers(interaction: ChatInputCommandInteraction): GuildMember[] {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return [];
    return Array.from(voiceChannel.members.values());
}

/**
 * Finds and returns an array of users from databaseDatas
 * that match the members in the voiceChannelMembers list.
 *
 * @param {Array<{ user: { id: string } }>} voiceChannelMembers - Array of members in the voice channel.
 * @param {Array<{ userId: string; name: string; tier: string }>} databaseDatas - Array of user data from the database.
 * @returns {Array<{ userId: string; name: string; tier: string } | undefined>} Array of matching users from databaseDatas.
 */
export function getDuplicateUsers(
    voiceChannelMembers: { user: { id: string } }[], 
    databaseDatas: { userId: string; name: string; tier: string }[]
): ({ userId: string; name: string; tier: string } | undefined)[] {
    return voiceChannelMembers.map(member => 
        databaseDatas.find(user => user.userId === member.user.id)
    );
}