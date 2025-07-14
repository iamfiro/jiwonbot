import { SupportGameTier } from '@/constants/game';
import { BalancePlayer, TeamBalancer } from '@/core/team-balancer';

// 콘솔 출력 스타일링 함수들
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
};

const printHeader = (text: string) => {
    const line = '='.repeat(60);
    console.log(`${colors.cyan}${line}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}🎮 ${text} 🎮${colors.reset}`);
    console.log(`${colors.cyan}${line}${colors.reset}\n`);
};

const printSubHeader = (text: string) => {
    console.log(`${colors.yellow}${colors.bright}📋 ${text}${colors.reset}`);
    console.log(`${colors.yellow}${'─'.repeat(40)}${colors.reset}`);
};

const printTeamInfo = (teamName: string, team: any, isWinner?: boolean) => {
    const teamColor = teamName.includes('A') ? colors.blue : colors.magenta;
    const winnerEmoji = isWinner ? ' 🏆' : '';
    
    console.log(`${teamColor}${colors.bright}${teamName}${winnerEmoji}${colors.reset}`);
    console.log(`${teamColor}├─ 총 점수: ${team.totalScore.toFixed(1)}${colors.reset}`);
    console.log(`${teamColor}├─ 평균 점수: ${team.averageScore.toFixed(1)}${colors.reset}`);
    console.log(`${teamColor}├─ 스킬 분산: ${team.skillVariance.toFixed(1)}${colors.reset}`);
    console.log(`${teamColor}├─ 역할 밸런스: ${team.roleBalance.toFixed(1)}${colors.reset}`);
    console.log(`${teamColor}└─ 시너지: ${team.synergy.toFixed(1)}${colors.reset}`);
    
    console.log(`${teamColor}   플레이어:${colors.reset}`);
    team.players.forEach((player: any, index: number) => {
        const isLast = index === team.players.length - 1;
        const prefix = isLast ? '   └─' : '   ├─';
        console.log(`${teamColor}   ${prefix} ${player.name} (${player.tier}) - ${player.score}점${colors.reset}`);
    });
    console.log();
};

const printBalanceResult = (solution: any) => {
    const balanceColor = solution.balanceType === 'Perfect' ? colors.green :
                        solution.balanceType === 'Excellent' ? colors.cyan :
                        solution.balanceType === 'Good' ? colors.yellow :
                        solution.balanceType === 'Acceptable' ? colors.magenta : colors.red;
    
    console.log(`${colors.bright}📊 밸런스 결과${colors.reset}`);
    console.log(`${colors.white}├─ 점수 차이: ${solution.scoreDifference.toFixed(1)}${colors.reset}`);
    console.log(`${colors.white}├─ 전체 밸런스: ${solution.overallBalance.toFixed(1)}${colors.reset}`);
    console.log(`${colors.white}├─ 품질 점수: ${solution.qualityScore.toFixed(1)}${colors.reset}`);
    console.log(`${colors.white}└─ 밸런스 등급: ${balanceColor}${solution.balanceType}${colors.reset}`);
    console.log();
};

// 테스트 데이터 생성
const createValorantPlayers = (): BalancePlayer[] => [
    { name: 'ProPlayer김철수', tier: 'Radiant', userId: '1' },
    { name: 'CarryMaster이영희', tier: 'Immortal 3', userId: '2' },
    { name: 'FlashBang박민수', tier: 'Immortal 1', userId: '3' },
    { name: 'SniperKing김지원', tier: 'Ascendant 2', userId: '4' },
    { name: 'RushB정현우', tier: 'Diamond 1', userId: '5' },
    { name: 'Support최수정', tier: 'Platinum 2', userId: '6' },
    { name: 'Newbie안재현', tier: 'Gold 1', userId: '7' },
    { name: 'Casual윤서준', tier: 'Silver 3', userId: '8' },
    { name: 'Bronze용사', tier: 'Bronze 2', userId: '9' },
    { name: 'Iron최하위', tier: 'Iron 1', userId: '10' }
];

const createLolPlayers = (): BalancePlayer[] => [
    { name: 'Faker조커', tier: 'Challenger', userId: '1' },
    { name: 'Canyon정글', tier: 'Grandmaster', userId: '2' },
    { name: 'Showmaker미드', tier: 'Master', userId: '3' },
    { name: 'Keria서폿', tier: 'Diamond I', userId: '4' },
    { name: 'Gumayusi원딜', tier: 'Diamond III', userId: '5' },
    { name: 'Oner정글러', tier: 'Platinum I', userId: '6' },
    { name: 'Zeus탑라이너', tier: 'Gold II', userId: '7' },
    { name: 'Casual게이머', tier: 'Silver I', userId: '8' },
    { name: 'Bronze탑', tier: 'Bronze III', userId: '9' },
    { name: 'Iron서폿', tier: 'Iron IV', userId: '10' }
];

// 극단적 불균형 - 최고 vs 최저
const createExtremeUnbalancedPlayers = (): BalancePlayer[] => [
    { name: 'God티어1', tier: 'Radiant', userId: '1' },
    { name: 'God티어2', tier: 'Immortal 3', userId: '2' },
    { name: 'God티어3', tier: 'Immortal 2', userId: '3' },
    { name: 'God티어4', tier: 'Immortal 1', userId: '4' },
    { name: 'Noob1', tier: 'Iron 1', userId: '5' },
    { name: 'Noob2', tier: 'Iron 2', userId: '6' },
    { name: 'Noob3', tier: 'Bronze 1', userId: '7' },
    { name: 'Noob4', tier: 'Bronze 2', userId: '8' }
];

// 회사 내전 (대부분 Gold~Diamond)
const createCompanyInternalPlayers = (): BalancePlayer[] => [
    { name: '부장님', tier: 'Diamond 2', userId: '1' },
    { name: '팀장A', tier: 'Platinum 3', userId: '2' },
    { name: '팀장B', tier: 'Platinum 1', userId: '3' },
    { name: '시니어개발자', tier: 'Gold 3', userId: '4' },
    { name: '주니어개발자1', tier: 'Gold 1', userId: '5' },
    { name: '주니어개발자2', tier: 'Gold 2', userId: '6' },
    { name: '인턴1', tier: 'Silver 3', userId: '7' },
    { name: '인턴2', tier: 'Silver 1', userId: '8' },
    { name: '신입사원1', tier: 'Silver 2', userId: '9' },
    { name: '신입사원2', tier: 'Bronze 3', userId: '10' }
];

// 친구들 내전 (다양한 티어 섞임)
const createFriendsGroupPlayers = (): BalancePlayer[] => [
    { name: '고수친구', tier: 'Ascendant 3', userId: '1' },
    { name: '중수친구1', tier: 'Diamond 3', userId: '2' },
    { name: '중수친구2', tier: 'Platinum 3', userId: '3' },
    { name: '평범한친구1', tier: 'Gold 2', userId: '4' },
    { name: '평범한친구2', tier: 'Gold 1', userId: '5' },
    { name: '초보친구1', tier: 'Silver 2', userId: '6' },
    { name: '초보친구2', tier: 'Bronze 3', userId: '7' },
    { name: '갓초보', tier: 'Bronze 1', userId: '8' }
];

// 프로팀 스크림 (모두 고티어)
const createProScrimPlayers = (): BalancePlayer[] => [
    { name: 'Pro선수1', tier: 'Radiant', userId: '1' },
    { name: 'Pro선수2', tier: 'Radiant', userId: '2' },
    { name: 'Semi-Pro1', tier: 'Immortal 3', userId: '3' },
    { name: 'Semi-Pro2', tier: 'Immortal 3', userId: '4' },
    { name: 'Semi-Pro3', tier: 'Immortal 2', userId: '5' },
    { name: 'Semi-Pro4', tier: 'Immortal 2', userId: '6' },
    { name: 'Trainee1', tier: 'Immortal 1', userId: '7' },
    { name: 'Trainee2', tier: 'Immortal 1', userId: '8' },
    { name: 'Substitute1', tier: 'Ascendant 3', userId: '9' },
    { name: 'Substitute2', tier: 'Ascendant 3', userId: '10' }
];

// 학교 동아리 (대부분 하위티어)
const createSchoolClubPlayers = (): BalancePlayer[] => [
    { name: '동아리회장', tier: 'Platinum 1', userId: '1' },
    { name: '부회장', tier: 'Gold 3', userId: '2' },
    { name: '고학년1', tier: 'Gold 1', userId: '3' },
    { name: '고학년2', tier: 'Silver 3', userId: '4' },
    { name: '신입부원1', tier: 'Silver 1', userId: '5' },
    { name: '신입부원2', tier: 'Bronze 3', userId: '6' },
    { name: '신입부원3', tier: 'Bronze 2', userId: '7' },
    { name: '신입부원4', tier: 'Bronze 1', userId: '8' },
    { name: '완전초보1', tier: 'Iron 3', userId: '9' },
    { name: '완전초보2', tier: 'Iron 1', userId: '10' }
];

// 중간티어 집중 (Gold~Diamond)
const createMidTierFocusedPlayers = (): BalancePlayer[] => [
    { name: 'Diamond고수1', tier: 'Diamond 3', userId: '1' },
    { name: 'Diamond고수2', tier: 'Diamond 1', userId: '2' },
    { name: 'Plat상위1', tier: 'Platinum 3', userId: '3' },
    { name: 'Plat상위2', tier: 'Platinum 3', userId: '4' },
    { name: 'Plat중위1', tier: 'Platinum 2', userId: '5' },
    { name: 'Plat중위2', tier: 'Platinum 1', userId: '6' },
    { name: 'Gold상위1', tier: 'Gold 3', userId: '7' },
    { name: 'Gold상위2', tier: 'Gold 2', userId: '8' },
    { name: 'Gold하위1', tier: 'Gold 1', userId: '9' },
    { name: 'Gold하위2', tier: 'Gold 1', userId: '10' }
];

// 밸런스 테스트용 - 한명씩 캐리어
const createCarryTestPlayers = (): BalancePlayer[] => [
    { name: 'SuperCarry', tier: 'Radiant', userId: '1' },
    { name: 'MiniCarry', tier: 'Ascendant 1', userId: '2' },
    { name: '평균1', tier: 'Gold 2', userId: '3' },
    { name: '평균2', tier: 'Gold 1', userId: '4' },
    { name: '평균3', tier: 'Silver 3', userId: '5' },
    { name: '평균4', tier: 'Silver 2', userId: '6' },
    { name: '평균5', tier: 'Silver 1', userId: '7' },
    { name: '평균6', tier: 'Bronze 3', userId: '8' }
];

// 소규모 그룹들
const createSmallGroupPlayers = (): BalancePlayer[] => [
    { name: 'Pro플레이어', tier: 'Radiant', userId: '1' },
    { name: 'Semi-Pro', tier: 'Immortal 2', userId: '2' },
    { name: 'Average플레이어', tier: 'Gold 1', userId: '3' },
    { name: 'Newbie', tier: 'Silver 2', userId: '4' }
];

const create6PlayerGroup = (): BalancePlayer[] => [
    { name: '고수', tier: 'Diamond 2', userId: '1' },
    { name: '중수1', tier: 'Platinum 1', userId: '2' },
    { name: '중수2', tier: 'Gold 3', userId: '3' },
    { name: '하수1', tier: 'Silver 2', userId: '4' },
    { name: '하수2', tier: 'Bronze 2', userId: '5' },
    { name: '초보', tier: 'Iron 2', userId: '6' }
];

// 랜덤 실력차 시뮬레이션
const createRandomMixPlayers = (): BalancePlayer[] => [
    { name: '랜덤고수1', tier: 'Immortal 1', userId: '1' },
    { name: '랜덤중수1', tier: 'Diamond 2', userId: '2' },
    { name: '랜덤평균1', tier: 'Gold 3', userId: '3' },
    { name: '랜덤하수1', tier: 'Silver 1', userId: '4' },
    { name: '랜덤고수2', tier: 'Ascendant 2', userId: '5' },
    { name: '랜덤중수2', tier: 'Platinum 2', userId: '6' },
    { name: '랜덤평균2', tier: 'Gold 1', userId: '7' },
    { name: '랜덤하수2', tier: 'Bronze 3', userId: '8' },
    { name: '랜덤초보1', tier: 'Bronze 1', userId: '9' },
    { name: '랜덤초보2', tier: 'Iron 3', userId: '10' }
];

// 테스트 실행 함수
const runTest = (testName: string, players: BalancePlayer[], game: SupportGameTier) => {
    printHeader(`${testName} - ${game}`);
    
    printSubHeader('참여 플레이어 목록');
    players.forEach(player => {
        const tierColor = player.tier.includes('Radiant') || player.tier.includes('Challenger') ? colors.red :
                         player.tier.includes('Immortal') || player.tier.includes('Grandmaster') || player.tier.includes('Master') ? colors.magenta :
                         player.tier.includes('Ascendant') || player.tier.includes('Diamond') ? colors.cyan :
                         player.tier.includes('Platinum') ? colors.blue :
                         player.tier.includes('Gold') ? colors.yellow :
                         player.tier.includes('Silver') ? colors.white :
                         colors.white;
        
        console.log(`${tierColor}👤 ${player.name} - ${player.tier}${colors.reset}`);
    });
    console.log();
    
    const balancer = new TeamBalancer(game);
    const solution = balancer.generateOptimalSolution(players);
    
    printSubHeader('팀 구성 결과');
    printTeamInfo('🔵 Team A', solution.teamA, solution.teamA.totalScore > solution.teamB.totalScore);
    printTeamInfo('🟣 Team B', solution.teamB, solution.teamB.totalScore > solution.teamA.totalScore);
    
    printBalanceResult(solution);
    
    // 다른 솔루션들도 테스트
    printSubHeader('대안 팀 구성 (재생성)');
    const altSolution = balancer.regenerateTeams();
    printTeamInfo('🔵 Team A (대안)', altSolution.teamA);
    printTeamInfo('🟣 Team B (대안)', altSolution.teamB);
    printBalanceResult(altSolution);
    
    console.log(`${colors.green}✅ 테스트 완료!${colors.reset}\n\n`);
};

// 밸런스 등급 타입 정의
type BalanceType = 'Perfect' | 'Excellent' | 'Good' | 'Acceptable' | 'Poor';

// 밸런스 등급별 카운터
let balanceStats: Record<BalanceType, number> = {
    'Perfect': 0,
    'Excellent': 0,
    'Good': 0,
    'Acceptable': 0,
    'Poor': 0
};

// 솔루션 인터페이스 정의
interface BalanceSolution {
    teamA: any;
    teamB: any;
    scoreDifference: number;
    overallBalance: number;
    qualityScore: number;
    balanceType: BalanceType;
}

// 테스트 결과 추적을 위한 함수
const trackBalanceResult = (solution: BalanceSolution) => {
    balanceStats[solution.balanceType]++;
};

// runTest 함수를 업데이트하여 결과 추적
const runTestWithTracking = (testName: string, players: BalancePlayer[], game: SupportGameTier) => {
    printHeader(`${testName} - ${game}`);
    
    printSubHeader('참여 플레이어 목록');
    players.forEach(player => {
        const tierColor = player.tier.includes('Radiant') || player.tier.includes('Challenger') ? colors.red :
                         player.tier.includes('Immortal') || player.tier.includes('Grandmaster') || player.tier.includes('Master') ? colors.magenta :
                         player.tier.includes('Ascendant') || player.tier.includes('Diamond') ? colors.cyan :
                         player.tier.includes('Platinum') ? colors.blue :
                         player.tier.includes('Gold') ? colors.yellow :
                         player.tier.includes('Silver') ? colors.white :
                         colors.white;
        
        console.log(`${tierColor}👤 ${player.name} - ${player.tier}${colors.reset}`);
    });
    console.log();
    
    const balancer = new TeamBalancer(game);
    const solution = balancer.generateOptimalSolution(players);
    
    // 결과 추적
    trackBalanceResult(solution);
    
    printSubHeader('팀 구성 결과');
    printTeamInfo('🔵 Team A', solution.teamA, solution.teamA.totalScore > solution.teamB.totalScore);
    printTeamInfo('🟣 Team B', solution.teamB, solution.teamB.totalScore > solution.teamA.totalScore);
    
    printBalanceResult(solution);
    
    // 다른 솔루션들도 테스트
    printSubHeader('대안 팀 구성 (재생성)');
    const altSolution = balancer.regenerateTeams();
    trackBalanceResult(altSolution); // 대안 솔루션도 추적
    
    printTeamInfo('🔵 Team A (대안)', altSolution.teamA);
    printTeamInfo('🟣 Team B (대안)', altSolution.teamB);
    printBalanceResult(altSolution);
    
    console.log(`${colors.green}✅ 테스트 완료!${colors.reset}\n\n`);
};

// 밸런스 통계 출력 함수
const printBalanceStatistics = () => {
    printHeader('📊 밸런스 등급별 통계');
    
    const totalTests = Object.values(balanceStats).reduce((sum, count) => sum + count, 0);
    
    console.log(`${colors.bright}${colors.white}총 테스트 실행 횟수: ${totalTests}${colors.reset}\n`);
    
    // 등급별 통계 출력
    const gradeColors: Record<BalanceType, string> = {
        'Perfect': colors.green,
        'Excellent': colors.cyan,
        'Good': colors.yellow,
        'Acceptable': colors.magenta,
        'Poor': colors.red
    };
    
    const gradeEmojis: Record<BalanceType, string> = {
        'Perfect': '🏆',
        'Excellent': '⭐',
        'Good': '👍',
        'Acceptable': '👌',
        'Poor': '😞'
    };
    
    (Object.entries(balanceStats) as [BalanceType, number][]).forEach(([grade, count]) => {
        const percentage = totalTests > 0 ? ((count / totalTests) * 100).toFixed(1) : '0.0';
        const color = gradeColors[grade];
        const emoji = gradeEmojis[grade];
        const bar = '█'.repeat(Math.floor(count / Math.max(1, Math.max(...Object.values(balanceStats)) / 20)));
        
        console.log(`${color}${emoji} ${grade.padEnd(10)}: ${count.toString().padStart(3)}개 (${percentage.padStart(5)}%) ${bar}${colors.reset}`);
    });
    
    console.log();
    
    // 품질 분석
    const excellentOrBetter = balanceStats['Perfect'] + balanceStats['Excellent'];
    const goodOrBetter = excellentOrBetter + balanceStats['Good'];
    const acceptableOrBetter = goodOrBetter + balanceStats['Acceptable'];
    
    console.log(`${colors.bright}${colors.cyan}📈 품질 분석:${colors.reset}`);
    console.log(`${colors.green}🎯 우수 이상 (Perfect + Excellent): ${excellentOrBetter}개 (${((excellentOrBetter / totalTests) * 100).toFixed(1)}%)${colors.reset}`);
    console.log(`${colors.yellow}✅ 양호 이상 (Good 이상): ${goodOrBetter}개 (${((goodOrBetter / totalTests) * 100).toFixed(1)}%)${colors.reset}`);
    console.log(`${colors.blue}📊 수용 가능 이상: ${acceptableOrBetter}개 (${((acceptableOrBetter / totalTests) * 100).toFixed(1)}%)${colors.reset}`);
    console.log(`${colors.red}⚠️  문제 있음 (Poor): ${balanceStats['Poor']}개 (${((balanceStats['Poor'] / totalTests) * 100).toFixed(1)}%)${colors.reset}`);
    
    console.log();
    
    // 알고리즘 평가
    if (excellentOrBetter / totalTests >= 0.7) {
        console.log(`${colors.bright}${colors.green}🌟 알고리즘 평가: 매우 우수! 대부분의 상황에서 좋은 밸런스를 제공합니다.${colors.reset}`);
    } else if (goodOrBetter / totalTests >= 0.8) {
        console.log(`${colors.bright}${colors.cyan}⭐ 알고리즘 평가: 우수! 대부분의 상황에서 만족스러운 결과를 제공합니다.${colors.reset}`);
    } else if (acceptableOrBetter / totalTests >= 0.9) {
        console.log(`${colors.bright}${colors.yellow}👍 알고리즘 평가: 양호! 일반적인 상황에서 사용 가능한 수준입니다.${colors.reset}`);
    } else {
        console.log(`${colors.bright}${colors.red}⚠️  알고리즘 평가: 개선 필요! 일부 상황에서 밸런스 품질이 떨어집니다.${colors.reset}`);
    }
};

// 메인 테스트 실행
const runAllTests = () => {
    console.log(`${colors.bright}${colors.cyan}🚀 TeamBalancer 알고리즘 실전 테스트 시작! 🚀${colors.reset}\n`);
    
    // 통계 초기화
    balanceStats = {
        'Perfect': 0,
        'Excellent': 0,
        'Good': 0,
        'Acceptable': 0,
        'Poor': 0
    };
    
    // =============== 기본 테스트 ===============
    runTestWithTracking('기본 발로란트 내전 (전 티어 골고루)', createValorantPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('기본 리그 오브 레전드 내전', createLolPlayers(), SupportGameTier['League of Legends']);
    
    // =============== 현실적인 상황들 ===============
    runTestWithTracking('💼 회사 내전 (Gold~Diamond 위주)', createCompanyInternalPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('👥 친구들 모임 (다양한 실력)', createFriendsGroupPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('🏫 학교 동아리 (초보자 위주)', createSchoolClubPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('💎 중간티어 집중 (Gold~Diamond)', createMidTierFocusedPlayers(), SupportGameTier.Valorant);
    
    // =============== 특수 상황들 ===============
    runTestWithTracking('🏆 프로팀 스크림 (모두 고수)', createProScrimPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('⚡ 캐리어 vs 평균유저들', createCarryTestPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('🎲 완전 랜덤 실력 분포', createRandomMixPlayers(), SupportGameTier.Valorant);
    
    // =============== 극단적 상황들 ===============
    runTestWithTracking('💥 극단적 불균형 (최고 vs 최저)', createExtremeUnbalancedPlayers(), SupportGameTier.Valorant);
    
    // =============== 인원수별 테스트 ===============
    runTestWithTracking('👫 소규모 그룹 (4명)', createSmallGroupPlayers(), SupportGameTier.Valorant);
    runTestWithTracking('👪 중간 그룹 (6명)', create6PlayerGroup(), SupportGameTier.Valorant);
    
    // =============== 성능 테스트 ===============
    printHeader('⚡ 성능 테스트');
    const performanceTests = [
        { name: '일반 내전', players: createValorantPlayers() },
        { name: '회사 내전', players: createCompanyInternalPlayers() },
        { name: '친구 모임', players: createFriendsGroupPlayers() },
        { name: '프로 스크림', players: createProScrimPlayers() },
    ];
    
    performanceTests.forEach(test => {
        console.log(`${colors.yellow}📊 ${test.name} 성능 측정...${colors.reset}`);
        const startTime = Date.now();
        const balancer = new TeamBalancer(SupportGameTier.Valorant);
        
        // 10회 반복 실행
        for (let i = 0; i < 10; i++) {
            balancer.generateOptimalSolution(test.players);
        }
        
        const endTime = Date.now();
        const avgTime = (endTime - startTime) / 10;
        
        console.log(`${colors.green}   ⏱️  평균 실행 시간: ${avgTime.toFixed(2)}ms${colors.reset}`);
        console.log(`${colors.green}   📈 10회 총 시간: ${(endTime - startTime).toFixed(2)}ms${colors.reset}`);
        console.log();
    });
    
    // =============== 극한 상황 테스트 ===============
    printHeader('🔥 극한 상황 테스트');
    
    // 모든 플레이어가 같은 티어
    const sameTierPlayers: BalancePlayer[] = Array.from({length: 10}, (_, i) => ({
        name: `동일티어${i + 1}`,
        tier: 'Gold 2',
        userId: `${i + 1}`
    }));
    runTestWithTracking('😵 모든 플레이어 동일 티어', sameTierPlayers, SupportGameTier.Valorant);
    
    // 한 명만 다른 티어
    const oneHighPlayerTest: BalancePlayer[] = [
        { name: '혼자고수', tier: 'Radiant', userId: '1' },
        ...Array.from({length: 9}, (_, i) => ({
            name: `일반인${i + 1}`,
            tier: 'Silver 2',
            userId: `${i + 2}`
        }))
    ];
    runTestWithTracking('👑 한 명만 압도적 고수', oneHighPlayerTest, SupportGameTier.Valorant);
    
    // 두 명의 캐리어
    const twoCarriesTest: BalancePlayer[] = [
        { name: '캐리어1', tier: 'Radiant', userId: '1' },
        { name: '캐리어2', tier: 'Immortal 3', userId: '2' },
        ...Array.from({length: 8}, (_, i) => ({
            name: `팀원${i + 1}`,
            tier: 'Gold 1',
            userId: `${i + 3}`
        }))
    ];
    runTestWithTracking('👥 두 명의 캐리어', twoCarriesTest, SupportGameTier.Valorant);
    
    // =============== 밸런스 통계 출력 ===============
    printBalanceStatistics();
    
    // =============== 테스트 요약 ===============
    printHeader('📋 테스트 시나리오 요약');
    console.log(`${colors.bright}${colors.white}실행된 테스트 시나리오:${colors.reset}`);
    console.log(`${colors.cyan}📍 일반적인 상황:${colors.reset}`);
    console.log(`   • 기본 발로란트/LOL 내전 (전 티어 골고루)`);
    console.log(`   • 회사 내전 (Gold~Diamond 집중)`);
    console.log(`   • 친구들 모임 (다양한 실력 분포)`);
    console.log(`   • 학교 동아리 (초보자 중심)`);
    console.log();
    
    console.log(`${colors.magenta}📍 특수 상황:${colors.reset}`);
    console.log(`   • 프로팀 스크림 (모든 플레이어 고수)`);
    console.log(`   • 중간티어 집중 (Gold~Diamond)`);
    console.log(`   • 캐리어 vs 일반 유저들`);
    console.log(`   • 완전 랜덤 실력 분포`);
    console.log();
    
    console.log(`${colors.red}📍 극단적 상황:${colors.reset}`);
    console.log(`   • 최고 티어 vs 최저 티어`);
    console.log(`   • 모든 플레이어 동일 티어`);
    console.log(`   • 한 명만 압도적 고수`);
    console.log(`   • 두 명의 캐리어`);
    console.log();
    
    console.log(`${colors.yellow}📍 다양한 인원수:${colors.reset}`);
    console.log(`   • 4명 (2vs2), 6명 (3vs3), 8명 (4vs4), 10명 (5vs5)`);
    console.log();
    
    printHeader('🎉 모든 실전 테스트 완료! 🎉');
    console.log(`${colors.bright}${colors.green}알고리즘이 다양한 실제 상황에서 얼마나 잘 작동하는지 확인해보세요!${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}특히 밸런스 등급과 점수 차이를 주목해보세요! 🎯${colors.reset}`);
};

// 테스트 실행
runAllTests();