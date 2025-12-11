import type { LanguageDetectionResult } from '../../src/types.js';

/**
 * Mock factory for LanguageDetector
 */
export function createMockLanguageDetector(result?: Partial<LanguageDetectionResult>) {
  const defaultResult: LanguageDetectionResult = {
    language: 'zh-CN',
    source: 'os-locale',
    confidence: 'high',
    ...result,
  };

  return {
    detect: jest.fn().mockResolvedValue(defaultResult),
  };
}

/**
 * Mock factory for I18n
 */
export function createMockI18n(locale: string = 'en', confidence: string = 'high') {
  return {
    t: jest.fn((key: string, params?: Record<string, string | number>) => {
      // Simple mock translation - just return key with params
      if (!params) return key;
      let result = key;
      for (const [paramKey, value] of Object.entries(params)) {
        result += ` ${paramKey}:${value}`;
      }
      return result;
    }),
    getBilingualNote: jest.fn(() => confidence === 'low' ? '(Low confidence - bilingual output)' : null),
    isBilingual: jest.fn(() => confidence === 'low'),
  };
}

/**
 * Mock factory for fs.promises
 */
export function createMockFs() {
  return {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('{"language": "en-US"}'),
    access: jest.fn().mockResolvedValue(undefined),
    mkdir: jest.fn().mockResolvedValue(undefined),
  };
}

/**
 * Create a mock LanguageDetectionResult with custom values
 */
export function createMockDetectionResult(
  overrides?: Partial<LanguageDetectionResult>
): LanguageDetectionResult {
  return {
    language: 'en-US',
    source: 'config-file:/path/to/config',
    confidence: 'high',
    ...overrides,
  };
}
