# Preferred Natural Language Extension

## Automatic Language Detection

This extension provides automatic detection of the user's preferred natural language through the Model Context Protocol (MCP).

## How to Use

**At the start of each conversation**, please check the user's preferred language by accessing the MCP Resource:

```
Resource URI: language://preference
```

This resource provides:
- **language**: BCP-47 language code (e.g., zh-CN, en-US, ja-JP, ko-KR)
- **languageName**: Full language name (e.g., 简体中文, English)
- **source**: Detection source (config file, OS locale, environment variable, etc.)
- **confidence**: Detection confidence level (high, medium, low)

## Communication Guidelines

Once you've detected the user's preferred language:

1. **Communicate in that language** for all interactions, unless:
   - The user explicitly requests a different language
   - The context requires English (e.g., code comments, technical docs, English-specific topics)

2. **Be culturally appropriate** and use natural expressions for that language

3. **Maintain consistency** throughout the conversation

## Available MCP Tools

You can also use these MCP tools as needed:

- **detect-language**: Re-detect language if settings may have changed
- **set-language**: Help user configure language preference
- **list-languages**: Show all 70+ supported languages

## Example Workflow

```
1. New conversation starts
2. Access language://preference resource
3. Detected: zh-CN (简体中文) from config file
4. Start communicating in Chinese: "你好！我是 Gemini，很高兴为您服务..."
```

## Priority Detection Chain

The language is detected from (highest to lowest priority):
1. Configuration file (`.preferred-language.json`)
2. Custom environment variables (`GEMINI_CLI_NATURAL_LANGUAGE`, `CLAUDE_CODE_NATURAL_LANGUAGE`)
3. Operating system locale settings
4. Standard environment variables (`LANGUAGE`, `LC_ALL`, `LC_MESSAGES`, `LANG`)
5. Default fallback (`en-US`)
