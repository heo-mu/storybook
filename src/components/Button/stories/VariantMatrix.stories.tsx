import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { TextButton } from '../TextButton';
import { BUTTON_SHAPES, BUTTON_SIZES, BUTTON_STATES, BUTTON_TONES, ICON_BUTTON_SIZES, TEXT_BUTTON_SIZES, TEXT_BUTTON_VARIANTS } from '../Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';
import { MatrixTable } from './StoryLayout';
import { FIGMA_TEXT_BUTTON_TYPE, PSEUDO_PARAMETERS, figmaCase, stateProps } from './story-helpers';

// Every Figma variant of the Button frame rendered by the real components. Each element carries
// `data-figma` with the exact Figma variant name (used by scripts/verify-button.mjs).
const meta = {
  title: "Components/Button/Variants",
  id: 'components-button-variant-matrix',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const expectVariantCount = (count: number) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  // Exactly the combinations of the Figma component set — no more, no less.
  const names = [...canvasElement.querySelectorAll('[data-figma]')].map((el) => el.getAttribute('data-figma'));
  await expect(names).toHaveLength(count);
  await expect(new Set(names).size).toBe(count);
};

/** 종류·크기·모양·상태에 따른 버튼 표현을 비교합니다. */
export const ButtonMatrix: Story = {
  name: 'Button',
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
  play: expectVariantCount(192),
};

/** 종류·크기·모양·상태에 따른 버튼 표현을 비교합니다. */
export const IconButtonMatrix: Story = {
  name: 'IconButton',
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
  play: expectVariantCount(144),
};

/** 종류·크기·모양·상태에 따른 버튼 표현을 비교합니다. */
export const TextButtonMatrix: Story = {
  name: 'TextButton',
  render: () => (
    <MatrixTable
      columns={[...TEXT_BUTTON_SIZES]}
      rows={TEXT_BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_STATES.map((state) => ({
          label: `${FIGMA_TEXT_BUTTON_TYPE[variant]} / ${figmaCase(state)}`,
          cells: TEXT_BUTTON_SIZES.map((size) => (
            <TextButton
              key={size}
              variant={variant}
              size={size}
              {...stateProps(state)}
              data-figma={`Type=${FIGMA_TEXT_BUTTON_TYPE[variant]}, Size=${size}, State=${figmaCase(state)}`}
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
  play: expectVariantCount(16),
};
