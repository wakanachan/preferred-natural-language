import { LanguageDetector } from '../shared/src/languageDetector.js';
import { DetectCommand } from './commands/detect.js';
import { SetCommand } from './commands/set.js';
import { ShowCommand } from './commands/show.js';
import { ListCommand } from './commands/list.js';
import type { PluginContext } from '../shared/src/types.js';
import { SUPPORTED_LANGUAGES } from '../shared/src/languageNames.js';

class PreferredNaturalLanguagePlugin {
  private detector: LanguageDetector;
  private context: PluginContext | null = null;

  constructor() {
    this.detector = new LanguageDetector();
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
  }

  async execute(command: string, args: any[]): Promise<any> {
    switch (command) {
      case 'detect':
        return new DetectCommand(this.detector).execute();
      case 'set':
        return new SetCommand(this.detector).execute(args[0]);
      case 'show':
        return new ShowCommand(this.detector).execute();
      case 'list':
        return new ListCommand().execute();
      case 'config':
        return this.showInteractiveConfig();
      default:
        throw new Error(`未知命令: ${command}. 可用命令: detect, set, show, list, config`);
    }
  }

  async cleanup(): Promise<void> {
    this.context = null;
  }

  private async showInteractiveConfig(): Promise<string> {
    let output = '╭─ Preferred Natural Language 配置 ──────────────────────╮\n';

    // 检测当前语言
    const result = await this.detector.detect();
    const languageName = SUPPORTED_LANGUAGES[result.language] || result.language;

    output += `│ 当前检测: ${languageName} (${result.language})${''.padEnd(20 - languageName.length - result.language.length - 3)} │\n`;
    output += `│ 检测来源: ${result.source}${''.padEnd(20 - result.source.length)} │\n`;
    output += `│ 置信度:   ${result.confidence}${''.padEnd(20 - result.confidence.length)} │\n`;
    output += `│                                                      │\n`;
    output += `│ 可用命令:                                             │\n`;
    output += `│ • claude plugin preferred-natural-language detect     │\n`;
    output += `│ • claude plugin preferred-natural-language set <lang> │\n`;
    output += `│ • claude plugin preferred-natural-language show      │\n`;
    output += `│ • claude plugin preferred-natural-language list      │\n`;
    output += `╰──────────────────────────────────────────────────────╯`;

    return output;
  }
}

export { PreferredNaturalLanguagePlugin };