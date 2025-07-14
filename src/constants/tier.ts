import { SupportGameTier } from './game';

export interface Tier {
	label: { ko: string; en: string };
	value: string;
	weight: number;
	emoji: string;
}

export type TierList = {
	[key in SupportGameTier]: Tier[];
};

export const GameTierList: TierList = {
	[SupportGameTier.Valorant]: [
		{
			label: { ko: '아이언 1', en: 'Iron 1' },
			value: 'Iron 1',
			weight: 1,
			emoji: '🔸',
		},
		{
			label: { ko: '아이언 2', en: 'Iron 2' },
			value: 'Iron 2',
			weight: 2,
			emoji: '🔸',
		},
		{
			label: { ko: '아이언 3', en: 'Iron 3' },
			value: 'Iron 3',
			weight: 3,
			emoji: '🔸',
		},
		{
			label: { ko: '브론즈 1', en: 'Bronze 1' },
			value: 'Bronze 1',
			weight: 4,
			emoji: '🟤',
		},
		{
			label: { ko: '브론즈 2', en: 'Bronze 2' },
			value: 'Bronze 2',
			weight: 5,
			emoji: '🟤',
		},
		{
			label: { ko: '브론즈 3', en: 'Bronze 3' },
			value: 'Bronze 3',
			weight: 6,
			emoji: '🟤',
		},
		{
			label: { ko: '실버 1', en: 'Silver 1' },
			value: 'Silver 1',
			weight: 7,
			emoji: '⚪',
		},
		{
			label: { ko: '실버 2', en: 'Silver 2' },
			value: 'Silver 2',
			weight: 8,
			emoji: '⚪',
		},
		{
			label: { ko: '실버 3', en: 'Silver 3' },
			value: 'Silver 3',
			weight: 9,
			emoji: '⚪',
		},
		{
			label: { ko: '골드 1', en: 'Gold 1' },
			value: 'Gold 1',
			weight: 10,
			emoji: '🟡',
		},
		{
			label: { ko: '골드 2', en: 'Gold 2' },
			value: 'Gold 2',
			weight: 11,
			emoji: '🟡',
		},
		{
			label: { ko: '골드 3', en: 'Gold 3' },
			value: 'Gold 3',
			weight: 12,
			emoji: '🟡',
		},
		{
			label: { ko: '플래티넘 1', en: 'Platinum 1' },
			value: 'Platinum 1',
			weight: 13,
			emoji: '🔵',
		},
		{
			label: { ko: '플래티넘 2', en: 'Platinum 2' },
			value: 'Platinum 2',
			weight: 14,
			emoji: '🔵',
		},
		{
			label: { ko: '플래티넘 3', en: 'Platinum 3' },
			value: 'Platinum 3',
			weight: 15,
			emoji: '🔵',
		},
		{
			label: { ko: '다이아몬드 1', en: 'Diamond 1' },
			value: 'Diamond 1',
			weight: 16,
			emoji: '💎',
		},
		{
			label: { ko: '다이아몬드 2', en: 'Diamond 2' },
			value: 'Diamond 2',
			weight: 17,
			emoji: '💎',
		},
		{
			label: { ko: '다이아몬드 3', en: 'Diamond 3' },
			value: 'Diamond 3',
			weight: 18,
			emoji: '💎',
		},
		{
			label: { ko: '초월자 1', en: 'Ascendant 1' },
			value: 'Ascendant 1',
			weight: 19,
			emoji: '🟢',
		},
		{
			label: { ko: '초월자 2', en: 'Ascendant 2' },
			value: 'Ascendant 2',
			weight: 20,
			emoji: '🟢',
		},
		{
			label: { ko: '초월자 3', en: 'Ascendant 3' },
			value: 'Ascendant 3',
			weight: 21,
			emoji: '🟢',
		},
		{
			label: { ko: '불멸 1', en: 'Immortal 1' },
			value: 'Immortal 1',
			weight: 22,
			emoji: '🟣',
		},
		{
			label: { ko: '불멸 2', en: 'Immortal 2' },
			value: 'Immortal 2',
			weight: 23,
			emoji: '🟣',
		},
		{
			label: { ko: '불멸 3', en: 'Immortal 3' },
			value: 'Immortal 3',
			weight: 24,
			emoji: '🟣',
		},
		{
			label: { ko: '레디언트', en: 'Radiant' },
			value: 'Radiant',
			weight: 25,
			emoji: '⭐',
		},
	],
	[SupportGameTier['League of Legends']]: [
		{
			label: { ko: '아이언 IV', en: 'Iron IV' },
			value: 'Iron IV',
			weight: 1,
			emoji: '🔸',
		},
		{
			label: { ko: '아이언 III', en: 'Iron III' },
			value: 'Iron III',
			weight: 2,
			emoji: '🔸',
		},
		{
			label: { ko: '아이언 II', en: 'Iron II' },
			value: 'Iron II',
			weight: 3,
			emoji: '🔸',
		},
		{
			label: { ko: '아이언 I', en: 'Iron I' },
			value: 'Iron I',
			weight: 4,
			emoji: '🔸',
		},
		{
			label: { ko: '브론즈 IV', en: 'Bronze IV' },
			value: 'Bronze IV',
			weight: 5,
			emoji: '🟤',
		},
		{
			label: { ko: '브론즈 III', en: 'Bronze III' },
			value: 'Bronze III',
			weight: 6,
			emoji: '🟤',
		},
		{
			label: { ko: '브론즈 II', en: 'Bronze II' },
			value: 'Bronze II',
			weight: 7,
			emoji: '🟤',
		},
		{
			label: { ko: '브론즈 I', en: 'Bronze I' },
			value: 'Bronze I',
			weight: 8,
			emoji: '🟤',
		},
		{
			label: { ko: '실버 IV', en: 'Silver IV' },
			value: 'Silver IV',
			weight: 9,
			emoji: '⚪',
		},
		{
			label: { ko: '실버 III', en: 'Silver III' },
			value: 'Silver III',
			weight: 10,
			emoji: '⚪',
		},
		{
			label: { ko: '실버 II', en: 'Silver II' },
			value: 'Silver II',
			weight: 11,
			emoji: '⚪',
		},
		{
			label: { ko: '실버 I', en: 'Silver I' },
			value: 'Silver I',
			weight: 12,
			emoji: '⚪',
		},
		{
			label: { ko: '골드 IV', en: 'Gold IV' },
			value: 'Gold IV',
			weight: 13,
			emoji: '🟡',
		},
		{
			label: { ko: '골드 III', en: 'Gold III' },
			value: 'Gold III',
			weight: 14,
			emoji: '🟡',
		},
		{
			label: { ko: '골드 II', en: 'Gold II' },
			value: 'Gold II',
			weight: 15,
			emoji: '🟡',
		},
		{
			label: { ko: '골드 I', en: 'Gold I' },
			value: 'Gold I',
			weight: 16,
			emoji: '🟡',
		},
		{
			label: { ko: '플래티넘 IV', en: 'Platinum IV' },
			value: 'Platinum IV',
			weight: 17,
			emoji: '🔵',
		},
		{
			label: { ko: '플래티넘 III', en: 'Platinum III' },
			value: 'Platinum III',
			weight: 18,
			emoji: '🔵',
		},
		{
			label: { ko: '플래티넘 II', en: 'Platinum II' },
			value: 'Platinum II',
			weight: 19,
			emoji: '🔵',
		},
		{
			label: { ko: '플래티넘 I', en: 'Platinum I' },
			value: 'Platinum I',
			weight: 20,
			emoji: '🔵',
		},
		{
			label: { ko: '에메랄드 IV', en: 'Emerald IV' },
			value: 'Emerald IV',
			weight: 21,
			emoji: '🟢',
		},
		{
			label: { ko: '에메랄드 III', en: 'Emerald III' },
			value: 'Emerald III',
			weight: 22,
			emoji: '🟢',
		},
		{
			label: { ko: '에메랄드 II', en: 'Emerald II' },
			value: 'Emerald II',
			weight: 23,
			emoji: '🟢',
		},
		{
			label: { ko: '에메랄드 I', en: 'Emerald I' },
			value: 'Emerald I',
			weight: 24,
			emoji: '🟢',
		},
		{
			label: { ko: '다이아몬드 IV', en: 'Diamond IV' },
			value: 'Diamond IV',
			weight: 25,
			emoji: '💎',
		},
		{
			label: { ko: '다이아몬드 III', en: 'Diamond III' },
			value: 'Diamond III',
			weight: 26,
			emoji: '💎',
		},
		{
			label: { ko: '다이아몬드 II', en: 'Diamond II' },
			value: 'Diamond II',
			weight: 27,
			emoji: '💎',
		},
		{
			label: { ko: '다이아몬드 I', en: 'Diamond I' },
			value: 'Diamond I',
			weight: 28,
			emoji: '💎',
		},
		{
			label: { ko: '마스터', en: 'Master' },
			value: 'Master',
			weight: 29,
			emoji: '🏆',
		},
		{
			label: { ko: '그랜드마스터', en: 'Grandmaster' },
			value: 'Grandmaster',
			weight: 30,
			emoji: '👑',
		},
		{
			label: { ko: '챌린저', en: 'Challenger' },
			value: 'Challenger',
			weight: 31,
			emoji: '⭐',
		},
	],
};
