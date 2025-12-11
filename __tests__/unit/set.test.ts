import { SetCommand } from '../../src/cli/commands/set.js';
import { createMockLanguageDetector, createMockI18n } from '../helpers/mockFactory.js';
import { promises as fs } from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

describe('SetCommand', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.writeFile.mockResolvedValue(undefined);
  });

  describe('execute', () => {
    it('should set language preference successfully', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('zh-CN');

      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), '.preferred-language.json'),
        JSON.stringify({ language: 'zh-CN' }, null, 2),
        'utf-8'
      );
      expect(result).toBeDefined();
      expect(mockI18n.t).toHaveBeenCalledWith('set.success', expect.any(Object));
    });

    it('should return error when language code is missing', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('');

      expect(mockFs.writeFile).not.toHaveBeenCalled();
      expect(mockI18n.t).toHaveBeenCalledWith('set.errorMissingCode');
      expect(mockI18n.t).toHaveBeenCalledWith('set.commonLanguages', expect.any(Object));
    });

    it('should return error for unsupported language code', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('invalid-lang');

      expect(mockFs.writeFile).not.toHaveBeenCalled();
      expect(mockI18n.t).toHaveBeenCalledWith('set.errorUnsupported', { language: 'invalid-lang' });
      expect(mockI18n.t).toHaveBeenCalledWith('set.errorUnsupportedHint');
    });

    it('should work with various supported languages (en-US)', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('en-US');

      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should work with various supported languages (de-DE)', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('de-DE');

      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should work with various supported languages (ja-JP)', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      const result = await command.execute('ja-JP');

      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should handle file write errors', async () => {
      mockFs.writeFile.mockRejectedValue(new Error('Write failed'));
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);

      await expect(command.execute('zh-CN')).rejects.toThrow();
      expect(mockI18n.t).toHaveBeenCalledWith('set.errorSaveFailed', expect.any(Object));
    });

    it('should create config file in current working directory', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      await command.execute('fr-FR');

      const expectedPath = path.join(process.cwd(), '.preferred-language.json');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(String),
        'utf-8'
      );
    });

    it('should format config file with 2-space indentation', async () => {
      const mockDetector = createMockLanguageDetector();
      const mockI18n = createMockI18n('en', 'high');

      const command = new SetCommand(mockDetector as any, mockI18n as any);
      await command.execute('es-ES');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({ language: 'es-ES' }, null, 2),
        'utf-8'
      );
    });
  });
});
