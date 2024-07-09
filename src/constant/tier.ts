import { TierList } from "../types/constant";

const valorantTierColors: Record<string, string> = {
    'Iron 1': '⚫', 'Iron 2': '⚫', 'Iron 3': '⚫',
    'Bronze 1': '🟤', 'Bronze 2': '🟤', 'Bronze 3': '🟤',
    'Silver 1': '⚪', 'Silver 2': '⚪', 'Silver 3': '⚪',
    'Gold 1': '🟡', 'Gold 2': '🟡', 'Gold 3': '🟡',
    'Platinum 1': '🟢', 'Platinum 2': '🟢', 'Platinum 3': '🟢',
    'Diamond 1': '🔷', 'Diamond 2': '🔷', 'Diamond 3': '🔷',
    'Immortal 1': '🔴', 'Immortal 2': '🔴', 'Immortal 3': '🔴',
    'Radiant': '⭐'
};

const GameTierList: TierList = {
    Valorant: [
        { label: '아이언 1', value: 'Iron 1', weight: 1, emoji: valorantTierColors['Iron 1'] },
        { label: '아이언 2', value: 'Iron 2', weight: 2, emoji: valorantTierColors['Iron 2'] },
        { label: '아이언 3', value: 'Iron 3', weight: 3, emoji: valorantTierColors['Iron 3'] },
        { label: '브론즈 1', value: 'Bronze 1', weight: 4, emoji: valorantTierColors['Bronze 1'] },
        { label: '브론즈 2', value: 'Bronze 2', weight: 5, emoji: valorantTierColors['Bronze 2'] },
        { label: '브론즈 3', value: 'Bronze 3', weight: 6, emoji: valorantTierColors['Bronze 3'] },
        { label: '실버 1', value: 'Silver 1', weight: 7, emoji: valorantTierColors['Silver 1'] },
        { label: '실버 2', value: 'Silver 2', weight: 8, emoji: valorantTierColors['Silver 2'] },
        { label: '실버 3', value: 'Silver 3', weight: 9, emoji: valorantTierColors['Silver 3'] },
        { label: '골드 1', value: 'Gold 1', weight: 10, emoji: valorantTierColors['Gold 1'] },
        { label: '골드 2', value: 'Gold 2', weight: 11, emoji: valorantTierColors['Gold 2'] },
        { label: '골드 3', value: 'Gold 3', weight: 12, emoji: valorantTierColors['Gold 3'] },
        { label: '플래티넘 1', value: 'Platinum 1', weight: 13, emoji: valorantTierColors['Platinum 1'] },
        { label: '플래티넘 2', value: 'Platinum 2', weight: 14, emoji: valorantTierColors['Platinum 2'] },
        { label: '플래티넘 3', value: 'Platinum 3', weight: 15, emoji: valorantTierColors['Platinum 3'] },
        { label: '다이아몬드 1', value: 'Diamond 1', weight: 16, emoji: valorantTierColors['Diamond 1'] },
        { label: '다이아몬드 2', value: 'Diamond 2', weight: 17, emoji: valorantTierColors['Diamond 2'] },
        { label: '다이아몬드 3', value: 'Diamond 3', weight: 18, emoji: valorantTierColors['Diamond 3'] },
        { label: '불멸 1', value: 'Immortal 1', weight: 19, emoji: valorantTierColors['Immortal 1'] },
        { label: '불멸 2', value: 'Immortal 2', weight: 20, emoji: valorantTierColors['Immortal 2'] },
        { label: '불멸 3', value: 'Immortal 3', weight: 21, emoji: valorantTierColors['Immortal 3'] },
        { label: '레디언트', value: 'Radiant', weight: 22, emoji: valorantTierColors['Radiant'] }
    ],
    'League of Legends': [
        { label: '아이언 IV', value: 'Iron IV', weight: 1, emoji: '👾' },
        { label: '아이언 III', value: 'Iron III', weight: 2, emoji: '👾' },
        { label: '아이언 II', value: 'Iron II', weight: 3, emoji: '👾' },
        { label: '아이언 I', value: 'Iron I', weight: 4, emoji: '👾' },
        { label: '브론즈 IV', value: 'Bronze IV', weight: 5, emoji: '👾' },
        { label: '브론즈 III', value: 'Bronze III', weight: 6, emoji: '👾' },
        { label: '브론즈 II', value: 'Bronze II', weight: 7, emoji: '👾' },
        { label: '브론즈 I', value: 'Bronze I', weight: 8, emoji: '👾' },
        { label: '실버 IV', value: 'Silver IV', weight: 9, emoji: '👾' },
        { label: '실버 III', value: 'Silver III', weight: 10, emoji: '👾' },
        { label: '실버 II', value: 'Silver II', weight: 11, emoji: '👾' },
        { label: '실버 I', value: 'Silver I', weight: 12, emoji: '👾' },
        { label: '골드 IV', value: 'Gold IV', weight: 13, emoji: '👾' },
        { label: '골드 III', value: 'Gold III', weight: 14, emoji: '👾' },
        { label: '골드 II', value: 'Gold II', weight: 15, emoji: '👾' },
        { label: '골드 I', value: 'Gold I', weight: 16, emoji: '👾' },
        { label: '플래티넘 IV', value: 'Platinum IV', weight: 17, emoji: '👾' },
        { label: '플래티넘 III', value: 'Platinum III', weight: 18, emoji: '👾' },
        { label: '플래티넘 II', value: 'Platinum II', weight: 19, emoji: '👾' },
        { label: '플래티넘 I', value: 'Platinum I', weight: 20, emoji: '👾' },
        { label: '다이아몬드 IV', value: 'Diamond IV', weight: 21, emoji: '👾' },
        { label: '다이아몬드 III', value: 'Diamond III', weight: 22, emoji: '👾' },
        { label: '다이아몬드 II', value: 'Diamond II', weight: 23, emoji: '👾' },
        { label: '다이아몬드 I', value: 'Diamond I', weight: 24, emoji: '👾' },
        { label: '마스터', value: 'Master', weight: 25, emoji: '👾' },
        { label: '그랜드마스터', value: 'Grandmaster', weight: 26, emoji: '👾' },
        { label: '챌린저', value: 'Challenger', weight: 27, emoji: '👾' }
    ]
}

export default GameTierList;