import { I18n } from '../../../src/i18n/index.js';

describe('I18n', () => {
  describe('constructor', () => {
    it('should initialize with default locale (en)', () => {
      const i18n = new I18n();
      const result = i18n.t('detect.result', { languageName: 'English', language: 'en' });

      expect(result).toContain('English');
      expect(result).toContain('en');
    });

    it('should normalize locale format (underscore to hyphen)', () => {
      const i18n = new I18n('zh_CN', 'high');
      const result = i18n.t('detect.result', { languageName: '简体中文', language: 'zh-CN' });

      expect(result).toBeDefined();
    });

    it('should enable bilingual mode when confidence is low', () => {
      const i18n = new I18n('zh-CN', 'low');

      expect(i18n.isBilingual()).toBe(true);
    });

    it('should not enable bilingual mode when confidence is high', () => {
      const i18n = new I18n('zh-CN', 'high');

      expect(i18n.isBilingual()).toBe(false);
    });
  });

  describe('t() - translation', () => {
    it('should translate simple message keys (English)', () => {
      const i18n = new I18n('en', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Supported languages:');
    });

    it('should translate simple message keys (Chinese)', () => {
      const i18n = new I18n('zh-CN', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('支持的语言:');
    });

    it('should translate simple message keys (German)', () => {
      const i18n = new I18n('de', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Unterstützte Sprachen:');
    });

    it('should replace parameters in messages', () => {
      const i18n = new I18n('en', 'high');
      const result = i18n.t('detect.result', {
        languageName: 'English',
        language: 'en-US',
      });

      expect(result).toContain('English');
      expect(result).toContain('en-US');
    });

    it('should handle multiple parameters', () => {
      const i18n = new I18n('en', 'high');
      const result = i18n.t('set.success', {
        languageName: 'French',
        language: 'fr-FR',
      });

      expect(result).toContain('French');
      expect(result).toContain('fr-FR');
    });

    it('should add bilingual fallback when confidence is low', () => {
      const i18n = new I18n('zh-CN', 'low');
      const result = i18n.t('detect.result', {
        languageName: '简体中文',
        language: 'zh-CN',
      });

      // Should contain both Chinese and English
      expect(result).toContain('简体中文');
      expect(result).toContain('zh-CN');
      expect(result).toContain('(');
      expect(result).toContain(')');
    });

    it('should fallback to English for unknown locales', () => {
      const i18n = new I18n('invalid-locale', 'high');
      const result = i18n.t('list.title');

      // Should fallback to English
      expect(result).toBe('Supported languages:');
    });

    it('should return key path when translation not found', () => {
      const i18n = new I18n('en', 'high');
      const result = i18n.t('nonexistent.key');

      expect(result).toBe('nonexistent.key');
    });
  });

  describe('getBilingualNote()', () => {
    it('should return note when in bilingual mode', () => {
      const i18n = new I18n('zh-CN', 'low');
      const note = i18n.getBilingualNote();

      expect(note).toBeDefined();
      expect(note).not.toBeNull();
    });

    it('should return null when not in bilingual mode', () => {
      const i18n = new I18n('zh-CN', 'high');
      const note = i18n.getBilingualNote();

      expect(note).toBeNull();
    });
  });
});
