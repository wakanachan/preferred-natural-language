---
description: Detect the current system's preferred natural language setting
---

Run the language detection utility to show the currently detected language based on the priority chain:

1. Configuration file (.preferred-language.json)
2. Custom environment variables (CLAUDE_CODE_NATURAL_LANGUAGE, GEMINI_CLI_NATURAL_LANGUAGE)
3. Operating system locale settings
4. Standard environment variables (LANGUAGE, LC_ALL, LC_MESSAGES, LANG)
5. Default fallback (en-US)

The command will display the detected language code, detection source, and confidence level.
