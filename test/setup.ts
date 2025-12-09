import { jest } from '@jest/globals';

// Global test setup
global.console = {
  ...console,
  // Silence console.log in tests unless explicitly needed
  log: process.env.VERBOSE_TESTS ? console.log : jest.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// Mock environment variables
const originalEnv = { ...process.env };

beforeEach(() => {
  // Reset environment variables before each test
  process.env = { ...originalEnv };
});

afterEach(() => {
  // Restore environment variables after each test
  process.env = originalEnv;
});