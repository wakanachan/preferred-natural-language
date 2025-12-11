#!/usr/bin/env node
import { spawn, execSync } from 'child_process';

/**
 * 智能启动 MCP 服务器
 * 1. 优先使用全局安装的 pnl-mcp（快速启动）
 * 2. 如果未找到，使用 npx -p @preferred-natural-language/cli pnl-mcp（自动下载）
 */

console.error('[MCP Launcher] Starting preferred-natural-language MCP server...');

// 检查全局安装的 pnl-mcp
try {
  const which = process.platform === 'win32' ? 'where' : 'which';
  execSync(`${which} pnl-mcp`, { stdio: 'ignore' });

  console.error('[MCP Launcher] Using globally installed pnl-mcp');
  const child = spawn('pnl-mcp', [], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} catch (error) {
  // 全局命令未找到，使用 npx
  console.error('[MCP Launcher] Global pnl-mcp not found, falling back to npx...');
  console.error('[MCP Launcher] First run may take a moment to download...');

  const child = spawn('npx', ['-y', '-p', '@preferred-natural-language/cli', 'pnl-mcp'], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  child.on('error', (err) => {
    console.error('[MCP Launcher] Failed to start MCP server:', err.message);
    console.error('[MCP Launcher] Please install the CLI: npm install -g @preferred-natural-language/cli');
    process.exit(1);
  });
}
