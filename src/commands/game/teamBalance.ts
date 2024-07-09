import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { balanceTeams } from "../../handler/teamBalance";
import SupportGameList from "../../constant/game";
import { SupportGame } from "../../types/constant";

async function handler(interaction: ChatInputCommandInteraction) {
    const game = interaction.options.getString('게임') as SupportGame;
        let players = [
            { name: 'Player1', tier: 'Radiant' },
            { name: 'Player2', tier: 'Silver 1' },
            { name: 'Player3', tier: 'Silver 3' },
            { name: 'Player4', tier: 'Gold 2' },
            { name: 'Player5', tier: 'Platinum 3' },
            { name: 'Player6', tier: 'Platinum 2' },
            { name: 'Player7', tier: 'Bronze 3' },
            { name: 'Player8', tier: 'Iron 2' },
            { name: 'Player9', tier: 'Iron 2' },
            { name: 'Player10', tier: 'Iron 2' },
        ];

        if (game === SupportGame["League of Legends"]) {
            players = [
                { name: 'Player7', tier: 'Challenger' },
                { name: 'Player8', tier: 'Iron IV' },
                { name: 'Player9', tier: 'Iron IV' },
                { name: 'Player10', tier: 'Iron IV' },
                { name: 'Player11', tier: 'Platinum IV' },
                { name: 'Player12', tier: 'Platinum III' },
                { name: 'Player13', tier: 'Platinum III' },
                { name: 'Player14', tier: 'Gold III' },
                { name: 'Player15', tier: 'Gold III' },
                { name: 'Player16', tier: 'Silver III' }
            ];
        }
        
        const { teamA, teamB, teamAScore, teamBScore } = balanceTeams(players, game);

        const teamAPlayers = teamA.map(player => `${player.name} (${player.tier})`).join('\n');
        const teamBPlayers = teamB.map(player => `${player.name} (${player.tier})`).join('\n');

        await interaction.reply(`**Team A (Score: ${teamAScore}):**\n${teamAPlayers}\n\n**Team B (Score: ${teamBScore}):**\n${teamBPlayers}`);
}

export default {
    info: new SlashCommandBuilder()
        .setName("밸런스")
        .setDescription("[ 👾 ] 음성 채팅방에 들어가 있는 사람들로 밸런스를 조정합니다")
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
        )
        ,
    handler
}