import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextButton } from './TextButton';
import { TEXT_BUTTON_SIZES, TEXT_BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

const meta = {
  title: 'Components/Button/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_text** (432:8395, 16 variants). Type → `variant`, Size → `size`, ' +
          'Left/Right Icon → `leftIcon`/`rightIcon` (icon elements), Label Text → `children`. In Ver 0.4 both Types ' +
          '("Primary", "SecondarySecondary") are bound to the same `colors/button_text/*` variables, so they render identically.',
      },
    },
  },
  args: {
    children: '라벨명',
    variant: 'primary',
    size: 'sm',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: TEXT_BUTTON_VARIANTS, description: 'Figma "Type"', table: { defaultValue: { summary: 'primary' } } },
    size: { control: 'inline-radio', options: TEXT_BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Left Icon" — an icon element (ReactNode)' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Right Icon" — an icon element (ReactNode)' },
    children: { control: 'text', description: 'Figma "Label Text"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every prop is wired to a control (icons can be switched on in the Left/Right Icon controls). */
export const Playground: Story = {};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
