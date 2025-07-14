import { getGuildLanguage } from '@/database/language';
import {
	createLangFunction,
	SupportedLanguage,
	TemplateVariables,
} from '@/utils/language';
import { languageManager } from '@/utils/language-manager';

export abstract class BaseFragment {
	protected guildId: string;
	protected language: SupportedLanguage;
	protected t: (key: string, variables?: TemplateVariables) => string;
	private _initialize: boolean = false;
	private languageChangeHandler: (
		guildId: string,
		language: SupportedLanguage
	) => void;

	constructor(guildId: string) {
		this.guildId = guildId;
		this.language = 'en';
		this.t = createLangFunction(this.language);

		// 언어 변경 이벤트 리스너 등록
		this.languageChangeHandler = (
			changedGuildId: string,
			newLanguage: SupportedLanguage
		) => {
			if (changedGuildId === this.guildId) {
				this.updateLanguage(newLanguage);
			}
		};

		languageManager.onLanguageChange(this.languageChangeHandler);
	}

	private async initialize(): Promise<void> {
		if (this._initialize) return;

		this.language = await getGuildLanguage(this.guildId);
		this.t = createLangFunction(this.language);
		this._initialize = true;

		// 언어 매니저에도 현재 언어 설정
		languageManager.setGuildLanguage(this.guildId, this.language);
	}

	protected async ensureInitialized(): Promise<void> {
		await this.initialize();
	}

	updateLanguage(language: SupportedLanguage): void {
		this.language = language;
		this.t = createLangFunction(language);
		this._initialize = true;
	}

	// 메모리 누수 방지를 위한 cleanup 메서드
	cleanup(): void {
		languageManager.offLanguageChange(this.languageChangeHandler);
	}
}
