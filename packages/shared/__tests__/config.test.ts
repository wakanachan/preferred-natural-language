import {
  CONFIG_FILE_NAME,
  CONFIG_SEARCH_PATHS,
  DEFAULT_LANGUAGE,
  CUSTOM_ENV_VARS,
  STANDARD_ENV_VARS
} from '../src/config.js';

describe('Configuration', () => {
  describe('CONFIG constants', () => {
    it('should have defined config file name', () => {
      expect(CONFIG_FILE_NAME).toBe('.preferred-language.json');
    });

    it('should have defined config search paths', () => {
      expect(CONFIG_SEARCH_PATHS.length).toBeGreaterThan(0);
      expect(CONFIG_SEARCH_PATHS[0]).toBe(process.cwd());
    });

    it('should have defined custom environment variables', () => {
      expect(CUSTOM_ENV_VARS).toHaveLength(2);
      expect(CUSTOM_ENV_VARS).toContain('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(CUSTOM_ENV_VARS).toContain('CLAUDE_CODE_NATURAL_LANGUAGE');
    });

    it('should have defined standard environment variables', () => {
      expect(STANDARD_ENV_VARS).toHaveLength(4);
      expect(STANDARD_ENV_VARS).toContain('LANGUAGE');
      expect(STANDARD_ENV_VARS).toContain('LC_ALL');
      expect(STANDARD_ENV_VARS).toContain('LC_MESSAGES');
      expect(STANDARD_ENV_VARS).toContain('LANG');
    });

    it('should have defined default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('en-US');
    });
  });
});