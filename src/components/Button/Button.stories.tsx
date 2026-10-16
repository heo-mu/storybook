import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { TextButton } from './TextButton';
import {
  BUTTON_APPEARANCES,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_STATES,
  BUTTON_TONES,
  BUTTON_VARIANTS,
  TEXT_BUTTON_SIZES,
  type ButtonAppearance,
  type ButtonShape,
  type ButtonSize,
} from './Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './stories/figma-icons';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';
import { MatrixTable, Section } from './stories/StoryLayout';
import { PSEUDO_PARAMETERS, figmaCase, stateProps } from './stories/story-helpers';

const meta = {
  title: 'Components/Button/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_basic** (54:2904, 160 variants). Props map 1:1 to the Figma variant properties: ' +
          'Variant → `variant`, Appearance → `appearance`, Size → `size`, Shape → `shape`, Left/Right Icon → `leftIcon`/`rightIcon`, ' +
          'Label Text → `children`. State Hover/Pressed are the native `:hover`/`:active` states, State Disabled is `disabled`.',
      },
    },
  },
  args: {
    children: '라벨명',
    variant: 'primary',
    appearance: 'solid',
    size: 'xs',
    shape: 'square',
    leftIcon: 'CaretLeft',
    rightIcon: 'CaretRight',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS, description: 'Figma "Variant"', table: { defaultValue: { summary: 'primary' } } },
    appearance: {
      control: 'inline-radio',
      options: BUTTON_APPEARANCES,
      // Figma has no Secondary/Solid — Secondary is always Outline.
      if: { arg: 'variant', neq: 'secondary' },
      description: 'Figma "Appearance". Secondary exists only as Outline.',
      table: { defaultValue: { summary: "'solid' ('outline' for secondary)" } },
    },
    size: { control: 'inline-radio', options: BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Left Icon"' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Right Icon"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The whole Button family at a glance. */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div>
      <Section title="Button — Variant × Appearance (md)">
        {BUTTON_TONES.map((tone) => (
          <Button key={`${tone.variant}-${tone.appearance}`} {...tone} size="md" leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            {figmaCase(tone.variant)} {figmaCase(tone.appearance)}
          </Button>
        ))}
      </Section>
      <Section title="Button — Size (xs · sm · md · lg)">
        {BUTTON_SIZES.map((size) => (
          <Button key={size} size={size} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </Button>
        ))}
      </Section>
      <Section title="Button — Shape (Square · Rounded)">
        {BUTTON_SHAPES.map((shape) => (
          <Button key={shape} size="md" shape={shape} variant="tertiary" appearance="outline">
            {figmaCase(shape)}
          </Button>
        ))}
      </Section>
      <Section title="IconButton — Variant × Appearance (md)">
        {BUTTON_TONES.map((tone) => (
          <IconButton key={`${tone.variant}-${tone.appearance}`} {...tone} size="md" icon={<PlusIcon />} aria-label={`${tone.variant} ${tone.appearance}`} />
        ))}
      </Section>
      <Section title="TextButton — Size (sm · md)">
        {TEXT_BUTTON_SIZES.map((size) => (
          <TextButton key={size} size={size} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </TextButton>
        ))}
      </Section>
    </div>
  ),
};

/** Every prop is wired to a control. */
export const Playground: Story = {};

/**
 * All 160 variants of `button_basic`: 5 Variant×Appearance pairs × 4 States (rows) ×
 * 4 Sizes × 2 Shapes (columns). Each button carries `data-figma` with the Figma variant name.
 */
export const VariantMatrix: Story = {
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
  render: () => (
    <MatrixTable
      columns={BUTTON_SIZES.flatMap((size) => BUTTON_SHAPES.map((shape) => `${size} · ${figmaCase(shape)}`))}
      rows={BUTTON_TONES.flatMap((tone) =>
        BUTTON_STATES.map((state) => ({
          label: `${figmaCase(tone.variant)} / ${figmaCase(tone.appearance)} / ${figmaCase(state)}`,
          cells: BUTTON_SIZES.flatMap((size) =>
            BUTTON_SHAPES.map((shape) => (
              <Button
                key={`${size}-${shape}`}
                {...tone}
                size={size}
                shape={shape}
                {...stateProps(state)}
                data-figma={`Variant=${figmaCase(tone.variant)}, Appearance=${figmaCase(tone.appearance)}, Size=${size}, Shape=${figmaCase(shape)}, State=${figmaCase(state)}`}
                leftIcon={<CaretLeftIcon />}
                rightIcon={<CaretRightIcon />}
              >
                라벨명
              </Button>
            )),
          ),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    // Exactly the 160 combinations of the Figma component set — no more, no less.
    const names = [...canvasElement.querySelectorAll('[data-figma]')].map((el) => el.getAttribute('data-figma'));
    await expect(names).toHaveLength(160);
    await expect(new Set(names).size).toBe(160);
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
          <Button key={state} {...tone} size="md" {...stateProps(state)} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </Button>
        )),
      }))}
    />
  ),
};

/** Proves the token stylesheet is loaded: computed styles equal the Figma values of Primary/Solid/xs/Square/Default. */
export const CssCheck: Story = {
  tags: ['!autodocs'],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '라벨명' });
    const style = getComputedStyle(button);
    await expect(style.backgroundColor).toBe('rgb(0, 74, 56)'); // colors/button/primary/solid/background/default #004a38
    await expect(style.color).toBe('rgb(253, 253, 253)'); // …/label/default #fdfdfd
    await expect(button.getBoundingClientRect().height).toBe(24);
    await expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual(['4px', '6px', '4px', '6px']);
    await expect(style.columnGap).toBe('2px');
    await expect(style.borderTopLeftRadius).toBe('4px');
    await expect(style.fontFamily).toContain('Pretendard Variable');
    await expect([style.fontSize, style.fontWeight, style.lineHeight]).toEqual(['12px', '500', '16px']);
  },
};

function PropTransitionsHarness() {
  const [disabled, setDisabled] = useState(false);
  const [appearance, setAppearance] = useState<ButtonAppearance>('solid');
  const [size, setSize] = useState<ButtonSize>('xs');
  const [shape, setShape] = useState<ButtonShape>('square');
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <div style={{ display: 'flex', gap: 12, font: '12px/16px sans-serif' }}>
        <label>
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> disabled
        </label>
        <select aria-label="appearance" value={appearance} onChange={(e) => setAppearance(e.target.value as ButtonAppearance)}>
          {BUTTON_APPEARANCES.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select aria-label="size" value={size} onChange={(e) => setSize(e.target.value as ButtonSize)}>
          {BUTTON_SIZES.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select aria-label="shape" value={shape} onChange={(e) => setShape(e.target.value as ButtonShape)}>
          {BUTTON_SHAPES.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <Button appearance={appearance} size={size} shape={shape} disabled={disabled} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
        라벨명
      </Button>
    </div>
  );
}

/** Changing props re-renders the button into the matching Figma variant. */
export const PropTransitions: Story = {
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: () => <PropTransitionsHarness />,
  play: async ({ canvas, userEvent, step }) => {
    const button = canvas.getByRole('button', { name: '라벨명' });
    const style = () => getComputedStyle(button);
    const iconWidth = () => button.querySelector('.ds-button__icon')!.getBoundingClientRect().width;

    await step('Default: Primary / Solid / xs / Square', async () => {
      await expect(style().backgroundColor).toBe('rgb(0, 74, 56)');
      await expect(button.getBoundingClientRect().height).toBe(24);
    });
    await step('disabled → State=Disabled', async () => {
      await userEvent.click(canvas.getByLabelText('disabled'));
      await expect(button).toBeDisabled();
      await expect(style().backgroundColor).toBe('rgb(214, 218, 224)'); // #d6dae0
      await expect(style().color).toBe('rgb(161, 168, 181)'); // #a1a8b5
      await userEvent.click(canvas.getByLabelText('disabled'));
      await expect(button).toBeEnabled();
    });
    await step('appearance=outline → 1px inside stroke', async () => {
      await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'appearance' }), 'outline');
      await expect(button).toHaveAttribute('data-appearance', 'outline');
      await expect(style().backgroundColor).toBe('rgb(253, 253, 253)');
      await expect(style().boxShadow).toBe('rgb(0, 74, 56) 0px 0px 0px 1px inset');
      await expect(button.getBoundingClientRect().height).toBe(24);
    });
    await step('size=lg → 44px, 20px icons, rounded-sm', async () => {
      await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'size' }), 'lg');
      await expect(button.getBoundingClientRect().height).toBe(44);
      await expect(iconWidth()).toBe(20);
      await expect(style().borderTopLeftRadius).toBe('6px');
    });
    await step('shape=rounded → rounded-full', async () => {
      await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'shape' }), 'rounded');
      await expect(style().borderTopLeftRadius).toBe('9999px');
    });
  },
};
