import { SUPPORTED_LANGUAGES } from '../../shared/src/languageNames.js';

export class ListCommand {
  async execute(): Promise<string> {
    let output = '支持的语言:\n';

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

    output += `\n使用方法: claude plugin preferred-natural-language set <语言代码>`;
    return output;
  }
}