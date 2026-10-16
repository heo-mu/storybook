import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
  features: {
    // Required by the Storybook MCP docs toolset (docs-list / docs-show).
    componentsManifest: true,
  },
};
export default config;
