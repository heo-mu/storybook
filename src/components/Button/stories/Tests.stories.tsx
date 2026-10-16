import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { TextButton } from '../TextButton';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_SIZES, type ButtonAppearance, type ButtonShape, type ButtonSize } from '../Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';

// Interaction / style tests run by `npm test` (Vitest + Playwright). Expected values are the
// Figma values of the Button frame (see figma/button-spec.json).
const meta = {
  title: 'Components/Button/Tests',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The token stylesheet is loaded: computed styles equal Figma Primary/Solid/xs/Square/Default. */
export const CssCheck: Story = {
  render: () => (
    <Button leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
      라벨명
    </Button>
  ),
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

/** The hidden Figma label becomes the accessible name; the icon itself is aria-hidden. */
export const IconButtonAccessibleName: Story = {
  render: () => <IconButton icon={<PlusIcon />} aria-label="추가" />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '추가' });
    await expect(button.querySelector('.ds-button__icon')).toHaveAttribute('aria-hidden', 'true');
    await expect(button.getBoundingClientRect().width).toBe(24);
    await expect(button.getBoundingClientRect().height).toBe(24);
  },
};

/** TextButton Default: transparent background, label #404b5d, icon #778191 (colors/button_text/*). */
export const TextButtonDefaultColors: Story = {
  render: () => (
    <TextButton leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
      라벨명
    </TextButton>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '라벨명' });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgba(255, 255, 255, 0)');
    await expect(getComputedStyle(button).color).toBe('rgb(64, 75, 93)');
    await expect(getComputedStyle(button.querySelector('.ds-button__icon')!).color).toBe('rgb(119, 129, 145)');
  },
};
