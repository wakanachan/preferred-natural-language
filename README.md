# Preferred Natural Language - Gemini CLI Extension

A Gemini CLI MCP (Model Context Protocol) extension that automatically detects your system's preferred natural language and instructs Gemini to communicate in that language.

## Features

- **Automatic Language Detection**: Detects your preferred language from multiple sources
- **Priority-Based Detection**: Uses a smart fallback chain for reliable detection
- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **Customizable**: Override detection with environment variables or config files
- **MCP Integration**: Provides both Resource and Prompt capabilities

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
├── gemini-extension.json          # Gemini extension configuration
├── mcpserver/
│   ├── package.json              # Dependencies and build scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── src/
│   │   ├── index.ts              # MCP server entry point
│   │   ├── languageDetector.ts   # Detection logic
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── config.ts             # Configuration constants
│   └── dist/                     # Compiled JavaScript (generated)
└── README.md
```

### Build Commands

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

You should see output like:
```
[Preferred Natural Language] Detected: zh-CN (source: GEMINI_CLI_NATURAL_LANGUAGE, confidence: high)
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
