import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import { CHOICE_SIZES } from '../Choice';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Radio.showcase.stories.tsx
const meta = {
  title: 'Components/Radio/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **radio** (102:2677, 24 variants). Selection Selected → checked (the `RadioGroup` value, or ' +
          '`checked` / `defaultChecked` standalone), Size → `size`, Label / Label Text → `label`. State: Hover / Pressed are the ' +
          'native :hover / :active, Disabled = `disabled`. Renders a native `<input type="radio">`; use inside `RadioGroup` ' +
          '(value / defaultValue / onChange, arrow-key navigation).',
      },
    },
  },
  args: {
    label: '라벨명',
    value: 'option',
    name: 'playground',
    size: 'sm',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHOICE_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text" (omit to hide the label, then set aria-label)' },
    defaultChecked: { control: 'boolean', description: 'Figma Selection "Selected" (standalone, uncontrolled)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: { defaultChecked: true },
};

export const Sizes: Story = {
  args: { size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

/** `RadioGroup` manages the value; item spacing is not defined in Figma, so it is set with `style`. */
export const Group: Story = {
  render: (args) => (
    <RadioGroup aria-label="정렬" defaultValue="recent" size={args.size} style={{ gap: 8 }}>
      <Radio value="recent" label="최신순" />
      <Radio value="popular" label="인기순" />
      <Radio value="name" label="이름순" />
    </RadioGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: (args) => (
    <RadioGroup aria-label="기간" defaultValue="7d" orientation="horizontal" size={args.size} style={{ gap: 16 }}>
      <Radio value="7d" label="7일" />
      <Radio value="30d" label="30일" />
      <Radio value="90d" label="90일" />
    </RadioGroup>
  ),
};
