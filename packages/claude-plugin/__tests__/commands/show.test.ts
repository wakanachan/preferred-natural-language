import { ShowCommand } from '../../src/commands/show.js';
import { LanguageDetector } from '@preferred-natural-language/shared';
import type { LanguageDetectionResult, DetectionSource } from '@preferred-natural-language/shared';

describe('ShowCommand', () => {
  let detector: LanguageDetector;
  let showCommand: ShowCommand;
  let mockDetect: jest.SpyInstance<Promise<LanguageDetectionResult>, []>;

  beforeEach(() => {
    detector = new LanguageDetector();
    showCommand = new ShowCommand(detector);
    mockDetect = jest.spyOn(detector, 'detect');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return detailed formatted language info', async () => {
      const mockResult: LanguageDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE',
        confidence: 'high'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await showCommand.execute();

      expect(result).toContain('语言偏好详情');
      expect(result).toContain('Chinese (Simplified)');
      expect(result).toContain('zh-CN');
      expect(result).toContain('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(result).toContain('high');
      expect(result).toContain('╭─');
      expect(result).toContain('╰─');
      expect(result).toContain('│');
    });

    it('should handle unsupported language codes', async () => {
      const mockResult: LanguageDetectionResult = {
        language: 'xx-XX',
        source: 'os-locale',
        confidence: 'medium'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await showCommand.execute();

      expect(result).toContain('xx-XX');
      expect(result).not.toContain('Chinese (Simplified)');
    });

    it('should display info in proper box format', async () => {
      const mockResult: LanguageDetectionResult = {
        language: 'en-US',
        source: 'CLAUDE_CODE_NATURAL_LANGUAGE',
        confidence: 'high'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await showCommand.execute();

      // Check for box formatting
      expect(result).toMatch(/^╭─.*─╮/m);
      expect(result).toMatch(/│.*│/m);
      expect(result).toMatch(/^╰─.*─╯/m);

      // Check for proper labels
      expect(result).toContain('首选语言:');
      expect(result).toContain('语言代码:');
      expect(result).toContain('检测来源:');
      expect(result).toContain('置信度:');
    });

    it('should handle long source names properly', async () => {
      const longSource = 'config-file:/very/long/path/to/config/file/.preferred-language.json';
      const mockResult: LanguageDetectionResult = {
        language: 'ja-JP',
        source: longSource,
        confidence: 'high'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await showCommand.execute();

      expect(result).toContain(longSource);
      // Should maintain box formatting even with long content
      expect(result).toMatch(/│.*│/m);
    });

    it('should propagate detection errors', async () => {
      const error = new Error('Detection failed');
      mockDetect.mockRejectedValue(error);

      await expect(showCommand.execute()).rejects.toThrow('Detection failed');
    });

    it('should handle different confidence levels', async () => {
      const confidenceLevels = ['high', 'medium', 'low'] as const;

      for (const confidence of confidenceLevels) {
        const mockResult: LanguageDetectionResult = {
          language: 'fr-FR',
          source: 'test',
          confidence
        };

        mockDetect.mockResolvedValue(mockResult);

        const result = await showCommand.execute();

        expect(result).toContain(`置信度:   ${confidence}`);
      }
    });

    it('should handle short and long language names', async () => {
      const testCases = [
        { language: 'en', name: 'English' },
        { language: 'zh-CN', name: 'Chinese (Simplified)' },
        { language: 'xx-XX', name: 'xx-XX' } // unsupported
      ];

      for (const testCase of testCases) {
        const mockResult: LanguageDetectionResult = {
          language: testCase.language,
          source: 'GEMINI_CLI_NATURAL_LANGUAGE' as DetectionSource,
          confidence: 'medium'
        };

        mockDetect.mockResolvedValue(mockResult);

        const result = await showCommand.execute();

        expect(result).toContain(testCase.name);
        expect(result).toContain(testCase.language);
      }
    });
  });
});