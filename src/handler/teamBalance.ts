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

export function balanceTeams(players: Player[], game: 'valorant' | 'lol'): { teamA: Player[], teamB: Player[], teamAScore: number, teamBScore: number } {
    const tierPoints = game === 'valorant' ? valorantTierPoints : lolTierPoints;
    const scores = players.map(player => tierPoints[player.tier]);
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const target = Math.floor(totalScore / 2);

    const dp: boolean[][] = Array.from({ length: players.length + 1 }, () => Array(target + 1).fill(false));
    dp[0][0] = true;

    for (let i = 1; i <= players.length; i++) {
        const score = scores[i - 1];
        for (let j = target; j >= score; j--) {
            dp[i][j] = dp[i - 1][j] || dp[i - 1][j - score];
        }
    }

    let bestSum = 0;
    for (let j = target; j >= 0; j--) {
        if (dp[players.length][j]) {
            bestSum = j;
            break;
        }
    }

    const teamA: Player[] = [];
    const teamB: Player[] = [...players];
    let remainingSum = bestSum;

    for (let i = players.length; i > 0 && remainingSum > 0; i--) {
        if (!dp[i - 1][remainingSum]) {
            teamA.push(players[i - 1]);
            remainingSum -= scores[i - 1];
            const index = teamB.findIndex(p => p.name === players[i - 1].name);
            if (index !== -1) teamB.splice(index, 1);
        }
    }

    // Ensure team sizes are balanced (5v5 for Valorant and LoL)
    while (teamA.length > 5) {
        teamB.push(teamA.pop()!);
    }
    while (teamB.length > 5) {
        teamA.push(teamB.pop()!);
    }

    const teamAScore = teamA.reduce((sum, player) => sum + tierPoints[player.tier], 0);
    const teamBScore = teamB.reduce((sum, player) => sum + tierPoints[player.tier], 0);

    return { teamA, teamB, teamAScore, teamBScore };
}