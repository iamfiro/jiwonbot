export type SupportedLanguage = 'en' | 'ko';

interface LanguageStrings {
	[key: string]: string | LanguageStrings;
}

export type TemplateVariables = Record<string, string | number>

const translation: Record<SupportedLanguage, LanguageStrings> = {
	en: {
    error: {
      default: '❌ Oops! error occurred',
      game: {
        random_map: {
          select: '❌ Please select map'
        }
      }
    },
		components: {
      ping: {
        title: 'Pong!',
        api: '🛜 API Latency',
        message: '💬 Message Latency'
      },
			setting_language: {
				title: 'Jiwon-bot language has been changed!',
        current: 'Current lang: '
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
            scissors: 'Scissors'
        },
        result: {
            tie: '🤝 It\'s a tie!',
            win: '🎉 {winner} wins!'
        }
      },
      coin_flip: {
				title: 'Coin Flip',
				flipping: 'Flipping a coin...',
				please_wait: 'Please wait...',
				flipped_by: 'Flipped by {user}',
				result: {
					heads: 'Heads',
					tails: 'Tails'
				}
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
      }
    }
	},
	ko: {
    error: {
      default: '❌ 잠깐만요! 오류가 발생했어요',
      game: {
        random_map: {
          select: '❌ 맵을 선택해주세요'
        }
      }
    },
		components: {
      ping: {
        title: '퐁!',
        api: '🛜 API 지연',
        message: '💬 API 지연'
      },
			setting_language: {
				title: '지원봇의 언어가 변경되었습니다',
        current: '현재 언어: '
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
            scissors: '가위'
        },
        result: {
            tie: '🤝 무승부!',
            win: '🎉 {winner}님이 승리!'
        }
      },
      coin_flip: {
				title: '동전 던지기',
				flipping: '동전을 던지는 중...',
				please_wait: '잠시만 기다려주세요...',
				flipped_by: '{user}님이 던진 동전',
				result: {
					heads: '앞면',
					tails: '뒷면'
				}
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
      }
    }
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
      current = current[k]
		} else {
      console.log(false, k)
      // fallback if key not found
      current = translation['en'];
      for (const fallbackKey of keys) {
        if(current && typeof current === 'object') {
          current = current[fallbackKey];
        } else {
          return `[Missing: ${key}]`
        }
      }
      break;
    }
	}

  if(typeof current !== 'string') {
    return `[Invalid: ${key}]`
  }

  if(variables) {
    return current.replace(/\{(\w+)\}/g, (match, variableName) => {
      return variables[variableName]?.toString() || match;
    })
  }

  return current
}

export function createLangFunction(guildLanguage: SupportedLanguage) {
  return (key: string, variables?: TemplateVariables): string => {
    return getTranslation(guildLanguage, key, variables)
  }
}
