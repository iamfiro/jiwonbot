import { GuildMember, ChatInputCommandInteraction } from "discord.js";
import redis from "./redis";
import { client } from "./bot";

/**
 * Retrieves the members in the voice channel of the interaction user.
 * 
 * @param {ChatInputCommandInteraction} interaction - The interaction object from Discord.
 * @returns {Array<GuildMember>} The list of members in the voice channel.
 */
export async function getVoiceChannelMembers(interaction: ChatInputCommandInteraction): Promise<GuildMember[]> {
    const member = interaction.member as GuildMember;
    const voiceChannelID = member.voice.channel?.id;

    if (!voiceChannelID) return [];

    const memberIDs = await redis.smembers(`voiceChannel:${voiceChannelID}`);
    const members: GuildMember[] = [];

    for (const id of memberIDs) {
        const guildMember = await client.guilds.cache.get(interaction.guildId!)?.members.fetch(id);
        if (guildMember) {
            members.push(guildMember);
        }
    }

    return members;
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