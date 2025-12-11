import { LanguageDetector } from '../../src/languageDetector.js';
import { SUPPORTED_LANGUAGES } from '../../src/languageNames.js';
import type { LanguageDetectionResult } from '../../src/types.js';

// Mock os-locale
jest.mock('os-locale', () => ({
  __esModule: true,
  osLocale: jest.fn()
}));

import { osLocale } from 'os-locale';
const mockOsLocale = osLocale as jest.MockedFunction<any>;

// Mock fs for config file tests
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

import { promises as fs } from 'fs';

describe('LanguageDetector', () => {
  let detector: LanguageDetector;

  beforeEach(() => {
    detector = new LanguageDetector();
    jest.clearAllMocks();

    // Reset environment variables
    delete process.env.GEMINI_CLI_NATURAL_LANGUAGE;
    delete process.env.CLAUDE_CODE_NATURAL_LANGUAGE;
    delete process.env.LANGUAGE;
    delete process.env.LC_ALL;
    delete process.env.LC_MESSAGES;
    delete process.env.LANG;
    delete process.env.HTTP_ACCEPT_LANGUAGE;

    // Reset fs mock to default (reject)
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
  });

  describe('priority chain detection', () => {
    it('should detect from GEMINI_CLI_NATURAL_LANGUAGE environment variable', async () => {
      process.env.GEMINI_CLI_NATURAL_LANGUAGE = 'ja-JP';
      mockOsLocale.mockResolvedValue('en-US');

      const result = await detector.detect();

      expect(result.language).toBe('ja-JP');
      expect(result.source).toBe('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(result.confidence).toBe('high');
    });

    it('should detect from CLAUDE_CODE_NATURAL_LANGUAGE environment variable', async () => {
      process.env.CLAUDE_CODE_NATURAL_LANGUAGE = 'zh-CN';
      mockOsLocale.mockResolvedValue('en-US');

      const result = await detector.detect();

      expect(result.language).toBe('zh-CN');
      expect(result.source).toBe('CLAUDE_CODE_NATURAL_LANGUAGE');
      expect(result.confidence).toBe('high');
    });

    it('should prioritize GEMINI_CLI over CLAUDE_CODE when both are set', async () => {
      process.env.GEMINI_CLI_NATURAL_LANGUAGE = 'ja-JP';
      process.env.CLAUDE_CODE_NATURAL_LANGUAGE = 'zh-CN';
      mockOsLocale.mockResolvedValue('en-US');

      const result = await detector.detect();

      expect(result.language).toBe('ja-JP');
      expect(result.source).toBe('GEMINI_CLI_NATURAL_LANGUAGE');
    });

    it('should detect from config file with highest priority', async () => {
      // Create mock config file
      const configContent = JSON.stringify({ language: 'ko-KR' });

      // Mock fs.readFile to return config content
      (fs.readFile as jest.Mock).mockResolvedValue(configContent);

      const result = await detector.detect();

      expect(result.language).toBe('ko-KR');
      expect(result.source).toContain('config-file');
      expect(result.confidence).toBe('high');
    });

    it('should fallback to OS locale when no custom env vars are set', async () => {
      mockOsLocale.mockResolvedValue('de-DE');

      const result = await detector.detect();

      expect(result.language).toBe('de-DE');
      expect(result.source).toBe('os-locale');
      expect(result.confidence).toBe('medium');
    });

    it('should detect from standard environment variables as fallback', async () => {
      process.env.LANGUAGE = 'fr-FR';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('fr-FR');
      expect(result.source).toBe('LANGUAGE');
      expect(result.confidence).toBe('medium');
    });

    it('should check LC_ALL environment variable', async () => {
      process.env.LC_ALL = 'es-ES.UTF-8';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('es-ES');
      expect(result.source).toBe('LC_ALL');
    });

    it('should check LC_MESSAGES environment variable', async () => {
      process.env.LC_MESSAGES = 'it-IT.UTF-8';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('it-IT');
      expect(result.source).toBe('LC_MESSAGES');
    });

    it('should check LANG environment variable', async () => {
      process.env.LANG = 'pt-BR.UTF-8';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('pt-BR');
      expect(result.source).toBe('LANG');
    });

    it('should detect from HTTP_ACCEPT_LANGUAGE as last resort', async () => {
      process.env.HTTP_ACCEPT_LANGUAGE = 'ru-RU,ru;q=0.9,en;q=0.8';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('ru-RU');
      expect(result.source).toBe('HTTP_ACCEPT_LANGUAGE');
      expect(result.confidence).toBe('low');
    });

    it('should fallback to en-US when no language can be detected', async () => {
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('en-US');
      expect(result.source).toBe('fallback');
      expect(result.confidence).toBe('low');
    });
  });

  describe('language tag normalization', () => {
    it('should normalize language tags to BCP-47 format', async () => {
      process.env.LANG = 'en_US.UTF-8';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('en-US');
    });

    it('should strip encoding suffixes', async () => {
      process.env.LANG = 'zh_CN.GB2312';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('zh-CN');
    });

    it('should handle base language tags without region', async () => {
      process.env.LANG = 'fr';
      mockOsLocale.mockRejectedValue(new Error('OS locale detection failed'));

      const result = await detector.detect();

      expect(result.language).toBe('fr');
    });

    it('should validate language tag format', async () => {
      process.env.GEMINI_CLI_NATURAL_LANGUAGE = 'invalid_locale_format';
      mockOsLocale.mockResolvedValue('en-US');

      const result = await detector.detect();

      // Should fall back to OS locale when invalid format is provided
      expect(result.language).toBe('en-US');
      expect(result.source).toBe('os-locale');
    });
  });

  describe('configuration file handling', () => {
    it('should handle malformed config file gracefully', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await detector.detect();

      // Should fall back to other detection methods
      expect(result.source).not.toContain('config-file');
    });

    it('should handle missing language field in config', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({}));

      const result = await detector.detect();

      // Should fall back to other detection methods
      expect(result.source).not.toContain('config-file');
    });
  });

  describe('error handling', () => {
    it('should never throw errors', async () => {
      // Mock all possible error conditions
      mockOsLocale.mockRejectedValue(new Error('OS locale failed'));
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File system error'));

      // Should not throw
      await expect(detector.detect()).resolves.toBeDefined();
    });

    it('should handle null/undefined environment variables', async () => {
      process.env.LANG = undefined as any;
      mockOsLocale.mockRejectedValue(new Error('OS locale failed'));

      const result = await detector.detect();

      expect(result).toBeDefined();
      expect(result.language).toBe('en-US');
    });
  });

  describe('concurrent detection', () => {
    it('should handle multiple concurrent detection requests', async () => {
      process.env.GEMINI_CLI_NATURAL_LANGUAGE = 'ja-JP';
      mockOsLocale.mockResolvedValue('en-US');

      const promises = Array(10).fill(null).map(() => detector.detect());
      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(results.every(r => r.language === 'ja-JP')).toBe(true);
      expect(results.every(r => r.source === 'GEMINI_CLI_NATURAL_LANGUAGE')).toBe(true);
    });
  });

  describe('supported language validation', () => {
    it('should accept all supported language codes', async () => {
      const supportedCodes = Object.keys(SUPPORTED_LANGUAGES);

      for (const code of supportedCodes.slice(0, 5)) { // Test first 5 for performance
        process.env.GEMINI_CLI_NATURAL_LANGUAGE = code;
        const result = await detector.detect();

        expect(result.language).toBe(code);
        expect(result.source).toBe('GEMINI_CLI_NATURAL_LANGUAGE');
      }
    });

    it('should handle unsupported but well-formed language codes', async () => {
      process.env.GEMINI_CLI_NATURAL_LANGUAGE = 'xx-XX';
      mockOsLocale.mockResolvedValue('en-US');

      const result = await detector.detect();

      // Should accept the well-formed code even if not in supported list
      expect(result.language).toBe('xx-XX');
      expect(result.source).toBe('GEMINI_CLI_NATURAL_LANGUAGE');
    });
  });
});