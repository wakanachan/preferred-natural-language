import { DetectCommand } from '../../src/commands/detect.js';
import { LanguageDetector } from '@preferred-natural-language/shared';
import type { LanguageDetectionResult, DetectionSource } from '@preferred-natural-language/shared';

describe('DetectCommand', () => {
  let detector: LanguageDetector;
  let detectCommand: DetectCommand;
  let mockDetect: jest.SpyInstance<Promise<LanguageDetectionResult>, []>;

  beforeEach(() => {
    detector = new LanguageDetector();
    detectCommand = new DetectCommand(detector);
    mockDetect = jest.spyOn(detector, 'detect');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return formatted language detection result', async () => {
      const mockResult: LanguageDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE',
        confidence: 'high'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await detectCommand.execute();

      expect(result).toContain('检测到首选语言');
      expect(result).toContain('Chinese (Simplified)');
      expect(result).toContain('(zh-CN)');
      expect(result).toContain('来源: GEMINI_CLI_NATURAL_LANGUAGE');
      expect(result).toContain('置信度: high');
    });

    it('should handle unsupported language codes', async () => {
      const mockResult: LanguageDetectionResult = {
        language: 'xx-XX',
        source: 'os-locale',
        confidence: 'medium'
      };

      mockDetect.mockResolvedValue(mockResult);

      const result = await detectCommand.execute();

      expect(result).toContain('检测到首选语言');
      expect(result).toContain('(xx-XX)');
      expect(result).not.toContain('Chinese (Simplified)');
    });

    it('should propagate detection errors', async () => {
      const error = new Error('Detection failed');
      mockDetect.mockRejectedValue(error);

      await expect(detectCommand.execute()).rejects.toThrow('Detection failed');
    });

    it('should handle different detection sources', async () => {
      const testCases: Array<LanguageDetectionResult> = [
        {
          language: 'en-US',
          source: 'CLAUDE_CODE_NATURAL_LANGUAGE' as DetectionSource,
          confidence: 'high'
        },
        {
          language: 'ja-JP',
          source: 'config-file:/test/.preferred-language.json' as DetectionSource,
          confidence: 'high'
        },
        {
          language: 'de-DE',
          source: 'os-locale' as DetectionSource,
          confidence: 'medium'
        },
        {
          language: 'fr-FR',
          source: 'LANGUAGE' as DetectionSource,
          confidence: 'medium'
        },
        {
          language: 'ru-RU',
          source: 'HTTP_ACCEPT_LANGUAGE' as DetectionSource,
          confidence: 'low'
        },
        {
          language: 'en-US',
          source: 'fallback' as DetectionSource,
          confidence: 'low'
        }
      ];

      for (const testCase of testCases) {
        mockDetect.mockResolvedValue(testCase);

        const result = await detectCommand.execute();

        expect(result).toContain(`来源: ${testCase.source}`);
        expect(result).toContain(`置信度: ${testCase.confidence}`);
      }
    });

    it('should handle different confidence levels', async () => {
      const confidenceLevels = ['high', 'medium', 'low'] as const;

      for (const confidence of confidenceLevels) {
        const mockResult: LanguageDetectionResult = {
          language: 'en-US',
          source: 'GEMINI_CLI_NATURAL_LANGUAGE' as DetectionSource,
          confidence
        };

        mockDetect.mockResolvedValue(mockResult);

        const result = await detectCommand.execute();

        expect(result).toContain(`置信度: ${confidence}`);
      }
    });
  });
});