import { ShowCommand } from '../../../src/cli/commands/show.js';
import { createMockLanguageDetector, createMockI18n } from '../../helpers/mockFactory.js';

describe('ShowCommand', () => {
  describe('execute', () => {
    it('should show detailed language information with box drawing', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'zh-CN',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Should contain box drawing characters
      expect(result).toContain('╭');
      expect(result).toContain('╮');
      expect(result).toContain('╰');
      expect(result).toContain('╯');
    });

    it('should show English language info', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'en-US',
        source: 'config-file:/path/to/config',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toContain('en-US');
      expect(mockI18n.t).toHaveBeenCalledWith('show.title');
      expect(mockI18n.t).toHaveBeenCalledWith('show.preferredLanguage');
    });

    it('should show German language info', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'de-DE',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('de', 'high');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalledWith('show.title');
    });

    it('should include bilingual note when confidence is low', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'fr-FR',
        source: 'LANG',
        confidence: 'low',
      });
      const mockI18n = createMockI18n('fr', 'low');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(mockI18n.getBilingualNote).toHaveBeenCalled();
      expect(result).toContain('(Low confidence - bilingual output)');
    });

    it('should handle detection from environment variable', async () => {
      const mockDetector = createMockLanguageDetector({
        language: 'ja-JP',
        source: 'LC_ALL',
        confidence: 'medium',
      });
      const mockI18n = createMockI18n('ja', 'medium');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute();

      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalled();
    });

    it('should handle detection errors gracefully', async () => {
      const mockDetector = {
        detect: jest.fn().mockRejectedValue(new Error('Detection failed')),
      };
      const mockI18n = createMockI18n('en', 'high');

      const command = new ShowCommand(mockDetector as any, mockI18n as any);

      await expect(command.execute()).rejects.toThrow('Detection failed');
      expect(mockDetector.detect).toHaveBeenCalledTimes(1);
    });
  });
});
