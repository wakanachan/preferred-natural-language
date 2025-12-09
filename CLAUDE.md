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

- `packages/claude-plugin/` - **Claude Code plugin** (`@preferred-natural-language/claude-plugin`)
  - CLI commands: detect, set, show, list
  - Depends on `@preferred-natural-language/shared`

- `packages/gemini-extension/` - **Gemini CLI MCP extension** (`@preferred-natural-language/gemini-extension`)
  - MCP server implementation for Gemini CLI
  - Exposes language detection as MCP resources and prompts
  - Depends on `@preferred-natural-language/shared`

### Detection Priority Chain (Important!)

The language detection follows a strict 5-level priority:

1. **Configuration File** (`.preferred-language.json`) - HIGHEST priority
2. **Custom Environment Variables** (`GEMINI_CLI_NATURAL_LANGUAGE`, `CLAUDE_CODE_NATURAL_LANGUAGE`)
3. **OS Locale** (via `os-locale` package)
4. **Standard Environment Variables** (`LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`)
5. **HTTP Accept-Language** (for web environments)
6. **Fallback** (`en-US`) - LOWEST priority

This priority order is critical and is enforced in `packages/shared/src/languageDetector.ts:15-43`.

## Development Commands

### Building
```bash
# Build all packages (runs shared -> claude -> gemini in order)
npm run build

# Build individual packages
npm run build:shared
npm run build:claude
npm run build:gemini
```

**Important**: Always build `shared` package first as it's a dependency for the other two packages.

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
- **Unit tests**: Located in `packages/*/__tests__/` - test individual functions and classes
- **Integration tests**: Test package interactions
- **E2E tests**: Test complete workflows across packages
- **Coverage requirements**: 85%+ for functions, lines, statements; 80%+ for branches
- Jest is configured with ES modules support (`type: "module"` in package.json)

### Development Mode
```bash
# Watch mode for development
npm run dev:shared    # Watch and rebuild shared package
npm run dev:claude    # Watch and rebuild Claude plugin
npm run dev:gemini    # Watch and rebuild Gemini extension
```

### Running a Single Test
```bash
# Run a specific test file
npx jest packages/shared/__tests__/languageDetector.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="should detect from config file"

# Run a specific test suite in watch mode
npx jest packages/shared/__tests__/languageDetector.test.ts --watch
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
2. **Test isolation**: Each test should set up and tear down its environment (see `test/setup.ts`)
3. **Priority testing**: Always test that higher priority sources override lower priority ones
4. **Error handling**: Test that errors don't crash detection, always return fallback
5. **Concurrent requests**: Language detector must be safe for concurrent calls

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
