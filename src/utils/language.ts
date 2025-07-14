export type SupportedLanguage = 'en' | 'ko';

interface LanguageStrings {
	[key: string]: string | LanguageStrings;
}

export type TemplateVariables = Record<string, string | number>;

const translation: Record<SupportedLanguage, LanguageStrings> = {
	en: {
		error: {
			default: '❌ Oops! error occurred',
			game: {
				random_map: {
					select: '❌ Please select map',
				},
			},
		},
		components: {
			ping: {
				title: 'Pong!',
				api: '🛜 API Latency',
				message: '💬 Message Latency',
			},
			setting_language: {
				title: 'Jiwon-bot language has been changed!',
				current: 'Current lang: ',
			},
			random_map: {
				selected: '🎲 Map selected',
				selected_map: 'Selected Map',
			},
			rsp: {
				cannot_alone: '❌ You cannot play Rock Paper Scissors with yourself',
				cannot_bot: '❌ You cannot play Rock Paper Scissors with a bot',
				game_title: '🎮 Rock Paper Scissors',
				result_label: 'Result',
				choices: {
					rock: 'Rock',
					paper: 'Paper',
					scissors: 'Scissors',
				},
				result: {
					tie: "🤝 It's a tie!",
					win: '🎉 {winner} wins!',
				},
			},
			coin_flip: {
				title: 'Coin Flip',
				flipping: 'Flipping a coin...',
				please_wait: 'Please wait...',
				flipped_by: 'Flipped by {user}',
				result: {
					heads: 'Heads',
					tails: 'Tails',
				},
			},
			tier_info: {
				title: "🎮 {user}'s Tier Information",
				description: 'Here are the registered tier information:',
				no_tier:
					'No tier information has been registered yet.\nUse `/register-tier` command to register your tier!',
				footer: 'Tier information',
			},
			tier_register: {
				title: '{emoji} {game} Tier Registration',
				description:
					'Hello {user}! Please select your {game} tier.\nPage {currentPage} of {totalPages}',
				footer: 'Please select your tier from the menu below',
				select_placeholder: 'Select your tier...',
				prev_page: 'Previous',
				next_page: 'Next',
				success_title: '✅ Tier Registration Complete!',
				success_description:
					"{user}'s {game} {gameEmoji} tier has been registered as {tierEmoji} {tierLabel}!",
				success_footer:
					'You can change your tier anytime with the same command.',
				timeout_title: '⏰ Time expired',
				timeout_description:
					'Tier registration has timed out. Please try the command again.',
				error_title: '❌ Error occurred',
				error_description:
					'An error occurred during tier registration. Please try again.',
			},
			balance_team: {
				errors: {
					not_in_voice: 'Not in Voice Channel',
					not_in_voice_desc:
						'You must be in a voice channel or specify a voice channel to balance teams.',
					not_enough_players: 'Not Enough Players',
					not_enough_players_desc:
						'Need at least {minimum} players for team balancing. Currently {current} players found.',
					too_many_players: 'Too Many Players',
					too_many_players_desc:
						'Maximum {maximum} players supported. Currently {current} players found.',
				},
				partial_result: 'Partial Team Balance Result',
				unregistered_players_desc:
					"Some players haven't registered their game tier yet. Please register to get balanced teams.",
				balance_failed: 'Team Balance Failed',
				teams_balanced: 'Teams Successfully Balanced!',
				balance_desc:
					'Teams have been balanced for **{channel}** voice channel using **{game}** tier system.',
				game_info: 'Game',
				voice_channel: 'Voice Channel',
				total_players: 'Total Players',
				team_a: 'Team A',
				team_b: 'Team B',
				total_score: 'Total Score',
				avg_score: 'Average Score',
				balance_info: 'Balance Information',
				score_diff: 'Score Difference',
				balance_grade: 'Balance Grade',
				quality_score: 'Quality Score',
				unregistered_players: 'Unregistered Players',
				register_tier_hint:
					'Use /register-tier command to register your game tier',
				regenerate_hint:
					'Run the command again to regenerate teams with different composition',
				game_tip: 'Game Tip',
				grades: {
					perfect: 'Perfect',
					excellent: 'Excellent',
					good: 'Good',
					acceptable: 'Acceptable',
					poor: 'Poor',
				},
				tips: {
					communication:
						'🗣️ Good communication is key to victory! Use voice chat effectively.',
					warm_up:
						'🔥 Warm up before playing ranked games to perform at your best.',
					positive_attitude:
						'😊 Keep a positive attitude even when losing - it helps team morale.',
					learn_from_mistakes:
						'📚 Learn from your mistakes and review your gameplay to improve.',
					team_coordination:
						'🤝 Coordinate with your team and play for objectives, not just kills.',
					practice_together:
						'🎯 Practice together as a team to build better synergy.',
					respect_teammates:
						'🤜🤛 Respect your teammates and give constructive feedback.',
					stay_focused: '🎯 Stay focused on the game and avoid distractions.',
				},
			},
		},
		game: {
			custom_map: 'Custom',
			valorant: {
				name: 'Valorant',
			},
			pubg: {
				name: 'PUBG',
			},
			csgo: {
				name: 'Counter Strike : Global Offensive',
			},
			league_of_legends: {
				name: 'League of Legends',
			},
		},
	},
	ko: {
		error: {
			default: '❌ 잠깐만요! 오류가 발생했어요',
			game: {
				random_map: {
					select: '❌ 맵을 선택해주세요',
				},
			},
		},
		components: {
			ping: {
				title: '퐁!',
				api: '🛜 API 지연',
				message: '💬 API 지연',
			},
			setting_language: {
				title: '지원봇의 언어가 변경되었습니다',
				current: '현재 언어: ',
			},
			random_map: {
				selected: '🎲 맵이 선택되었습니다',
				selected_map: '선택된 맵',
			},
			rsp: {
				cannot_alone: '❌ 가위바위보는 자기 자신과 할 수 없어요',
				cannot_bot: '❌ 가위바위보는 로봇과 할 수 없어요',
				game_title: '🎮 가위바위보',
				result_label: '결과',
				choices: {
					rock: '바위',
					paper: '보',
					scissors: '가위',
				},
				result: {
					tie: '🤝 무승부!',
					win: '🎉 {winner}님이 승리!',
				},
			},
			coin_flip: {
				title: '동전 던지기',
				flipping: '동전을 던지는 중...',
				please_wait: '잠시만 기다려주세요...',
				flipped_by: '{user}님이 던진 동전',
				result: {
					heads: '앞면',
					tails: '뒷면',
				},
			},
			tier_info: {
				title: '🎮 {user}님의 티어 정보',
				description: '등록된 티어 정보입니다:',
				no_tier:
					'아직 등록된 티어 정보가 없습니다.\n`/register-tier or /티어등록` 명령어를 사용해서 티어를 등록해주세요!',
				footer: '티어 정보',
			},
			balance_team: {
				errors: {
					not_in_voice: '음성 채널에 참여 안함',
					not_in_voice_desc:
						'팀 밸런싱을 위해서는 음성 채널에 참여하거나 특정 음성 채널을 지정해야 합니다.',
					not_enough_players: '플레이어 부족',
					not_enough_players_desc:
						'팀 밸런싱을 위해서는 최소 {minimum}명의 플레이어가 필요합니다. 현재 {current}명이 있습니다.',
					too_many_players: '플레이어 초과',
					too_many_players_desc:
						'최대 {maximum}명까지 지원됩니다. 현재 {current}명이 있습니다.',
				},
				partial_result: '부분 팀 밸런스 결과',
				unregistered_players_desc:
					'일부 플레이어가 아직 게임 티어를 등록하지 않았습니다. 밸런싱된 팀을 얻으려면 티어를 등록해주세요.',
				balance_failed: '팀 밸런스 실패',
				teams_balanced: '팀 밸런싱 완료!',
				balance_desc:
					'**{channel}** 음성 채널의 팀이 **{game}** 티어 시스템으로 밸런싱되었습니다.',
				game_info: '게임',
				voice_channel: '음성 채널',
				total_players: '총 플레이어',
				team_a: 'A팀',
				team_b: 'B팀',
				total_score: '총 점수',
				avg_score: '평균 점수',
				balance_info: '밸런스 정보',
				score_diff: '점수 차이',
				balance_grade: '밸런스 등급',
				quality_score: '품질 점수',
				unregistered_players: '미등록 플레이어',
				register_tier_hint:
					'/register-tier 명령어를 사용해서 게임 티어를 등록하세요',
				regenerate_hint:
					'명령어를 다시 실행하면 다른 구성으로 팀을 재생성할 수 있습니다',
				game_tip: '게임 팁',
				grades: {
					perfect: '완벽',
					excellent: '우수',
					good: '양호',
					acceptable: '수용가능',
					poor: '불량',
				},
				tips: {
					communication:
						'🗣️ 좋은 소통이 승리의 열쇠입니다! 음성 채팅을 효과적으로 활용하세요.',
					warm_up: '🔥 랭크 게임 전에 워밍업을 해서 최고의 실력을 발휘하세요.',
					positive_attitude:
						'😊 지더라도 긍정적인 태도를 유지하세요 - 팀 사기에 도움이 됩니다.',
					learn_from_mistakes:
						'📚 실수로부터 배우고 게임플레이를 리뷰해서 실력을 향상시키세요.',
					team_coordination:
						'🤝 팀과 협력하고 킬보다는 오브젝트를 위해 플레이하세요.',
					practice_together:
						'🎯 팀으로 함께 연습해서 더 나은 시너지를 구축하세요.',
					respect_teammates: '🤜🤛 팀원을 존중하고 건설적인 피드백을 주세요.',
					stay_focused: '🎯 게임에 집중하고 산만한 것들을 피하세요.',
				},
			},
			tier_register: {
				title: '{emoji} {game} 티어 등록',
				description:
					'안녕하세요 {user}님! {game} 티어를 선택해주세요.\n{currentPage}페이지 / 총 {totalPages}페이지',
				footer: '아래 메뉴에서 티어를 선택해주세요',
				select_placeholder: '티어를 선택하세요...',
				prev_page: '이전',
				next_page: '다음',
				success_title: '✅ 티어 등록 완료!',
				success_description:
					'{user}님의 {game} {gameEmoji} 티어가 {tierEmoji} {tierLabel}로 등록되었습니다!',
				success_footer: '언제든지 같은 명령어로 티어를 변경할 수 있습니다.',
				timeout_title: '⏰ 시간 초과',
				timeout_description:
					'티어 등록 시간이 초과되었습니다. 다시 명령어를 실행해주세요.',
				error_title: '❌ 오류 발생',
				error_description:
					'티어 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
			},
		},
		game: {
			custom_map: '사설맵',
			valorant: {
				name: '발로란트',
			},
			pubg: {
				name: '배틀그라운드',
			},
			csgo: {
				name: '카운터스트라이크: 글로벌 오펜시브',
			},
			league_of_legends: {
				name: '리그 오브 레전드',
			},
		},
	},
};

export function getTranslation(
	language: SupportedLanguage,
	key: string,
	variables?: TemplateVariables
): string {
	const keys = key.split('.');
	let current: any = translation[language];

	for (const k of keys) {
		if (current && typeof current === 'object') {
			current = current[k];
		} else {
			console.log(false, k);
			// fallback if key not found
			current = translation['en'];
			for (const fallbackKey of keys) {
				if (current && typeof current === 'object') {
					current = current[fallbackKey];
				} else {
					return `[Missing: ${key}]`;
				}
			}
			break;
		}
	}

	if (typeof current !== 'string') {
		return `[Invalid: ${key}]`;
	}

	if (variables) {
		return current.replace(/\{(\w+)\}/g, (match, variableName) => {
			return variables[variableName]?.toString() || match;
		});
	}

	return current;
}

export function createLangFunction(guildLanguage: SupportedLanguage) {
	return (key: string, variables?: TemplateVariables): string => {
		return getTranslation(guildLanguage, key, variables);
	};
}
