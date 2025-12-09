# Preferred Natural Language（首选自然语言）

[![npm version](https://badge.fury.io/js/%40preferred-natural-language%2Fcli.svg)](https://badge.fury.io/js/%40preferred-natural-language%2Fcli)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![测试覆盖率](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/your-username/preferred-natural-language)

跨平台的自然语言偏好检测工具，通过 MCP（Model Context Protocol）为 Claude Code 和 Gemini CLI 提供**自动语言检测**功能。

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
- 🧪 **100% 测试**：65+ 测试用例，100% 语句覆盖率

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
   ```bash
   # 从 Claude Code 市场安装（即将推出）
   # 或手动安装
   npm install -g @preferred-natural-language/claude-plugin
   ```

2. **自动语言检测**：
   - Claude Code 自动检测并使用您的首选语言
   - 通过 MCP Resource 访问语言偏好：`language://preference`
   - 使用 MCP 工具：`detect-language`、`set-language`、`list-languages`

3. **斜杠命令**：
   ```
   /detect-language   # 检测语言偏好
   /set-language      # 设置语言偏好
   /list-languages    # 列出支持的语言
   ```

#### Gemini CLI

1. **安装扩展**：
   ```bash
   npm install -g @preferred-natural-language/gemini-extension
   ```

2. **自动语言检测**：
   - Gemini 在会话开始时自动检测您的首选语言
   - 扩展通过 `GEMINI.md` 提供上下文
   - MCP 服务器提供语言工具和资源

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

### Monorepo 结构

```
preferred-natural-language/
├── packages/
│   ├── shared/                    # 核心检测库
│   ├── cli/                       # CLI 包 + MCP 服务器
│   │   ├── src/
│   │   │   ├── cli/               # CLI 命令
│   │   │   ├── i18n/              # 国际化（10 种语言）
│   │   │   └── mcp/               # MCP 服务器
│   │   └── __tests__/             # 单元 + 集成测试
│   ├── claude-plugin/             # Claude Code 插件（轻量）
│   └── gemini-extension/          # Gemini CLI 扩展（轻量）
```

### 设计理念

- **共享核心**：所有检测逻辑在 `@preferred-natural-language/shared`
- **CLI 包**：完整的 CLI + MCP 服务器在 `@preferred-natural-language/cli`
- **轻量插件**：Claude/Gemini 包是轻量包装（配置 + 启动脚本）
- **无代码重复**：插件层通过智能启动器委托给 CLI 包

## 🧪 测试

### 运行测试

```bash
# 所有测试（单元 + 集成）
npm test

# 特定测试套件
npm run test:unit           # 快速单元测试
npm run test:integration    # 集成测试
npm run test:e2e           # 端到端测试（Phase 4）

# 开发
npm run test:watch          # 监视模式
npm run test:coverage       # 带覆盖率报告
npm run test:ci            # CI 模式（无监视）
```

### 测试覆盖率

当前覆盖率（Phase 2B 完成）：

| 包 | 语句 | 分支 | 函数 | 行 |
|----|------|------|------|-----|
| **CLI** | **100%** | **72.72%** | **100%** | **100%** |
| 命令 | 100% | 80% | 100% | 100% |
| i18n | 100% | 100% | 100% | 100% |
| 工具 | 100% | 66.66% | 100% | 100% |

**65 个测试用例，全部通过** ✅

## 🛠️ 开发

### 设置

```bash
# 克隆仓库
git clone https://github.com/your-username/preferred-natural-language.git
cd preferred-natural-language

# 安装依赖（monorepo）
npm install

# 构建包
npm run build              # 构建 shared + cli

# 运行测试
npm test
```

### 可用脚本

```bash
# 构建
npm run build              # 构建 shared + cli 包
npm run build:shared       # 仅构建 shared 核心
npm run build:cli          # 仅构建 CLI 包

# 开发（监视模式）
npm run dev:shared         # 监视 shared 包
npm run dev:cli            # 监视 CLI 包

# 测试
npm run test:unit          # 单元测试
npm run test:integration   # 集成测试
npm run test:coverage      # 带覆盖率
npm run test:pr            # PR 验证（单元 + 集成）

# 安装
npm run install:cli-global # 从源代码全局安装 CLI
```

## 📖 API 参考

### CLI 包

```typescript
import { LanguageDetector } from '@preferred-natural-language/shared';
import { I18n } from '@preferred-natural-language/cli/i18n';
import { DetectCommand } from '@preferred-natural-language/cli/commands';

// 检测语言
const detector = new LanguageDetector();
const result = await detector.detect();
// { language: 'zh-CN', source: 'os-locale', confidence: 'high' }

// 初始化 i18n
const i18n = new I18n(result.language, result.confidence);
const message = i18n.t('detect.result', {
  languageName: '简体中文',
  language: 'zh-CN'
});

// 使用命令类
const command = new DetectCommand(detector, i18n);
const output = await command.execute();
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

**自动检测**：MCP 服务器声明 `resources: { subscribe: true }` 以实现自动上下文注入。

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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - AI 集成标准
- [Anthropic](https://www.anthropic.com/) - Claude Code 平台
- [Google](https://ai.google.dev/) - Gemini CLI 平台
- [os-locale](https://github.com/sindresorhus/os-locale) - 跨平台 locale 检测
- [Commander.js](https://github.com/tj/commander.js) - CLI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📞 支持

- 🐛 [报告 Bug](https://github.com/your-username/preferred-natural-language/issues)
- 💡 [请求功能](https://github.com/your-username/preferred-natural-language/issues)
- 📖 [文档](https://github.com/your-username/preferred-natural-language/wiki)
- 💬 [讨论](https://github.com/your-username/preferred-natural-language/discussions)

---

<div align="center">
  <p>用 ❤️ 为 AI 社区打造</p>
  <p>支持 <strong>Claude Code</strong> 和 <strong>Gemini CLI</strong></p>
</div>
