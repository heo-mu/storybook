import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { SEGMENTED_CONTROL_SIZES } from './SegmentedControl.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/SegmentedControl.showcase.stories.tsx
const meta = {
  title: 'Components/SegmentedControl/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **segmented-control** (531:24471) and **segmented-item** (524:24397). Size → `size` (md · sm · xs), ' +
          'items → `SegmentedControlItem` children (`value`, label, `disabled`), Variant Selected → `value` / `defaultValue` / `onChange`. ' +
          'Items share the width equally; set the control width with `style` / `className`. Native radios (role="radiogroup"); ' +
          'label it with `aria-label` or `aria-labelledby`.',
      },
    },
  },
  args: {
    'aria-label': '기간',
    size: 'md',
    defaultValue: 'week',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SEGMENTED_CONTROL_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Figma State "Disabled" (all items)' },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="day">일간</SegmentedControlItem>
      <SegmentedControlItem value="week">주간</SegmentedControlItem>
      <SegmentedControlItem value="month">월간</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const ExtraSmall: Story = {
  args: { size: 'xs' },
};

export const FullWidth: Story = {
  args: { style: { width: 316 } },
};

export const Disabled: Story = {
  args: { disabled: true },
};
