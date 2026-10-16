import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_STATES, BUTTON_TONES, BUTTON_VARIANTS, ICON_BUTTON_SIZES } from './Button.options';
import { PlusIcon } from './stories/figma-icons';
import { ICON_MAPPING } from './stories/icon-controls';
import { MatrixTable } from './stories/StoryLayout';
import { PSEUDO_PARAMETERS, figmaCase, stateProps } from './stories/story-helpers';

const meta = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_icon** (67:2368, 120 variants). Same Variant / Appearance / Shape / State as Button; ' +
          'Size has no `lg`. The Figma "Label" layer is hidden, so the accessible name is the required `aria-label`.',
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
      if: { arg: 'variant', neq: 'secondary' },
      description: 'Figma "Appearance". Secondary exists only as Outline.',
      table: { defaultValue: { summary: "'solid' ('outline' for secondary)" } },
    },
    size: { control: 'inline-radio', options: ICON_BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
    icon: { control: 'select', options: ['Plus', 'CaretLeft', 'CaretRight'], mapping: ICON_MAPPING, description: 'Icon instance' },
    'aria-label': { control: 'text', description: 'Accessible name (Figma "Label", hidden)' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All 120 variants of `button_icon`: 5 Variant×Appearance pairs × 4 States × 3 Sizes × 2 Shapes. */
export const VariantMatrix: Story = {
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
  render: () => (
    <MatrixTable
      columns={ICON_BUTTON_SIZES.flatMap((size) => BUTTON_SHAPES.map((shape) => `${size} · ${figmaCase(shape)}`))}
      rows={BUTTON_TONES.flatMap((tone) =>
        BUTTON_STATES.map((state) => ({
          label: `${figmaCase(tone.variant)} / ${figmaCase(tone.appearance)} / ${figmaCase(state)}`,
          cells: ICON_BUTTON_SIZES.flatMap((size) =>
            BUTTON_SHAPES.map((shape) => (
              <IconButton
                key={`${size}-${shape}`}
                {...tone}
                size={size}
                shape={shape}
                {...stateProps(state)}
                data-figma={`Variant=${figmaCase(tone.variant)}, Appearance=${figmaCase(tone.appearance)}, Size=${size}, Shape=${figmaCase(shape)}, State=${figmaCase(state)}`}
                icon={<PlusIcon />}
                aria-label="추가"
              />
            )),
          ),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('[data-figma]')].map((el) => el.getAttribute('data-figma'));
    await expect(names).toHaveLength(120);
    await expect(new Set(names).size).toBe(120);
  },
};

/** Default → Hover → Pressed → Disabled for every Variant × Appearance (md). */
export const States: Story = {
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
  render: () => (
    <MatrixTable
      columns={BUTTON_STATES.map(figmaCase)}
      rows={BUTTON_TONES.map((tone) => ({
        label: `${figmaCase(tone.variant)} / ${figmaCase(tone.appearance)}`,
        cells: BUTTON_STATES.map((state) => (
          <IconButton key={state} {...tone} size="md" {...stateProps(state)} icon={<PlusIcon />} aria-label="추가" />
        )),
      }))}
    />
  ),
};

/** The hidden Figma label becomes the accessible name; the icon itself is aria-hidden. */
export const AccessibleName: Story = {
  tags: ['!autodocs'],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '추가' });
    await expect(button.querySelector('.ds-button__icon')).toHaveAttribute('aria-hidden', 'true');
    await expect(button.getBoundingClientRect().width).toBe(24);
    await expect(button.getBoundingClientRect().height).toBe(24);
  },
};
