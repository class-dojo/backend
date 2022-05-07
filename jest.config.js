module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
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
  ],
  maxConcurrency: 1,
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};
