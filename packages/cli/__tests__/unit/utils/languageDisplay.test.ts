import { formatLanguageResult, formatDetailedLanguageInfo } from '../../../src/cli/utils/languageDisplay.js';
import { createMockI18n, createMockDetectionResult } from '../../helpers/mockFactory.js';

describe('languageDisplay', () => {
  describe('formatLanguageResult', () => {
    it('should format language detection result', () => {
      const result = createMockDetectionResult({
        language: 'zh-CN',
        source: 'os-locale',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const output = formatLanguageResult(result, mockI18n as any);

      expect(output).toBeDefined();
      expect(typeof output).toBe('string');
      expect(mockI18n.t).toHaveBeenCalledWith('detect.result', expect.any(Object));
      expect(mockI18n.t).toHaveBeenCalledWith('detect.source', expect.any(Object));
      expect(mockI18n.t).toHaveBeenCalledWith('detect.confidence', expect.any(Object));
    });

    it('should include bilingual note when in bilingual mode', () => {
      const result = createMockDetectionResult({
        language: 'zh-CN',
        source: 'LANG',
        confidence: 'low',
      });
      const mockI18n = createMockI18n('zh-CN', 'low');

      const output = formatLanguageResult(result, mockI18n as any);

      expect(output).toBeDefined();
      expect(mockI18n.getBilingualNote).toHaveBeenCalled();
      expect(output).toContain('(Low confidence - bilingual output)');
    });
  });

  describe('formatDetailedLanguageInfo', () => {
    it('should format detailed language info with box drawing', () => {
      const result = createMockDetectionResult({
        language: 'en-US',
        source: 'config-file:/path/to/config',
        confidence: 'high',
      });
      const mockI18n = createMockI18n('en', 'high');

      const output = formatDetailedLanguageInfo(result, mockI18n as any);

      expect(output).toBeDefined();
      expect(typeof output).toBe('string');
      // Should contain box drawing characters
      expect(output).toContain('╭');
      expect(output).toContain('╮');
      expect(output).toContain('╰');
      expect(output).toContain('╯');
      expect(mockI18n.t).toHaveBeenCalledWith('show.title');
      expect(mockI18n.t).toHaveBeenCalledWith('show.preferredLanguage');
    });

    it('should include bilingual note in detailed info when in bilingual mode', () => {
      const result = createMockDetectionResult({
        language: 'fr-FR',
        source: 'os-locale',
        confidence: 'low',
      });
      const mockI18n = createMockI18n('fr', 'low');

      const output = formatDetailedLanguageInfo(result, mockI18n as any);

      expect(output).toBeDefined();
      expect(mockI18n.getBilingualNote).toHaveBeenCalled();
      expect(output).toContain('(Low confidence - bilingual output)');
    });
  });
});
