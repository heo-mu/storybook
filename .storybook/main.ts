import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      // GitHub-flavored Markdown (tables) in the MDX docs pages.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-mcp',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    // The TypeScript-based docgen resolves the Variant/Appearance union and the literal size
    // unions (react-docgen reports them as `any`), so docs, controls, URL args and the MCP
    // manifest show the real Figma values.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Document the library's own props; native <button> attributes stay out of the table.
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  features: {
    // Required by the Storybook MCP docs toolset (docs-list / docs-show).
    componentsManifest: true,
  },
};
export default config;
