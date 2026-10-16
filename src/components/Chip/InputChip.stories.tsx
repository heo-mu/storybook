import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputChip } from './InputChip';
import { CHIP_SIZES } from './Chip.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Chip.showcase.stories.tsx
const meta = {
  title: 'Components/Chip/InputChip',
  component: InputChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **chip-input** (558:26017, 12 variants) — an entered value with a remove (X) icon. ' +
          'The whole chip is the remove button: click, Enter, Space, Delete or Backspace call `onRemove`. ' +
          'Size → `size`, Label Text → children, State Disabled → `disabled`. The accessible name is the label + `removeLabel` ("삭제").',
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    disabled: false,
    onRemove: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
  },
} satisfies Meta<typeof InputChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
