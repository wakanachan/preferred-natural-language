export const messages = {
  // Detect command
  detect: {
    result: 'Bevorzugte Sprache erkannt: {languageName} ({language})',
    source: 'Quelle: {source}',
    confidence: 'Vertrauen: {confidence}'
  },

  // List command
  list: {
    title: 'Unterstützte Sprachen:',
    usage: 'Verwendung: pnl set <Sprachcode>'
  },

  // Set command
  set: {
    success: '✅ Sprachpräferenz festgelegt auf: {languageName} ({language})',
    configSaved: 'Konfiguration gespeichert in: {path}',
    errorMissingCode: 'Fehler: Bitte geben Sie einen Sprachcode an. Beispiel: pnl set de',
    commonLanguages: 'Gängige Sprachen: {languages}...',
    errorUnsupported: 'Fehler: Nicht unterstützter Sprachcode "{language}"',
    errorUnsupportedHint: 'Verwenden Sie "pnl list", um unterstützte Sprachen anzuzeigen.',
    errorSaveFailed: 'Fehler beim Speichern der Konfiguration: {error}'
  },

  // Show command
  show: {
    title: '─ Sprachpräferenzdetails ────────────────────────',
    preferredLanguage: 'Bevorzugte Sprache:',
    languageCode: 'Sprachcode:',
    detectionSource: 'Erkennungsquelle:',
    confidence: 'Vertrauen:'
  },

  // General errors
  error: {
    unknown: 'Unbekannter Fehler',
    generic: 'Fehler: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Niedrige Erkennungssicherheit - zweisprachige Ausgabe)'
  }
};

export type Messages = typeof messages;
