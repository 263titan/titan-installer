import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async (config) => {
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
    config.optimizeDeps.esbuildOptions.target = 'es2022';

    config.build = config.build || {};
    config.build.target = 'es2022';

    return config;
  },
};

export default config;
