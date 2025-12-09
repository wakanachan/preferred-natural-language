import type { Messages } from './locales/en.js';
import { messages as enMessages } from './locales/en.js';
import { messages as zhCNMessages } from './locales/zh-CN.js';
import { messages as esMessages } from './locales/es.js';
import { messages as frMessages } from './locales/fr.js';
import { messages as deMessages } from './locales/de.js';
import { messages as jaMessages } from './locales/ja.js';
import { messages as koMessages } from './locales/ko.js';
import { messages as ruMessages } from './locales/ru.js';
import { messages as ptMessages } from './locales/pt.js';

type MessageKey = string;
type MessageParams = Record<string, string | number>;

const LOCALE_MAP: Record<string, any> = {
  // English
  'en': enMessages,
  'en-US': enMessages,
  'en-GB': enMessages,

  // Chinese
  'zh-CN': zhCNMessages,
  'zh': zhCNMessages,

  // Spanish
  'es': esMessages,
  'es-ES': esMessages,
  'es-MX': esMessages,

  // French
  'fr': frMessages,
  'fr-FR': frMessages,

  // German
  'de': deMessages,
  'de-DE': deMessages,

  // Japanese
  'ja': jaMessages,
  'ja-JP': jaMessages,

  // Korean
  'ko': koMessages,
  'ko-KR': koMessages,

  // Russian
  'ru': ruMessages,
  'ru-RU': ruMessages,

  // Portuguese
  'pt': ptMessages,
  'pt-BR': ptMessages,
  'pt-PT': ptMessages,
};

export class I18n {
  private locale: string;
  private fallbackLocale: string = 'en';
  private useBilingual: boolean = false;

  constructor(locale: string = 'en', confidence: string = 'high') {
    // Normalize locale (e.g., zh_CN -> zh-CN)
    this.locale = locale.replace('_', '-');

    // If confidence is low, enable bilingual mode
    this.useBilingual = confidence === 'low';
  }

  /**
   * Get translated message by key path (e.g., 'detect.result')
   */
  private getMessage(keyPath: string, locale: string): string {
    const messages = LOCALE_MAP[locale] || LOCALE_MAP[this.fallbackLocale];
    const keys = keyPath.split('.');

    let value: any = messages;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }

    return typeof value === 'string' ? value : keyPath;
  }

  /**
   * Translate a message key with parameters
   */
  t(keyPath: MessageKey, params?: MessageParams): string {
    // Get message in detected language
    let message = this.getMessage(keyPath, this.locale);

    // Replace parameters
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        message = message.replace(`{${key}}`, String(value));
      }
    }

    // If bilingual mode and not using English, add English translation
    if (this.useBilingual && this.locale !== 'en' && this.locale !== 'en-US') {
      const enMessage = this.getMessage(keyPath, 'en');
      const enMessageWithParams = params
        ? Object.entries(params).reduce(
            (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
            enMessage
          )
        : enMessage;

      // Add English translation in parentheses (only if different)
      if (message !== enMessageWithParams) {
        message = `${message} (${enMessageWithParams})`;
      }
    }

    return message;
  }

  /**
   * Get bilingual note for low confidence
   */
  getBilingualNote(): string | null {
    if (!this.useBilingual) return null;
    return this.t('fallback.lowConfidenceNote');
  }

  /**
   * Check if using bilingual mode
   */
  isBilingual(): boolean {
    return this.useBilingual;
  }
}
