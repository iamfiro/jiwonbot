import { SupportGameTier } from '@/constants/game';
import prisma from '@/utils/prisma';

export async function setUserTier(
	userId: string,
	game: SupportGameTier,
	tierValue: string
): Promise<void> {
	try {
		await prisma.userGameTier.upsert({
			where: {
				userId_game: {
					userId,
					game,
				},
			},
			update: {
				tier: tierValue,
			},
			create: {
				userId,
				game,
				tier: tierValue,
			},
		});

		console.log(
			`✅ Tier registered: ${game} - ${tierValue} for user ${userId}`
		);
	} catch (error) {
		console.error(`❌ Error setting tier for user ${userId}:`, error);
		throw error;
	}
}

export async function getUserTier(
	userId: string,
	game: SupportGameTier
): Promise<string | null> {
	try {
		const userTier = await prisma.userGameTier.findUnique({
			where: {
				userId_game: {
					userId,
					game,
				},
			},
		});

		return userTier?.tier || null;
	} catch (error) {
		console.error(`❌ Error getting tier for user ${userId}:`, error);
		return null;
	}
}

export async function getAllUserTiers(userId: string): Promise<{
	valorantTier: string | null;
	lolTier: string | null;
} | null> {
	try {
		const userTiers = await prisma.userGameTier.findMany({
			where: { userId },
		});

		if (userTiers.length === 0) return null;

		const valorantTier = userTiers.find(
			(tier) => tier.game === SupportGameTier.Valorant
		)?.tier || null;

		const lolTier = userTiers.find(
			(tier) => tier.game === SupportGameTier['League of Legends']
		)?.tier || null;

		return {
			valorantTier,
			lolTier,
		};
	} catch (error) {
		console.error(`❌ Error getting all tiers for user ${userId}:`, error);
		return null;
	}
}

export async function deleteUserTier(
	userId: string,
	game: SupportGameTier
): Promise<void> {
	try {
		await prisma.userGameTier.delete({
			where: {
				userId_game: {
					userId,
					game,
				},
			},
		});

		console.log(`✅ Tier deleted: ${game} for user ${userId}`);
	} catch (error) {
		console.error(`❌ Error deleting tier for user ${userId}:`, error);
		throw error;
	}
}

export async function getAllUsersWithTiers(game?: SupportGameTier): Promise<
	Array<{
		userId: string;
		game: string;
		tier: string;
		createdAt: Date;
		updatedAt: Date;
	}>
> {
	try {
		const where = game ? { game } : {};

		const userTiers = await prisma.userGameTier.findMany({
			where,
			orderBy: [
				{ game: 'asc' },
				{ tier: 'desc' },
			],
		});

		return userTiers;
	} catch (error) {
		console.error(`❌ Error getting all users with tiers:`, error);
		return [];
	}
}