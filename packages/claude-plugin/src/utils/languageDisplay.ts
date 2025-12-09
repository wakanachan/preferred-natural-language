import type { LanguageDetectionResult } from '@preferred-natural-language/shared';
import { SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';

export function formatLanguageResult(result: LanguageDetectionResult): string {
  const languageName = SUPPORTED_LANGUAGES[result.language] || result.language;
  return `检测到首选语言: ${languageName} (${result.language})
来源: ${result.source}
置信度: ${result.confidence}`;
}

export function formatDetailedLanguageInfo(result: LanguageDetectionResult): string {
  const languageName = SUPPORTED_LANGUAGES[result.language] || result.language;
  return `╭─ 语言偏好详情 ──────────────────────────────╮
│ 首选语言: ${languageName.padEnd(20)} │
│ 语言代码: ${result.language.padEnd(20)} │
│ 检测来源: ${result.source.padEnd(20)} │
│ 置信度:   ${result.confidence.padEnd(20)} │
╰───────────────────────────────────────╯`;
}