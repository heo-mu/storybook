import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchField } from './SearchField';
import { SEARCH_FIELD_APPEARANCES } from './SearchField.options';
import { FIELD_SIZES } from '../Field';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/SearchField.showcase.stories.tsx
const meta = {
  title: 'Components/SearchField/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **search-field** (216:6570, 36 variants). Size → `size`, Type → `appearance` (outline · solid), ' +
          'Label → `label`. State: Hover / Focus native, Completed = has a value, Error = `invalid`, Disabled = `disabled`. ' +
          'Enter calls `onSearch(value)`; the clear (X) button appears in Focus and Error.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '검색어 입력',
    size: 'sm',
    appearance: 'outline',
    invalid: false,
    disabled: false,
    onSearch: fn(),
    onClear: fn(),
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    appearance: { control: 'inline-radio', options: SEARCH_FIELD_APPEARANCES, description: 'Figma "Type"', table: { defaultValue: { summary: 'outline' } } },
    label: { control: 'text', description: 'Figma "Label Text"' },
    invalid: { control: 'boolean', description: 'Figma State "Error"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Solid: Story = {
  args: { appearance: 'solid' },
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': '검색' },
};

export const Large: Story = {
  args: { size: 'lg', defaultValue: '검색어' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
