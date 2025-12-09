export interface LanguageDetectionResult {
  language: string;
  source: DetectionSource;
  confidence: 'high' | 'medium' | 'low';
}

export interface LanguageConfig {
  language: string;
  fallback?: string;
}

export type DetectionSource =
  | 'GEMINI_CLI_NATURAL_LANGUAGE'
  | 'CLAUDE_CODE_NATURAL_LANGUAGE'
  | `config-file:${string}`
  | 'os-locale'
  | 'LANGUAGE'
  | 'LC_ALL'
  | 'LC_MESSAGES'
  | 'LANG'
  | 'accept-language-header'
  | 'fallback-default';
