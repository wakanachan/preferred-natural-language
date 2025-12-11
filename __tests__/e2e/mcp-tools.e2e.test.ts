import { spawn } from 'child_process';
import path from 'path';

describe('MCP Server Tools E2E Tests', () => {
  const pnlBinPath = path.resolve(__dirname, '../../bin/pnl.js');

  // Helper to send JSON-RPC message to MCP server
  const sendMcpRequest = (process: any, method: string, params?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params: params || {}
      };

      let stdoutData = '';
      let stderrData = '';
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for response to ${method}`));
      }, 5000);

      const dataHandler = (data: Buffer) => {
        stdoutData += data.toString();
        try {
          const lines = stdoutData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === id) {
              clearTimeout(timeout);
              process.stdout.removeListener('data', dataHandler);
              resolve(response);
              return;
            }
          }
        } catch (e) {
          // Not yet a complete JSON response, keep waiting
        }
      };

      const errorHandler = (data: Buffer) => {
        stderrData += data.toString();
        if (stderrData.includes('Error') || stderrData.includes('error')) {
          clearTimeout(timeout);
          process.stdout.removeListener('data', dataHandler);
          process.stderr.removeListener('data', errorHandler);
          reject(new Error(`Server error: ${stderrData}`));
        }
      };

      process.stdout.on('data', dataHandler);
      process.stderr.on('data', errorHandler);
      process.stdin.write(JSON.stringify(request) + '\n');
    });
  };

  describe('detect-language tool', () => {
    it('should successfully detect language when called via MCP protocol', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Wait for server to start
      setTimeout(async () => {
        try {
          const response = await sendMcpRequest(mcpProcess, 'tools/call', {
            name: 'detect-language',
            arguments: {}
          });

          // Verify response structure
          expect(response.result).toBeDefined();
          expect(response.result.content).toBeDefined();
          expect(Array.isArray(response.result.content)).toBe(true);
          expect(response.result.content[0].type).toBe('text');

          // Parse and verify the content
          const content = JSON.parse(response.result.content[0].text);
          expect(content.language).toBeDefined();
          expect(content.languageName).toBeDefined();
          expect(content.source).toBeDefined();
          expect(content.confidence).toBeDefined();

          mcpProcess.kill();
          done();
        } catch (error) {
          mcpProcess.kill();
          done(error);
        }
      }, 2000);
    }, 15000);
  });

  describe('list-languages tool', () => {
    it('should return list of supported languages when called via MCP protocol', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      setTimeout(async () => {
        try {
          const response = await sendMcpRequest(mcpProcess, 'tools/call', {
            name: 'list-languages',
            arguments: {}
          });

          expect(response.result).toBeDefined();
          expect(response.result.content).toBeDefined();

          const content = JSON.parse(response.result.content[0].text);
          expect(content.total).toBeGreaterThan(0);
          expect(Array.isArray(content.languages)).toBe(true);
          expect(content.languages.length).toBeGreaterThan(10);
          expect(content.languages[0]).toHaveProperty('code');
          expect(content.languages[0]).toHaveProperty('name');

          mcpProcess.kill();
          done();
        } catch (error) {
          mcpProcess.kill();
          done(error);
        }
      }, 2000);
    }, 15000);
  });

  describe('set-language tool', () => {
    it('should accept valid language code when called via MCP protocol', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      setTimeout(async () => {
        try {
          const response = await sendMcpRequest(mcpProcess, 'tools/call', {
            name: 'set-language',
            arguments: {
              language: 'en-US',
              fallback: 'en-US'
            }
          });

          expect(response.result).toBeDefined();
          expect(response.result.content).toBeDefined();

          const content = JSON.parse(response.result.content[0].text);
          expect(content.success).toBe(true);
          expect(content.language).toBe('en-US');

          mcpProcess.kill();
          done();
        } catch (error) {
          mcpProcess.kill();
          done(error);
        }
      }, 2000);
    }, 15000);

    it('should reject invalid language code when called via MCP protocol', (done) => {
      const mcpProcess = spawn('node', [pnlBinPath, 'mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      setTimeout(async () => {
        try {
          const response = await sendMcpRequest(mcpProcess, 'tools/call', {
            name: 'set-language',
            arguments: {
              language: 'invalid-XX'
            }
          });

          expect(response.result).toBeDefined();
          expect(response.result.content).toBeDefined();

          const content = JSON.parse(response.result.content[0].text);
          expect(content.success).toBe(false);
          expect(content.error).toBeDefined();

          mcpProcess.kill();
          done();
        } catch (error) {
          mcpProcess.kill();
          done(error);
        }
      }, 2000);
    }, 15000);
  });
});
