export const messages = {
  // Detect command
  detect: {
    result: 'Idioma preferido detectado: {languageName} ({language})',
    source: 'Fonte: {source}',
    confidence: 'Confiança: {confidence}'
  },

  // List command
  list: {
    title: 'Idiomas suportados:',
    usage: 'Uso: pnl set <código-do-idioma>'
  },

  // Set command
  set: {
    success: '✅ Preferência de idioma definida para: {languageName} ({language})',
    configSaved: 'Configuração salva em: {path}',
    errorMissingCode: 'Erro: Forneça um código de idioma. Exemplo: pnl set pt',
    commonLanguages: 'Idiomas comuns: {languages}...',
    errorUnsupported: 'Erro: Código de idioma não suportado "{language}"',
    errorUnsupportedHint: 'Use "pnl list" para ver os idiomas suportados.',
    errorSaveFailed: 'Falha ao salvar configuração: {error}'
  },

  // Show command
  show: {
    title: '─ Detalhes de Preferência de Idioma ─────────────',
    preferredLanguage: 'Idioma Preferido:',
    languageCode: 'Código do Idioma:',
    detectionSource: 'Fonte de Detecção:',
    confidence: 'Confiança:'
  },

  // General errors
  error: {
    unknown: 'Erro desconhecido',
    generic: 'Erro: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Detecção de baixa confiança - mostrando saída bilíngue)'
  }
};

export type Messages = typeof messages;
