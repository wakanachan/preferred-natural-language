import { SUPPORTED_LANGUAGES } from '../../languageNames.js';
import type { I18n } from '../../i18n/index.js';

export class ListCommand {
  constructor(private i18n: I18n) {}

  async execute(): Promise<string> {
    let output = this.i18n.t('list.title') + '\n';

    // 按语言代码排序
    const sortedEntries = Object.entries(SUPPORTED_LANGUAGES).sort(([a], [b]) => a.localeCompare(b));

    // 分列显示，每行3个
    const languages = sortedEntries.map(([code, name]) => `${code}: ${name}`);
    for (let i = 0; i < languages.length; i += 3) {
      const line = languages.slice(i, i + 3);
      const paddedLine = line.map((lang, idx) => {
        if (idx < line.length - 1) {
          return lang.padEnd(35);
        }
        return lang;
      }).join('');
      output += `  ${paddedLine}\n`;
    }

    output += `\n${this.i18n.t('list.usage')}`;
    return output;
  }
}
