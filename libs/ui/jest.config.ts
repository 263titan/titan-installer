import type { Config } from 'jest';
const config: Config = {
  displayName: 'ui',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  testMatch: ['**/+(*.)+(spec|test).+(ts|tsx|js)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@titan/(.*)$': '<rootDir>/../../libs/$1/src',
  },
};
export default config;
