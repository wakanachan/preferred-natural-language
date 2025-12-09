# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server called "preferred-natural-language" that automatically detects the user's preferred natural language and provides it to Gemini. The extension uses a priority-based detection system to determine language preferences from environment variables, config files, and OS settings.

## Project Structure

```
.
├── gemini-extension.json          # Gemini extension configuration
├── GEMINI.md                      # Context file for Gemini
├── CLAUDE.md                      # This file
├── README.md                      # User-facing documentation
└── mcpserver/
    ├── package.json               # Dependencies: @modelcontextprotocol/sdk, os-locale, zod
    ├── tsconfig.json              # TypeScript configuration (ES2022 modules)
    ├── src/
    │   ├── index.ts               # MCP server entry point with stdio transport
    │   ├── languageDetector.ts    # Detection logic with 5-level priority chain
    │   ├── types.ts               # TypeScript interfaces
    │   └── config.ts              # Configuration constants
    └── dist/                      # Compiled JavaScript output
        └── index.js               # Entry point executed by Gemini
```

## MCP Server Configuration

The MCP server is configured in `gemini-extension.json`:
- **Server name**: preferredNaturalLanguage
- **Entry point**: `mcpserver/dist/index.js`
- **Runtime**: Node.js with ES2022 modules
- **Context file**: GEMINI.md

The server is invoked with:
```bash
node mcpserver/dist/index.js
```

## Architecture

### Language Detection Strategy

The `LanguageDetector` class implements a 5-level priority chain:

1. **Custom Environment Variables** (high confidence)
   - `GEMINI_CLI_NATURAL_LANGUAGE`
   - `CLAUDE_CODE_NATURAL_LANGUAGE`

2. **Configuration File** (high confidence)
   - Searches: `./.preferred-language.json`, `~/.config/preferred-language/config.json`, `%APPDATA%/preferred-language/config.json`

3. **OS Locale** (medium confidence)
   - Uses `os-locale` package for cross-platform detection

4. **Standard Environment Variables** (medium confidence)
   - `LANGUAGE`, `LC_ALL`, `LC_MESSAGES`, `LANG`

5. **Browser Accept-Language** (low confidence)
   - From `HTTP_ACCEPT_LANGUAGE` env var if present

6. **Fallback**: `en-US` (low confidence)

### MCP Protocol Implementation

The server exposes two MCP capabilities:

**1. Resource: `language://preference`**
- Returns JSON with detected language, source, confidence, and timestamp
- Machine-readable format for applications

**2. Prompt: `use-preferred-language`**
- Returns natural language instruction for the AI
- Maps language codes to human-readable names
- Includes detection metadata for transparency

### Cross-Platform Support

- **Windows**: Uses `%APPDATA%` for config, PowerShell/registry for OS locale
- **macOS**: Uses `~/.config` for config, `defaults read` for OS locale
- **Linux**: Uses `~/.config` (XDG spec), `locale` command for OS locale

## Development Commands

```bash
# Install dependencies
cd mcpserver && npm install

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean
```

## Key Implementation Details

### Error Handling
- Never throws errors - always returns a result
- Logs to stderr (not stdout - reserved for MCP protocol)
- Gracefully degrades to next detection method on failure

### Language Tag Normalization
- Converts `en_US` → `en-US` (BCP-47 format)
- Strips encoding suffixes like `.UTF-8`
- Handles both full tags (`zh-CN`) and base tags (`zh`)

### Dependencies
- `@modelcontextprotocol/sdk`: Official MCP TypeScript SDK
- `os-locale`: Cross-platform system locale detection
- `zod`: Schema validation (peer dependency for MCP SDK)

## Testing

Test the server with different configurations:

```bash
# Test with custom env var
GEMINI_CLI_NATURAL_LANGUAGE=ja-JP node mcpserver/dist/index.js

# Test with config file
echo '{"language": "ko-KR"}' > .preferred-language.json
node mcpserver/dist/index.js

# Test OS locale detection
unset GEMINI_CLI_NATURAL_LANGUAGE
node mcpserver/dist/index.js
```

Expected output on stderr:
```
[Preferred Natural Language] Detected: zh-CN (source: os-locale, confidence: medium)
```
