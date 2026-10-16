import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { TextButton } from './TextButton';
import { BUTTON_STATES, TEXT_BUTTON_SIZES, TEXT_BUTTON_VARIANTS } from './Button.options';
import { CaretLeftIcon, CaretRightIcon } from './stories/figma-icons';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';
import { MatrixTable } from './stories/StoryLayout';
import { PSEUDO_PARAMETERS, figmaCase, stateProps } from './stories/story-helpers';

/** Figma "Type" value names (the second one is literally "SecondarySecondary" in Ver 0.4). */
const FIGMA_TYPE = { primary: 'Primary', secondary: 'SecondarySecondary' } as const;

const meta = {
  title: 'Components/Button/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **button_text** (432:8395, 16 variants). Type → `variant`, Size → `size`, ' +
          'Left/Right Icon → `leftIcon`/`rightIcon`, Label Text → `children`. In Ver 0.4 both Types are bound to the same ' +
          '`colors/button_text/*` variables, so they render identically.',
      },
    },
  },
  args: {
    children: '라벨명',
    variant: 'primary',
    size: 'sm',
    leftIcon: 'CaretLeft',
    rightIcon: 'CaretRight',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: TEXT_BUTTON_VARIANTS, description: 'Figma "Type"', table: { defaultValue: { summary: 'primary' } } },
    size: { control: 'inline-radio', options: TEXT_BUTTON_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Left Icon"' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: 'Figma "Right Icon"' },
    children: { control: 'text', description: 'Figma "Label Text"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All 16 variants of `button_text`: 2 Types × 4 States (rows) × 2 Sizes (columns). */
export const VariantMatrix: Story = {
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
  render: () => (
    <MatrixTable
      columns={[...TEXT_BUTTON_SIZES]}
      rows={TEXT_BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_STATES.map((state) => ({
          label: `${FIGMA_TYPE[variant]} / ${figmaCase(state)}`,
          cells: TEXT_BUTTON_SIZES.map((size) => (
            <TextButton
              key={size}
              variant={variant}
              size={size}
              {...stateProps(state)}
              data-figma={`Type=${FIGMA_TYPE[variant]}, Size=${size}, State=${figmaCase(state)}`}
              leftIcon={<CaretLeftIcon />}
              rightIcon={<CaretRightIcon />}
            >
              라벨명
            </TextButton>
          )),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('[data-figma]')].map((el) => el.getAttribute('data-figma'));
    await expect(names).toHaveLength(16);
    await expect(new Set(names).size).toBe(16);
  },
};

/** Default → Hover → Pressed → Disabled (label and icon colours change with the state). */
export const States: Story = {
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
  render: () => (
    <MatrixTable
      columns={BUTTON_STATES.map(figmaCase)}
      rows={TEXT_BUTTON_SIZES.map((size) => ({
        label: size,
        cells: BUTTON_STATES.map((state) => (
          <TextButton key={state} size={size} {...stateProps(state)} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </TextButton>
        )),
      }))}
    />
  ),
};

/** Default state: transparent background, label #404b5d, icon #778191 (colors/button_text/*). */
export const DefaultColors: Story = {
  tags: ['!autodocs'],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '라벨명' });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgba(255, 255, 255, 0)');
    await expect(getComputedStyle(button).color).toBe('rgb(64, 75, 93)');
    await expect(getComputedStyle(button.querySelector('.ds-button__icon')!).color).toBe('rgb(119, 129, 145)');
  },
};
