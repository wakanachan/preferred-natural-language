import { LanguageDetector } from '../../shared/src/languageDetector.js';
import { formatLanguageResult } from '../utils/languageDisplay.js';

export class DetectCommand {
  constructor(private detector: LanguageDetector) {}

  async execute(): Promise<string> {
    const result = await this.detector.detect();
    return formatLanguageResult(result);
  }
}