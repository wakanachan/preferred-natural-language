import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync, unlinkSync } from 'fs';

const execAsync = promisify(exec);

describe('CLI Real Environment E2E Tests', () => {
  const binPath = path.resolve(__dirname, '../../bin/pnl.js');
  // Config file is created in current working directory
  const configPath = path.join(process.cwd(), '.preferred-language.json');
  const backupConfigPath = `${configPath}.e2e-backup`;

  beforeAll(() => {
    // Backup existing config if it exists
    if (existsSync(configPath)) {
      const fs = require('fs');
      fs.copyFileSync(configPath, backupConfigPath);
      unlinkSync(configPath);
    }
  });

  afterAll(() => {
    // Restore backup config if it existed
    if (existsSync(backupConfigPath)) {
      const fs = require('fs');
      fs.copyFileSync(backupConfigPath, configPath);
      unlinkSync(backupConfigPath);
    } else if (existsSync(configPath)) {
      // Clean up config created during tests
      unlinkSync(configPath);
    }
  });

  describe('detect command', () => {
    it('should detect language and show all information', async () => {
      const { stdout, stderr } = await execAsync(`node "${binPath}" detect`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should show language name and code
      expect(stdout).toMatch(/[A-Za-z\u4e00-\u9fa5]+/); // Language name
      expect(stdout).toMatch(/[a-z]{2}(-[A-Z]{2})?/); // BCP-47 code

      // Should show detection source
      expect(stdout).toMatch(/os-locale|config-file|env|http/i);

      // Should show confidence level
      expect(stdout).toMatch(/high|medium|low/i);
    }, 10000);
  });

  describe('set command', () => {
    it('should create config file with valid language code', async () => {
      const { stdout, stderr } = await execAsync(`node "${binPath}" set en-US`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();
      expect(stdout.length).toBeGreaterThan(0);

      // Verify config file was created
      expect(existsSync(configPath)).toBe(true);

      // Verify config file content
      const fs = require('fs');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      expect(config.language).toBe('en-US');
    }, 10000);

    it('should update existing config file', async () => {
      // First set to en-US
      await execAsync(`node "${binPath}" set en-US`);

      // Then change to zh-CN
      const { stdout, stderr } = await execAsync(`node "${binPath}" set zh-CN`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Verify config was updated
      const fs = require('fs');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      expect(config.language).toBe('zh-CN');
    }, 10000);
  });

  describe('show command', () => {
    it('should display detailed language information in formatted box', async () => {
      // Set a known language first
      await execAsync(`node "${binPath}" set en-US`);

      const { stdout, stderr } = await execAsync(`node "${binPath}" show`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should contain box drawing characters
      expect(stdout).toMatch(/[╭╮╰╯│─]/);

      // Should show language information
      expect(stdout).toMatch(/English|en-US/i);
      expect(stdout).toMatch(/config-file/i); // Source should be config-file now
      expect(stdout).toMatch(/high/i); // Confidence should be high for config
    }, 10000);
  });

  describe('list command', () => {
    it('should list all supported languages with codes', async () => {
      const { stdout, stderr } = await execAsync(`node "${binPath}" list`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();

      // Should contain common languages
      expect(stdout).toContain('English');
      expect(stdout).toContain('Chinese');
      expect(stdout).toMatch(/Japanese|日本語/);

      // Should contain language codes
      expect(stdout).toMatch(/en-US/);
      expect(stdout).toMatch(/zh-CN/);
      expect(stdout).toMatch(/ja-JP/);

      // Should contain multiple languages (at least 10)
      const lines = stdout.split('\n').filter(line => line.trim().length > 0);
      expect(lines.length).toBeGreaterThan(10);
    }, 10000);
  });
});
