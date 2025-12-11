# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **single-package** cross-platform natural language preference detection tool that supports both **Claude Code** and **Gemini CLI** environments. The package `@preferred-natural-language/cli` provides CLI commands, MCP server, and integrations for AI assistants.

## Architecture

### Project Structure
```
preferred-natural-language/
├── src/                       # Source code
│   ├── languageDetector.ts    # Core detection algorithm
│   ├── types.ts               # Type definitions
│   ├── config.ts              # Configuration constants
│   ├── languageNames.ts       # Supported languages mapping
│   ├── index.ts               # Unified exports
│   ├── cli/                   # CLI commands (Commander.js)
│   ├── mcp/                   # MCP server implementation
│   └── i18n/                  # Internationalization (10 languages)
├── bin/
│   └── pnl.js                 # Single CLI entry point
├── __tests__/                 # Test suites
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   ├── e2e/                   # End-to-end tests
│   └── helpers/               # Test utilities
├── .claude-plugin/            # Claude Code plugin (marketplace structure)
│   ├── marketplace.json       # Marketplace configuration
│   └── pnl/                   # Plugin root directory
│       ├── .claude-plugin/plugin.json
│       ├── .mcp.json          # MCP server configuration
│       ├── commands/          # Slash commands (.md files)
│       ├── agents/            # Agent definitions
│       └── scripts/start-mcp.js
├── scripts/                   # Shared scripts
│   └── start-mcp.js           # MCP launcher for Gemini
├── gemini-extension.json      # Gemini CLI extension manifest
├── GEMINI.md                  # Gemini context file
├── commands/                  # Gemini slash commands (.toml)
├── package.json               # Package configuration
└── tsconfig.json              # TypeScript configuration
```

### Detection Priority Chain (Important!)

The language detection follows a strict 5-level priority:

1. **Configuration File** (`.preferred-language.json`) - HIGHEST priority
2. **Custom Environment Variables** (`GEMINI_CLI_NATURAL_LANGUAGE`, `CLAUDE_CODE_NATURAL_LANGUAGE`)
3. **OS Locale** (via `os-locale` package)
4. **Standard Environment Variables** (`LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`)
5. **HTTP Accept-Language** (for web environments)
6. **Fallback** (`en-US`) - LOWEST priority

This priority order is critical and is enforced in `src/languageDetector.ts:15-43`.

### MCP Integration (Model Context Protocol)

The MCP server implementation (`src/mcp/server.ts`) enables automatic language detection in AI assistants.

#### MCP Capabilities

**Resource** (auto-loaded at session start):
- `language://preference` - Returns user's language preference as JSON
  ```json
  {
    "language": "zh-CN",
    "languageName": "简体中文 (Simplified Chinese)",
    "source": "os-locale",
    "confidence": "high"
  }
  ```
- **Resource Subscription**: Server declares `subscribe: true, listChanged: true` for auto-updates

**Prompt**:
- `use-preferred-language` - Generates AI instruction to communicate in detected language

**Tools** (callable by AI):
- `detect-language` - Detect current language preference
- `set-language(language, fallback?)` - Create/update `.preferred-language.json` with validation
- `list-languages()` - List all 70+ supported languages and regional variants

#### Auto-Language Detection

Both Claude and Gemini plugins enable automatic language detection:

1. **Claude Code**: Plugin's `plugin.json` description instructs AI to access `language://preference` Resource at session start
2. **Gemini CLI**: `GEMINI.md` context file provides explicit instructions for AI to check language preference
3. **MCP Resource Subscription**: Server notifies clients when language preference changes

**Implementation**: The MCP server is started via `pnl mcp` subcommand. Smart launchers (`scripts/start-mcp.js`) try global install first, then fall back to `npx @preferred-natural-language/cli mcp`.

### i18n System

The CLI includes a complete internationalization system (`src/i18n/`) supporting 10 languages.

#### Supported i18n Languages
- English (`en`, `en-US`, `en-GB`)
- Simplified Chinese (`zh-CN`)
- Japanese (`ja-JP`)
- Korean (`ko-KR`)
- Russian (`ru-RU`)
- Portuguese (`pt-BR`, `pt-PT`)
- Spanish (`es-ES`)
- French (`fr-FR`)
- German (`de-DE`)

#### Features
- **Automatic locale selection**: Based on detected language preference
- **Parameter substitution**: `i18n.t('detect.result', { languageName: '简体中文', language: 'zh-CN' })`
- **Bilingual fallback**: When detection confidence is "low", CLI outputs in both detected language and English
- **Graceful fallback**: Unsupported locales default to English

**Implementation**: Locale files are in `src/i18n/locales/`, with `I18n` class handling message lookup and parameter replacement.

## Development Commands

### Building
```bash
# Build the project
npm run build
```

**Important**:
- The build process uses TypeScript with ES2022 modules
- Output goes to `dist/` directory

### Testing

```bash
# Run all tests (unit + integration + e2e)
npm test

# Run specific test suites
npm run test:unit           # Fast unit tests only
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Run tests suitable for PR validation
npm run test:pr            # unit + integration only (fast)
```

### Testing Strategy
- **Unit tests**: Located in `__tests__/unit/` - test individual functions and classes
- **Integration tests**: Located in `__tests__/integration/` - test CLI workflow and MCP integration
- **E2E tests**: Located in `__tests__/e2e/` - test complete workflows
- **Test infrastructure**:
  - `__tests__/helpers/mockFactory.ts` - Centralized mock creation for LanguageDetector and I18n
  - `__tests__/setup.ts` - Test environment setup and teardown
- Jest is configured with ES modules support (`preset: 'ts-jest/presets/default-esm'`)

### Development Mode
```bash
# Run CLI locally without global install
node dist/cli/index.js detect
node dist/cli/index.js --help

# Test MCP server locally
node dist/mcp/server.js
# Or use the CLI's mcp subcommand
node bin/pnl.js mcp
```

### Running a Single Test
```bash
# Run a specific test file
npx jest __tests__/unit/languageDetector.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="should detect from config file"

# Run a specific test suite in watch mode
npx jest __tests__/unit/i18n.test.ts --watch
```

## Key Technical Details

### TypeScript Configuration
- **Module System**: ES2022 modules (`type: "module"` in package.json)
- **Target**: ES2022
- **Strict mode**: Enabled

### ES Modules Gotchas
- Import statements MUST include `.js` extension: `import { foo } from './bar.js'` (not `.ts`)
- This is because TypeScript outputs `.js` files but doesn't rewrite import paths
- Jest is configured to handle this via `moduleNameMapper` in `jest.config.ts`

### Language Detection Implementation

The core detection logic is in `src/languageDetector.ts`. Key methods:

- `detect()` - Main entry point, tries all detection methods in priority order
- `checkConfigFile()` - Searches for `.preferred-language.json` in predefined paths
- `checkCustomEnvironment()` - Checks `GEMINI_CLI_NATURAL_LANGUAGE` and `CLAUDE_CODE_NATURAL_LANGUAGE`
- `checkOSLocale()` - Uses `os-locale` package for system language
- `checkStandardEnvironment()` - Checks POSIX environment variables
- `normalizeLanguageTag()` - Converts locale formats (e.g., `zh_CN.UTF-8`) to BCP-47 (e.g., `zh-CN`)

**Never fail**: The detector always returns a result, even on errors (falls back to `en-US`).

### MCP Server Implementation

The MCP server is in `src/mcp/server.ts`. Key features:

- **Resource Registration**: `language://preference` with auto-subscription capability
- **Tool Validation**: `set-language` tool validates against `SUPPORTED_LANGUAGES`
- **Error Handling**: Tools return `{ success: false, error: string, message: string }` on validation failures
- **JSON Output**: All tools return JSON for machine-readable responses
- **Stdio Communication**: Server uses `stdio` transport for integration with Claude/Gemini

### i18n Implementation

The i18n system is in `src/i18n/`. Key classes:

- **I18n class** (`index.ts`):
  - Constructor: `new I18n(language: string, confidence: 'high' | 'medium' | 'low')`
  - `t(key: string, params?: Record<string, string>)` - Translate with parameter substitution
  - `isBilingual()` - Returns true when confidence is "low"
  - Automatic locale loading from `locales/` directory

- **Locale files** (`locales/{language}.ts`):
  - Nested structure: `{ detect: { result: "..." } }`
  - Parameter placeholders: `"Detected language: {languageName} ({language})"`
  - Fallback chain: requested locale → base language (e.g., `en-US` → `en`) → English

**Bilingual mode**: When confidence is "low", commands automatically output in both detected language and English to ensure understanding.

### Configuration File Format
```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

File is searched in paths defined in `src/config.ts:CONFIG_SEARCH_PATHS`.

## Testing Best Practices

1. **Mock external dependencies**: Use `jest.mock()` for `os-locale` and `fs` operations
2. **Test isolation**: Each test should set up and tear down its environment
3. **Priority testing**: Always test that higher priority sources override lower priority ones
4. **Error handling**: Test that errors don't crash detection, always return fallback
5. **Concurrent requests**: Language detector must be safe for concurrent calls
6. **i18n testing**:
   - Test at least 3 languages (English, Chinese, and one other) for each message key
   - Test parameter substitution with various values
   - Test bilingual mode (low confidence) outputs both languages
   - Test fallback behavior for unsupported locales

## Git Workflow

### ⚠️ 重要规则：推送到远程仓库前必须获得确认

**在执行任何 git push 命令之前，必须先获得用户的明确确认。** 这包括：
- git push
- git push --force
- git push --force-with-lease
- 任何其他推送到远程仓库的命令

如果用户没有明确表示要推送，绝不执行推送操作。

### Commit Messages
All commit messages should be in **Chinese** with the following format:
```
feat: 添加新功能的简短描述

- 详细说明点 1
- 详细说明点 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Prefix types: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`

### Version Management

This project follows **Semantic Versioning 2.0.0** (https://semver.org/):

**Version Format**: `MAJOR.MINOR.PATCH`

**Current Version**: 3.0.0

**Version History**:
- **1.0.0** (Initial Release): Basic project structure with language detection
- **2.0.0**: Monorepo migration with npm workspaces, MCP server, i18n system
- **3.0.0** (Current): Simplified to single-package structure
  - Merged shared and cli packages
  - Removed pnl-mcp command (use `pnl mcp` instead)
  - Claude plugin uses marketplace structure
  - Gemini extension at root level

### Line Endings
- **Always use LF** (not CRLF)
- Enforced via `.gitattributes`
- `core.autocrlf` is set to `false`

## Common Issues

### TypeScript Import Errors
If you see "Cannot find module" errors:
1. Check that imports use `.js` extension (not `.ts`)
2. Ensure the imported file exists
3. Run `npm run build` first

### Test Failures After Changes
1. Clear Jest cache: `npx jest --clearCache`
2. Rebuild: `npm run build`
3. Reinstall dependencies: `npm install`

### MCP Server Not Starting
If the MCP server fails to start:
1. Verify CLI package is installed globally: `npm list -g @preferred-natural-language/cli`
2. Try using npx fallback: `npx @preferred-natural-language/cli mcp`
3. Check MCP server logs in Claude/Gemini console

### i18n Messages Not Loading
If translations are not working:
1. Ensure locale file exists in `src/i18n/locales/`
2. Check locale file is valid TypeScript
3. Verify message key exists in the locale file
4. Rebuild: `npm run build`

### Jest ES Module Errors
If Jest fails to parse ES modules:
1. Ensure `jest.config.ts` uses `preset: 'ts-jest/presets/default-esm'`
2. Check `package.json` has `"type": "module"`
3. Clear Jest cache: `npx jest --clearCache`

## Package Publishing

```bash
# Publish to npm
npm publish --access public
```

## CI/CD

GitHub Actions workflows are in `.github/workflows/`:
- `ci.yml` - Main CI pipeline
- `test.yml` - Test suite execution
- `code-quality.yml` - Linting and type checking
- `publish.yml` - Package publishing

All workflows run on push to main and on pull requests.
