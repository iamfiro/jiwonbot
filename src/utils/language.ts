export type SupportedLanguage = 'en' | 'ko';

interface LanguageStrings {
	[key: string]: string | LanguageStrings;
}

const translation: Record<SupportedLanguage, LanguageStrings> = {
	en: {
    error: {
      default: '❌ Oops! error occurred'
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
		},
	},
	ko: {
    error: {
      default: '❌ 잠깐만요! 오류가 발생했어요'
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
		},
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
