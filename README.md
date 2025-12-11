# Preferred Natural Language

[![npm version](https://badge.fury.io/js/%40preferred-natural-language%2Fcli.svg)](https://badge.fury.io/js/%40preferred-natural-language%2Fcli)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/wakanachan/preferred-natural-language)

A cross-platform natural language preference detection tool for AI assistants through MCP (Model Context Protocol).

## 🌐 Languages

- 🇺🇸 **English** ← Current
- 🇨🇳 **[简体中文](README.zh.md)**

## ✨ Key Features

- 🤖 **Automatic Language Detection**: AI automatically communicates in your preferred language
- 🔌 **MCP Integration**: Seamless integration with Claude Code and Gemini CLI
- 🎯 **Priority Chain Detection**: 5-level detection priority system
- 🌍 **70+ Languages**: Comprehensive language and regional variant support
- 🔧 **Multiple Detection Methods**: Config files, environment variables, OS locale
- 📝 **Full i18n**: CLI output in 10 languages (en, zh, ja, ko, ru, pt, es, fr, de)
- 🧪 **100% Tested**: 100+ test cases, high coverage

## 🚀 Quick Start

### Installation

```bash
# Install globally (recommended)
npm install -g @preferred-natural-language/cli

# Or use with npx (no installation)
npx @preferred-natural-language/cli detect
```

### CLI Usage

```bash
# Detect current language preference
pnl detect

# Set language preference
pnl set zh-CN

# Show detailed information
pnl show

# List all supported languages
pnl list

# Start MCP server (for programmatic use)
pnl mcp
```

### MCP Integration

#### For Claude Code

1. **Install the plugin**:

   **From Marketplaces**:
   ```bash
   /plugin marketplace add wakanachan/preferred-natural-language
   /plugin install pnl@pnl-dev-marketplace
   ```

   **For Local Development**:
   ```bash
   # Clone the repository
   git clone https://github.com/wakanachan/preferred-natural-language
   cd preferred-natural-language

   # Install as local marketplace
   /plugin marketplace add ./
   /plugin install preferred-natural-language@pnl-dev-marketplace
   ```

2. **Restart Claude Code** to load the plugin (required after installation)

3. **Automatic Language Detection**:
   - Claude Code automatically detects and uses your preferred language
   - Access language preference via MCP Resource: `language://preference`
   - Use MCP tools: `detect-language`, `set-language`, `list-languages`

4. **Available Slash Commands**:
   ```
   /pnl:detect-language   # Detect current language preference
   /pnl:set-language      # Set language preference (e.g., zh-CN, ja-JP)
   /pnl:list-languages    # List all 70+ supported languages
   ```

#### For Gemini CLI

1. **Install the extension**:

   **From Github**:
   ```bash
   gemini extensions install https://github.com/wakanachan/preferred-natural-language
   ```

   **For Local Development**:
   ```bash
   # Clone the repository
   git clone https://github.com/wakanachan/preferred-natural-language
   cd preferred-natural-language

   # Install from local path (root directory contains gemini-extension.json)
   gemini extensions install .

   # Or use link command
   gemini extensions link .
   ```

2. **Restart Gemini CLI** to load the extension (changes only apply on restart)

3. **Update Extension** (when updates are available):
   ```bash
   # Update specific extension
   gemini extensions update preferred-natural-language

   # Or update all extensions at once
   gemini extensions update --all
   ```

4. **Automatic Language Detection**:
   - Gemini automatically detects your preferred language at session start
   - The extension provides context through `GEMINI.md`
   - MCP server provides language tools and resources

5. **Available Slash Commands**:
   ```
   /detect-language   # Detect current language preference
   /set-language      # Set language preference (e.g., zh-CN, ja-JP)
   /list-languages    # List all 70+ supported languages
   ```

#### General MCP Server Configuration

For users who prefer not to install plugins, you can configure the MCP server manually in any MCP-compatible client.

**Using npx**

Add this configuration to your MCP client settings:

```json
{
  "mcpServers": {
    "pnl-mcp": {
      "command": "npx",
      "args": [
        "@preferred-natural-language/cli",
        "mcp"
      ],
      "env": {}
    }
  }
}
```

For Windows

```json
{
  "mcpServers": {
    "pnl-mcp": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "@preferred-natural-language/cli",
        "mcp"
      ],
      "env": {}
    }
  }
}
```

**Using Global Installation**

If you have installed the package globally:

```bash
npm install -g @preferred-natural-language/cli
```

Then configure your MCP client with:

```json
{
  "mcpServers": {
    "pnl-mcp": {
      "command": "pnl",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

**Standalone Usage**

You can also run the MCP server directly for testing:

```bash
# Using npx (no installation required)
npx @preferred-natural-language/cli mcp

# Or if installed globally
pnl mcp
```

The server provides the same MCP capabilities via stdio communication:
- **Resource**: `language://preference` - Auto-loaded language preference
- **Prompt**: `use-preferred-language` - AI language instruction
- **Tools**: `detect-language`, `set-language`, `list-languages`

## 🌍 Supported Languages (70+)

We support **70+ languages and regional variants**, with **full i18n output** for 10 major languages:

### CLI Output Languages (Full i18n)

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en`, `en-US`, `en-GB` | English |
| Chinese (Simplified) | `zh-CN` | 简体中文 |
| Japanese | `ja-JP` | 日本語 |
| Korean | `ko-KR` | 한국어 |
| Russian | `ru-RU` | Русский |
| Portuguese | `pt-BR`, `pt-PT` | Português |
| Spanish | `es-ES` | Español |
| French | `fr-FR` | Français |
| German | `de-DE` | Deutsch |

### All Supported Languages

View the [complete list of 70+ supported languages →](./docs/LANGUAGES.md)

## 🔍 Detection Priority Chain

The tool detects language preferences using a strict 5-level priority:

1. **🥇 Configuration File** (`.preferred-language.json`) - Highest priority
2. **🥈 Custom Environment Variables**
   - `CLAUDE_CODE_NATURAL_LANGUAGE`
   - `GEMINI_CLI_NATURAL_LANGUAGE`
3. **🥉 OS Locale Settings** (via `os-locale` package)
4. **🏅 Standard Environment Variables**
   - Priority: `LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`
5. **🌐 HTTP Accept-Language Header** (for web environments)
6. **🏁 Fallback** (`en-US`) - Lowest priority

## 📁 Configuration

### Configuration File (Highest Priority)

Create `.preferred-language.json` in your project root:

```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

### Environment Variables

```bash
# Platform-specific (priority 2)
export CLAUDE_CODE_NATURAL_LANGUAGE="zh-CN"
export GEMINI_CLI_NATURAL_LANGUAGE="ja-JP"
# others（coming soon）

# Standard Unix variables (priority 4)
export LANGUAGE="zh_CN:en_US"
export LC_ALL="zh_CN.UTF-8"
export LANG="zh_CN.UTF-8"
```

### Using CLI

```bash
# Create config file interactively
pnl set zh-CN

# This creates .preferred-language.json with:
# { "language": "zh-CN", "fallback": "en-US" }
```

## 🏗️ Architecture

### Project Structure

```
preferred-natural-language/
├── src/                          # Source code
│   ├── languageDetector.ts       # Core 5-level priority detection
│   ├── types.ts                  # Type definitions
│   ├── languageNames.ts          # 70+ language mappings
│   ├── config.ts                 # Configuration paths
│   ├── index.ts                  # Unified exports
│   ├── cli/                      # CLI commands (Commander.js)
│   │   ├── commands/             # detect, set, show, list, mcp
│   │   ├── utils/                # Display utilities
│   │   └── index.ts              # CLI entry point
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts              # I18n class
│   │   └── locales/              # 10 language files
│   └── mcp/                      # MCP server
│       └── server.ts             # Resource + Prompt + Tools
├── bin/
│   └── pnl.js                    # CLI entry point
├── __tests__/                    # Test suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── .claude-plugin/               # Claude Code marketplace config
│   └── marketplace.json          # Points to ./claude-code-plugin
├── claude-code-plugin/           # Claude Code plugin
│   ├── .claude-plugin/plugin.json
│   ├── .mcp.json                 # MCP server config
│   ├── agents/                   # Agent definitions
│   ├── commands/                 # Slash commands
│   └── scripts/start-mcp.js      # Smart MCP launcher
├── gemini-extension.json         # Gemini CLI extension manifest
├── GEMINI.md                     # Gemini context file
├── commands/                     # Gemini slash commands (.toml)
└── scripts/start-mcp.js          # Shared MCP launcher
```

### Design Philosophy

- **Single Package**: All code in `@preferred-natural-language/cli`
- **Lightweight Plugins**: Claude/Gemini integrations are configuration layers
- **Smart Launchers**: Plugins use `pnl mcp` subcommand via smart launchers
- **No Code Duplication**: Plugin layers delegate to CLI package

## 🧪 Testing

### Run Tests

```bash
# All tests (unit + integration + e2e)
npm test

# Specific test suites
npm run test:unit           # Fast unit tests
npm run test:integration    # Integration tests
npm run test:e2e            # End-to-end tests

# Development
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
npm run test:ci             # CI mode (no watch)
```

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/wakanachan/preferred-natural-language.git
cd preferred-natural-language

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Available Scripts

```bash
# Building
npm run build              # Build project

# Testing
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e           # E2E tests
npm run test:coverage      # With coverage
npm run test:pr            # PR validation (unit + integration)
```

## 📖 API Reference

### MCP Server API

The MCP server provides:

**Resource** (auto-loaded):
- `language://preference` - User's language preference (JSON)

**Prompt**:
- `use-preferred-language` - Generates language instruction for AI

**Tools**:
- `detect-language` - Detect current language
- `set-language(language, fallback?)` - Set language preference
- `list-languages()` - List all 70+ supported languages

### Type Definitions

```typescript
interface LanguageDetectionResult {
  language: string;           // BCP-47 code (e.g., 'zh-CN')
  source: DetectionSource;    // Detection source
  confidence: 'high' | 'medium' | 'low';
}

type DetectionSource =
  | `config-file:${string}`  // Config file path
  | 'GEMINI_CLI_NATURAL_LANGUAGE'
  | 'CLAUDE_CODE_NATURAL_LANGUAGE'
  | 'os-locale'
  | 'LANGUAGE' | 'LC_ALL' | 'LC_MESSAGES' | 'LANG'
  | 'HTTP_ACCEPT_LANGUAGE'
  | 'fallback';
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (Chinese commit messages preferred)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

```bash
git commit -m "feat: 添加新功能描述

- 详细说明 1
- 详细说明 2

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - For AI integration standards
- [Anthropic](https://www.anthropic.com/) - For Claude Code platform
- [Google](https://geminicli.com/) - For Gemini CLI platform
- [os-locale](https://github.com/sindresorhus/os-locale) - For cross-platform locale detection
- [Commander.js](https://github.com/tj/commander.js) - For CLI framework
- [TypeScript](https://www.typescriptlang.org/) - For type safety

## 📞 Support

- 🐛 [Report a Bug](https://github.com/wakanachan/preferred-natural-language/issues)
- 💡 [Request a Feature](https://github.com/wakanachan/preferred-natural-language/issues)
- 💬 [Discussions](https://github.com/wakanachan/preferred-natural-language/discussions)

---

<div align="center">
  <p>Made with ❤️ for the AI community</p>
  <p>Supporting <strong>Claude Code</strong> and <strong>Gemini CLI</strong></p>
</div>
