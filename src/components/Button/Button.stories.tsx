import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

// Usage stories (part of the Storybook MCP components manifest). Visual verification
// stories — Overview, Variant Matrix, States, Tests — live in ./stories and are tagged !manifest.
const meta = {
  title: 'Components/Button/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_basic** (54:2904, 192 variants). Props map 1:1 to the Figma variant properties: ' +
          'Variant → `variant`, Appearance → `appearance`, Size → `size`, Shape → `shape`, Left/Right Icon → `leftIcon`/`rightIcon` ' +
          '(pass an icon element), Label Text → `children`. State Hover/Pressed are the native `:hover`/`:active` states, ' +
          'State Disabled is `disabled`. Without `appearance`, Secondary is Outline (backward compatible); Secondary / Solid exists since the 2026-10-19 Figma sync.',
      },
    },
  },
  args: {
    children: '라벨명',
    variant: 'primary',
    appearance: 'solid',
    size: 'xs',
    shape: 'square',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS, description: 'Figma "Variant"', table: { defaultValue: { summary: 'primary' } } },
    appearance: {
      control: 'inline-radio',
      options: BUTTON_APPEARANCES,
      description: 'Figma "Appearance". Without it Secondary is Outline (backward compatible), the others Solid.',
      table: { defaultValue: { summary: "'solid' ('outline' for secondary)" } },
    },
    size: { control: 'inline-radio', options: BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Left Icon" — an icon element (ReactNode)' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Right Icon" — an icon element (ReactNode)' },
    children: { control: 'text', description: 'Figma "Label Text"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every prop is wired to a control (icons can be switched on in the Left/Right Icon controls). */
export const Playground: Story = {};

/** Secondary / Outline — also what `variant="secondary"` renders without `appearance`. */
export const Secondary: Story = {
  args: { variant: 'secondary', appearance: 'outline', size: 'md' },
};

/** Secondary / Solid (Figma button_basic since 2026-10-19). */
export const SecondarySolid: Story = {
  args: { variant: 'secondary', appearance: 'solid', size: 'md' },
};

export const TertiaryOutline: Story = {
  args: { variant: 'tertiary', appearance: 'outline', size: 'md' },
};

export const RoundedLarge: Story = {
  args: { size: 'lg', shape: 'rounded' },
};

export const Disabled: Story = {
  args: { disabled: true, size: 'md' },
};
