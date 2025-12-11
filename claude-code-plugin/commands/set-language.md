---
description: Set the preferred natural language for Claude Code
---

Please use the MCP tool `set-language` to configure the user's preferred natural language.

**Parameters:**
- `language` (required): BCP-47 language code (e.g., zh-CN, en-US, ja-JP, ko-KR, fr-FR, de-DE, es-ES, pt-BR)
- `fallback` (optional): Fallback language code (defaults to en-US)

**What this tool does:**
- Creates or updates `.preferred-language.json` in the project root
- Sets the specified language as the highest priority preference
- Validates the language code against supported languages

**Usage tip:** If you're unsure which language codes are supported, use the `/list-languages` command first to see all available options.
