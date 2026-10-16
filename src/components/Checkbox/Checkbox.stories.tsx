import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { CHOICE_SIZES } from '../Choice';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Checkbox.showcase.stories.tsx
const meta = {
  title: 'Components/Checkbox/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **checkbox** (99:2389, 36 variants). Selection Checked → `checked` / `defaultChecked`, ' +
          'Indeterminate → `indeterminate`, Size → `size`, Label / Label Text → `label`. State: Hover / Pressed are the native ' +
          ':hover / :active, Disabled = `disabled`. Renders a native `<input type="checkbox">` (props and ref go to it); ' +
          '`className` / `style` go to the root `<label>`. Group several with `CheckboxGroup`.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    indeterminate: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHOICE_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text" (omit to hide the label, then set aria-label)' },
    indeterminate: { control: 'boolean', description: 'Figma Selection "Indeterminate"' },
    defaultChecked: { control: 'boolean', description: 'Figma Selection "Checked" (uncontrolled)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '일부 선택' },
};

export const Sizes: Story = {
  args: { size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': '행 선택' },
};

/** `CheckboxGroup` manages the selected values; item spacing is not defined in Figma, so it is set with `style`. */
export const Group: Story = {
  render: (args) => (
    <CheckboxGroup aria-label="관심 분야" defaultValue={['design']} name="interest" size={args.size} style={{ gap: 8 }}>
      <Checkbox value="design" label="디자인" />
      <Checkbox value="dev" label="개발" />
      <Checkbox value="data" label="데이터" disabled />
    </CheckboxGroup>
  ),
};
