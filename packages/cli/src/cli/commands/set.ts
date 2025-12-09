import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';
import { promises as fs } from 'fs';
import path from 'path';
import type { I18n } from '../../i18n/index.js';

export class SetCommand {
  constructor(
    private detector: LanguageDetector,
    private i18n: I18n
  ) {}

  async execute(language: string): Promise<string> {
    if (!language) {
      const available = Object.keys(SUPPORTED_LANGUAGES).slice(0, 10).join(', ');
      return `${this.i18n.t('set.errorMissingCode')}\n\n${this.i18n.t('set.commonLanguages', { languages: available })}`;
    }

    // 验证语言代码
    if (!SUPPORTED_LANGUAGES[language]) {
      return `${this.i18n.t('set.errorUnsupported', { language })}\n\n${this.i18n.t('set.errorUnsupportedHint')}`;
    }

    const config = { language };
    const configPath = path.join(process.cwd(), '.preferred-language.json');

    try {
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      const languageName = SUPPORTED_LANGUAGES[language];
      return `${this.i18n.t('set.success', { languageName, language })}\n${this.i18n.t('set.configSaved', { path: configPath })}`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : this.i18n.t('error.unknown');
      throw new Error(this.i18n.t('set.errorSaveFailed', { error: errorMsg }));
    }
  }
}
