export const messages = {
  // Detect command
  detect: {
    result: '検出された優先言語: {languageName} ({language})',
    source: 'ソース: {source}',
    confidence: '信頼度: {confidence}'
  },

  // List command
  list: {
    title: 'サポートされている言語:',
    usage: '使用方法: pnl set <言語コード>'
  },

  // Set command
  set: {
    success: '✅ 言語設定を次に設定しました: {languageName} ({language})',
    configSaved: '設定を保存しました: {path}',
    errorMissingCode: 'エラー: 言語コードを指定してください。例: pnl set ja',
    commonLanguages: '一般的な言語: {languages}...',
    errorUnsupported: 'エラー: サポートされていない言語コード "{language}"',
    errorUnsupportedHint: '"pnl list" を使用してサポートされている言語を表示します。',
    errorSaveFailed: '設定の保存に失敗しました: {error}'
  },

  // Show command
  show: {
    title: '─ 言語設定の詳細 ────────────────────────────',
    preferredLanguage: '優先言語:',
    languageCode: '言語コード:',
    detectionSource: '検出ソース:',
    confidence: '信頼度:'
  },

  // General errors
  error: {
    unknown: '不明なエラー',
    generic: 'エラー: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(低信頼度検出 - バイリンガル出力を表示)'
  }
};

export type Messages = typeof messages;
