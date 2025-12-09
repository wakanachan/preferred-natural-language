import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@preferred-natural-language/shared$': '<rootDir>/__mocks__/@preferred-natural-language/shared.ts',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!@preferred-natural-language)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/mcp/**/*.ts',
    '!src/cli/commands/show.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 60,
      statements: 60,
    },
    './src/cli/commands/detect.ts': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/cli/commands/set.ts': {
      branches: 75,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/cli/commands/list.ts': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
};

export default config;
