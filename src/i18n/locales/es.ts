export const messages = {
  // Detect command
  detect: {
    result: 'Idioma preferido detectado: {languageName} ({language})',
    source: 'Fuente: {source}',
    confidence: 'Confianza: {confidence}'
  },

  // List command
  list: {
    title: 'Idiomas compatibles:',
    usage: 'Uso: pnl set <código-de-idioma>'
  },

  // Set command
  set: {
    success: '✅ Preferencia de idioma establecida en: {languageName} ({language})',
    configSaved: 'Configuración guardada en: {path}',
    errorMissingCode: 'Error: Proporcione un código de idioma. Ejemplo: pnl set es',
    commonLanguages: 'Idiomas comunes: {languages}...',
    errorUnsupported: 'Error: Código de idioma no compatible "{language}"',
    errorUnsupportedHint: 'Use "pnl list" para ver los idiomas compatibles.',
    errorSaveFailed: 'Error al guardar la configuración: {error}'
  },

  // Show command
  show: {
    title: '─ Detalles de Preferencia de Idioma ────────────',
    preferredLanguage: 'Idioma Preferido:',
    languageCode: 'Código de Idioma:',
    detectionSource: 'Fuente de Detección:',
    confidence: 'Confianza:'
  },

  // General errors
  error: {
    unknown: 'Error desconocido',
    generic: 'Error: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Detección de baja confianza - mostrando salida bilingüe)'
  }
};

export type Messages = typeof messages;
