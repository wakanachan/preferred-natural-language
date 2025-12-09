#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';
import type { LanguageDetectionResult } from '@preferred-natural-language/shared';
import { promises as fs } from 'fs';
import path from 'path';

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

  // Create MCP server with resource subscription capability
  const server = new McpServer(
    {
      name: 'preferred-natural-language',
      version: '1.0.0'
    },
    {
      capabilities: {
        resources: {
          subscribe: true,
          listChanged: true
        },
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
      try {
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
      } catch (error: any) {
        console.error('[MCP Resource] Error providing language preference:', error);
        // Return fallback data
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'application/json',
              text: JSON.stringify({
                language: 'en-US',
                languageName: 'English (United States)',
                source: 'fallback',
                confidence: 'low',
                error: error.message,
                detectedAt: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  // Register MCP Prompt - instructs the AI to use detected language
  server.registerPrompt(
    'use-preferred-language',
    {
      description: 'Instructs the AI to communicate in the user\'s preferred language'
    },
    async () => {
      try {
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
      } catch (error: any) {
        console.error('[MCP Prompt] Error generating language prompt:', error);
        // Return fallback prompt
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: 'Please communicate with the user in English.'
              }
            }
          ]
        };
      }
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
      try {
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
      } catch (error: any) {
        console.error('[MCP Tool: detect-language] Error detecting language:', error);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: error.message,
                message: 'Failed to detect language preference',
                fallback: {
                  language: 'en-US',
                  languageName: 'English (United States)',
                  source: 'fallback',
                  confidence: 'low'
                }
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    }
  );

  // Register MCP Tool - set language preference
  server.registerTool(
    'set-language',
    {
      description: 'Set the preferred natural language by creating/updating .preferred-language.json',
      inputSchema: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            description: 'BCP-47 language code (e.g., zh-CN, en-US, ja-JP, ko-KR, fr-FR, de-DE, es-ES, pt-BR)'
          },
          fallback: {
            type: 'string',
            description: 'Optional fallback language code (defaults to en-US)'
          }
        },
        required: ['language']
      } as any
    },
    async (args: any) => {
      const { language, fallback = 'en-US' } = args;

      // Validate language code
      const baseLanguage = language.split('-')[0];
      if (!SUPPORTED_LANGUAGES[language] && !SUPPORTED_LANGUAGES[baseLanguage]) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: `Unsupported language: ${language}`,
                message: 'Use list-languages tool to see all supported languages'
              }, null, 2)
            }
          ],
          isError: true
        };
      }

      // Write configuration file
      const configPath = path.join(process.cwd(), '.preferred-language.json');
      const config = { language, fallback };

      try {
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
        const languageName = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES[baseLanguage] || language;

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: true,
                language: language,
                languageName: languageName,
                fallback: fallback,
                configPath: configPath,
                message: `Language preference set to ${languageName} (${language})`
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: error.message,
                message: 'Failed to write configuration file'
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    }
  );

  // Register MCP Tool - list supported languages
  server.registerTool(
    'list-languages',
    {
      description: 'List all supported languages (70+ languages and regional variants)',
      inputSchema: {
        type: 'object',
        properties: {},
      } as any
    },
    async () => {
      try {
        // Validate SUPPORTED_LANGUAGES is available
        if (!SUPPORTED_LANGUAGES || typeof SUPPORTED_LANGUAGES !== 'object') {
          throw new Error('SUPPORTED_LANGUAGES is not available');
        }

        // Convert SUPPORTED_LANGUAGES object to sorted array
        const languageList = Object.entries(SUPPORTED_LANGUAGES)
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                total: languageList.length,
                languages: languageList
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        console.error('[MCP Tool: list-languages] Error listing languages:', error);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: error.message,
                message: 'Failed to retrieve list of supported languages'
              }, null, 2)
            }
          ],
          isError: true
        };
      }
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
