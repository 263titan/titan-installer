import type { Config } from 'jest';
const config: Config = {
  displayName: '@titan/common',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@titan/common(.*)$': '<rootDir>/src$1',
  },
  coverageDirectory: '../../coverage/libs/common',
};
export default config;
