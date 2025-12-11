import { LanguageDetector } from '../../languageDetector.js';
import { formatLanguageResult } from '../utils/languageDisplay.js';
import type { I18n } from '../../i18n/index.js';

export class DetectCommand {
  constructor(
    private detector: LanguageDetector,
    private i18n: I18n
  ) {}

  async execute(): Promise<string> {
    const result = await this.detector.detect();
    return formatLanguageResult(result, this.i18n);
  }
}
