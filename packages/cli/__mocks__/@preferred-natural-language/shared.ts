// Mock for @preferred-natural-language/shared package

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  'en-US': 'English (United States)',
  'en-GB': 'English (United Kingdom)',
  'zh-CN': '简体中文 (Simplified Chinese)',
  'zh-TW': '繁體中文 (Traditional Chinese)',
  'es-ES': 'Español (Spanish)',
  'fr-FR': 'Français (French)',
  'de-DE': 'Deutsch (German)',
  'ja-JP': '日本語 (Japanese)',
  'ko-KR': '한국어 (Korean)',
  'ru-RU': 'Русский (Russian)',
  'pt-BR': 'Português (Portuguese - Brazil)',
  'pt-PT': 'Português (Portuguese - Portugal)',
  'it-IT': 'Italiano (Italian)',
  'ar-SA': 'العربية (Arabic)',
  'hi-IN': 'हिन्दी (Hindi)',
};

export type DetectionSource =
  | 'GEMINI_CLI_NATURAL_LANGUAGE'
  | 'CLAUDE_CODE_NATURAL_LANGUAGE'
  | `config-file:${string}`
  | 'os-locale'
  | 'LANGUAGE'
  | 'LC_ALL'
  | 'LC_MESSAGES'
  | 'LANG'
  | 'HTTP_ACCEPT_LANGUAGE'
  | 'fallback';

export interface LanguageDetectionResult {
  language: string;
  source: DetectionSource;
  confidence: 'high' | 'medium' | 'low';
}

export interface LanguageConfig {
  language: string;
  fallback?: string;
}

export class LanguageDetector {
  async detect(): Promise<LanguageDetectionResult> {
    return {
      language: 'en-US',
      source: 'os-locale',
      confidence: 'high',
    };
  }
}
