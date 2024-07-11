export enum SupportGame {
    'Valorant' = 'Valorant',
    'League of Legends' = 'League of Legends',
    'PUBG Default' = 'PUBG Default',
    'PUBG Custom' = 'PUBG Custom',
}

export interface SupportGameList {
    name: string;
    value: SupportGame;
}

export interface SupportMapList {
    name: string;
    value: string;
    game: SupportGame;
}

interface Tier {
    label: string;
    value: string;
    weight: number;
    emoji: string;
}

export type TierList = {
    [key in SupportGame]?: Tier[];
};