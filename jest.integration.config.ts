import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  displayName: 'integration',
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
    '<rootDir>/packages/*/__tests__/integration/**/*.test.ts',
    '<rootDir>/packages/*/__tests__/integration/**/*.spec.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: []
};

export default config;