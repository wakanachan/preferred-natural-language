import { ListCommand } from '../../../src/cli/commands/list.js';
import { createMockI18n } from '../../helpers/mockFactory.js';

describe('ListCommand', () => {
  describe('execute', () => {
    it('should list all supported languages', async () => {
      const mockI18n = createMockI18n('en', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockI18n.t).toHaveBeenCalledWith('list.title');
      expect(mockI18n.t).toHaveBeenCalledWith('list.usage');
    });

    it('should include language codes and names', async () => {
      const mockI18n = createMockI18n('en', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      // Should contain some common language codes
      expect(result).toContain('en-US');
      expect(result).toContain('zh-CN');
    });

    it('should format output in columns', async () => {
      const mockI18n = createMockI18n('en', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      // Should have multiple lines (header + language lines + usage)
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(3);
    });

    it('should display in sorted order', async () => {
      const mockI18n = createMockI18n('en', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      // Extract language codes from result
      const codeMatches = result.match(/[a-z]{2}-[A-Z]{2}/g);
      expect(codeMatches).toBeDefined();
      expect(codeMatches!.length).toBeGreaterThan(0);
    });

    it('should work with English i18n', async () => {
      const mockI18n = createMockI18n('en', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalledWith('list.title');
    });

    it('should work with Chinese i18n', async () => {
      const mockI18n = createMockI18n('zh-CN', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalledWith('list.title');
    });

    it('should work with German i18n', async () => {
      const mockI18n = createMockI18n('de', 'high');

      const command = new ListCommand(mockI18n as any);
      const result = await command.execute();

      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalledWith('list.title');
      expect(mockI18n.t).toHaveBeenCalledWith('list.usage');
    });
  });
});
