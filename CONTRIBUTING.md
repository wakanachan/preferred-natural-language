# Contributing to Preferred Natural Language

[![English](https://img.shields.io/badge/English-blue.svg)](#english)
[![简体中文](https://img.shields.io/badge/简体中文-red.svg)](#简体中文)

---

## English

Thank you for your interest in contributing to Preferred Natural Language! We welcome all forms of contributions, including but not limited to:

- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions
- 🧪 Test cases
- 🌍 Internationalization translations

### Getting Started

#### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

#### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the project on GitHub, then clone locally
   git clone https://github.com/YOUR_USERNAME/preferred-natural-language.git
   cd preferred-natural-language
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/fix-some-bug
   ```

2. **Make your changes**
   - Use `npm run dev:shared` to watch core library changes
   - Use `npm run dev:cli` to watch CLI package changes
   - Ensure all tests pass: `npm test`

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature

   - Implement feature X
   - Add tests for feature X

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

4. **Push your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create a Pull Request**
   - Provide a clear PR description
   - Link related issues
   - Ensure CI checks pass

### Commit Guidelines

#### Commit Message Format

We use Chinese commit messages with the following format:

```
<type>: <brief description>

[Optional detailed description]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `test`: Test related
- `refactor`: Code refactoring
- `chore`: Build/tooling related

### Testing Guidelines

#### Test Structure

```
packages/
├── shared/
│   └── __tests__/
│       ├── unit/           # Unit tests
│       └── integration/    # Integration tests
└── cli/
    └── __tests__/
        ├── unit/           # Unit tests
        ├── integration/    # Integration tests
        └── e2e/           # End-to-end tests
```

#### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests only
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# PR validation (fast)
npm run test:pr
```

#### Coverage Requirements

- Statement coverage >= 85%
- Branch coverage >= 80%
- Function coverage >= 85%
- Line coverage >= 85%

### Code Standards

#### TypeScript

- Use strict TypeScript configuration
- Imports must use `.js` extensions
- Prefer `const` and `let`
- Use JSDoc comments

```typescript
// ✅ Good example
import { LanguageDetector } from './languageDetector.js';

/**
 * Detect user's language preference
 * @param options Detection options
 * @returns Language detection result
 */
export async function detectLanguage(options: DetectionOptions): Promise<DetectionResult> {
  const detector = new LanguageDetector(options);
  return await detector.detect();
}
```

#### Code Style

- 2-space indentation
- Single quotes
- No semicolons at end of lines
- Trailing commas for objects and arrays

### Bug Reports

Use this template for bug reports:

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Run command `...`
2. Set parameter `...`
3. See error

## Expected Behavior
Describe what should happen

## Actual Behavior
Describe what actually happens

## Environment
- OS: [e.g. Windows 11]
- Node.js: [e.g. 18.17.0]
- Package Version: [e.g. 2.0.0]

## Additional Information
Logs, screenshots, etc.
```

### Feature Requests

Use this template for feature requests:

```markdown
## Feature Description
Brief description of the requested feature

## Use Case
Describe why this feature is needed

## Proposed Solution
Describe the expected implementation

## Alternatives Considered
Other implementation approaches

## Additional Information
Any other relevant information
```

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Necessary test cases added
- [ ] Documentation updated
- [ ] Commit message format correct
- [ ] PR description is clear
- [ ] CI checks pass
- [ ] No merge conflicts

---

## 简体中文

感谢您对 Preferred Natural Language 项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🧪 测试用例
- 🌍 国际化翻译

### 开始贡献

#### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

#### 开发环境设置

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 Fork 项目，然后克隆到本地
   git clone https://github.com/YOUR_USERNAME/preferred-natural-language.git
   cd preferred-natural-language
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **运行测试**
   ```bash
   npm test
   ```

### 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/fix-some-bug
   ```

2. **进行开发**
   - 使用 `npm run dev:shared` 监听核心库变化
   - 使用 `npm run dev:cli` 监听 CLI 包变化
   - 确保所有测试通过：`npm test`

3. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能

   - 实现功能 X
   - 为功能 X 添加测试

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **创建 Pull Request**
   - 提供清晰的 PR 描述
   - 关联相关的 Issue
   - 确保 CI 检查通过

### 提交规范

#### 提交消息格式

我们使用中文提交消息，格式如下：

```
<type>: <简短描述>

[可选的详细说明]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

#### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `test`: 测试相关
- `refactor`: 代码重构
- `chore`: 构建/工具相关

### 测试指南

#### 测试结构

```
packages/
├── shared/
│   └── __tests__/
│       ├── unit/           # 单元测试
│       └── integration/    # 集成测试
└── cli/
    └── __tests__/
        ├── unit/           # 单元测试
        ├── integration/    # 集成测试
        └── e2e/           # 端到端测试
```

#### 运行测试

```bash
# 所有测试
npm test

# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 端到端测试
npm run test:e2e

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage

# PR 验证（快速）
npm run test:pr
```

#### 覆盖率要求

- 语句覆盖率 >= 85%
- 分支覆盖率 >= 80%
- 函数覆盖率 >= 85%
- 行覆盖率 >= 85%

### 代码规范

#### TypeScript

- 使用严格的 TypeScript 配置
- 导入必须使用 `.js` 扩展名
- 优先使用 `const` 和 `let`
- 使用 JSDoc 注释

```typescript
// ✅ 好的示例
import { LanguageDetector } from './languageDetector.js';

/**
 * 检测用户的语言偏好
 * @param options 检测选项
 * @returns 语言检测结果
 */
export async function detectLanguage(options: DetectionOptions): Promise<DetectionResult> {
  const detector = new LanguageDetector(options);
  return await detector.detect();
}
```

#### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 行末不使用分号
- 对象和数组使用尾随逗号

### Bug 报告

使用以下模板报告 Bug：

```markdown
## Bug 描述
简要描述 bug

## 复现步骤
1. 执行命令 `...`
2. 设置参数 `...`
3. 查看错误

## 期望行为
描述期望的正确行为

## 实际行为
描述实际发生的错误

## 环境信息
- OS: [例如: Windows 11]
- Node.js: [例如: 18.17.0]
- 包版本: [例如: 2.0.0]

## 附加信息
日志、截图等
```

### 功能请求

使用以下模板请求新功能：

```markdown
## 功能描述
简要描述请求的功能

## 使用场景
描述为什么需要这个功能

## 解决方案
描述期望的实现方式

## 替代方案
是否考虑过其他实现方式

## 附加信息
任何其他相关信息
```

### Pull Request 检查清单

提交 PR 前，请确保：

- [ ] 代码符合项目规范
- [ ] 所有测试通过
- [ ] 添加了必要的测试用例
- [ ] 更新了相关文档
- [ ] 提交消息格式正确
- [ ] PR 描述清晰
- [ ] CI 检查通过
- [ ] 没有 merge 冲突

---

## Community & Support / 社区与支持

### Getting Help / 获取帮助

如果您在贡献过程中遇到问题：

- 📧 查看 [Issues](https://github.com/wakanachan/preferred-natural-language/issues)
- 💬 参与 [Discussions](https://github.com/wakanachan/preferred-natural-language/discussions)
- 📖 阅读 [CLAUDE.md](./CLAUDE.md) 了解更多开发细节
- 🏷️ 使用 `help wanted` 标签寻求帮助

### Code of Conduct / 行为准则

- Respect all contributors / 尊重所有贡献者
- Maintain friendly and professional communication / 保持友好和专业
- Accept constructive feedback / 接受建设性的反馈
- Focus on issues, not individuals / 关注问题本身而非个人

---

Thank you for contributing! / 感谢您的贡献！🎉

Every contribution, no matter how small, helps make this project better. We sincerely appreciate your participation.

您的每一个贡献都会让这个项目变得更好。无论贡献大小，我们都真诚地感谢您的参与。

---

<div align="center">
  <p>Made with ❤️ by the community / 由社区用心制作</p>
  <p>Supporting <strong>Claude Code</strong> and <strong>Gemini CLI</strong></p>
  <p>支持 <strong>Claude Code</strong> 和 <strong>Gemini CLI</strong></p>
</div>