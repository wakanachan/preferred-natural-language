# Preferred Natural Language - Dual Platform Extension

A dual-platform extension that automatically detects your system's preferred natural language. Works as both a **Gemini CLI MCP extension** and a **Claude Code plugin** with 95% code reuse.

## Features

- **Dual Platform Support**: Works with both Gemini CLI (MCP) and Claude Code
- **Automatic Language Detection**: Detects your preferred language from multiple sources
- **Priority-Based Detection**: Uses a smart fallback chain for reliable detection
- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **Customizable**: Override detection with environment variables or config files
- **95% Code Reuse**: Shared core logic ensures consistent behavior across platforms

## How It Works

The extension detects your preferred language using the following priority order:

1. **Custom Environment Variables** (Highest Priority)
   - `GEMINI_CLI_NATURAL_LANGUAGE`
   - `CLAUDE_CODE_NATURAL_LANGUAGE`
   - etc.

2. **Configuration File**
   - `.preferred-language.json` in current directory
   - `~/.config/preferred-language/config.json` (Linux/macOS)
   - `%APPDATA%\preferred-language\config.json` (Windows)

3. **Operating System Language Settings**
   - System locale via OS-specific methods

4. **Standard Environment Variables**
   - `LANGUAGE`, `LC_ALL`, `LC_MESSAGES`, `LANG`

5. **Browser Accept-Language Header** (if available)

6. **Fallback**: Defaults to `en-US` if no language can be detected

## Installation

### Prerequisites

- Node.js 20+ installed
- Gemini CLI

### Steps

1. Clone or download this repository

2. Install dependencies and build:
   ```bash
   cd mcpserver
   npm install
   npm run build
   ```

3. The extension is now ready to use with Gemini

## Platform-Specific Usage

### Gemini CLI (MCP Extension)

The MCP server provides these capabilities to Gemini:

- **Resource**: `language://preference` - Returns JSON with language data
- **Prompt**: `use-preferred-language` - Instructs AI to use detected language

### Claude Code (Plugin)

The Claude Code plugin provides interactive language management commands:

```bash
# Detect current language preference
claude plugin preferred-natural-language detect

# Set language preference
claude plugin preferred-natural-language set zh-CN

# Show detailed language information
claude plugin preferred-natural-language show

# List all supported languages
claude plugin preferred-natural-language list

# Show interactive configuration help
claude plugin preferred-natural-language config
```

## Configuration

### Method 1: Environment Variables (Recommended for Quick Setup)

Set one of these environment variables:

**Windows (PowerShell):**
```powershell
$env:GEMINI_CLI_NATURAL_LANGUAGE="zh-CN"
```

**Windows (Command Prompt):**
```cmd
set GEMINI_CLI_NATURAL_LANGUAGE=zh-CN
```

**macOS/Linux:**
```bash
export GEMINI_CLI_NATURAL_LANGUAGE="zh-CN"
```

To make it permanent, add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
```bash
echo 'export GEMINI_CLI_NATURAL_LANGUAGE="zh-CN"' >> ~/.bashrc
```

### Method 2: Configuration File (Recommended for Persistent Settings)

Create a `.preferred-language.json` file in one of these locations:

- Project directory: `./.preferred-language.json`
- User config (Linux/macOS): `~/.config/preferred-language/config.json`
- User config (Windows): `%APPDATA%\preferred-language\config.json`

**Example configuration:**
```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

**Supported Language Codes** (BCP-47 format):
- `en-US` - English (United States)
- `zh-CN` - Chinese (Simplified)
- `zh-TW` - Chinese (Traditional)
- `ja-JP` - Japanese
- `ko-KR` - Korean
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- `pt-BR` - Portuguese (Brazil)
- `ru-RU` - Russian
- And many more...

### Method 3: System Locale (Automatic)

If you don't configure anything, the extension will automatically detect your OS language settings.

## Usage with Gemini

Once installed, the extension provides two MCP capabilities:

### 1. MCP Resource: `language://preference`

Query the detected language preference:
```
Read resource: language://preference
```

Returns JSON with:
```json
{
  "language": "zh-CN",
  "source": "GEMINI_CLI_NATURAL_LANGUAGE",
  "confidence": "high",
  "detectedAt": "2025-12-09T11:09:00.000Z"
}
```

### 2. MCP Prompt: `use-preferred-language`

Instruct Gemini to use your preferred language:
```
Use prompt: use-preferred-language
```

This automatically tells Gemini:
> The user's preferred natural language is Chinese (Simplified) (zh-CN).
>
> Please communicate with the user in Chinese (Simplified) unless they explicitly request a different language...

## Development

### Project Structure

```
.
├── plugin.json                    # Claude Code plugin configuration
├── gemini-extension.json         # Gemini CLI MCP configuration
├── package.json                  # Root project dependencies and scripts
├── src/                          # Claude Code plugin source
│   ├── index.ts                  # Plugin main entry
│   ├── cli.ts                    # Plugin implementation
│   ├── commands/                 # Plugin commands
│   │   ├── detect.ts             # Detect language
│   │   ├── set.ts                # Set language
│   │   ├── show.ts               # Show configuration
│   │   └── list.ts               # List languages
│   └── utils/                    # Plugin utilities
│       └── languageDisplay.ts    # Display formatting
├── shared/                       # Shared core logic
│   ├── src/
│   │   ├── languageDetector.ts   # Language detection logic
│   │   ├── types.ts              # Type definitions
│   │   ├── config.ts             # Configuration constants
│   │   └── languageNames.ts      # Language name mapping
│   └── dist/                     # Shared compiled code
├── mcpserver/                    # MCP server (Gemini CLI)
│   ├── package.json              # MCP dependencies
│   ├── tsconfig.json             # MCP TypeScript config
│   ├── src/                      # MCP server source
│   │   └── index.ts              # MCP server entry
│   └── dist/                     # MCP compiled output
├── dist/                         # Claude Code plugin compiled output
├── tsconfig.json                 # Root TypeScript config
├── tsconfig.shared.json          # Shared code build config
├── tsconfig.claude.json          # Claude Code plugin build config
└── README.md
```

### Build Commands

```bash
# Build everything
npm run build

# Build specific components
npm run build:shared    # Build shared core code
npm run build:claude    # Build Claude Code plugin
npm run build:mcp       # Build MCP server

# Development modes
npm run dev:claude      # Watch mode for Claude Code plugin
npm run dev:mcp         # Watch mode for MCP server
npm run dev:shared      # Watch mode for shared code
```

### Platform-Specific Testing

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean
```

### Testing

Test language detection with different sources:

**Test with custom environment variable:**
```bash
export GEMINI_CLI_NATURAL_LANGUAGE=ja-JP
node mcpserver/dist/index.js
```

**Test with config file:**
```bash
echo '{"language": "ko-KR"}' > .preferred-language.json
node mcpserver/dist/index.js
```

**Test OS locale detection:**
```bash
# Clear all env vars and config, rely on OS settings
unset GEMINI_CLI_NATURAL_LANGUAGE
unset CLAUDE_CODE_NATURAL_LANGUAGE
node mcpserver/dist/index.js
```

**Test Claude Code Plugin:**
```bash
# Test detect command
node -e "
import('./dist/cli.js').then(module => {
  const plugin = new module.PreferredNaturalLanguagePlugin();
  plugin.initialize({}).then(() => {
    plugin.execute('detect', []).then(console.log);
  });
});
"

# Test set command
node -e "
import('./dist/cli.js').then(module => {
  const plugin = new module.PreferredNaturalLanguagePlugin();
  plugin.initialize({}).then(() => {
    plugin.execute('set', ['ja-JP']).then(console.log);
  });
});
"
```

Expected output:
```
[Preferred Natural Language] Detected: zh-CN (source: GEMINI_CLI_NATURAL_LANGUAGE, confidence: high)
```
```
✅ 语言偏好已设置为: Japanese (ja-JP)
```

## Troubleshooting

### Issue: Language not detected correctly

**Solution:** Check detection priority order and verify your configuration:

1. Ensure environment variables are set correctly:
   ```bash
   echo $GEMINI_CLI_NATURAL_LANGUAGE
   ```

2. Verify config file exists and has correct format:
   ```bash
   cat .preferred-language.json
   ```

3. Check OS locale settings:
   ```bash
   # macOS/Linux
   locale

   # Windows PowerShell
   Get-WinSystemLocale
   ```

### Issue: Build fails

**Solution:** Make sure you have Node.js 20+ and TypeScript is installed:
```bash
node --version  # Should be 20.x or higher
cd mcpserver
npm install
npm run build
```

### Issue: Gemini doesn't respond in preferred language

**Solution:**
1. Verify the MCP server is running and language is detected
2. Explicitly invoke the `use-preferred-language` prompt in Gemini
3. Note that Gemini may still use English for code, technical terms, or when discussing English-specific topics

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
