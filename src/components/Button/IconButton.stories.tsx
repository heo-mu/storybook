import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_VARIANTS, ICON_BUTTON_SIZES } from './Button.options';
import { ICON_MAPPING } from './stories/icon-controls';

const meta = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_icon** (67:2368, 144 variants). Same Variant / Appearance / Shape / State as Button; ' +
          'Size has no `lg`. `icon` takes an icon element (ReactNode). The Figma "Label" layer is hidden, so the accessible ' +
          'name is the required `aria-label`.',
      },
    },
  },
  args: {
    'aria-label': '추가',
    icon: 'Plus',
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
    size: { control: 'inline-radio', options: ICON_BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
    icon: { control: 'select', options: ['Plus', 'CaretLeft', 'CaretRight'], mapping: ICON_MAPPING, description: 'Icon element (ReactNode)' },
    'aria-label': { control: 'text', description: 'Accessible name (Figma "Label", hidden)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TertiaryOutlineRounded: Story = {
  args: { variant: 'tertiary', appearance: 'outline', shape: 'rounded', size: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true, size: 'md' },
};
