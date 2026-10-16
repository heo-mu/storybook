import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { LINK_SIZES } from './Link.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Link.showcase.stories.tsx
const meta = {
  title: 'Components/Link/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **link** (111:1509, 15 variants): underlined text link. Size → `size` (sm · md · lg), Label Text → children, ' +
          'Icon (arrow-square-out) → `showIcon` (default: `external`). `external` opens a new tab and announces "(새 창)". ' +
          'State: Hover / Pressed / Visited = :hover / :active / :visited, Disabled = `disabled` (no href, aria-disabled). Native `<a>`.',
      },
    },
  },
  args: {
    children: '라벨명',
    href: '#',
    size: 'sm',
    external: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: LINK_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    showIcon: { control: 'boolean', description: 'Figma "Icon"' },
    external: { control: 'boolean' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const External: Story = {
  args: { href: 'https://www.figma.com', external: true, children: 'Figma 열기' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
