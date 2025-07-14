import { lolTierPoints, valorantTierPoints } from '@/constants/elo';
import { SupportGameTier } from '@/constants/game';

export interface BalancePlayer {
	name: string;
	tier: string;
	userId: string;
}

export interface PlayerWithScore extends BalancePlayer {
	score: number;
	weight: number; // 플레이어 영향력
	normalizedScore: number;
}

export interface TeamComposition {
	players: PlayerWithScore[];
	totalScore: number;
	averageScore: number;
	skillVariance: number;
	roleBalance: number; // 역할 밸런스 (고수/중수/하수 분포)
	synergy: number;
	strengthDistribution: number;
}

export type BalanceType =
	| 'Perfect'
	| 'Excellent'
	| 'Good'
	| 'Acceptable'
	| 'Poor';

export interface BalanceSolution {
	teamA: TeamComposition;
	teamB: TeamComposition;
	scoreDifference: number;
	overallBalance: number;
	qualityScore: number;
	balanceType: BalanceType;
	fairnessIndex: number;
}

export class TeamBalancer {
	private solutions: BalanceSolution[] = [];
	private usedSolutions: Set<string> = new Set();
	private tierPoints: Record<string, number>;
	private maxScore: number;
	private minScore: number;

	constructor(game: SupportGameTier) {
		this.tierPoints =
			game === SupportGameTier.Valorant ? valorantTierPoints : lolTierPoints;
		this.maxScore = Math.max(...Object.values(this.tierPoints));
		this.minScore = Math.min(...Object.values(this.tierPoints));
	}

	public generateOptimalSolution(players: BalancePlayer[]): BalanceSolution {
		const playersWithScores = this.preprocessPlayers(players);

		if (this.solutions.length === 0) {
			this.solutions = this.findAllOptimalSolutions(playersWithScores);
		}

		return this.getNextBestSolution();
	}

	public regenerateTeams(): BalanceSolution {
		return this.getNextBestSolution();
	}

	private preprocessPlayers(players: BalancePlayer[]): PlayerWithScore[] {
		const limitedPlayers = players.slice(0, 10);

		return limitedPlayers.map((player) => {
			const score = this.tierPoints[player.tier] || 0;
			const normalizedScore =
				(score - this.minScore) / (this.maxScore - this.minScore);
			const weight = this.calculatePlayerWeight(score, limitedPlayers.length);

			return {
				...player,
				score,
				weight,
				normalizedScore,
			};
		});
	}

	private calculatePlayerWeight(score: number, totalPlayer: number): number {
		// 상위 20%는 높은 가중치 하위 20%는 낮은 가중치
		const maxScore = Math.max(...Object.values(this.tierPoints));
		const scoreRatio = score / maxScore;

		if (scoreRatio >= 0.9) return 1.4;
		if (scoreRatio >= 0.7) return 1.2;
		if (scoreRatio >= 0.5) return 1.0;
		if (scoreRatio >= 0.3) return 0.9;

		return 0.8;
	}

	private findAllOptimalSolutions(
		players: PlayerWithScore[]
	): BalanceSolution[] {
		const solutions: BalanceSolution[] = [];

		const bruteForceSolutions = this.bruteForceBestSolutions(players, 30);
		solutions.push(...bruteForceSolutions);

		const greedySolutions = this.greedySearch(players, 20);
		solutions.push(...greedySolutions);

		const geneticSolutions = this.geneticAlgorithmSearch(players, 20);
		solutions.push(...geneticSolutions);

		const localSearchSolutions = this.multiStartLocalSearch(players, 15);
		solutions.push(...localSearchSolutions);

		return this.deduplicateAndSort(solutions);
	}

	private greedySearch(
		player: PlayerWithScore[],
		iterations: number
	): BalanceSolution[] {
		const solutions: BalanceSolution[] = [];

		const sortedPlayer = [...player].sort((a, b) => b.score - a.score);

		for (let attempt = 0; attempt < iterations; attempt++) {
			const teamA: PlayerWithScore[] = [];
			const teamB: PlayerWithScore[] = [];

			sortedPlayer.forEach((player, index) => {
				const shouldRandomize = Math.random() < 0.2;
				const targetTeam = shouldRandomize
					? Math.random() < 0.5
						? teamA
						: teamB
					: index % 2 === 0
					? teamA
					: teamB;

				if (Math.abs(teamA.length - teamB.length) > 1) {
					if (teamA.length > teamB.length) {
						teamB.push(player);
					} else {
						teamA.push(player);
					}
				} else {
					targetTeam.push(player);
				}
			});

			if (this.isValidTeamSize(teamA.length, teamB.length)) {
				solutions.push(this.evaluateSolution(teamA, teamB));
			}
		}

		return solutions;
	}

	private bruteForceBestSolutions(
		players: PlayerWithScore[],
		maxSolutions: number
	): BalanceSolution[] {
		const solutions: BalanceSolution[] = [];
		const totalPlayers = players.length;
		const maxCombinations = Math.min(Math.pow(2, totalPlayers), 400000);

		for (let mask = 1; mask < maxCombinations - 1; mask++) {
			const { teamA, teamB } = this.maskToTeams(players, mask);

			if (!this.isValidTeamSize(teamA.length, teamB.length)) continue;

			const solution = this.evaluateSolution(teamA, teamB);
			if (solution.qualityScore > 70) {
				solutions.push(solution);
			}
		}

		return solutions
			.sort((a, b) => b.qualityScore - a.qualityScore)
			.slice(0, maxSolutions);
	}

	private multiStartLocalSearch(
		players: PlayerWithScore[],
		startPoints: number
	): BalanceSolution[] {
		const solutions: BalanceSolution[] = [];

		for (let start = 0; start < startPoints; start++) {
			const shuffled = [...players].sort(() => Math.random() - 0.5);
			const mid = Math.floor(shuffled.length / 2);
			let teamA = shuffled.slice(0, mid);
			let teamB = shuffled.slice(mid);

			let improved = false;
			let iterations = 0;
			const maxIterations = 100;

			while (improved && iterations < maxIterations) {
				improved = false;
				iterations++;

				const currentSolution = this.evaluateSolution(teamA, teamB);

				for (let i = 0; i < teamA.length; i++) {
					for (let j = 0; j < teamB.length; j++) {
						const newTeamA = [...teamA];
						const newTeamB = [...teamB];

						[newTeamA[i], newTeamB[j]] = [newTeamB[j], newTeamA[i]];

						const newSolution = this.evaluateSolution(newTeamA, newTeamB);

						if (newSolution.qualityScore > currentSolution.qualityScore) {
							teamA = newTeamA;
							teamB = newTeamB;
							improved = true;
							break;
						}
					}
					if (improved) break;
				}
			}

			if (this.isValidTeamSize(teamA.length, teamB.length)) {
				solutions.push(this.evaluateSolution(teamA, teamB));
			}
		}

		return solutions;
	}

	private geneticAlgorithmSearch(
		players: PlayerWithScore[],
		generations: number
	): BalanceSolution[] {
		const populationSize = 100;
		let population = this.generateRandomPopulation(players, populationSize);
		const solutions: BalanceSolution[] = [];

		for (let gen = 0; gen < generations; gen++) {
			const evaluated = population
				.map((individual) => ({
					individual,
					fitness: this.calculateFitness(individual, players),
				}))
				.sort((a, b) => b.fitness - a.fitness);

			const topSolutions = evaluated.slice(0, 10);

			for (const sol of topSolutions) {
				const { teamA, teamB } = this.maskToTeams(players, sol.individual);
				if (this.isValidTeamSize(teamA.length, teamB.length)) {
					solutions.push(this.evaluateSolution(teamA, teamB));
				}
			}

			population = this.generateNextGeneration(
				evaluated.slice(0, 30).map((e) => e.individual)
			);
		}

		return solutions;
	}

	// private simulatedAnnealingSearch(players: PlayerWithScore[], iterations: number): BalanceSolution[] {
	//     const solutions: BalanceSolution[] = [];
	//     let currentMask = this.generateRandomMask(players.length);
	//     let currentScore = this.calculateFitness(currentMask, players);
	//     let temperature = 1000;
	//     const coolingRate = 0.95;

	//     for(let i = 0; i <iterations * 100; i++) {
	//         const newMask = this.mutateIndividual(currentMask);
	//         const newScore = this.calculateFitness(newMask, players)

	//         const delta = newScore - currentScore;
	//         if(delta > 0 || Math.random() < Math.exp(delta / temperature)) {
	//             currentMask = newMask;
	//             currentScore = newScore;

	//             const {teamA, teamB} = this.maskToTeams(players, currentMask);

	//             if(this.isValidTeamSize(teamA.length, teamB.length)) {
	//                 solutions.push(this.evaluateSolution(teamA, teamB))
	//             }
	//         }

	//         temperature *= coolingRate
	//     }

	//     return solutions;
	// }

	private maskToTeams(
		players: PlayerWithScore[],
		mask: number
	): { teamA: PlayerWithScore[]; teamB: PlayerWithScore[] } {
		const teamA: PlayerWithScore[] = [];
		const teamB: PlayerWithScore[] = [];

		for (let i = 0; i < players.length; i++) {
			if (mask & (1 << i)) {
				teamA.push(players[i]);
			} else {
				teamB.push(players[i]);
			}
		}

		return { teamA, teamB };
	}

	private evaluateSolution(
		teamA: PlayerWithScore[],
		teamB: PlayerWithScore[]
	): BalanceSolution {
		const teamAComp = this.analyzeTeamComposition(teamA);
		const teamBComp = this.analyzeTeamComposition(teamB);

		const scoreDifference = Math.abs(
			teamAComp.totalScore - teamBComp.totalScore
		);
		const varianceDifference = Math.abs(
			teamAComp.skillVariance - teamBComp.skillVariance
		);
		const roleBalanceDifference = Math.abs(
			teamAComp.roleBalance - teamBComp.roleBalance
		);

		const overallBalance = this.calculateOverallBalance(
			scoreDifference,
			varianceDifference,
			roleBalanceDifference,
			teamA.length + teamB.length
		);

		// 개선된 품질 점수 계산
		const maxPossibleScoreDiff =
			(this.maxScore - this.minScore) * Math.max(teamA.length, teamB.length);
		const normalizedScoreDiff =
			maxPossibleScoreDiff > 0 ? scoreDifference / maxPossibleScoreDiff : 0;

		const qualityScore = Math.max(
			0,
			100 -
				(normalizedScoreDiff * 40 + // 정규화된 점수 차이 (40점)
					varianceDifference / 30 + // 분산 차이 (최대 30점)
					roleBalanceDifference * 2 + // 역할 밸런스 (최대 20점)
					this.calculateExtraFactors(teamAComp, teamBComp)) // 추가 요소들 (최대 10점)
		);

		const fairnessIndex = this.calculateFairnessIndex(teamAComp, teamBComp);

		return {
			teamA: teamAComp,
			teamB: teamBComp,
			scoreDifference,
			overallBalance,
			qualityScore,
			balanceType: this.getBalanceType(qualityScore),
			fairnessIndex,
		};
	}

	private calculateExtraFactors(
		teamA: TeamComposition,
		teamB: TeamComposition
	): number {
		const synergyDiff = Math.abs(teamA.synergy - teamB.synergy);

		const strengthDiff = Math.abs(
			teamA.strengthDistribution - teamB.strengthDistribution
		);

		return synergyDiff * 0.5 + strengthDiff * 0.5;
	}

	private calculateFairnessIndex(
		teamA: TeamComposition,
		teamB: TeamComposition
	): number {
		const totalScoreA = teamA.totalScore || 1;
		const totalScoreB = teamB.totalScore || 1;
		const scoreFairness =
			1 - Math.abs(totalScoreA - totalScoreB) / (totalScoreA + totalScoreB);

		const maxVariance = Math.max(teamA.skillVariance, teamB.skillVariance, 1);
		const varianceFairness =
			1 - Math.abs(teamA.skillVariance - teamB.skillVariance) / maxVariance;

		const roleFairness =
			1 - Math.abs(teamA.roleBalance - teamB.roleBalance) / 20;

		return scoreFairness * 0.5 + varianceFairness * 0.3 + roleFairness * 0.2;
	}

	private analyzeTeamComposition(team: PlayerWithScore[]): TeamComposition {
        const scores = team.map(p => p.score);
        const weights = team.map(p => p.weight);

        const weightedTotalScore = scores.reduce((sum, score, i) => sum + (score * weights[i]), 0);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const averageScore = totalWeight > 0 ? weightedTotalScore / totalWeight : 0;
        
        const skillVariance = this.calculateWeightedVariance(scores, weights);
        const roleBalance = this.calculateRoleBalance(team);
        const synergy = this.calculateTeamSynergy(team);
        const strengthDistribution = this.calculateStrengthDistribution(team);

        return {
            players: team,
            totalScore,
            averageScore,
            skillVariance,
            roleBalance,
            synergy,
            strengthDistribution
        };
    }

    private calculateStrengthDistribution(team: PlayerWithScore[]): number {
        const normalizedScores = team.map(p => p.normalizedScore);
        const mean = normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length;
        const variance = normalizedScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / normalizedScores.length;
        
        const idealVariance = 0.2;
        return Math.max(0, 10 - Math.abs(variance - idealVariance) * 25);
    }

	private calculateRoleBalance(team: PlayerWithScore[]): number {
		const maxScore = Math.max(...Object.values(this.tierPoints));
		let carries = 0,
			supports = 0,
			balanced = 0;

		for (const player of team) {
			const scoreRatio = player.score / maxScore;
			if (scoreRatio >= 0.7) carries++;
			else if (scoreRatio <= 0.3) supports++;
			else balanced;
		}

		const idealCarry = team.length <= 3 ? 1 : 2;
		const idealSupport = team.length <= 3 ? 1 : 2;

		const carryDeviation = Math.abs(carries - idealCarry);
		const supportDeviation = Math.abs(supports - idealSupport);

		return Math.max(0, 10 - (carryDeviation + supportDeviation) * 2);
	}

	private calculateTeamSynergy(team: PlayerWithScore[]): number {
		if (team.length <= 1) return 10;

		let synergyScore = 0;
		const scores = team.map((p) => p.score).sort((a, b) => b - a);

		for (let i = 0; i < scores.length - 1; i++) {
			const diff = scores[i] - scores[i + 1];
			if (diff > 100 && diff < 800) synergyScore += 2;
			else if (diff <= 100) synergyScore += 1;
		}

		return Math.min(10, synergyScore);
	}

	private calculateWeightedVariance(
		scores: number[],
		weights: number[]
	): number {
		const weightedMean =
			scores.reduce((sum, score, i) => sum + score * weights[i], 0) /
			weights.reduce((sum, weight) => sum + weight, 0);

		const weightedVariance =
			scores.reduce(
				(sum, score, i) => sum + weights[i] * Math.pow(score - weightedMean, 2),
				0
			) / weights.reduce((sum, weight) => sum + weight, 0);

		return Math.sqrt(weightedVariance);
	}

	private getNextBestSolution(): BalanceSolution {
		for (const solution of this.solutions) {
			const solutionKey = this.generateSolutionKey(solution);

			if (!this.usedSolutions.has(solutionKey)) {
				this.usedSolutions.add(solutionKey);
				return solution;
			}
		}

		this.usedSolutions.clear();
		const bestSolution = this.solutions[0];
		this.usedSolutions.add(this.generateSolutionKey(bestSolution));
		return bestSolution;
	}

	private generateSolutionKey(solution: BalanceSolution): string {
		const teamAIds = solution.teamA.players
			.map((p) => p.userId)
			.sort()
			.join(',');
		const teamBIds = solution.teamB.players
			.map((p) => p.userId)
			.sort()
			.join(',');

		return `${teamAIds}|${teamBIds}`;
	}

	private isValidTeamSize(teamASize: number, teamBSize: number): boolean {
		return (
			Math.abs(teamASize - teamBSize) <= 1 && teamASize > 0 && teamBSize > 0
		);
	}

	private calculateOverallBalance(
		scoreDiff: number,
		varianceDiff: number,
		rollDiff: number,
		totalPlayers: number
	): number {
		return scoreDiff + varianceDiff * 0.5 + rollDiff * 20;
	}

	private getBalanceType(qualityScore: number): BalanceType {
		if (qualityScore >= 95) return 'Perfect';
		if (qualityScore >= 85) return 'Excellent';
		if (qualityScore >= 70) return 'Good';
		if (qualityScore >= 50) return 'Acceptable';

		return 'Poor';
	}

	private generateRandomPopulation(
		players: PlayerWithScore[],
		size: number
	): number[] {
		const population: number[] = [];

		for (let i = 0; i < size; i++) {
			population.push(this.generateRandomMask(players.length));
		}

		return population;
	}

	private generateRandomMask(playerCount: number): number {
		let mask = 0;
		const teamSize = Math.floor(playerCount / 2);
		const indices = Array.from({ length: playerCount }, (_, i) => i);

		for (let i = 0; i < teamSize; i++) {
			const randomIndex = Math.floor(Math.random() * indices.length);
			mask |= 1 << indices.splice(randomIndex, 1)[0];
		}

		return mask;
	}

	private calculateFitness(mask: number, players: PlayerWithScore[]): number {
		const { teamA, teamB } = this.maskToTeams(players, mask);

		if (!this.isValidTeamSize(teamA.length, teamB.length)) return 0;

		const solution = this.evaluateSolution(teamA, teamB);

		const scoreFitness = Math.max(0, 100 - solution.scoreDifference);
		const varianceFitness = Math.max(
			0,
			100 -
				Math.abs(solution.teamA.skillVariance - solution.teamB.skillVariance)
		);
		const roleFitness =
			(solution.teamA.roleBalance = solution.teamB.roleBalance) / 2;

		return scoreFitness * 0.4 + varianceFitness * 0.3 + roleFitness * 0.3;
	}

	private generateNextGeneration(parents: number[]): number[] {
		const nextGen: number[] = [];

		nextGen.push(...parents.slice(0, 15));

		while (nextGen.length < 50) {
			const parent1 = parents[Math.floor(Math.random() * parents.length)];
			const parent2 = parents[Math.floor(Math.random() * parents.length)];
			const child = this.crossover(parent1, parent2);
			const mutatedChild = this.mutateIndividual(child);
			nextGen.push(mutatedChild);
		}

		return nextGen;
	}

	private crossover(parent1: number, parent2: number): number {
		const crossoverPoint = Math.floor(Math.random() * 10);
		const mask = (1 << crossoverPoint) - 1;

		let child = (parent1 & mask) | (parent2 & -mask);

		const teamASize = this.countBits(child);
		const totalPlayers = 10;
		const idealSize = Math.floor(totalPlayers / 2);

		if (Math.abs(teamASize - idealSize) > 1) {
			child = this.adjustTeamSizes(child, totalPlayers);
		}

		return child;
	}

	private countBits(mask: number): number {
		let count = 0;
		while (mask) {
			count += mask & 1;
			mask >>= 1;
		}
		return count;
	}

	private adjustTeamSizes(mask: number, totalPlayers: number): number {
		const teamASize = this.countBits(mask);
		const idealSize = Math.floor(totalPlayers / 2);

		if (teamASize > idealSize + 1) {
			let adjusted = mask;
			let currentSize = teamASize;
			for (let i = 0; i < totalPlayers && currentSize > idealSize; i++) {
				if (adjusted & (1 << i) && Math.random() < 0.5) {
					adjusted &= ~(1 << i);
					currentSize--;
				}
			}
			return adjusted;
		} else if (teamASize < idealSize - 1) {
			let adjusted = mask;
			let currentSize = teamASize;
			for (let i = 0; i < totalPlayers && currentSize < idealSize; i++) {
				if (!(adjusted & (1 << i)) && Math.random() < 0.5) {
					adjusted |= 1 << i;
					currentSize++;
				}
			}
			return adjusted;
		}

		return mask;
	}

	private mutateIndividual(individual: number): number {
		let mutated = individual;
		const mutationRate = 0.1;

		for (let i = 0; i < 10; i++) {
			if (Math.random() < mutationRate) {
				mutated ^= i << 1;
			}
		}

		return this.adjustTeamSizes(mutated, 10);
	}

	private deduplicateAndSort(solutions: BalanceSolution[]): BalanceSolution[] {
		const uniqueSolutions = new Map<string, BalanceSolution>();

		for (const solution of solutions) {
			const key = this.generateSolutionKey(solution);
			if (
				!uniqueSolutions.has(key) ||
				uniqueSolutions.get(key)!.qualityScore < solution.qualityScore
			) {
				uniqueSolutions.set(key, solution);
			}
		}

		return Array.from(uniqueSolutions.values())
			.sort((a, b) => b.qualityScore - a.qualityScore)
			.slice(0, 50);
	}
}
