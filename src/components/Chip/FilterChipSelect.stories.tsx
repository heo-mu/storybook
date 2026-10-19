import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChipSelect } from './FilterChipSelect';
import { CHIP_SIZES } from './Chip.options';

// Usage stories (Storybook MCP manifest). Interaction and real filter examples: ./stories/FilterChipSelect.showcase.stories.tsx
const AGES = [
  { id: '10', label: '10대' },
  { id: '20', label: '20대' },
  { id: '30', label: '30대' },
  { id: '40', label: '40대' },
  { id: '50', label: '50대 이상' },
];

const meta = {
  title: 'Components/Chip/FilterChipSelect',
  component: FilterChipSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma **chip-filter** (558:25704) with its option panel (`listbox` / `option` Size=sm) — the Figma "chip-filter 선택 예시". ' +
          '`selectionMode="multiple"`(default): options toggle while the panel stays open, the choice is applied when it closes; ' +
          '`selectionMode="single"`: choosing applies and closes, the first option (`clearLabel`, "전체") removes the filter. ' +
          'The chip shows "name: value, value" and the Selected look while a value is applied.',
      },
    },
  },
  args: {
    label: '나이대',
    options: AGES,
    size: 'md',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: 'Filter name' },
    size: { control: 'inline-radio', options: CHIP_SIZES, description: 'Figma chip "Size"', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    maxDisplayed: { control: { type: 'number', min: 1, max: 5 } },
    options: { control: 'object' },
  },
} satisfies Meta<typeof FilterChipSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Multiple selection (default). */
export const Playground: Story = {};

/** Values applied from the start: Selected look, "나이대: 20대, 30대". */
export const WithValue: Story = {
  args: { defaultValue: ['20', '30'] },
};

/** Single selection with a "전체" option that removes the filter. */
export const Single: Story = {
  args: {
    label: '기간',
    selectionMode: 'single',
    options: [
      { id: '7d', label: '최근 7일' },
      { id: '30d', label: '최근 30일' },
      { id: '90d', label: '최근 90일' },
    ],
    defaultValue: '30d',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['20'] },
};
