import { DetectCommand } from '../../../src/cli/commands/detect.js';
import { createMockLanguageDetector, createMockI18n, createMockDetectionResult } from '../../helpers/mockFactory.js';

describe('DetectCommand', () => {
  describe('execute', () => {
    it('should detect language and format result with i18n', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'zh-CN',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle English language detection', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'en-US',
        source: 'config-file:/path/to/config',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toContain('en-US');
    });

    it('should handle Chinese language detection', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'zh-CN',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('zh-CN', 'high');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should handle German language detection', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'de-DE',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('de', 'high');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should include bilingual note when confidence is low', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'zh-CN',
        source: 'LC_ALL',
        confidence: 'low',
      });
      const mockI18n = createMockI18n('zh-CN', 'low');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(mockI18n.getBilingualNote).toHaveBeenCalled();
    });

    it('should handle detection errors gracefully', async () => {
      const mockDetector = {
        detect: jest.fn().mockRejectedValue(new Error('Detection failed')),
      };
      const mockI18n = createMockI18n('en', 'high');

      const command = new DetectCommand(mockDetector as any, mockI18n as any);

      await expect(command.execute()).rejects.toThrow('Detection failed');
      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
    });
  });
});
