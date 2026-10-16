import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Breadcrumb } from './Breadcrumb';
import { BREADCRUMB_LAYOUTS, BREADCRUMB_SIZES } from './Breadcrumb.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Breadcrumb.showcase.stories.tsx
const meta = {
  title: 'Components/Breadcrumb/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **breadcrumb** (712:5106, 6 variants), **breadcrumb-item** (710:4794, 12) and ' +
          '**breadcrumb-modern-separator** (710:4795). Pass the ancestors as `items` (top level → parent) and the page name as ' +
          '`current`; the home item (House icon) links to `homeHref`. Size → `size`, Layout → `layout`, Expanded → ' +
          '`expanded` / `defaultExpanded` (overflow menu of the collapsed layout), Show Parent → `showParent`. ' +
          '`BreadcrumbItem` (Role Link / Current / Open) is exported for custom layouts.',
      },
    },
  },
  args: {
    items: [
      { label: '에너지 관리', href: '#energy' },
      { label: '에너지 절약', href: '#saving' },
      { label: '프로그램 목록', href: '#programs' },
    ],
    current: '프로그램 등록',
    size: 'md',
    layout: 'full',
    showParent: true,
    onExpandedChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: BREADCRUMB_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'md' } } },
    layout: { control: 'inline-radio', options: BREADCRUMB_LAYOUTS, description: 'Figma "Layout"', table: { defaultValue: { summary: 'full' } } },
  },
  decorators: [(Story) => <div style={{ minHeight: 180 }}>{Story()}</div>],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Collapsed: Story = {
  args: { layout: 'collapsed' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

/** Collapsed without the parent (Figma Show Parent off): home · overflow · current page. */
export const CollapsedWithoutParent: Story = {
  args: { layout: 'collapsed', showParent: false },
};
