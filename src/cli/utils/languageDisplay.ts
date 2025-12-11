import type { LanguageDetectionResult } from '../../types.js';
import { SUPPORTED_LANGUAGES } from '../../languageNames.js';
import type { I18n } from '../../i18n/index.js';

export function formatLanguageResult(result: LanguageDetectionResult, i18n: I18n): string {
  const languageName = SUPPORTED_LANGUAGES[result.language] || result.language;
  let output = i18n.t('detect.result', { languageName, language: result.language }) + '\n';
  output += i18n.t('detect.source', { source: result.source }) + '\n';
  output += i18n.t('detect.confidence', { confidence: result.confidence });

  // Add note if using bilingual mode
  const bilingualNote = i18n.getBilingualNote();
  if (bilingualNote) {
    output += '\n\n' + bilingualNote;
  }

  return output;
}

export function formatDetailedLanguageInfo(result: LanguageDetectionResult, i18n: I18n): string {
  const languageName = SUPPORTED_LANGUAGES[result.language] || result.language;

  const title = i18n.t('show.title');
  const preferredLangLabel = i18n.t('show.preferredLanguage');
  const langCodeLabel = i18n.t('show.languageCode');
  const sourceLabel = i18n.t('show.detectionSource');
  const confidenceLabel = i18n.t('show.confidence');

  let output = `╭${title}╮\n`;
  output += `│ ${preferredLangLabel} ${languageName.padEnd(20)} │\n`;
  output += `│ ${langCodeLabel} ${result.language.padEnd(20)} │\n`;
  output += `│ ${sourceLabel} ${result.source.padEnd(20)} │\n`;
  output += `│ ${confidenceLabel}   ${result.confidence.padEnd(20)} │\n`;
  output += `╰───────────────────────────────────────╯`;

  // Add note if using bilingual mode
  const bilingualNote = i18n.getBilingualNote();
  if (bilingualNote) {
    output += '\n\n' + bilingualNote;
  }

  return output;
}
