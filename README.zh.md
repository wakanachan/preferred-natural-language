# Preferred Natural Language（首选自然语言）

[![npm version](https://badge.fury.io/js/%40preferred-natural-language%2Fcli.svg)](https://badge.fury.io/js/%40preferred-natural-language%2Fcli)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![测试覆盖率](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/wakanachan/preferred-natural-language)

跨平台的自然语言偏好检测工具，通过 MCP（Model Context Protocol）为 AI 助手提供**自动语言检测**功能。

## 🌐 语言

- 🇺🇸 **[English](README.md)**
- 🇨🇳 **简体中文** ← 当前

## ✨ 核心特性

- 🤖 **自动语言检测**：AI 自动使用您的首选语言进行交流
- 🔌 **MCP 集成**：与 Claude Code 和 Gemini CLI 无缝集成
- 🎯 **优先级检测链**：5 级检测优先级系统
- 🌍 **70+ 种语言**：全面的语言和地区变体支持
- 🔧 **多种检测方式**：配置文件、环境变量、系统语言
- 📝 **完整 i18n**：CLI 输出支持 10 种语言（中、英、日、韩、俄、葡、西、法、德）
- 🧪 **100% 测试**：100+ 测试用例，高覆盖率

## 🚀 快速开始

### 安装

```bash
# 全局安装（推荐）
npm install -g @preferred-natural-language/cli

# 或使用 npx（无需安装）
npx @preferred-natural-language/cli detect
```

### CLI 使用

```bash
# 检测当前语言偏好
pnl detect

# 设置语言偏好
pnl set zh-CN

# 显示详细信息
pnl show

# 列出所有支持的语言
pnl list

# 启动 MCP 服务器（编程使用）
pnl mcp
```

### MCP 集成

#### Claude Code

1. **安装插件**：

   **从 Marketplaces 安装**：
   ```bash
   /plugin marketplace add wakanachan/preferred-natural-language
   /plugin install pnl@preferred-natural-language
   ```

   **本地开发模式**：
   ```bash
   # 克隆仓库
   git clone https://github.com/wakanachan/preferred-natural-language
   cd preferred-natural-language

   # 安装为本地 marketplace
   /plugin marketplace add ./
   /plugin install preferred-natural-language@pnl-dev-marketplace
   ```

2. **重启 Claude Code** 以加载插件（安装后必须重启）

3. **自动语言检测**：
   - Claude Code 自动检测并使用您的首选语言
   - 通过 MCP Resource 访问语言偏好：`language://preference`
   - 使用 MCP 工具：`detect-language`、`set-language`、`list-languages`

4. **可用的斜杠命令**：
   ```
   /pnl:detect-language   # 检测当前语言偏好
   /pnl:set-language      # 设置语言偏好（如 zh-CN, ja-JP）
   /pnl:list-languages    # 列出所有 70+ 种支持的语言
   ```

#### Gemini CLI

1. **安装扩展**：

   **从 Github 安装**：
   ```bash
   gemini extensions install https://github.com/wakanachan/preferred-natural-language
   ```

   **本地开发模式**：
   ```bash
   # 克隆仓库
   git clone https://github.com/wakanachan/preferred-natural-language
   cd preferred-natural-language

   # 从本地路径安装（根目录包含 gemini-extension.json）
   gemini extensions install .

   # 或使用 link 命令
   gemini extensions link .
   ```

2. **重启 Gemini CLI** 以加载扩展（更改仅在重启后生效）

3. **更新扩展**（当有更新可用时）：
   ```bash
   # 更新特定扩展
   gemini extensions update preferred-natural-language

   # 或一次更新所有扩展
   gemini extensions update --all
   ```

4. **自动语言检测**：
   - Gemini 在会话开始时自动检测您的首选语言
   - 扩展通过 `GEMINI.md` 提供上下文
   - MCP 服务器提供语言工具和资源

5. **可用的斜杠命令**：
   ```
   /detect-language   # 检测当前语言偏好
   /set-language      # 设置语言偏好（如 zh-CN, ja-JP）
   /list-languages    # 列出所有 70+ 种支持的语言
   ```

## 🌍 支持的语言（70+）

我们支持 **70+ 种语言和地区变体**，其中 **10 种主要语言**提供**完整的 i18n 输出**：

### CLI 输出语言（完整 i18n）

| 语言 | 代码 | 原生名称 |
|------|------|----------|
| 英语 | `en`, `en-US`, `en-GB` | English |
| 简体中文 | `zh-CN` | 简体中文 |
| 日语 | `ja-JP` | 日本語 |
| 韩语 | `ko-KR` | 한국어 |
| 俄语 | `ru-RU` | Русский |
| 葡萄牙语 | `pt-BR`, `pt-PT` | Português |
| 西班牙语 | `es-ES` | Español |
| 法语 | `fr-FR` | Français |
| 德语 | `de-DE` | Deutsch |

查看[完整的 70+ 种支持语言列表 →](./docs/LANGUAGES.md)

## 🔍 检测优先级链

工具使用严格的 5 级优先级检测语言偏好：

1. **🥇 配置文件**（`.preferred-language.json`）- 最高优先级
2. **🥈 自定义环境变量**
   - `CLAUDE_CODE_NATURAL_LANGUAGE`
   - `GEMINI_CLI_NATURAL_LANGUAGE`
3. **🥉 系统语言设置**（通过 `os-locale` 包）
4. **🏅 标准环境变量**
   - 优先级：`LANGUAGE` > `LC_ALL` > `LC_MESSAGES` > `LANG`
5. **🌐 HTTP Accept-Language 头**（Web 环境）
6. **🏁 Fallback**（`en-US`）- 最低优先级

## 📁 配置

### 配置文件（最高优先级）

在项目根目录创建 `.preferred-language.json`：

```json
{
  "language": "zh-CN",
  "fallback": "en-US"
}
```

### 环境变量

```bash
# 平台特定（优先级 2）
export CLAUDE_CODE_NATURAL_LANGUAGE="zh-CN"
export GEMINI_CLI_NATURAL_LANGUAGE="ja-JP"

# 标准 Unix 变量（优先级 4）
export LANGUAGE="zh_CN:en_US"
export LC_ALL="zh_CN.UTF-8"
export LANG="zh_CN.UTF-8"
```

### 使用 CLI

```bash
# 交互式创建配置文件
pnl set zh-CN

# 这会创建包含以下内容的 .preferred-language.json：
# { "language": "zh-CN", "fallback": "en-US" }
```

## 🏗️ 架构

### 项目结构

```
preferred-natural-language/
├── src/                          # 源代码
│   ├── languageDetector.ts       # 核心 5 级优先级检测
│   ├── types.ts                  # 类型定义
│   ├── languageNames.ts          # 70+ 语言映射
│   ├── config.ts                 # 配置路径
│   ├── index.ts                  # 统一导出
│   ├── cli/                      # CLI 命令（Commander.js）
│   │   ├── commands/             # detect, set, show, list, mcp
│   │   ├── utils/                # 显示工具
│   │   └── index.ts              # CLI 入口
│   ├── i18n/                     # 国际化
│   │   ├── index.ts              # I18n 类
│   │   └── locales/              # 10 种语言文件
│   └── mcp/                      # MCP 服务器
│       └── server.ts             # Resource + Prompt + Tools
├── bin/
│   └── pnl.js                    # CLI 入口点
├── __tests__/                    # 测试套件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── .claude-plugin/               # Claude Code marketplace 配置
│   └── marketplace.json          # 指向 ./claude-code-plugin
├── claude-code-plugin/           # Claude Code 插件
│   ├── .claude-plugin/plugin.json
│   ├── .mcp.json                 # MCP 服务器配置
│   ├── agents/                   # Agent 定义
│   ├── commands/                 # 斜杠命令
│   └── scripts/start-mcp.js      # 智能 MCP 启动器
├── gemini-extension.json         # Gemini CLI 扩展清单
├── GEMINI.md                     # Gemini 上下文文件
├── commands/                     # Gemini 斜杠命令（.toml）
└── scripts/start-mcp.js          # 共享 MCP 启动器
```

### 设计理念

- **单一包**：所有代码在 `@preferred-natural-language/cli`
- **轻量插件**：Claude/Gemini 集成是配置层
- **智能启动器**：插件通过智能启动器使用 `pnl mcp` 子命令
- **无代码重复**：插件层委托给 CLI 包

## 🧪 测试

### 运行测试

```bash
# 所有测试（单元 + 集成 + e2e）
npm test

# 特定测试套件
npm run test:unit           # 快速单元测试
npm run test:integration    # 集成测试
npm run test:e2e            # 端到端测试

# 开发
npm run test:watch          # 监视模式
npm run test:coverage       # 带覆盖率报告
npm run test:ci             # CI 模式（无监视）
```

## 🛠️ 开发

### 设置

```bash
# 克隆仓库
git clone https://github.com/wakanachan/preferred-natural-language.git
cd preferred-natural-language

# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test
```

### 可用脚本

```bash
# 构建
npm run build              # 构建项目

# 测试
npm run test:unit          # 单元测试
npm run test:integration   # 集成测试
npm run test:e2e           # E2E 测试
npm run test:coverage      # 带覆盖率
npm run test:pr            # PR 验证（单元 + 集成）
```

## 📖 API 参考

### 编程使用

```typescript
import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/cli';

// 检测语言
const detector = new LanguageDetector();
const result = await detector.detect();
// { language: 'zh-CN', source: 'os-locale', confidence: 'high' }

// 列出支持的语言
console.log(SUPPORTED_LANGUAGES);
// { 'en': 'English', 'zh-CN': 'Chinese (Simplified)', ... }
```

### MCP 服务器 API

MCP 服务器提供：

**Resource**（自动加载）：
- `language://preference` - 用户的语言偏好（JSON）

**Prompt**：
- `use-preferred-language` - 为 AI 生成语言指令

**Tools**：
- `detect-language` - 检测当前语言
- `set-language(language, fallback?)` - 设置语言偏好
- `list-languages()` - 列出所有 70+ 种支持的语言

### 类型定义

```typescript
interface LanguageDetectionResult {
  language: string;           // BCP-47 代码（如 'zh-CN'）
  source: DetectionSource;    // 检测源
  confidence: 'high' | 'medium' | 'low';
}

type DetectionSource =
  | `config-file:${string}`  // 配置文件路径
  | 'GEMINI_CLI_NATURAL_LANGUAGE'
  | 'CLAUDE_CODE_NATURAL_LANGUAGE'
  | 'os-locale'
  | 'LANGUAGE' | 'LC_ALL' | 'LC_MESSAGES' | 'LANG'
  | 'HTTP_ACCEPT_LANGUAGE'
  | 'fallback';
```

## 🤝 贡献

我们欢迎贡献！详见 [贡献指南](./CONTRIBUTING.md)。

### 开发工作流

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（使用中文提交消息）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启 Pull Request

### 提交消息格式

```bash
git commit -m "feat: 添加新功能描述

- 详细说明 1
- 详细说明 2

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - AI 集成标准
- [Anthropic](https://www.anthropic.com/) - Claude Code 平台
- [Google](https://geminicli.com/) - Gemini CLI 平台
- [os-locale](https://github.com/sindresorhus/os-locale) - 跨平台 locale 检测
- [Commander.js](https://github.com/tj/commander.js) - CLI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📞 支持

- 🐛 [报告 Bug](https://github.com/wakanachan/preferred-natural-language/issues)
- 💡 [请求功能](https://github.com/wakanachan/preferred-natural-language/issues)
- 💬 [讨论](https://github.com/wakanachan/preferred-natural-language/discussions)

---

<div align="center">
  <p>用 ❤️ 为 AI 社区打造</p>
  <p>支持 <strong>Claude Code</strong> 和 <strong>Gemini CLI</strong></p>
</div>
