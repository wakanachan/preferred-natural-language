---
description: Set the preferred natural language for Claude Code
---

Configure your preferred natural language by creating or updating the `.preferred-language.json` configuration file.

Usage: Specify a BCP-47 language code (e.g., zh-CN, en-US, ja-JP, ko-KR, fr-FR, de-DE, es-ES, pt-BR).

This command will:
- Create or update `.preferred-language.json` in the project root
- Set the specified language as your preference
- Configure a fallback language (en-US by default)

The configuration file will be used as the highest priority source for language detection.
