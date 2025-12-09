#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LanguageDetector } from './languageDetector.js';
import type { LanguageDetectionResult } from './types.js';

// Language code to human-readable name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'en-US': 'English (United States)',
  'en-GB': 'English (United Kingdom)',
  'zh': 'Chinese',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zh-HK': 'Chinese (Hong Kong)',
  'ja': 'Japanese',
  'ja-JP': 'Japanese',
  'es': 'Spanish',
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Spanish (Mexico)',
  'fr': 'French',
  'fr-FR': 'French (France)',
  'de': 'German',
  'de-DE': 'German (Germany)',
  'ko': 'Korean',
  'ko-KR': 'Korean',
  'pt': 'Portuguese',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ru': 'Russian',
  'ru-RU': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'it': 'Italian',
  'it-IT': 'Italian',
  'nl': 'Dutch',
  'nl-NL': 'Dutch',
  'pl': 'Polish',
  'pl-PL': 'Polish',
  'tr': 'Turkish',
  'tr-TR': 'Turkish',
  'vi': 'Vietnamese',
  'vi-VN': 'Vietnamese',
  'th': 'Thai',
  'th-TH': 'Thai'
};

function generateLanguagePrompt(result: LanguageDetectionResult): string {
  const fullLanguage = result.language;
  const baseLanguage = fullLanguage.split('-')[0];
  const languageName = LANGUAGE_NAMES[fullLanguage] || LANGUAGE_NAMES[baseLanguage] || fullLanguage;

  return `The user's preferred natural language is ${languageName} (${fullLanguage}).

Please communicate with the user in ${languageName} unless they explicitly request a different language or the context requires English (e.g., code comments, technical documentation, or when discussing English-specific topics).

This language preference was detected from: ${result.source}
Detection confidence: ${result.confidence}`;
}

async function main() {
  // Initialize language detector
  const detector = new LanguageDetector();
  const languageResult = await detector.detect();

  // Create MCP server
  const server = new McpServer(
    {
      name: 'preferred-natural-language',
      version: '1.0.0'
    },
    {
      capabilities: {
        resources: {},
        prompts: {}
      }
    }
  );

  // Register MCP Resource - provides language information
  server.registerResource(
    'Language Preference',
    'language://preference',
    {
      description: 'User\'s preferred natural language for interactions',
      mimeType: 'application/json'
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify({
              language: languageResult.language,
              source: languageResult.source,
              confidence: languageResult.confidence,
              detectedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  );

  // Register MCP Prompt - instructs Gemini to use detected language
  server.registerPrompt(
    'use-preferred-language',
    {
      description: 'Instructs the AI to communicate in the user\'s preferred language'
    },
    async () => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: generateLanguagePrompt(languageResult)
            }
          }
        ]
      };
    }
  );

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log detection result to stderr (stdout is used for MCP protocol)
  console.error(`[Preferred Natural Language] Detected: ${languageResult.language} (source: ${languageResult.source}, confidence: ${languageResult.confidence})`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
