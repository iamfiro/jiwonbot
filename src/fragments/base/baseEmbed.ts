import { getGuildLanguage } from "@/database/language";
import { createLangFunction, SupportedLanguage } from "@/utils/language";

export abstract class BaseFragment {
    protected guildId: string;
    protected language: SupportedLanguage;
    protected t: (key: string) => string;
    private _initialize: boolean = false;

    constructor(guildId: string) {
        this.guildId = guildId;
        this.language = 'en';
        this.t = createLangFunction(this.language)
    }

    private async initialize(): Promise<void> {
        if(this._initialize) return;

        this.language = await getGuildLanguage(this.guildId)
        this.t = await createLangFunction(this.language);
        this._initialize = true;
    }

    protected async ensureInitialized(): Promise<void> {
        await this.initialize()
    }

    updateLanguage(language: SupportedLanguage): void {
        this.language = language;
        this.t = createLangFunction(language);
        this._initialize = true;
    }
}