import { SUPPORTED_LANGUAGES } from '../src/languageNames.js';

describe('Language Names', () => {
  describe('SUPPORTED_LANGUAGES constant', () => {
    it('should contain language mappings', () => {
      expect(Object.keys(SUPPORTED_LANGUAGES).length).toBeGreaterThan(0);
    });

    it('should have proper format for language codes', () => {
      const languageCodes = Object.keys(SUPPORTED_LANGUAGES);

      languageCodes.forEach(code => {
        // Should be either base language (en) or language-region (en-US)
        expect(code).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
      });
    });

    it('should have human-readable names for all languages', () => {
      const languageNames = Object.values(SUPPORTED_LANGUAGES);

      languageNames.forEach(name => {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it('should contain major world languages', () => {
      expect(SUPPORTED_LANGUAGES).toHaveProperty('en', 'English');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('zh-CN', 'Chinese (Simplified)');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('ja', 'Japanese');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('es', 'Spanish');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('fr', 'French');
    });

    it('should contain language variants', () => {
      expect(SUPPORTED_LANGUAGES).toHaveProperty('zh-CN', 'Chinese (Simplified)');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('zh-TW', 'Chinese (Traditional)');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('en-US', 'English (United States)');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('en-GB', 'English (United Kingdom)');
    });

    it('should have consistent naming conventions', () => {
      const specialCases = [
        'Chinese (Simplified)',
        'Chinese (Traditional)',
        'Chinese (Hong Kong)',
        'English (United States)',
        'English (United Kingdom)',
        'Spanish (Spain)',
        'Spanish (Mexico)',
        'Portuguese (Brazil)',
        'Portuguese (Portugal)',
        'French (France)',
        'German (Germany)'
      ];

      Object.values(SUPPORTED_LANGUAGES).forEach(name => {
        if (!specialCases.includes(name)) {
          // Most language names should be capitalized with no special formatting
          expect(name).toMatch(/^[A-Z][a-z]+(\s[A-Za-z]+)*$/);
        }
      });
    });

    it('should be extensible for new languages', () => {
      const originalLength = Object.keys(SUPPORTED_LANGUAGES).length;

      // This test ensures the structure allows for extension
      expect(typeof SUPPORTED_LANGUAGES).toBe('object');
      expect(Array.isArray(SUPPORTED_LANGUAGES)).toBe(false);

      // Verify we can add new languages (though we don't actually modify the constant)
      const testExtension = { ...SUPPORTED_LANGUAGES, 'test-TT': 'Test Language' };
      expect(testExtension['test-TT']).toBe('Test Language');
    });

    it('should handle edge cases properly', () => {
      // Ensure no empty language codes or names
      Object.keys(SUPPORTED_LANGUAGES).forEach(code => {
        expect(code.trim()).toBe(code);
        expect(code.length).toBeGreaterThan(0);
      });

      Object.values(SUPPORTED_LANGUAGES).forEach(name => {
        expect(name.trim()).toBe(name);
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it('should have unique language codes', () => {
      const languageCodes = Object.keys(SUPPORTED_LANGUAGES);
      const uniqueCodes = new Set(languageCodes);

      expect(languageCodes.length).toBe(uniqueCodes.size);
    });

    it('should have unique language names (mostly)', () => {
      const languageNames = Object.values(SUPPORTED_LANGUAGES);
      const uniqueNames = new Set(languageNames);

      // Allow for some duplicates (like regional variants that might share names)
      // But ensure most are unique
      expect(uniqueNames.size).toBeGreaterThan(languageNames.length * 0.7);
    });
  });
});