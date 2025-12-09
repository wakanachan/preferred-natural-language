import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('i18n + Commands Integration Tests', () => {
  const cliPath = path.resolve(__dirname, '../../dist/cli/index.js');

  beforeAll(() => {
    // Ensure CLI is built
    if (!require('fs').existsSync(cliPath)) {
      throw new Error(`CLI not built at ${cliPath}. Run 'npm run build' first.`);
    }
  });

  describe('multilingual command execution', () => {
    it('should execute detect command and output language information', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" detect`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should contain language name or code
      expect(stdout.length).toBeGreaterThan(0);

      // Should contain some form of language identifier
      expect(stdout).toMatch(/[a-z]{2}(-[A-Z]{2})?/); // BCP-47 code pattern
    }, 10000);

    it('should execute list command and show language names', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" list`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should contain multiple languages
      expect(stdout).toContain('English');
      expect(stdout).toContain('Chinese');

      // Should contain language codes
      expect(stdout).toMatch(/en-US|zh-CN|ja-JP/);
    }, 10000);

    it('should handle show command with formatted output', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" show`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should contain box drawing characters
      expect(stdout).toMatch(/[╭╮╰╯│─]/);

      // Should contain language information
      expect(stdout).toMatch(/language|source|confidence/i);
    }, 10000);

    it('should handle set command with valid language code', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" set en-US`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should confirm the setting
      expect(stdout.length).toBeGreaterThan(0);
    }, 10000);
  });
});
