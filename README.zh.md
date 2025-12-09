# 首选自然语言检测工具

[![npm 版本](https://badge.fury.io/js/%40preferred-natural-language%2Fshared.svg)](https://badge.fury.io/js/%40preferred-natural-language%2Fshared)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个跨平台的自然语言偏好检测工具，支持 **Claude Code** 和 **Gemini CLI** 环境。

## 🌐 语言

- 🇺🇸 **[English (United States)](README.md)**
- 🇨🇳 **简体中文** ← 当前页面

## ✨ 特性

- 🎯 **优先级链检测**: 5级检测优先级系统
- 🌍 **多平台支持**: Windows、macOS、Linux
- 🔧 **多种集成方式**: 环境变量、配置文件、系统语言
- 📝 **TypeScript**: 完整的类型安全和智能提示
- 🧪 **全面测试**: 95%+ 测试覆盖率
- 📦 **单体仓库架构**: 共享核心与平台特定扩展

## 🚀 快速开始

### Claude Code 使用

```bash
# 安装插件
npm install -g @preferred-natural-language/claude-plugin

# 检测当前语言偏好
claude plugin preferred-natural-language detect

# 设置语言偏好
claude plugin preferred-natural-language set zh-CN

# 显示详细信息
claude plugin preferred-natural-language show

# 列出所有支持的语言
claude plugin preferred-natural-language list
```

### Gemini CLI 使用

```bash
# 安装扩展
npm install -g @preferred-natural-language/gemini-extension

# 与 Gemini CLI 一起使用
gemini chat --extension preferred-natural-language
```

## 📋 支持的语言

我们支持 **70+ 种语言和地区变体**，包括：

| 语言 | 代码 | 语言 | 代码 |
|----------|------|----------|------|
| 英语 (美国) | `en-US` | 中文 (简体) | `zh-CN` |
| 英语 (英国) | `en-GB` | 中文 (繁体) | `zh-TW` |
| 日语 | `ja-JP` | 中文 (香港) | `zh-HK` |
| 韩语 | `ko-KR` | 西班牙语 (西班牙) | `es-ES` |
| 法语 (法国) | `fr-FR` | 西班牙语 (墨西哥) | `es-MX` |
| 德语 (德国) | `de-DE` | 葡萄牙语 (巴西) | `pt-BR` |
| 阿拉伯语 (埃及) | `ar-EG` | 俄语 | `ru-RU` |

[查看完整列表 →](./docs/LANGUAGES.zh.md)

## 🔍 检测优先级

工具使用 5 级优先级链检测语言偏好：

1. **🥇 配置文件** (`.preferred-language.json`)
2. **🥈 自定义环境变量**
   - `GEMINI_CLI_NATURAL_LANGUAGE`
   - `CLAUDE_CODE_NATURAL_LANGUAGE`
3. **🥉 操作系统语言设置** (系统语言)
4. **🏅 标准环境变量**
   - `LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`
5. **🆕 HTTP Accept-Language 头** (用于 Web 环境)
6. **🏁 回退选项** (`en-US`)

## 📁 配置

### 环境变量

```bash
# Claude Code
export CLAUDE_CODE_NATURAL_LANGUAGE="zh-CN"

# Gemini CLI
export GEMINI_CLI_NATURAL_LANGUAGE="ja-JP"
```

### 配置文件

在项目根目录创建 `.preferred-language.json`：

```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

### 系统环境

```bash
# 标准 Unix 环境变量
export LANGUAGE="zh_CN:en_US"
export LC_ALL="zh_CN.UTF-8"
export LANG="zh_CN.UTF-8"
```

## 🏗️ 架构

```
preferred-natural-language/
├── packages/
│   ├── shared/                    # 核心检测逻辑
│   │   ├── src/
│   │   │   ├── languageDetector.ts
│   │   │   ├── types.ts
│   │   │   └── languageNames.ts
│   │   └── __tests__/
│   ├── claude-plugin/             # Claude Code 集成
│   │   ├── src/commands/
│   │   └── __tests__/
│   └── gemini-extension/          # Gemini CLI 集成
│       ├── src/
│       └── __tests__/
├── test/                          # 集成和端到端测试
└── docs/                          # 文档
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行特定测试套件
npm run test:unit
npm run test:integration
npm run test:e2e

# 生成覆盖率报告
npm run test:coverage
```

### 测试覆盖率

- **共享核心**: 95% 覆盖率
- **语言检测**: 100% 覆盖率
- **平台扩展**: 90% 覆盖率

## 🛠️ 开发

### 环境搭建

```bash
# 克隆仓库
git clone https://github.com/your-username/preferred-natural-language.git
cd preferred-natural-language

# 安装依赖
npm install

# 构建所有包
npm run build

# 运行测试
npm test
```

### 项目脚本

```bash
# 开发
npm run dev:claude        # Claude Code 插件开发
npm run dev:gemini        # Gemini CLI 扩展开发

# 构建
npm run build:shared      # 构建共享核心
npm run build:claude      # 构建 Claude Code 插件
npm run build:gemini      # 构建 Gemini CLI 扩展

# 测试
npm run test:watch        // 监视模式
npm run test:coverage     // 带覆盖率
npm run test:ci          // CI 模式
```

## 📖 API 参考

### 核心 API

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

### 检测结果类型

```typescript
interface LanguageDetectionResult {
  language: string;           // BCP-47 语言代码
  source: DetectionSource;    // 检测源
  confidence: 'high' | 'medium' | 'low';
}
```

## 🤝 贡献

我们欢迎贡献！请查看我们的[贡献指南](./CONTRIBUTING.zh.md)了解详情。

### 开发流程

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🙏 致谢

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - AI 集成标准
- [os-locale](https://github.com/sindresorhus/os-locale) - 跨平台语言检测
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📞 支持

- 🐛 [报告错误](https://github.com/your-username/preferred-natural-language/issues)
- 💡 [请求功能](https://github.com/your-username/preferred-natural-language/issues)
- 📧 [邮件支持](mailto:support@example.com)

---

<div align="center">
  <p>为 AI 社区 ❤️ 制作</p>
</div>