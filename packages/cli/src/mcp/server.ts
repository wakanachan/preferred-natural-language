#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';
import type { LanguageDetectionResult } from '@preferred-natural-language/shared';

function generateLanguagePrompt(result: LanguageDetectionResult): string {
  const fullLanguage = result.language;
  const baseLanguage = fullLanguage.split('-')[0];
  const languageName = SUPPORTED_LANGUAGES[fullLanguage] || SUPPORTED_LANGUAGES[baseLanguage] || fullLanguage;

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
        prompts: {},
        tools: {}
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
              languageName: SUPPORTED_LANGUAGES[languageResult.language] || languageResult.language,
              source: languageResult.source,
              confidence: languageResult.confidence,
              detectedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  );

  // Register MCP Prompt - instructs the AI to use detected language
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

  // Register MCP Tool - detect language on demand
  server.registerTool(
    'detect-language',
    {
      description: 'Detect the user\'s preferred natural language',
      inputSchema: {
        type: 'object',
        properties: {},
      } as any
    },
    async () => {
      // Re-detect in case settings changed
      const freshResult = await detector.detect();
      const languageName = SUPPORTED_LANGUAGES[freshResult.language] || freshResult.language;

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              language: freshResult.language,
              languageName: languageName,
              source: freshResult.source,
              confidence: freshResult.confidence,
              prompt: generateLanguagePrompt(freshResult)
            }, null, 2)
          }
        ]
      };
    }
  );

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log detection result to stderr (stdout is used for MCP protocol)
  console.error(`[Preferred Natural Language MCP] Detected: ${languageResult.language} (source: ${languageResult.source}, confidence: ${languageResult.confidence})`);
  console.error(`[Preferred Natural Language MCP] Server started successfully`);
}

main().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});
