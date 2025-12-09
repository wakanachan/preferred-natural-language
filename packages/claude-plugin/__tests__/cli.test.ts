import { PreferredNaturalLanguagePlugin } from '../src/cli.js';
import { LanguageDetector } from '@preferred-natural-language/shared';
import type { PluginContext, DetectionSource } from '@preferred-natural-language/shared';
import { DetectCommand } from '../src/commands/detect.js';
import { SetCommand } from '../src/commands/set.js';
import { ShowCommand } from '../src/commands/show.js';
import { ListCommand } from '../src/commands/list.js';

// Mock all command classes
jest.mock('../src/commands/detect.js');
jest.mock('../src/commands/set.js');
jest.mock('../src/commands/show.js');
jest.mock('../src/commands/list.js');

describe('PreferredNaturalLanguagePlugin', () => {
  let plugin: PreferredNaturalLanguagePlugin;
  let mockContext: PluginContext;
  let mockDetector: LanguageDetector;

  beforeEach(() => {
    plugin = new PreferredNaturalLanguagePlugin();
    mockContext = {
      workspace: {
        rootPath: '/test/workspace'
      },
      environment: {}
    };

    // Get the detector instance from the plugin for mocking
    mockDetector = (plugin as any).detector;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should store the provided context', async () => {
      await plugin.initialize(mockContext);

      // Check that context is stored (we can verify this indirectly)
      expect(await plugin.execute('detect', [])).toBeDefined();
    });

    it('should handle empty context', async () => {
      await expect(plugin.initialize({} as PluginContext)).resolves.not.toThrow();
    });
  });

  describe('execute', () => {
    beforeEach(async () => {
      await plugin.initialize(mockContext);
    });

    it('should execute detect command', async () => {
      const mockDetectResult = 'Detection result';
      (DetectCommand.prototype.execute as jest.Mock).mockResolvedValue(mockDetectResult);

      const result = await plugin.execute('detect', []);

      expect(DetectCommand).toHaveBeenCalledWith(mockDetector);
      expect(DetectCommand.prototype.execute).toHaveBeenCalled();
      expect(result).toBe(mockDetectResult);
    });

    it('should execute set command with arguments', async () => {
      const mockSetResult = 'Language set result';
      const languageArg = 'zh-CN';
      (SetCommand.prototype.execute as jest.Mock).mockResolvedValue(mockSetResult);

      const result = await plugin.execute('set', [languageArg]);

      expect(SetCommand).toHaveBeenCalledWith(mockDetector);
      expect(SetCommand.prototype.execute).toHaveBeenCalledWith(languageArg);
      expect(result).toBe(mockSetResult);
    });

    it('should execute show command', async () => {
      const mockShowResult = 'Show result';
      (ShowCommand.prototype.execute as jest.Mock).mockResolvedValue(mockShowResult);

      const result = await plugin.execute('show', []);

      expect(ShowCommand).toHaveBeenCalledWith(mockDetector);
      expect(ShowCommand.prototype.execute).toHaveBeenCalled();
      expect(result).toBe(mockShowResult);
    });

    it('should execute list command', async () => {
      const mockListResult = 'List result';
      (ListCommand.prototype.execute as jest.Mock).mockResolvedValue(mockListResult);

      const result = await plugin.execute('list', []);

      expect(ListCommand).toHaveBeenCalled();
      expect(ListCommand.prototype.execute).toHaveBeenCalled();
      expect(result).toBe(mockListResult);
    });

    it('should execute config command', async () => {
      // Mock the detector
      const mockDetectionResult = {
        language: 'en-US',
        source: 'os-locale' as DetectionSource,
        confidence: 'medium'
      };
      jest.spyOn(mockDetector, 'detect').mockResolvedValue(mockDetectionResult);

      const result = await plugin.execute('config', []);

      expect(result).toContain('Preferred Natural Language 配置');
      expect(result).toContain('当前检测');
      expect(result).toContain('检测来源');
      expect(result).toContain('置信度');
      expect(result).toContain('可用命令');
    });

    it('should throw error for unknown command', async () => {
      await expect(plugin.execute('unknown', [])).rejects.toThrow('未知命令: unknown');
      await expect(plugin.execute('unknown', [])).rejects.toThrow('可用命令: detect, set, show, list, config');
    });

    it('should handle command execution errors', async () => {
      const errorMessage = 'Command failed';
      (DetectCommand.prototype.execute as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(plugin.execute('detect', [])).rejects.toThrow(errorMessage);
    });
  });

  describe('cleanup', () => {
    it('should clear context', async () => {
      await plugin.initialize(mockContext);
      await plugin.cleanup();

      // Should not throw when executing commands after cleanup
      await expect(plugin.execute('detect', [])).resolves.toBeDefined();
    });
  });

  describe('showInteractiveConfig', () => {
    beforeEach(async () => {
      await plugin.initialize(mockContext);
    });

    it('should display current language detection', async () => {
      const mockDetectionResult = {
        language: 'zh-CN',
        source: 'GEMINI_CLI_NATURAL_LANGUAGE' as DetectionSource,
        confidence: 'high'
      };
      jest.spyOn(mockDetector, 'detect').mockResolvedValue(mockDetectionResult);

      const result = await plugin.execute('config', []);

      expect(result).toContain('Chinese (Simplified)');
      expect(result).toContain('(zh-CN)');
      expect(result).toContain('GEMINI_CLI_NATURAL_LANGUAGE');
      expect(result).toContain('high');
    });

    it('should show available commands', async () => {
      const mockDetectionResult = {
        language: 'en-US',
        source: 'os-locale' as DetectionSource,
        confidence: 'medium'
      };
      jest.spyOn(mockDetector, 'detect').mockResolvedValue(mockDetectionResult);

      const result = await plugin.execute('config', []);

      expect(result).toContain('claude plugin preferred-natural-language detect');
      expect(result).toContain('claude plugin preferred-natural-language set <lang>');
      expect(result).toContain('claude plugin preferred-natural-language show');
      expect(result).toContain('claude plugin preferred-natural-language list');
    });

    it('should handle detection errors in config', async () => {
      jest.spyOn(mockDetector, 'detect').mockRejectedValue(new Error('Detection failed'));

      await expect(plugin.execute('config', [])).rejects.toThrow('Detection failed');
    });
  });

  describe('integration', () => {
    it('should handle multiple command executions', async () => {
      await plugin.initialize(mockContext);

      // Mock all commands
      (DetectCommand.prototype.execute as jest.Mock).mockResolvedValue('detect result');
      (SetCommand.prototype.execute as jest.Mock).mockResolvedValue('set result');
      (ShowCommand.prototype.execute as jest.Mock).mockResolvedValue('show result');
      (ListCommand.prototype.execute as jest.Mock).mockResolvedValue('list result');

      const results = await Promise.all([
        plugin.execute('detect', []),
        plugin.execute('set', ['zh-CN']),
        plugin.execute('show', []),
        plugin.execute('list', [])
      ]);

      expect(results).toHaveLength(4);
      expect(results[0]).toBe('detect result');
      expect(results[1]).toBe('set result');
      expect(results[2]).toBe('show result');
      expect(results[3]).toBe('list result');
    });
  });
});