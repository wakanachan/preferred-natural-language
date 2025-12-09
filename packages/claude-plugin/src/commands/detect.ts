import { LanguageDetector } from '@preferred-natural-language/shared';
import { formatLanguageResult } from '../utils/languageDisplay.js';

export class DetectCommand {
  constructor(private detector: LanguageDetector) {}

  async execute(): Promise<string> {
    const result = await this.detector.detect();
    return formatLanguageResult(result);
  }
}