import { SupportGame } from "../types/constant";

// src/util/teamBalancer.ts
interface Player {
    name: string;
    tier: string;
}

const valorantTierPoints: Record<string, number> = {
    'Iron 1': 1, 'Iron 2': 2, 'Iron 3': 3,
    'Bronze 1': 4, 'Bronze 2': 5, 'Bronze 3': 6,
    'Silver 1': 7, 'Silver 2': 8, 'Silver 3': 9,
    'Gold 1': 10, 'Gold 2': 11, 'Gold 3': 12,
    'Platinum 1': 13, 'Platinum 2': 14, 'Platinum 3': 15,
    'Diamond 1': 16, 'Diamond 2': 17, 'Diamond 3': 18,
    'Immortal 1': 19, 'Immortal 2': 20, 'Immortal 3': 21,
    'Radiant': 22
};

const lolTierPoints: Record<string, number> = {
    'Iron IV': 1, 'Iron III': 2, 'Iron II': 3, 'Iron I': 4,
    'Bronze IV': 5, 'Bronze III': 6, 'Bronze II': 7, 'Bronze I': 8,
    'Silver IV': 9, 'Silver III': 10, 'Silver II': 11, 'Silver I': 12,
    'Gold IV': 13, 'Gold III': 14, 'Gold II': 15, 'Gold I': 16,
    'Platinum IV': 17, 'Platinum III': 18, 'Platinum II': 19, 'Platinum I': 20,
    'Diamond IV': 21, 'Diamond III': 22, 'Diamond II': 23, 'Diamond I': 24,
    'Master': 25, 'Grandmaster': 26, 'Challenger': 27
};

export function balanceTeams(players: Player[], game: SupportGame): { teamA: Player[], teamB: Player[], teamAScore: number, teamBScore: number } {
    const tierPoints = game === SupportGame.Valorant ? valorantTierPoints : lolTierPoints;

    // 플레이어 목록을 최대 10명으로 제한
    players = players.slice(0, 10);

    // 점수로 정렬
    players.sort((a, b) => tierPoints[b.tier] - tierPoints[a.tier]);

    const teamA: Player[] = [];
    const teamB: Player[] = [];
    let teamAScore = 0;
    let teamBScore = 0;

    // 그리디 방식으로 팀 배분
    for (const player of players) {
        const playerScore = tierPoints[player.tier];
        if (teamAScore <= teamBScore && teamA.length < 5) {
            teamA.push(player);
            teamAScore += playerScore;
        } else if (teamB.length < 5) {
            teamB.push(player);
            teamBScore += playerScore;
        } else {
            teamA.push(player);
            teamAScore += playerScore;
        }
    }

    return { teamA, teamB, teamAScore, teamBScore };
}