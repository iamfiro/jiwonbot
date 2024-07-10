import { SupportGame, SupportGameList } from "../types/constant";

const SupportGameList: SupportGameList[] = [
    {
        name: '🔫 발로란트',
        value: SupportGame.Valorant
    },
    {
        name: '배틀그라운드 - 일반맵',
        value: SupportGame["PUBG Default"]
    },
    {
        name: '배틀그라운드 - 사설맵',
        value: SupportGame["PUBG Custom"]
    }
]

export default SupportGameList;