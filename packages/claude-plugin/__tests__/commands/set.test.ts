import { SetCommand } from '../../src/commands/set.js';
import { LanguageDetector } from '@preferred-natural-language/shared';
import { SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';

// Mock fs for file operations
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn()
  }
}));

import { promises as fs } from 'fs';
import path from 'path';

describe('SetCommand', () => {
  let detector: LanguageDetector;
  let setCommand: SetCommand;

  beforeEach(() => {
    detector = new LanguageDetector();
    setCommand = new SetCommand(detector);
    jest.clearAllMocks();

    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue('/test/workspace');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return error when no language is provided', async () => {
      const result = await setCommand.execute('');

      expect(result).toContain('错误: 请提供语言代码');
      expect(result).toContain('zh-CN');
    });

    it('should return error for unsupported language code', async () => {
      const result = await setCommand.execute('invalid-lang');

      expect(result).toContain('错误: 不支持的语言代码 "invalid-lang"');
      expect(result).toContain('claude plugin preferred-natural-language list');
    });

    it('should set valid language and write config file', async () => {
      const languageCode = 'zh-CN';
      const expectedConfig = JSON.stringify({ language: languageCode }, null, 2);

      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await setCommand.execute(languageCode);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/test/workspace', '.preferred-language.json'),
        expectedConfig,
        'utf-8'
      );
      expect(result).toContain('✅ 语言偏好已设置为');
      expect(result).toContain('Chinese (Simplified)');
      expect(result).toContain('(zh-CN)');
      expect(result).toContain('.preferred-language.json');
    });

    it('should handle file system errors gracefully', async () => {
      const errorMessage = 'Permission denied';
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(setCommand.execute('en-US')).rejects.toThrow('保存配置失败');
      await expect(setCommand.execute('en-US')).rejects.toThrow(errorMessage);
    });

    it('should work with different supported languages', async () => {
      const testCases = [
        { code: 'en-US', name: 'English (United States)' },
        { code: 'ja-JP', name: 'Japanese' },
        { code: 'fr-FR', name: 'French (France)' }
      ];

      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      for (const testCase of testCases) {
        const result = await setCommand.execute(testCase.code);

        expect(result).toContain(testCase.name);
        expect(result).toContain(`(${testCase.code})`);
        expect(fs.writeFile).toHaveBeenCalledWith(
          path.join('/test/workspace', '.preferred-language.json'),
          JSON.stringify({ language: testCase.code }, null, 2),
          'utf-8'
        );
      }
    });

    it('should show some common languages in help message', async () => {
      const result = await setCommand.execute('');

      expect(result).toContain('常用语言');

      // Check that some common languages are mentioned
      const commonLanguages = ['en-US', 'zh-CN', 'ja-JP', 'es-ES', 'fr-FR'];
      const hasCommonLanguage = commonLanguages.some(lang => result.includes(lang));
      expect(hasCommonLanguage).toBe(true);
    });
  });
});