import { spawn, ChildProcess } from 'child_process';
import path from 'path';

describe('MCP Server Real Communication E2E Tests', () => {
  const pnlBinPath = path.resolve(__dirname, '../../bin/pnl.js');

  describe('MCP server stdio communication', () => {
    it('should start server and accept stdin without crashing', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderrData = '';
      let crashed = false;

      mcpProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      mcpProcess.on('error', () => {
        crashed = true;
      });

      mcpProcess.on('exit', (code) => {
        if (code !== null && code !== 0 && code !== 143) {
          crashed = true;
        }
      });

      // Send test input after server starts
      setTimeout(() => {
        if (!mcpProcess.killed) {
          mcpProcess.stdin.write('{"test": "input"}\n');
        }
      }, 1000);

      // Verify server is still running and didn't crash
      setTimeout(() => {
        expect(crashed).toBe(false);
        expect(stderrData).toContain('Detected:');
        expect(stderrData).toContain('Server started successfully');
        mcpProcess.kill();
        done();
      }, 2000);
    }, 10000);

    it('should handle multiple stdin writes gracefully', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let crashed = false;

      mcpProcess.on('error', () => {
        crashed = true;
      });

      mcpProcess.on('exit', (code) => {
        if (code !== null && code !== 0 && code !== 143) {
          crashed = true;
        }
      });

      // Send multiple inputs
      setTimeout(() => {
        if (!mcpProcess.killed) {
          mcpProcess.stdin.write('{"jsonrpc":"2.0","method":"test1"}\n');
        }
      }, 500);

      setTimeout(() => {
        if (!mcpProcess.killed) {
          mcpProcess.stdin.write('{"jsonrpc":"2.0","method":"test2"}\n');
        }
      }, 1000);

      setTimeout(() => {
        if (!mcpProcess.killed) {
          mcpProcess.stdin.write('{"jsonrpc":"2.0","method":"test3"}\n');
        }
      }, 1500);

      // Verify server handled all inputs without crashing
      setTimeout(() => {
        expect(crashed).toBe(false);
        mcpProcess.kill();
        done();
      }, 2500);
    }, 10000);

    it('should log startup information to stderr', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderrData = '';

      mcpProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      // Wait for startup messages
      setTimeout(() => {
        // Should log detection result
        expect(stderrData).toMatch(/Detected: [a-z]{2}(-[A-Z]{2})?/);
        expect(stderrData).toMatch(/source: (os-locale|config-file|env)/);
        expect(stderrData).toMatch(/confidence: (high|medium|low)/);

        // Should log server start
        expect(stderrData).toContain('Server started successfully');

        mcpProcess.kill();
        done();
      }, 2000);
    }, 10000);
  });
});
