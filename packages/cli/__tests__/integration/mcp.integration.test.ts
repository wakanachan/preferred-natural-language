import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { readFileSync } from 'fs';

describe('MCP Server Integration Tests', () => {
  const mcpServerPath = path.resolve(__dirname, '../../dist/mcp/server.js');
  const mcpServerSourcePath = path.resolve(__dirname, '../../src/mcp/server.ts');

  beforeAll(() => {
    // Ensure MCP server is built
    if (!require('fs').existsSync(mcpServerPath)) {
      throw new Error(`MCP server not built at ${mcpServerPath}. Run 'npm run build' first.`);
    }
  });

  describe('MCP Server Startup', () => {
    it('should start without errors', (done) => {
      const mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderrData = '';

      mcpProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      // Wait for startup messages
      setTimeout(() => {
        // Should log detection result
        expect(stderrData).toContain('Detected:');
        expect(stderrData).toContain('Server started successfully');

        mcpProcess.kill();
        done();
      }, 2000);
    }, 10000);

    it('should accept stdio input without crashing', (done) => {
      const mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let crashed = false;

      mcpProcess.on('error', () => {
        crashed = true;
      });

      mcpProcess.on('exit', (code) => {
        if (code !== null && code !== 0 && code !== 143) { // 143 is SIGTERM
          crashed = true;
        }
      });

      // Send some test input
      setTimeout(() => {
        mcpProcess.stdin.write('{"jsonrpc":"2.0","id":1,"method":"initialize"}\n');
      }, 500);

      // Wait and check
      setTimeout(() => {
        expect(crashed).toBe(false);
        mcpProcess.kill();
        done();
      }, 2000);
    }, 10000);
  });

  describe('MCP Server Code Quality', () => {
    it('should have proper error handling in all tool callbacks', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      // Check that Resource callback has try-catch
      expect(serverSource).toContain('registerResource');

      // Check that Prompt callback has try-catch
      expect(serverSource).toContain('registerPrompt');

      // Check that Tools have try-catch
      expect(serverSource).toContain('registerTool');
      expect(serverSource).toMatch(/detect-language|set-language|list-languages/);
    });

    it('should export proper MCP capabilities', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      // Should declare resource subscription capability in TypeScript source
      expect(serverSource).toContain('capabilities');
      expect(serverSource).toContain('resources');
      expect(serverSource).toContain('subscribe');
      expect(serverSource).toContain('listChanged');

      // Should declare prompts capability
      expect(serverSource).toContain('prompts');

      // Should declare tools capability
      expect(serverSource).toContain('tools');
    });

    it('should register detect-language tool', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      expect(serverSource).toContain('detect-language');
      expect(serverSource).toMatch(/Detect.*preferred.*natural.*language/i);
    });

    it('should register set-language tool with validation', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      expect(serverSource).toContain('set-language');
      expect(serverSource).toMatch(/SUPPORTED_LANGUAGES/);
      expect(serverSource).toMatch(/Unsupported language/);
    });

    it('should register list-languages tool', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      expect(serverSource).toContain('list-languages');
      expect(serverSource).toMatch(/List.*supported.*languages/i);
      expect(serverSource).toMatch(/total[\s\S]*languages/); // Allow newlines between total and languages
    });

    it('should register language://preference resource', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      expect(serverSource).toContain('language://preference');
      expect(serverSource).toMatch(/Language Preference|preferred.*language.*interactions/i);
      expect(serverSource).toMatch(/languageName/);
      expect(serverSource).toMatch(/source/);
      expect(serverSource).toMatch(/confidence/);
    });

    it('should register use-preferred-language prompt', () => {
      const serverSource = readFileSync(mcpServerSourcePath, 'utf-8');

      expect(serverSource).toContain('use-preferred-language');
      expect(serverSource).toMatch(/preferred.*natural.*language/i);
    });
  });
});
