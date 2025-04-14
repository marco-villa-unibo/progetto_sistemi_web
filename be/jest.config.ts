import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  testMatch: [
    '<rootDir>/src/tests/**/*.test.ts', // test unitari
    '<rootDir>/tests/**/*.test.ts', // test integrazione
  ],
  // automock: true,
};
export default jestConfig;
