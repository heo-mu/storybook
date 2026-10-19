import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from './Chip';
import { CHIP_SIZES } from './Chip.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Chip.showcase.stories.tsx
const meta = {
  title: 'Components/Chip/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **chip-multi** (201:12711, 24 variants) — toggle chip for multi-select filters. ' +
          'Variant Selected → `selected` / `defaultSelected` / `onSelectedChange` (check icon after the label), Size → `size` ' +
          '(xs · sm · md), Label Text → children. State: Hover / Pressed are :hover / :active, Disabled = `disabled`. ' +
          'Renders `<button aria-pressed>`. See also `InputChip` (chip-input) and `FilterChip` (chip-filter).',
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    disabled: false,
    onSelectedChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    defaultSelected: { control: 'boolean', description: 'Figma Variant "Selected" (uncontrolled)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: { defaultSelected: true },
};

export const Medium: Story = {
  args: { size: 'md', defaultSelected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Several chips as a multi-select filter (wrap them in a labelled group). */
export const Group: Story = {
  render: (args) => (
    <div role="group" aria-label="상태" style={{ display: 'flex', gap: 'var(--spacing-margin-m-1)' }}>
      <Chip {...args} defaultSelected>
        진행 중
      </Chip>
      <Chip {...args}>완료</Chip>
      <Chip {...args}>보류</Chip>
    </div>
  ),
};
