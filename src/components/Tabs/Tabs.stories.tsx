import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { TABS_APPEARANCES, TABS_SHAPES, TABS_SIZES, TABS_VARIANTS } from './Tabs.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Tabs.showcase.stories.tsx
const meta = {
  title: 'Components/Tabs/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **tab_filled** (91:5000, 60 variants) and **tab_line** (91:5241, 30 variants). Compose `Tabs` > `TabList` > `Tab` ' +
          'plus `TabPanel`s (matching `id`s). appearance → set, Variant → `variant`, Size → `size`, Shape → `shape` (filled), ' +
          'State Selected → `selectedKey` / `defaultSelectedKey`, Disabled → `Tab disabled`. Arrow keys / Home / End move between tabs ' +
          '(react-aria-components tablist).',
      },
    },
  },
  args: {
    appearance: 'line',
    variant: 'primary',
    size: 'sm',
    shape: 'square',
    defaultSelectedKey: 'all',
    onSelectionChange: fn(),
    children: null,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: TABS_APPEARANCES, description: 'Figma set (tab_line / tab_filled)' },
    variant: { control: 'inline-radio', options: TABS_VARIANTS, description: 'Figma "Variant"' },
    size: { control: 'inline-radio', options: TABS_SIZES, description: 'Figma "Size"' },
    shape: { control: 'inline-radio', options: TABS_SHAPES, description: 'Figma "Shape" (filled)' },
    children: { control: false },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="상태">
        <Tab id="all">전체</Tab>
        <Tab id="open">진행 중</Tab>
        <Tab id="done">완료</Tab>
        <Tab id="hold" disabled>
          보류
        </Tab>
      </TabList>
      <TabPanel id="all">전체 목록</TabPanel>
      <TabPanel id="open">진행 중 목록</TabPanel>
      <TabPanel id="done">완료 목록</TabPanel>
      <TabPanel id="hold">보류 목록</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = {
  args: { appearance: 'filled' },
};

export const FilledRounded: Story = {
  args: { appearance: 'filled', shape: 'rounded', variant: 'secondary', size: 'md' },
};

export const Large: Story = {
  args: { size: 'lg' },
};
