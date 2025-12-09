# Preferred Natural Language

[![npm version](https://badge.fury.io/js/%40preferred-natural-language%2Fshared.svg)](https://badge.fury.io/js/%40preferred-natural-language%2Fshared)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cross-platform natural language preference detection tool for AI assistants, supporting both **Claude Code** and **Gemini CLI** environments.

## 🌐 Languages

- 🇺🇸 **English** ← Current
- 🇨🇳 **[简体中文](README.zh.md)**

## ✨ Features

- 🎯 **Priority Chain Detection**: 5-level detection priority system
- 🌍 **Multi-Platform Support**: Windows, macOS, Linux
- 🔧 **Multiple Integration Points**: Environment variables, config files, OS locale
- 📝 **TypeScript**: Full type safety and IntelliSense support
- 🧪 **Comprehensive Testing**: 95%+ test coverage
- 📦 **Monorepo Architecture**: Shared core with platform-specific extensions

## 🚀 Quick Start

### For Claude Code

```bash
# Install the plugin
npm install -g @preferred-natural-language/claude-plugin

# Detect current language preference
claude plugin preferred-natural-language detect

# Set language preference
claude plugin preferred-natural-language set zh-CN

# Show detailed information
claude plugin preferred-natural-language show

# List all supported languages
claude plugin preferred-natural-language list
```

### For Gemini CLI

```bash
# Install the extension
npm install -g @preferred-natural-language/gemini-extension

# Run with Gemini CLI
gemini chat --extension preferred-natural-language
```

## 📋 Supported Languages

We support **70+ languages and regional variants**, including:

| Language | Code | Language | Code |
|----------|------|----------|------|
| English (US) | `en-US` | Chinese (Simplified) | `zh-CN` |
| English (UK) | `en-GB` | Chinese (Traditional) | `zh-TW` |
| Japanese | `ja-JP` | Chinese (Hong Kong) | `zh-HK` |
| Korean | `ko-KR` | Spanish (Spain) | `es-ES` |
| French (France) | `fr-FR` | Spanish (Mexico) | `es-MX` |
| German (Germany) | `de-DE` | Portuguese (Brazil) | `pt-BR` |
| Arabic (Egypt) | `ar-EG` | Russian | `ru-RU` |

[View full list →](./docs/LANGUAGES.md)

## 🔍 Detection Priority

The tool detects language preferences using a 5-level priority chain:

1. **🥇 Configuration File** (`.preferred-language.json`)
2. **🥈 Custom Environment Variables**
   - `GEMINI_CLI_NATURAL_LANGUAGE`
   - `CLAUDE_CODE_NATURAL_LANGUAGE`
3. **🥉 OS Locale Settings** (system language)
4. **🏅 Standard Environment Variables**
   - `LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`
5. **🆕 HTTP Accept-Language Header** (for web environments)
6. **🏁 Fallback** (`en-US`)

## 📁 Configuration

### Environment Variables

```bash
# Claude Code
export CLAUDE_CODE_NATURAL_LANGUAGE="zh-CN"

# Gemini CLI
export GEMINI_CLI_NATURAL_LANGUAGE="ja-JP"
```

### Configuration File

Create `.preferred-language.json` in your project root:

```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

### System Environment

```bash
# Standard Unix environment variables
export LANGUAGE="zh_CN:en_US"
export LC_ALL="zh_CN.UTF-8"
export LANG="zh_CN.UTF-8"
```

## 🏗️ Architecture

```
preferred-natural-language/
├── packages/
│   ├── shared/                    # Core detection logic
│   │   ├── src/
│   │   │   ├── languageDetector.ts
│   │   │   ├── types.ts
│   │   │   └── languageNames.ts
│   │   └── __tests__/
│   ├── claude-plugin/             # Claude Code integration
│   │   ├── src/commands/
│   │   └── __tests__/
│   └── gemini-extension/          # Gemini CLI integration
│       ├── src/
│       └── __tests__/
├── test/                          # Integration & E2E tests
└── docs/                          # Documentation
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Shared Core**: 95% coverage
- **Language Detection**: 100% coverage
- **Platform Extensions**: 90% coverage

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/preferred-natural-language.git
cd preferred-natural-language

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Project Scripts

```bash
# Development
npm run dev:claude        # Claude Code plugin development
npm run dev:gemini        # Gemini CLI extension development

# Building
npm run build:shared      # Build shared core
npm run build:claude      # Build Claude Code plugin
npm run build:gemini      # Build Gemini CLI extension

# Testing
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
npm run test:ci          # CI mode
```

## 📖 API Reference

### Core API

```typescript
import { LanguageDetector } from '@preferred-natural-language/shared';

const detector = new LanguageDetector();
const result = await detector.detect();

console.log(result);
// {
//   language: 'zh-CN',
//   source: 'GEMINI_CLI_NATURAL_LANGUAGE',
//   confidence: 'high'
// }
```

### Detection Result Type

```typescript
interface LanguageDetectionResult {
  language: string;           // BCP-47 language code
  source: DetectionSource;    // Detection source
  confidence: 'high' | 'medium' | 'low';
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - For AI integration standards
- [os-locale](https://github.com/sindresorhus/os-locale) - For cross-platform locale detection
- [TypeScript](https://www.typescriptlang.org/) - For type safety

## 📞 Support

- 🐛 [Report a Bug](https://github.com/your-username/preferred-natural-language/issues)
- 💡 [Request a Feature](https://github.com/your-username/preferred-natural-language/issues)
- 📧 [Email Support](mailto:support@example.com)

---

<div align="center">
  <p>Made with ❤️ for the AI community</p>
</div>