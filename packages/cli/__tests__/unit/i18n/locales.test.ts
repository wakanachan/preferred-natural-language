import { readdirSync } from 'fs';
import path from 'path';

describe('i18n Locale Files', () => {
  // Test source TypeScript files directly (ts-jest will handle them)
  const localesDir = path.resolve(__dirname, '../../../src/i18n/locales');
  const localeFiles = readdirSync(localesDir).filter(f => f.endsWith('.ts'));

  // Expected message keys that should exist in all locales
  const requiredKeys = [
    'detect.result',
    'detect.source',
    'detect.confidence',
    'set.success',
    'set.configSaved', // Changed from 'set.created'
    'set.errorMissingCode', // Added
    'list.title',
    'show.title',
    'show.preferredLanguage', // Changed from 'show.language'
    'show.detectionSource', // Changed from 'show.source'
    'show.confidence'
  ];

  it('should have consistent structure across all locale files', () => {
    expect(localeFiles.length).toBeGreaterThan(0);

    const locales: Record<string, any> = {};

    // Load all locale files
    for (const file of localeFiles) {
      const localeName = file.replace('.ts', '');
      const localePath = path.join(localesDir, file);

      // Dynamically import locale
      delete require.cache[require.resolve(localePath)];
      const localeModule = require(localePath);
      locales[localeName] = localeModule.messages; // Use .messages instead of .default
    }

    // Verify all locales have the same top-level keys
    const allTopLevelKeys = Object.keys(locales).map(locale =>
      Object.keys(locales[locale])
    );

    const firstKeys = allTopLevelKeys[0].sort();

    for (let i = 1; i < allTopLevelKeys.length; i++) {
      const currentKeys = allTopLevelKeys[i].sort();
      expect(currentKeys).toEqual(firstKeys);
    }
  });

  it('should have all required message keys in each locale', () => {
    for (const file of localeFiles) {
      const localeName = file.replace('.ts', '');
      const localePath = path.join(localesDir, file);

      delete require.cache[require.resolve(localePath)];
      const localeModule = require(localePath);
      const locale = localeModule.messages; // Use .messages instead of .default

      // Check each required key path
      for (const keyPath of requiredKeys) {
        const keys = keyPath.split('.');
        let current = locale;

        for (const key of keys) {
          expect(current).toHaveProperty(key);
          current = current[key];
        }

        expect(typeof current).toBe('string');
        expect(current.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have proper parameter placeholders in messages', () => {
    for (const file of localeFiles) {
      const localeName = file.replace('.ts', '');
      const localePath = path.join(localesDir, file);

      delete require.cache[require.resolve(localePath)];
      const localeModule = require(localePath);
      const locale = localeModule.messages; // Use .messages instead of .default

      // Verify detect.result has correct placeholders (single braces)
      expect(locale.detect.result).toMatch(/\{languageName\}/);
      expect(locale.detect.result).toMatch(/\{language\}/);

      // Verify set.success has languageName placeholder
      expect(locale.set.success).toMatch(/\{languageName\}/);
    }
  });
});
