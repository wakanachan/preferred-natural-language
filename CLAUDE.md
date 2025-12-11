# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo** for a cross-platform natural language preference detection tool that supports both **Claude Code** and **Gemini CLI** environments. The project uses **npm workspaces** to manage three packages that share a common core library.

## Architecture

### Monorepo Structure
- `packages/shared/` - **Core detection library** (`@preferred-natural-language/shared`)
  - Contains the language detection algorithm with 5-level priority chain
  - Exports `LanguageDetector` class and type definitions
  - Platform-agnostic and reusable

- `packages/cli/` - **CLI package + MCP server** (`@preferred-natural-language/cli`)
  - **CLI commands**: detect, set, show, list (Commander.js)
  - **i18n system**: 10 languages (en, zh-CN, ja, ko, ru, pt, es, fr, de) + bilingual fallback
  - **MCP server**: Provides Resource (`language://preference`), Prompt, and Tools
  - **Utilities**: Language display formatting with box drawing characters
  - Depends on `@preferred-natural-language/shared`

- `packages/claude-plugin/` - **Claude Code plugin** (`@preferred-natural-language/claude-plugin`)
  - **Lightweight wrapper** - delegates to CLI package
  - Slash commands (`.md` files) instruct AI to use MCP tools
  - `.mcp.json` configures MCP server startup
  - `scripts/start-mcp.js` - Smart launcher (global install → npx fallback)
  - No source code - pure configuration layer

- `packages/gemini-extension/` - **Gemini CLI extension** (`@preferred-natural-language/gemini-extension`)
  - **Lightweight wrapper** - delegates to CLI package
  - `GEMINI.md` - Context file for auto-language detection at session start
  - `gemini-extension.json` - Extension metadata and MCP config
  - `scripts/start-mcp.js` - Smart launcher (same as Claude plugin)
  - No source code - pure configuration layer

### Detection Priority Chain (Important!)

The language detection follows a strict 5-level priority:

1. **Configuration File** (`.preferred-language.json`) - HIGHEST priority
2. **Custom Environment Variables** (`GEMINI_CLI_NATURAL_LANGUAGE`, `CLAUDE_CODE_NATURAL_LANGUAGE`)
3. **OS Locale** (via `os-locale` package)
4. **Standard Environment Variables** (`LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`)
5. **HTTP Accept-Language** (for web environments)
6. **Fallback** (`en-US`) - LOWEST priority

This priority order is critical and is enforced in `packages/shared/src/languageDetector.ts:15-43`.

### MCP Integration (Model Context Protocol)

The CLI package includes a comprehensive MCP server implementation (`packages/cli/src/mcp/server.ts`) that enables automatic language detection in AI assistants.

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

1. **Claude Code**: `plugin.json` description instructs AI to access `language://preference` Resource at session start
2. **Gemini CLI**: `GEMINI.md` context file provides explicit instructions for AI to check language preference
3. **MCP Resource Subscription**: Server notifies clients when language preference changes

**Implementation**: The MCP server is started by smart launchers (`scripts/start-mcp.js`) that try global install first, then fall back to `npx -p @preferred-natural-language/cli pnl-mcp`.

### i18n System

The CLI package includes a complete internationalization system (`packages/cli/src/i18n/`) supporting 10 languages.

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

**Implementation**: Locale files are in `packages/cli/src/i18n/locales/`, with `I18n` class handling message lookup and parameter replacement.

## Development Commands

### Building
```bash
# Build all packages (runs shared -> cli in order)
npm run build

# Build individual packages
npm run build:shared       # Build core detection library
npm run build:cli          # Build CLI package (includes MCP server)
```

**Important**:
- Always build `shared` package first as it's a dependency for the CLI package
- Claude/Gemini plugins are lightweight configuration layers - no build required
- The build process uses TypeScript with ES2022 modules

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
- **Unit tests**: Located in `packages/*/__tests__/unit/` - test individual functions and classes
- **Integration tests**: Located in `packages/*/__tests__/integration/` - test CLI workflow and MCP integration
- **E2E tests**: Located in `packages/*/__tests__/e2e/` - test complete workflows across packages
- **Test infrastructure**:
  - `__tests__/helpers/mockFactory.ts` - Centralized mock creation for LanguageDetector and I18n
  - `__tests__/setup.ts` - Test environment setup and teardown
  - `__mocks__/@preferred-natural-language/shared.ts` - Manual mock for workspace package isolation
- **Current coverage** (Phase 2B completed):
  - **65+ test cases** covering commands, i18n, utilities, and CLI integration
  - **100% statement coverage** for tested modules
  - **72.72% branch coverage** (branches: 40% global, higher for critical paths)
  - **100% function and line coverage** for core functionality
- **Coverage requirements**: 85%+ for functions, lines, statements; 80%+ for branches (target for Phase 4)
- Jest is configured with ES modules support (`preset: 'ts-jest/presets/default-esm'` in jest.config.ts)

### Development Mode
```bash
# Watch mode for development
npm run dev:shared    # Watch and rebuild shared package
npm run dev:cli       # Watch and rebuild CLI package

# Run CLI locally without global install
node packages/cli/dist/cli/index.js detect
node packages/cli/dist/cli/index.js --help

# Test MCP server locally
node packages/cli/dist/mcp/server.js
# Or use the CLI package's pnl-mcp command
npx -p @preferred-natural-language/cli pnl-mcp
```

### Running a Single Test
```bash
# Run a specific test file
npx jest packages/cli/__tests__/unit/commands/detect.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="should detect from config file"

# Run a specific test suite in watch mode
npx jest packages/cli/__tests__/unit/i18n/i18n.test.ts --watch

# Run CLI integration tests
npx jest packages/cli/__tests__/integration/cli.integration.test.ts
```

## Key Technical Details

### TypeScript Configuration
- **Module System**: ES2022 modules (`type: "module"` in all package.json files)
- **Target**: ES2022
- **Strict mode**: Enabled
- All packages extend the root `tsconfig.json`

### ES Modules Gotchas
- Import statements MUST include `.js` extension: `import { foo } from './bar.js'` (not `.ts`)
- This is because TypeScript outputs `.js` files but doesn't rewrite import paths
- Jest is configured to handle this via `moduleNameMapper` in `jest.config.ts`

### Workspace Dependencies
When one package depends on another workspace package:
```json
{
  "dependencies": {
    "@preferred-natural-language/shared": "file:../shared"
  }
}
```

After modifying dependencies, run `npm install` at the root to update workspace links.

### Language Detection Implementation

The core detection logic is in `packages/shared/src/languageDetector.ts`. Key methods:

- `detect()` - Main entry point, tries all detection methods in priority order
- `checkConfigFile()` - Searches for `.preferred-language.json` in predefined paths
- `checkCustomEnvironment()` - Checks `GEMINI_CLI_NATURAL_LANGUAGE` and `CLAUDE_CODE_NATURAL_LANGUAGE`
- `checkOSLocale()` - Uses `os-locale` package for system language
- `checkStandardEnvironment()` - Checks POSIX environment variables
- `normalizeLanguageTag()` - Converts locale formats (e.g., `zh_CN.UTF-8`) to BCP-47 (e.g., `zh-CN`)

**Never fail**: The detector always returns a result, even on errors (falls back to `en-US`).

### MCP Server Implementation

The MCP server is in `packages/cli/src/mcp/server.ts`. Key features:

- **Resource Registration**: `language://preference` with auto-subscription capability
- **Tool Validation**: `set-language` tool validates against `SUPPORTED_LANGUAGES` from shared package
- **Error Handling**: Tools return `{ success: false, error: string, message: string }` on validation failures
- **JSON Output**: All tools return JSON for machine-readable responses
- **Stdio Communication**: Server uses `stdio` transport for integration with Claude/Gemini

**Testing**: MCP integration tests will be in `packages/cli/__tests__/integration/mcp.integration.test.ts` (Phase 3B).

### i18n Implementation

The i18n system is in `packages/cli/src/i18n/`. Key classes:

- **I18n class** (`index.ts`):
  - Constructor: `new I18n(language: string, confidence: 'high' | 'medium' | 'low')`
  - `t(key: string, params?: Record<string, string>)` - Translate with parameter substitution
  - `isBilingual()` - Returns true when confidence is "low"
  - Automatic locale loading from `locales/` directory

- **Locale files** (`locales/{language}.json`):
  - Nested JSON structure: `{ "detect": { "result": "..." } }`
  - Parameter placeholders: `"Detected language: {{languageName}} ({{language}})"`
  - Fallback chain: requested locale → base language (e.g., `en-US` → `en`) → English

**Bilingual mode**: When confidence is "low", commands automatically output in both detected language and English to ensure understanding.

### Configuration File Format
```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

File is searched in paths defined in `packages/shared/src/config.ts:CONFIG_SEARCH_PATHS`.

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
7. **CLI integration testing**:
   - Use `execAsync` to spawn actual CLI processes
   - Test both stdout and stderr
   - Verify exit codes for success and error cases
   - Use 10-second timeouts for process spawning
8. **Manual mocking for workspace packages**:
   - Create manual mocks in `__mocks__/@preferred-natural-language/` for better isolation
   - Manual mocks prevent shared package changes from breaking CLI tests
   - Map mocks in `jest.config.ts` using `moduleNameMapper`

## Git Workflow

### Commit Messages
All commit messages should be in **Chinese** with the following format:
```
feat: 添加新功能的简短描述

- 详细说明点 1
- 详细说明点 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Prefix types: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`

### Version Management

This project follows **Semantic Versioning 2.0.0** (https://semver.org/):

**Version Format**: `MAJOR.MINOR.PATCH`

**Version Increment Rules**:
- **MAJOR** (X.0.0): Increment when making incompatible API changes or major architecture refactoring
  - Examples: Breaking API changes, complete architecture overhaul, incompatible dependency updates
- **MINOR** (0.X.0): Increment when adding functionality in a backward compatible manner
  - Examples: New features, new command/tool additions, significant enhancements
- **PATCH** (0.0.X): Increment when making backward compatible bug fixes
  - Examples: Bug fixes, documentation updates, minor improvements

**Version History**:
- **1.0.0** (Initial Release): Basic project structure with language detection
- **2.0.0** (Current): Major architecture refactoring and feature additions
  - Complete Monorepo migration with npm workspaces
  - New CLI package with i18n system (10 languages)
  - MCP server implementation with Resource/Prompt/Tools
  - Lightweight plugin layer for Claude Code and Gemini CLI
  - Comprehensive test coverage (99 tests, 85%+ coverage)
  - Gemini CLI extension slash commands
  - Bug fixes: MCP inputSchema format

**When to Update Versions**:
1. Update version in all `package.json` files simultaneously:
   - Root `package.json`
   - `packages/shared/package.json`
   - `packages/cli/package.json`
   - `packages/claude-plugin/package.json`
   - `packages/gemini-extension/package.json`
   - `packages/gemini-extension/gemini-extension.json`

2. Update `peerDependencies` in plugin packages to match CLI version

3. Update this CLAUDE.md file's "Version History" section with:
   - Version number
   - Release date
   - Summary of changes
   - Breaking changes (if MAJOR version)

4. Create a git tag after version update:
   ```bash
   git tag -a v2.0.0 -m "Release version 2.0.0"
   git push origin v2.0.0
   ```

**Example Version Update Workflow**:
```bash
# 1. Update all package.json files (MAJOR version bump example)
# Edit: package.json, packages/*/package.json, gemini-extension.json
# Change version from 2.0.0 -> 3.0.0
# Update peerDependencies: "^2.0.0" -> "^3.0.0"

# 2. Update CLAUDE.md Version History
# Add entry for v3.0.0 with changes

# 3. Commit version update
git add -A
git commit -m "chore: bump version to 3.0.0

- 更新所有包版本号
- 更新 peerDependencies
- 更新版本历史

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 4. Create and push tag
git tag -a v3.0.0 -m "Release version 3.0.0"
git push origin v3.0.0
git push
```

### Line Endings
- **Always use LF** (not CRLF)
- Enforced via `.gitattributes`
- `core.autocrlf` is set to `false`

## Common Issues

### TypeScript Import Errors
If you see "Cannot find module" errors:
1. Check that imports use `.js` extension (not `.ts`)
2. Ensure the imported file exists
3. Run `npm run build` in the dependency package first

### Test Failures After Changes
1. Clear Jest cache: `npx jest --clearCache`
2. Rebuild packages: `npm run build`
3. Reinstall dependencies: `npm install`

### Workspace Dependency Issues
If workspace packages aren't linking:
```bash
npm install          # At root
npm run build:shared # Build shared package first
```

### MCP Server Not Starting
If the MCP server fails to start:
1. Verify CLI package is installed globally: `npm list -g @preferred-natural-language/cli`
2. Try using npx fallback: `npx -p @preferred-natural-language/cli pnl-mcp`
3. Check MCP server logs in Claude/Gemini console
4. Verify `scripts/start-mcp.js` has execute permissions

### i18n Messages Not Loading
If translations are not working:
1. Ensure locale file exists in `packages/cli/src/i18n/locales/`
2. Check locale file is valid JSON
3. Verify message key exists in the locale file
4. Rebuild CLI package: `npm run build:cli`
5. Test with: `node packages/cli/dist/cli/index.js detect`

### Jest ES Module Errors
If Jest fails to parse ES modules:
1. Ensure `jest.config.ts` uses `preset: 'ts-jest/presets/default-esm'`
2. Check `package.json` has `"type": "module"`
3. Create manual mocks in `__mocks__/` for workspace packages
4. Clear Jest cache: `npx jest --clearCache`

## Package Publishing

```bash
# Publish all packages to npm
npm run publish
```

This publishes all workspace packages with `--access public` flag.

## CI/CD

GitHub Actions workflows are in `.github/workflows/`:
- `ci.yml` - Main CI pipeline
- `test.yml` - Test suite execution
- `code-quality.yml` - Linting and type checking
- `publish.yml` - Package publishing

All workflows run on push to main and on pull requests.
