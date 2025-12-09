import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';
import { promises as fs } from 'fs';
import path from 'path';

export class SetCommand {
  constructor(private detector: LanguageDetector) {}

  async execute(language: string): Promise<string> {
    if (!language) {
      const available = Object.keys(SUPPORTED_LANGUAGES).slice(0, 10).join(', ');
      return `错误: 请提供语言代码。例如: claude plugin preferred-natural-language set zh-CN\n\n常用语言: ${available}...`;
    }

    // 验证语言代码
    if (!SUPPORTED_LANGUAGES[language]) {
      return `错误: 不支持的语言代码 "${language}"\n\n使用 "claude plugin preferred-natural-language list" 查看支持的语言。`;
    }

    const config = { language };
    const configPath = path.join(process.cwd(), '.preferred-language.json');

    try {
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      const languageName = SUPPORTED_LANGUAGES[language];
      return `✅ 语言偏好已设置为: ${languageName} (${language})\n配置文件已保存到: ${configPath}`;
    } catch (error) {
      throw new Error(`保存配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}