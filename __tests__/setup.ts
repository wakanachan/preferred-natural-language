// Test setup file for Jest
// This file runs before each test suite

// Extend Jest matchers if needed
expect.extend({
  // Custom matchers can be added here
});

// Set default test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Keep log/error for debugging
  log: jest.fn(),
  error: jest.fn(),
  // Suppress debug/info/warn
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
