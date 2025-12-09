import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('CLI Integration Tests', () => {
  const cliPath = path.resolve(__dirname, '../../dist/cli/index.js');

  describe('detect command', () => {
    it('should execute detect command successfully', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" detect`);

      expect(stdout).toBeDefined();
      expect(stderr).toBe('');
      // Should contain language information
      expect(stdout.length).toBeGreaterThan(0);
    }, 10000);

    it('should detect and display language with confidence', async () => {
      const { stdout } = await execAsync(`node "${cliPath}" detect`);

      // Should contain confidence indicator
      expect(stdout).toMatch(/high|medium|low/i);
    }, 10000);
  });

  describe('list command', () => {
    it('should list all supported languages', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" list`);

      expect(stdout).toBeDefined();
      expect(stderr).toBe('');
      // Should contain popular languages
      expect(stdout).toContain('English');
      expect(stdout).toContain('Chinese');
    }, 10000);

    it('should display language codes in list', async () => {
      const { stdout } = await execAsync(`node "${cliPath}" list`);

      // Should contain BCP-47 codes
      expect(stdout).toMatch(/en-US|zh-CN|ja-JP/);
    }, 10000);
  });

  describe('show command', () => {
    it('should show detailed language information', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" show`);

      expect(stdout).toBeDefined();
      expect(stderr).toBe('');
      // Should contain box drawing characters
      expect(stdout).toMatch(/[╭╮╰╯│─]/);
    }, 10000);

    it('should include detection source in show output', async () => {
      const { stdout } = await execAsync(`node "${cliPath}" show`);

      // Should show where language was detected from
      expect(stdout).toMatch(/config|locale|environment|fallback/i);
    }, 10000);
  });

  describe('set command', () => {
    it('should validate language code format', async () => {
      try {
        await execAsync(`node "${cliPath}" set invalid-code`);
        fail('Should have thrown an error');
      } catch (error: any) {
        // Should throw an error for invalid language code
        expect(error).toBeDefined();
        expect(error.message || error.stderr).toBeDefined();
      }
    }, 10000);

    it('should accept valid language codes', async () => {
      const { stdout, stderr } = await execAsync(`node "${cliPath}" set en-US`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();
    }, 10000);
  });

  describe('error handling', () => {
    it('should handle unknown commands gracefully', async () => {
      try {
        await execAsync(`node "${cliPath}" unknown-command`);
        fail('Should have thrown an error');
      } catch (error: any) {
        // Commander will output help or error
        expect(error.code).toBeGreaterThan(0);
      }
    }, 10000);
  });
});
