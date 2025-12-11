import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { osLocale } from 'os-locale';
import type { LanguageDetectionResult, LanguageConfig } from './types.js';
import {
  CONFIG_FILE_NAME,
  CONFIG_SEARCH_PATHS,
  DEFAULT_LANGUAGE,
  CUSTOM_ENV_VARS,
  STANDARD_ENV_VARS
} from './config.js';

export class LanguageDetector {
  async detect(): Promise<LanguageDetectionResult> {
    try {
      // Priority 1: Configuration file (highest priority according to tests)
      const configFile = await this.checkConfigFile();
      if (configFile) return configFile;

      // Priority 2: Custom environment variables
      const customEnv = this.checkCustomEnvironment();
      if (customEnv) return customEnv;

      // Priority 3: OS language settings
      const osLocaleResult = await this.checkOSLocale();
      if (osLocaleResult) return osLocaleResult;

      // Priority 4: Standard environment variables
      const stdEnv = this.checkStandardEnvironment();
      if (stdEnv) return stdEnv;

      // Priority 5: Browser Accept-Language (if in web environment)
      const browser = this.checkBrowserLanguage();
      if (browser) return browser;

      // Fallback: Default to English
      return this.getFallbackLanguage();
    } catch (error) {
      // Log error but never fail - always return a result
      console.error('Language detection error:', error);
      return this.getFallbackLanguage();
    }
  }

  private checkCustomEnvironment(): LanguageDetectionResult | null {
    for (const varName of CUSTOM_ENV_VARS) {
      const value = process.env[varName];
      if (value) {
        const normalizedLanguage = this.normalizeLanguageTag(value);
        if (normalizedLanguage) {
          return {
            language: normalizedLanguage,
            source: varName,
            confidence: 'high'
          };
        }
      }
    }
    return null;
  }

  private async checkConfigFile(): Promise<LanguageDetectionResult | null> {
    for (const searchPath of CONFIG_SEARCH_PATHS) {
      const configPath = path.join(searchPath, CONFIG_FILE_NAME);
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        const config: LanguageConfig = JSON.parse(content);
        if (config.language) {
          const normalizedLanguage = this.normalizeLanguageTag(config.language);
          if (normalizedLanguage) {
            return {
              language: normalizedLanguage,
              source: `config-file:${configPath}`,
              confidence: 'high'
            };
          }
        }
      } catch {
        // File doesn't exist or invalid JSON, continue to next
        continue;
      }
    }
    return null;
  }

  private async checkOSLocale(): Promise<LanguageDetectionResult | null> {
    try {
      const locale = await osLocale();
      return {
        language: this.normalizeLanguageTag(locale),
        source: 'os-locale',
        confidence: 'medium'
      };
    } catch (error) {
      return null;
    }
  }

  private checkStandardEnvironment(): LanguageDetectionResult | null {
    // Check in priority order: LANGUAGE > LC_ALL > LC_MESSAGES > LANG
    for (const varName of STANDARD_ENV_VARS) {
      const value = process.env[varName];
      if (value && value !== 'undefined') {
        // LANGUAGE can have multiple locales separated by colons
        const primaryLocale = value.split(':')[0];
        const normalizedLanguage = this.normalizeLanguageTag(primaryLocale);
        if (normalizedLanguage) {
          return {
            language: normalizedLanguage,
            source: varName,
            confidence: 'medium'
          };
        }
      }
    }
    return null;
  }

  private checkBrowserLanguage(): LanguageDetectionResult | null {
    // Only applicable in web environments (not typical for stdio MCP)
    // Check for Accept-Language header if running in HTTP context
    const acceptLanguage = process.env.HTTP_ACCEPT_LANGUAGE;

    if (acceptLanguage) {
      // Parse "en-US,en;q=0.9,zh-CN;q=0.8" format
      const primaryLang = acceptLanguage.split(',')[0].split(';')[0].trim();
      const normalizedLanguage = this.normalizeLanguageTag(primaryLang);
      if (normalizedLanguage) {
        return {
          language: normalizedLanguage,
          source: 'HTTP_ACCEPT_LANGUAGE',
          confidence: 'low'
        };
      }
    }

    return null;
  }

  private normalizeLanguageTag(tag: string): string {
    if (!tag || typeof tag !== 'string') {
      return '';
    }

    // Convert locale formats to BCP-47
    // Examples:
    //   en_US -> en-US
    //   zh_CN.UTF-8 -> zh-CN
    //   en -> en

    const cleaned = tag.split('.')[0]; // Remove encoding (e.g., UTF-8)
    const normalized = cleaned.replace('_', '-');

    // Validate basic BCP-47 format: language-code(-country-code)?
    const bcp47Pattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!bcp47Pattern.test(normalized)) {
      return ''; // Invalid format
    }

    return normalized;
  }

  private getFallbackLanguage(): LanguageDetectionResult {
    return {
      language: DEFAULT_LANGUAGE,
      source: 'fallback',
      confidence: 'low'
    };
  }
}
