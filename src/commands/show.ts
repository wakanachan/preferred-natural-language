import { LanguageDetector } from '../../shared/src/languageDetector.js';
import { formatDetailedLanguageInfo } from '../utils/languageDisplay.js';

export class ShowCommand {
  constructor(private detector: LanguageDetector) {}

  async execute(): Promise<string> {
    const result = await this.detector.detect();
    return formatDetailedLanguageInfo(result);
  }
}