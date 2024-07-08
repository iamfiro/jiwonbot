export enum SupportGame {
    'Valorant' = 'Valorant',
    'League of Legends' = 'League of Legends'
}

export interface SupportGameList {
    name: string;
    value: SupportGame;
}

export interface SupportMapList extends SupportGameList {
    game: SupportGame;
    banner: string;
    img: string;
}