import { SupportGameTier } from '@/constants/game';
import prisma from '@/utils/prisma';

export async function setUserTier(
	userId: string,
	game: SupportGameTier,
	tierValue: string
): Promise<void> {
	try {
		const fieldToUpdate =
			game === SupportGameTier.Valorant ? 'valorantTier' : 'lolTier';

		await prisma.tier.upsert({
			where: { userId },
			update: { [fieldToUpdate]: tierValue },
			create: {
				userId,
				[fieldToUpdate]: tierValue,
			},
		});

		console.log(
			`✅ Tier registered: ${game} - ${tierValue} for user ${userId}`
		);
	} catch (error) {
		console.error(`❌ Error setting tier for user ${userId}:`, error);
	}
}

export async function getUserTier(
	userId: string,
	game: SupportGameTier
): Promise<string | null> {
	try {
		const userTier = await prisma.tier.findUnique({
			where: { userId },
		});

		if (!userTier) return null;

		return game === SupportGameTier.Valorant
			? userTier.valorantTier
			: userTier.lolTier;
	} catch (e) {
		console.error(`❌ Error getting tier for user ${userId}:`, e);
		return null;
	}
}

export async function getAllUserTiers(userId: string): Promise<{
	valorantTier: string | null;
	lolTier: string | null;
} | null> {
	try {
		const userTier = await prisma.tier.findUnique({
			where: { userId },
		});

		if (!userTier) return null;

		return {
			valorantTier: userTier.valorantTier,
			lolTier: userTier.lolTier,
		};
	} catch (e) {
		console.error(`❌ Error getting all tier for user ${userId}:`, e);

		return null;
	}
}
