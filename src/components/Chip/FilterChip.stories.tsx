import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChip } from './FilterChip';
import { CHIP_SIZES } from './Chip.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Chip.showcase.stories.tsx
const meta = {
  title: 'Components/Chip/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **chip-filter** (558:25704, 48 variants) — a chip that opens a filter menu or panel (caret). ' +
          'Variant Selected → `selected` (a value is applied), Expanded → `expanded` (caret up, `aria-expanded`), Size → `size`, ' +
          'Label Text → children, State Disabled → `disabled`. Built on the react-aria `Button`: `onPress` / `onClick`, and it can be ' +
          'the trigger of react-aria overlays (MenuTrigger, DialogTrigger), which set the expanded state automatically.',
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    selected: false,
    expanded: false,
    disabled: false,
    onPress: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    selected: { control: 'boolean', description: 'Figma Variant "Selected"' },
    expanded: { control: 'boolean', description: 'Figma "Expanded"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: { selected: true, children: '담당자: 김민지' },
};

export const Expanded: Story = {
  args: { expanded: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
