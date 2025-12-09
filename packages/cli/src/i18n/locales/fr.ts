export const messages = {
  // Detect command
  detect: {
    result: 'Langue préférée détectée : {languageName} ({language})',
    source: 'Source : {source}',
    confidence: 'Confiance : {confidence}'
  },

  // List command
  list: {
    title: 'Langues prises en charge :',
    usage: 'Utilisation : pnl set <code-langue>'
  },

  // Set command
  set: {
    success: '✅ Préférence de langue définie sur : {languageName} ({language})',
    configSaved: 'Configuration enregistrée dans : {path}',
    errorMissingCode: 'Erreur : Veuillez fournir un code de langue. Exemple : pnl set fr',
    commonLanguages: 'Langues courantes : {languages}...',
    errorUnsupported: 'Erreur : Code de langue non pris en charge "{language}"',
    errorUnsupportedHint: 'Utilisez "pnl list" pour voir les langues prises en charge.',
    errorSaveFailed: 'Échec de l\'enregistrement de la configuration : {error}'
  },

  // Show command
  show: {
    title: '─ Détails de Préférence de Langue ──────────────',
    preferredLanguage: 'Langue Préférée :',
    languageCode: 'Code de Langue :',
    detectionSource: 'Source de Détection :',
    confidence: 'Confiance :'
  },

  // General errors
  error: {
    unknown: 'Erreur inconnue',
    generic: 'Erreur : {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Détection de faible confiance - affichage bilingue)'
  }
};

export type Messages = typeof messages;
