module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts}',
  ],
  coverageDirectory: 'log',
  coverageReporters: ['lcov', 'text', 'cobertura'],
  reporters: [
    'default',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.{js,ts}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/mocks.ts',
    '<rootDir>/tests/testContainer.ts',
  ],
  maxConcurrency: 1,
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};
