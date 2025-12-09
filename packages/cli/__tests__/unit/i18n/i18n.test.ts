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

    it('should translate simple message keys (Japanese)', () => {
      const i18n = new I18n('ja-JP', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('サポートされている言語:');
    });

    it('should translate simple message keys (Korean)', () => {
      const i18n = new I18n('ko-KR', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('지원되는 언어:');
    });

    it('should translate simple message keys (Russian)', () => {
      const i18n = new I18n('ru-RU', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Поддерживаемые языки:');
    });

    it('should translate simple message keys (Portuguese)', () => {
      const i18n = new I18n('pt-BR', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Idiomas suportados:');
    });

    it('should translate simple message keys (Spanish)', () => {
      const i18n = new I18n('es-ES', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Idiomas compatibles:');
    });

    it('should translate simple message keys (French)', () => {
      const i18n = new I18n('fr-FR', 'high');
      const result = i18n.t('list.title');

      expect(result).toBe('Langues prises en charge :');
    });

    it('should fallback to English for Italian (no locale file)', () => {
      const i18n = new I18n('it-IT', 'high');
      const result = i18n.t('list.title');

      // Italian locale not implemented, should fallback to English
      expect(result).toBe('Supported languages:');
    });

    it('should translate with parameters (Japanese)', () => {
      const i18n = new I18n('ja-JP', 'high');
      const result = i18n.t('detect.result', { languageName: '日本語', language: 'ja-JP' });

      expect(result).toContain('日本語');
      expect(result).toContain('ja-JP');
    });

    it('should translate with parameters (Korean)', () => {
      const i18n = new I18n('ko-KR', 'high');
      const result = i18n.t('detect.result', { languageName: '한국어', language: 'ko-KR' });

      expect(result).toContain('한국어');
      expect(result).toContain('ko-KR');
    });

    it('should fallback to base language (pt for pt-PT)', () => {
      const i18n = new I18n('pt-PT', 'high');
      const result = i18n.t('list.title');

      // Should use pt locale
      expect(result).toBe('Idiomas suportados:');
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
