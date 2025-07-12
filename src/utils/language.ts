export type SupportedLanguage = 'en' | 'ko';

interface LanguageStrings {
	[key: string]: string | LanguageStrings;
}

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
      }
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
      }
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
	key: string
): string {
	const keys = key.split('.');
	let current: any = translation[language];

	for (const k of keys) {
		if (current && typeof current === 'object') {
      current = current[k]
		} else {
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

  return typeof current === 'string' ? current : `[Invaild: ${key}]`
}

export function createLangFunction(guildLanguage: SupportedLanguage) {
  return (key: string): string => {
    return getTranslation(guildLanguage, key)
  }
}
