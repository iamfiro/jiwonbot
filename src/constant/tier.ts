import { SupportGameTier, TierList } from "../types/constant";

const GameTierList: TierList = {
    Valorant: [
        { label: '아이언 1', value: 'Iron 1', weight: 1, emoji: '<:Iron_1_Rank:1260066230354706504>' },
        { label: '아이언 2', value: 'Iron 2', weight: 2, emoji: '<:Iron_2_Rank:1260065998992703499>' },
        { label: '아이언 3', value: 'Iron 3', weight: 3, emoji: '<:Iron_3_Rank:1260066002423779419>' },
        { label: '브론즈 1', value: 'Bronze 1', weight: 4, emoji: '<:Bronze_1_Rank:1260065971465490515>' },
        { label: '브론즈 2', value: 'Bronze 2', weight: 5, emoji: '<:Bronze_2_Rank:1260065973478621224>' },
        { label: '브론즈 3', value: 'Bronze 3', weight: 6, emoji: '<:Bronze_3_Rank:1260065975710253098>' },
        { label: '실버 1', value: 'Silver 1', weight: 7, emoji: '<:Silver_1_Rank:1260066015660871811>' },
        { label: '실버 2', value: 'Silver 2', weight: 8, emoji: '<:Silver_2_Rank:1260066233127010404>' },
        { label: '실버 3', value: 'Silver 3', weight: 9, emoji: '<:Silver_3_Rank:1260066019708502078>' },
        { label: '골드 1', value: 'Gold 1', weight: 10, emoji: '<:Gold_1_Rank:1260065983230382080>' },
        { label: '골드 2', value: 'Gold 2', weight: 11, emoji: '<:Gold_2_Rank:1260065985193574482>' },
        { label: '골드 3', value: 'Gold 3', weight: 12, emoji: '<:Gold_3_Rank:1260065987898904717>' },
        { label: '플래티넘 1', value: 'Platinum 1', weight: 13, emoji: '<:Platinum_1_Rank:1260066005494009856>' },
        { label: '플래티넘 2', value: 'Platinum 2', weight: 14, emoji: '<:Platinum_2_Rank:1260066008903975033>' },
        { label: '플래티넘 3', value: 'Platinum 3', weight: 15, emoji: '<:Platinum_3_Rank:1260066125408899123>' },
        { label: '다이아몬드 1', value: 'Diamond 1', weight: 16, emoji: '<:Diamond_1_Rank:1260065977886834729>' },
        { label: '다이아몬드 2', value: 'Diamond 2', weight: 17, emoji: '<:Diamond_2_Rank:1260065979577274428>' },
        { label: '다이아몬드 3', value: 'Diamond 3', weight: 18, emoji: '<:Diamond_3_Rank:1260065981431021642>' },
        { label: '불멸 1', value: 'Immortal 1', weight: 19, emoji: '<:Immortal_1_Rank:1260068935571607603>' },
        { label: '불멸 2', value: 'Immortal 2', weight: 20, emoji: '<:Immortal_2_Rank:1260065992902709350>' },
        { label: '불멸 3', value: 'Immortal 3', weight: 21, emoji: '<:Immortal_3_Rank:1260065994554998794>' },
        { label: '레디언트', value: 'Radiant', weight: 22, emoji: '<:Radiant_Rank:1260066013509320715>' }
    ],
    'League of Legends': [
        { label: '아이언 IV', value: 'Iron IV', weight: 1, emoji: '<:Iron:1260066729804038156>' },
        { label: '아이언 III', value: 'Iron III', weight: 2, emoji: '<:Iron:1260066729804038156>' },
        { label: '아이언 II', value: 'Iron II', weight: 3, emoji: '<:Iron:1260066729804038156>' },
        { label: '아이언 I', value: 'Iron I', weight: 4, emoji: '<:Iron:1260066729804038156>' },
        { label: '브론즈 IV', value: 'Bronze IV', weight: 5, emoji: '<:Bronze:1260066581711425576>' },
        { label: '브론즈 III', value: 'Bronze III', weight: 6, emoji: '<:Bronze:1260066581711425576>' },
        { label: '브론즈 II', value: 'Bronze II', weight: 7, emoji: '<:Bronze:1260066581711425576>' },
        { label: '브론즈 I', value: 'Bronze I', weight: 8, emoji: '<:Bronze:1260066581711425576>' },
        { label: '실버 IV', value: 'Silver IV', weight: 9, emoji: '<:Silver:1260066662128812074>' },
        { label: '실버 III', value: 'Silver III', weight: 10, emoji: '<:Silver:1260066662128812074>' },
        { label: '실버 II', value: 'Silver II', weight: 11, emoji: '<:Silver:1260066662128812074>' },
        { label: '실버 I', value: 'Silver I', weight: 12, emoji: '<:Silver:1260066662128812074>' },
        { label: '골드 IV', value: 'Gold IV', weight: 13, emoji: '<:Gold:1260066834439209042>' },
        { label: '골드 III', value: 'Gold III', weight: 14, emoji: '<:Gold:1260066834439209042>' },
        { label: '골드 II', value: 'Gold II', weight: 15, emoji: '<:Gold:1260066834439209042>' },
        { label: '골드 I', value: 'Gold I', weight: 16, emoji: '<:Gold:1260066834439209042>' },
        { label: '플래티넘 IV', value: 'Platinum IV', weight: 17, emoji: '<:Platinum:1260066948390195212>' },
        { label: '플래티넘 III', value: 'Platinum III', weight: 18, emoji: '<:Platinum:1260066948390195212>' },
        { label: '플래티넘 II', value: 'Platinum II', weight: 19, emoji: '<:Platinum:1260066948390195212>' },
        { label: '플래티넘 I', value: 'Platinum I', weight: 20, emoji: '<:Platinum:1260066948390195212>' },
        { label: '다이아몬드 IV', value: 'Diamond IV', weight: 21, emoji: '<:Diamond:1260066953075228702>' },
        { label: '다이아몬드 III', value: 'Diamond III', weight: 22, emoji: '<:Diamond:1260066953075228702>' },
        { label: '다이아몬드 II', value: 'Diamond II', weight: 23, emoji: '<:Diamond:1260066953075228702>' },
        { label: '다이아몬드 I', value: 'Diamond I', weight: 24, emoji: '<:Diamond:1260066953075228702>' },
        { label: '마스터', value: 'Master', weight: 25, emoji: '<:Master:1260067013326278667>' },
        { label: '그랜드마스터', value: 'Grandmaster', weight: 26, emoji: '<:Grandmaster:1260067106658058310>' },
        { label: '챌린저', value: 'Challenger', weight: 27, emoji: '<:Challenger:1260067067864940596>' }
    ]
}


export default GameTierList;