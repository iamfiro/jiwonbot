import { SupportedLanguage } from '@/utils/language';
import { EventEmitter } from 'events';

class LanguageManager extends EventEmitter {
  private static instance: LanguageManager;
  private guildLanguages: Map<string, SupportedLanguage> = new Map();

  private constructor() {
    super();
  }

  static getInstance(): LanguageManager {
    if (!LanguageManager.instance) {
      LanguageManager.instance = new LanguageManager();
    }
    return LanguageManager.instance;
  }

  setGuildLanguage(guildId: string, language: SupportedLanguage): void {
    this.guildLanguages.set(guildId, language);
    this.emit('languageChanged', guildId, language);
  }

  getGuildLanguage(guildId: string): SupportedLanguage {
    return this.guildLanguages.get(guildId) || 'en';
  }

  onLanguageChange(callback: (guildId: string, language: SupportedLanguage) => void): void {
    this.on('languageChanged', callback);
  }

  offLanguageChange(callback: (guildId: string, language: SupportedLanguage) => void): void {
    this.off('languageChanged', callback);
  }
}

export const languageManager = LanguageManager.getInstance();
