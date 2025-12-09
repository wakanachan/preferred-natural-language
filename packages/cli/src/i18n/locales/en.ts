export const messages = {
  // Detect command
  detect: {
    result: 'Detected preferred language: {languageName} ({language})',
    source: 'Source: {source}',
    confidence: 'Confidence: {confidence}'
  },

  // List command
  list: {
    title: 'Supported languages:',
    usage: 'Usage: pnl set <language-code>'
  },

  // Set command
  set: {
    success: '✅ Language preference set to: {languageName} ({language})',
    configSaved: 'Configuration saved to: {path}',
    errorMissingCode: 'Error: Please provide a language code. Example: pnl set zh-CN',
    commonLanguages: 'Common languages: {languages}...',
    errorUnsupported: 'Error: Unsupported language code "{language}"',
    errorUnsupportedHint: 'Use "pnl list" to see supported languages.',
    errorSaveFailed: 'Failed to save configuration: {error}'
  },

  // Show command
  show: {
    title: '─ Language Preference Details ──────────────────',
    preferredLanguage: 'Preferred Language:',
    languageCode: 'Language Code:',
    detectionSource: 'Detection Source:',
    confidence: 'Confidence:'
  },

  // General errors
  error: {
    unknown: 'Unknown error',
    generic: 'Error: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Low confidence detection - showing bilingual output)'
  }
};

export type Messages = typeof messages;
