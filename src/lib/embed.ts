import { EmbedBuilder } from "discord.js";
import GameTierList from "../constant/tier";
import { SupportGame, SupportGameTier } from "../types/constant";

/**
 * Creates an embed for a team.
 * 
 * @param {string} teamName - The name of the team.
 * @param {Player[]} team - The list of players in the team.
 * @param {SupportGame} game - The game type.
 * @param {string} color - The color of the embed.
 * @returns {EmbedBuilder} The created embed.
 */
export function createTeamBalanceEmbed(teamName: string, team: BalancePlayer[], game: SupportGameTier, color: any, footer?: string): EmbedBuilder {
    const Embed = new EmbedBuilder()
        .setTitle(`${teamName} 팀`)
        .addFields(team.map(player => ({
            name: player.name,
            value: `${GameTierList[game].find(tier => tier.value === player.tier)?.emoji} ${GameTierList[game].find(tier => tier.value === player.tier)?.label}`
        })))
        .setColor(color);

    if(footer) Embed.setFooter({ text: footer });
    
    return Embed;
}