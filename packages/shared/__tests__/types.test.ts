import type { LanguageDetectionResult, LanguageConfig, DetectionSource } from '../src/types.js';

describe('Type Definitions', () => {
  describe('LanguageDetectionResult interface', () => {
    it('should accept valid language detection result', () => {
      const result: LanguageDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE',
        confidence: 'high'
      };

      expect(result.language).toBe('zh-CN');
      expect(result.source).toBe('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(result.confidence).toBe('high');
    });

    it('should accept all valid confidence levels', () => {
      const highConfidence: LanguageDetectionResult = {
        language: 'en-US',
        source: 'os-locale',
        confidence: 'high'
      };

      const mediumConfidence: LanguageDetectionResult = {
        language: 'fr-FR',
        source: 'config-file:./.preferred-language.json',
        confidence: 'medium'
      };

      const lowConfidence: LanguageDetectionResult = {
        language: 'ja-JP',
        source: 'fallback',
        confidence: 'low'
      };

      expect(highConfidence.confidence).toBe('high');
      expect(mediumConfidence.confidence).toBe('medium');
      expect(lowConfidence.confidence).toBe('low');
    });

    it('should accept different sources', () => {
      const sources: DetectionSource[] = [
        'GEMINI_CLI_NATURAL_LANGUAGE',
        'CLAUDE_CODE_NATURAL_LANGUAGE',
        'config-file:./.preferred-language.json',
        'os-locale',
        'LANGUAGE',
        'LC_ALL',
        'LC_MESSAGES',
        'LANG',
        'HTTP_ACCEPT_LANGUAGE',
        'fallback'
      ];

      sources.forEach(source => {
        const result: LanguageDetectionResult = {
          language: 'en-US',
          source: source,
          confidence: 'medium'
        };
        expect(result.source).toBe(source);
      });
    });
  });

  describe('LanguageConfig interface', () => {
    it('should accept config with only language', () => {
      const config: LanguageConfig = {
        language: 'zh-CN'
      };

      expect(config.language).toBe('zh-CN');
    });

    it('should accept config with language and fallback', () => {
      const config: LanguageConfig = {
        language: 'ja-JP',
        fallback: 'en-US'
      };

      expect(config.language).toBe('ja-JP');
      expect(config.fallback).toBe('en-US');
    });
  });
});