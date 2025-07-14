// src/utils/getUserTier.ts
import { SupportGameTier } from '@/constants/game';
import prisma from '@/utils/prisma';

export interface UserTierInfo {
	userId: string;
	tier: string | null;
	isRegistered: boolean;
}

/**
 * 특정 사용자의 게임 티어를 조회합니다
 */
export async function getUserTier(
	userId: string, 
	game: SupportGameTier
): Promise<UserTierInfo> {
	try {
		// TODO: 실제 prisma 스키마에 맞게 수정해야 합니다
		// 예시 스키마: UserGameTier { id, userId, game, tier, createdAt, updatedAt }
		
		const userTier = await prisma.userGameTier?.findFirst({
			where: {
				userId: userId,
				game: game
			}
		});

		return {
			userId,
			tier: userTier?.tier || null,
			isRegistered: !!userTier
		};
	} catch (error) {
		console.error(`❌ Error fetching tier for user ${userId}, game ${game}:`, error);
		return {
			userId,
			tier: null,
			isRegistered: false
		};
	}
}

/**
 * 여러 사용자의 게임 티어를 한 번에 조회합니다
 */
export async function getUserTiers(
	userIds: string[], 
	game: SupportGameTier
): Promise<UserTierInfo[]> {
	try {
		const userTiers = await prisma.userGameTier?.findMany({
			where: {
				userId: {
					in: userIds
				},
				game: game
			}
		});

		return userIds.map(userId => {
			const userTier = userTiers?.find(tier => tier.userId === userId);
			return {
				userId,
				tier: userTier?.tier || null,
				isRegistered: !!userTier
			};
		});
	} catch (error) {
		console.error(`❌ Error fetching tiers for users, game ${game}:`, error);
		return userIds.map(userId => ({
			userId,
			tier: null,
			isRegistered: false
		}));
	}
}