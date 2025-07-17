import { ScoreboardData } from '@/fragments/scoreboard';
import prisma from '@/utils/prisma';

export async function saveScoreboardData(
	messageId: string,
    guildId: string,
	data: ScoreboardData
): Promise<void> {
	try {
		await prisma.scoreBoard.upsert({
			where: {
				messageId: messageId,
			},
			create: {
                guildId,
				messageId: messageId,
				name: data.name,
				redName: data.redTeam.name,
				redScore: data.redTeam.score,
				blueName: data.blueTeam.name,
				blueScore: data.blueTeam.score,
				creatorId: data.creator,
				isFinished: data.isFinished,
				winner: data.winner || null,
			},
			update: {
				name: data.name,
				redName: data.redTeam.name,
				redScore: data.redTeam.score,
				blueName: data.blueTeam.name,
				blueScore: data.blueTeam.score,
				creatorId: data.creator,
				isFinished: data.isFinished,
				winner: data.winner || null,
			},
		});

		console.log(`✅ Scoreboard data saved for message ${messageId}`);
	} catch (error) {
		console.error(
			`❌ Error saving scoreboard data for message ${messageId}:`,
			error
		);
		throw error;
	}
}

export async function getScoreboardData(
	messageId: string
): Promise<ScoreboardData | null> {
	try {
		const scoreboard = await prisma.scoreBoard.findUnique({
			where: { messageId },
		});

		if (!scoreboard) return null;

		return {
			name: scoreboard.name,
			redTeam: {
				name: scoreboard.redName,
				score: scoreboard.redScore,
			},
			blueTeam: {
				name: scoreboard.blueName,
				score: scoreboard.blueScore,
			},
			creator: scoreboard.creatorId,
			isFinished: scoreboard.isFinished,
			winner: scoreboard.winner as 'red' | 'blue' | 'tie' | undefined,
		};
	} catch (error) {
		console.error('Error fetching scoreboard data: ', error);
		return null;
	}
}

export async function updateScoreboardData(
	messageId: string,
	data: ScoreboardData
): Promise<void> {
	try {
		await prisma.scoreBoard.update({
			where: { messageId },
			data: {
				redScore: data.redTeam.score,
				blueScore: data.blueTeam.score,
				isFinished: data.isFinished,
				winner: data.winner,
			},
		});
	} catch (error) {
		console.error('Error updating scoreboard data: ', error);
		throw error;
	}
}

export async function deleteScoreboardData(messageId: string): Promise<void> {
	try {
		await prisma.scoreBoard.delete({
			where: { messageId },
		});
	} catch (error) {
		console.error('Error deleting scoreboard data: ', error);
	}
}
