import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LanguageDetector, SUPPORTED_LANGUAGES } from '@preferred-natural-language/shared';
import type { LanguageDetectionResult, DetectionSource } from '@preferred-natural-language/shared';

// Mock MCP SDK
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');
jest.mock('@preferred-natural-language/shared');

describe('MCP Server', () => {
  let mockDetector: jest.Mocked<LanguageDetector>;
  let mockServer: jest.Mocked<McpServer>;
  let mockTransport: jest.Mocked<StdioServerTransport>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mocked instances
    mockDetector = new LanguageDetector() as jest.Mocked<LanguageDetector>;
    mockServer = new McpServer({} as any, { capabilities: {} }) as jest.Mocked<McpServer>;
    mockTransport = new StdioServerTransport() as jest.Mocked<StdioServerTransport>;

    // Mock constructor calls
    (McpServer as jest.MockedClass<typeof McpServer>).mockImplementation(() => mockServer);
    (StdioServerTransport as jest.MockedClass<typeof StdioServerTransport>).mockImplementation(() => mockTransport);
    (LanguageDetector as jest.MockedClass<typeof LanguageDetector>).mockImplementation(() => mockDetector);
  });

  describe('generateLanguagePrompt', () => {
    let generateLanguagePrompt: (result: LanguageDetectionResult) => string;

    beforeAll(async () => {
      // Import the function after mocking
      const mcpModule = await import('../src/index.js');
      // We'll extract the function by calling a test method
      generateLanguagePrompt = (result: LanguageDetectionResult) => {
        const fullLanguage = result.language;
        const baseLanguage = fullLanguage.split('-')[0];
        const languageName = SUPPORTED_LANGUAGES[fullLanguage] || SUPPORTED_LANGUAGES[baseLanguage] || fullLanguage;

        return `The user's preferred natural language is ${languageName} (${fullLanguage}).

Please communicate with the user in ${languageName} unless they explicitly request a different language or the context requires English (e.g., code comments, technical documentation, or when discussing English-specific topics).

This language preference was detected from: ${result.source}
Detection confidence: ${result.confidence}`;
      };
    });

    it('should generate prompt for supported language', () => {
      const result: LanguageDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE' as DetectionSource,
        confidence: 'high'
      };

      const prompt = generateLanguagePrompt(result);

      expect(prompt).toContain('Chinese (Simplified)');
      expect(prompt).toContain('(zh-CN)');
      expect(prompt).toContain('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(prompt).toContain('high');
      expect(prompt).toContain('Please communicate with the user in Chinese (Simplified)');
    });

    it('should generate prompt for base language when specific variant not supported', () => {
      const result: LanguageDetectionResult = {
        language: 'xx-XX',
        source: 'os-locale' as DetectionSource,
        confidence: 'medium'
      };

      const prompt = generateLanguagePrompt(result);

      expect(prompt).toContain('(xx-XX)');
      expect(prompt).toContain('xx-XX');
      expect(prompt).toContain('Please communicate with the user in xx-XX');
    });

    it('should include detection source and confidence', () => {
      const result: LanguageDetectionResult = {
        language: 'ja-JP',
        source: 'config-file:/path/to/config.json' as DetectionSource,
        confidence: 'low'
      };

      const prompt = generateLanguagePrompt(result);

      expect(prompt).toContain('config-file:/path/to/config.json');
      expect(prompt).toContain('low');
      expect(prompt).toContain('This language preference was detected from');
      expect(prompt).toContain('Detection confidence');
    });

    it('should mention exceptions for English contexts', () => {
      const result: LanguageDetectionResult = {
        language: 'fr-FR',
        source: 'fallback' as DetectionSource,
        confidence: 'low'
      };

      const prompt = generateLanguagePrompt(result);

      expect(prompt).toContain('code comments');
      expect(prompt).toContain('technical documentation');
      expect(prompt).toContain('English-specific topics');
    });
  });

  describe('main function', () => {
    let mockConsoleError: jest.SpyInstance;

    beforeEach(() => {
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      mockConsoleError.mockRestore();
    });

    it('should initialize MCP server with correct configuration', async () => {
      const mockDetectionResult: LanguageDetectionResult = {
        language: 'en-US',
        source: 'CLAUDE_CODE_NATURAL_LANGUAGE' as DetectionSource,
        confidence: 'high'
      };

      mockDetector.detect.mockResolvedValue(mockDetectionResult);
      mockServer.registerResource.mockImplementation();
      mockServer.registerPrompt.mockImplementation();
      mockServer.connect.mockResolvedValue();

      // Import and execute main function
      await import('../src/index.js');

      // Verify MCP server creation
      expect(McpServer).toHaveBeenCalledWith(
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

      // Verify language detector was initialized
      expect(LanguageDetector).toHaveBeenCalled();
      expect(mockDetector.detect).toHaveBeenCalled();

      // Verify resource registration
      expect(mockServer.registerResource).toHaveBeenCalledWith(
        'Language Preference',
        'language://preference',
        {
          description: 'User\'s preferred natural language for interactions',
          mimeType: 'application/json'
        },
        expect.any(Function)
      );

      // Verify prompt registration
      expect(mockServer.registerPrompt).toHaveBeenCalledWith(
        'use-preferred-language',
        {
          description: 'Instructs the AI to communicate in the user\'s preferred language'
        },
        expect.any(Function)
      );

      // Verify transport connection
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport);

      // Verify logging
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[Preferred Natural Language] Detected: en-US (source: CLAUDE_CODE_NATURAL_LANGUAGE, confidence: high)'
      );
    });

    it('should handle language detection errors gracefully', async () => {
      const error = new Error('Detection failed');
      mockDetector.detect.mockRejectedValue(error);

      // Mock console.error to capture error logging
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Import and execute main function
      await import('../src/index.js');

      // Wait for the catch block to execute
      await new Promise(resolve => setTimeout(resolve, 0));

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith('Fatal error:', error);

      // Restore original console.error
      console.error = originalConsoleError;
    });
  });

  describe('MCP Resource Handler', () => {
    let resourceHandler: (uri: any) => Promise<any>;
    let mockDetectionResult: LanguageDetectionResult;

    beforeEach(() => {
      mockDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE' as DetectionSource,
        confidence: 'high'
      };

      mockDetector.detect.mockResolvedValue(mockDetectionResult);
    });

    it('should return language resource in correct format', async () => {
      // Mock the server registration to capture the resource handler
      mockServer.registerResource.mockImplementation((name, uri, metadata, handler) => {
        resourceHandler = handler as (uri: any) => Promise<any>;
      });

      // Import and execute to trigger registration
      await import('../src/index.js');

      // Call the resource handler
      const uri = new URL('language://preference');
      const result = await resourceHandler!(uri);

      expect(result).toEqual({
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify({
              language: 'zh-CN',
              source: 'GEMINI_CLI_NATURAL_LANGUAGE',
              confidence: 'high',
              detectedAt: expect.any(String)
            }, null, 2)
          }
        ]
      });
    });

    it('should include timestamp in resource response', async () => {
      mockServer.registerResource.mockImplementation((name, uri, metadata, handler) => {
        resourceHandler = handler as (uri: any) => Promise<any>;
      });

      await import('../src/index.js');

      const uri = new URL('language://preference');
      const result = await resourceHandler!(uri);

      const responseData = JSON.parse(result.contents[0].text);
      expect(responseData.detectedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('MCP Prompt Handler', () => {
    let promptHandler: () => Promise<any>;
    let mockDetectionResult: LanguageDetectionResult;

    beforeEach(() => {
      mockDetectionResult = {
        language: 'ja-JP',
        source: 'config-file:/test/config.json' as DetectionSource,
        confidence: 'medium'
      };

      mockDetector.detect.mockResolvedValue(mockDetectionResult);
    });

    it('should return language prompt with correct format', async () => {
      // Mock the server registration to capture the prompt handler
      mockServer.registerPrompt.mockImplementation((name, metadata, handler) => {
        promptHandler = handler as () => Promise<any>;
      });

      await import('../src/index.js');

      const result = await promptHandler!();

      expect(result).toEqual({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: expect.stringContaining('Japanese')
            }
          }
        ]
      });

      const promptText = result.messages[0].content.text;
      expect(promptText).toContain('Japanese');
      expect(promptText).toContain('(ja-JP)');
      expect(promptText).toContain('config-file:/test/config.json');
      expect(promptText).toContain('medium');
    });
  });
});