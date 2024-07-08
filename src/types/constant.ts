export enum SupportGame {
    'Valorant' = 'Valorant',
    'League of Legends' = 'League of Legends'
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