import { ListCommand } from '../../src/commands/list.js';
import { SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';

describe('ListCommand', () => {
  let listCommand: ListCommand;

  beforeEach(() => {
    listCommand = new ListCommand();
  });

  describe('execute', () => {
    it('should return formatted list of supported languages', async () => {
      const result = await listCommand.execute();

      expect(result).toContain('支持的语言:');
      expect(result).toContain('使用方法: claude plugin preferred-natural-language set <语言代码>');
    });

    it('should include all supported languages', async () => {
      const result = await listCommand.execute();

      Object.keys(SUPPORTED_LANGUAGES).forEach(code => {
        expect(result).toContain(code);
      });

      Object.values(SUPPORTED_LANGUAGES).forEach(name => {
        expect(result).toContain(name);
      });
    });

    it('should display languages in proper format', async () => {
      const result = await listCommand.execute();

      // Check for "code: name" format
      expect(result).toMatch(/[a-z]{2}(-[A-Z]{2})?: .+/g);

      // Should include some specific examples
      expect(result).toContain('en: English');
      expect(result).toContain('en-US: English (United States)');
      expect(result).toContain('zh-CN: Chinese (Simplified)');
      expect(result).toContain('ja-JP: Japanese');
    });

    it('should display languages in multiple columns', async () => {
      const result = await listCommand.execute();

      // Check that languages are arranged in columns
      const lines = result.split('\n').filter(line => line.trim() && !line.includes('支持的语言') && !line.includes('使用方法'));

      // Should have multiple languages per line (except possibly the last one)
      expect(lines.length).toBeLessThan(Object.keys(SUPPORTED_LANGUAGES).length);
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should sort languages by code', async () => {
      const result = await listCommand.execute();

      // Extract language codes in order of appearance
      const codeMatches = result.match(/[a-z]{2}(-[A-Z]{2})?:/g);
      if (!codeMatches) {
        throw new Error('No language codes found in output');
      }

      const codes = codeMatches.map(match => match.replace(':', ''));
      const sortedCodes = [...codes].sort((a, b) => a.localeCompare(b));

      expect(codes).toEqual(sortedCodes);
    });

    it('should have consistent column padding', async () => {
      const result = await listCommand.execute();

      const lines = result.split('\n').filter(line =>
        line.trim() &&
        line.includes(':') &&
        !line.includes('支持的语言') &&
        !line.includes('使用方法')
      );

      // Each line should be padded to consistent width (except last line)
      lines.slice(0, -1).forEach(line => {
        // Should end with proper spacing before newline
        expect(line).toMatch(/.*\s{2,}$/);
      });
    });

    it('should handle edge cases gracefully', async () => {
      const result = await listCommand.execute();

      // Should start with header
      expect(result).toStartWith('支持的语言:');

      // Should end with usage instructions
      expect(result).toEndWith('使用方法: claude plugin preferred-natural-language set <语言代码>');

      // Should not have empty lines between language entries
      const lines = result.split('\n');
      const languageLines = lines.filter(line =>
        line.trim() &&
        line.includes(':') &&
        !line.includes('支持的语言') &&
        !line.includes('使用方法')
      );

      languageLines.forEach(line => {
        expect(line.trim()).not.toBe('');
        expect(line).toContain(':');
      });
    });

    it('should include regional variants', async () => {
      const result = await listCommand.execute();

      // Should include regional variants
      expect(result).toContain('en-US');
      expect(result).toContain('en-GB');
      expect(result).toContain('zh-CN');
      expect(result).toContain('zh-TW');
      expect(result).toContain('zh-HK');
      expect(result).toContain('pt-BR');
      expect(result).toContain('pt-PT');
    });

    it('should display Chinese and other multi-byte characters correctly', async () => {
      const result = await listCommand.execute();

      // Should handle multi-byte characters properly
      expect(result).toContain('中文');
      expect(result).toContain('日本語');
      expect(result).toContain('한국어');
      expect(result).toContain('العربية');
    });
  });
});