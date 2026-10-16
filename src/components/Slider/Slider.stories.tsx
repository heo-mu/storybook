import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Slider } from './Slider';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Slider.showcase.stories.tsx
const meta = {
  title: 'Components/Slider/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **slider** (391:1988) with **handle** (391:2013). Value → `value` / `defaultValue` / `onChange`, ' +
          'range → `minValue` / `maxValue` / `step`, Show Input → `showInput`, unit text → `unit`, handle Value Label → `valueLabel`, ' +
          'State Disabled → `disabled`. Figma shows no visible label, so `aria-label` (or `aria-labelledby`) is required. ' +
          'Built on react-aria-components (pointer, touch and keyboard).',
      },
    },
  },
  args: {
    'aria-label': '인원',
    minValue: 1,
    maxValue: 200,
    defaultValue: 100,
    step: 1,
    unit: '명',
    showInput: true,
    valueLabel: true,
    disabled: false,
    onChange: fn(),
    onChangeEnd: fn(),
  },
  argTypes: {
    showInput: { control: 'boolean', description: 'Figma "Show Input"' },
    valueLabel: { control: 'boolean', description: 'Figma handle "Value Label" (hover / drag / focus)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    unit: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320, paddingTop: 28 }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutInput: Story = {
  args: { showInput: false },
};

export const Percent: Story = {
  args: { 'aria-label': '투명도', minValue: 0, maxValue: 100, defaultValue: 40, step: 10, unit: '%' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
