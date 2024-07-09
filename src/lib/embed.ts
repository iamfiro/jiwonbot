import { EmbedBuilder } from "discord.js";
import GameTierList from "../constant/tier";
import { SupportGame } from "../types/constant";

/**
 * Creates an embed for a team.
 * 
 * @param {string} teamName - The name of the team.
 * @param {Player[]} team - The list of players in the team.
 * @param {SupportGame} game - The game type.
 * @param {string} color - The color of the embed.
 * @returns {EmbedBuilder} The created embed.
 */
export function createTeamBalanceEmbed(teamName: string, team: BalancePlayer[], game: SupportGame, color: any): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`${teamName} 팀`)
        .addFields(team.map(player => ({
            name: player.name,
            value: `${GameTierList[game].find(tier => tier.value === player.tier)?.emoji} ${GameTierList[game].find(tier => tier.value === player.tier)?.label}`
        })))
        .setColor(color);
}