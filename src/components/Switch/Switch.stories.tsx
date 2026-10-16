import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';
import { SWITCH_SIZES } from './Switch.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Switch.showcase.stories.tsx
const meta = {
  title: 'Components/Switch/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **switch** (107:409, 16 variants). Checked → `checked` / `defaultChecked`, Size → `size` (sm · md), ' +
          'Label / Label Text → `label`. State: Hover / Pressed are the native :hover / :active, Disabled = `disabled`. ' +
          'Renders `<input type="checkbox" role="switch">` (props and ref go to it); `className` / `style` go to the root `<label>`.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SWITCH_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text" (omit to hide the label, then set aria-label)' },
    defaultChecked: { control: 'boolean', description: 'Figma "Checked" (uncontrolled)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Medium: Story = {
  args: { size: 'md', defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': '다크 모드' },
};
