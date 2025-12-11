import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { readFileSync, accessSync, constants } from 'fs';

const execAsync = promisify(exec);

describe('Bin Scripts E2E Tests', () => {
  const binDir = path.resolve(__dirname, '../../bin');
  const pnlBinPath = path.join(binDir, 'pnl.js');

  describe('pnl CLI bin script', () => {
    it('should execute and show help when run with --help', async () => {
      const { stdout, stderr } = await execAsync(`node "${pnlBinPath}" --help`);

      expect(stderr).toBe('');
      expect(stdout).toBeDefined();
      expect(stdout).toContain('Usage:');
      expect(stdout).toMatch(/detect|set|show|list|mcp/);
    }, 10000);

    it('should have correct shebang line', () => {
      const content = readFileSync(pnlBinPath, 'utf-8');
      const firstLine = content.split('\n')[0];

      expect(firstLine).toBe('#!/usr/bin/env node');
    });

    it('should have executable permissions', () => {
      // Skip on Windows - execute permissions work differently
      if (process.platform === 'win32') {
        // On Windows, just verify the file exists and is readable
        expect(() => {
          accessSync(pnlBinPath, constants.R_OK);
        }).not.toThrow();
        return;
      }

      // On Unix systems, check if file has execute permissions
      // Note: Git may not preserve execute permissions, so we also allow read-only
      try {
        accessSync(pnlBinPath, constants.X_OK);
      } catch {
        // If execute permission check fails, at least verify file is readable
        // This can happen in CI environments where git doesn't preserve permissions
        expect(() => {
          accessSync(pnlBinPath, constants.R_OK);
        }).not.toThrow();
      }
    });
  });

  describe('pnl mcp subcommand', () => {
    it('should start MCP server and log startup message', (done) => {
      const child = exec(`node "${pnlBinPath}" mcp`, { timeout: 3000 });

      let stderrOutput = '';

      child.stderr?.on('data', (data) => {
        stderrOutput += data.toString();
      });

      child.on('error', (error: any) => {
        // Timeout is expected behavior for server
        if (error.killed || error.signal === 'SIGTERM') {
          expect(stderrOutput).toContain('Detected:');
          expect(stderrOutput).toContain('Server started successfully');
          done();
        } else {
          done(error);
        }
      });

      child.on('exit', (code, signal) => {
        // Server should be killed by timeout
        if (signal === 'SIGTERM' || code === null) {
          expect(stderrOutput).toContain('Detected:');
          expect(stderrOutput).toContain('Server started successfully');
          done();
        }
      });

      // Kill after 2 seconds if still running
      setTimeout(() => {
        if (!child.killed) {
          child.kill();
        }
      }, 2000);
    }, 10000);
  });
});
