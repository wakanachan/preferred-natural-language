import os from 'os';
import path from 'path';

export const CONFIG_FILE_NAME = '.preferred-language.json';

export const CONFIG_SEARCH_PATHS = [
  // Project-level config (highest priority after env vars)
  process.cwd(),

  // User-level config (XDG Base Directory spec for Linux/macOS)
  path.join(
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
    'preferred-language'
  ),

  // Windows-specific AppData path
  ...(process.platform === 'win32' && process.env.APPDATA
    ? [path.join(process.env.APPDATA, 'preferred-language')]
    : [])
];

export const DEFAULT_LANGUAGE = 'en-US';

export const CUSTOM_ENV_VARS = [
  'GEMINI_CLI_NATURAL_LANGUAGE',
  'CLAUDE_CODE_NATURAL_LANGUAGE'
] as const;

export const STANDARD_ENV_VARS = [
  'LANGUAGE',
  'LC_ALL',
  'LC_MESSAGES',
  'LANG'
] as const;
