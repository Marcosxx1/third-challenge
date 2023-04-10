module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/tests/.*/.*|(\\.|/)(test|spec))\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true, // Enable ESM support
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  resolver: 'jest-ts-webcompat-resolver',
  transformIgnorePatterns: [], // Remove ignore patterns for transforms
};
