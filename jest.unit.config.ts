import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  displayName: 'unit',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ES2022',
          moduleResolution: 'node'
        }
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@preferred-natural-language/shared(.*)$': '<rootDir>/packages/shared/src$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(os-locale)/)'
  ],
  testMatch: [
    '<rootDir>/packages/*/__tests__/unit/**/*.test.ts',
    '<rootDir>/packages/*/__tests__/unit/**/*.spec.ts',
    '<rootDir>/packages/*/__tests__/*.test.ts',
    '<rootDir>/packages/*/__tests__/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/integration/',
    '/__tests__/e2e/'
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};

export default config;