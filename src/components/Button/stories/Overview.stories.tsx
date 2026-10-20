import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { TextButton } from '../TextButton';
import { BUTTON_SHAPES, BUTTON_SIZES, BUTTON_TONES, ICON_BUTTON_SIZES, TEXT_BUTTON_SIZES } from '../Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';
import { Section } from './StoryLayout';
import { figmaCase } from './story-helpers';

// Visual showcase — excluded from the MCP components manifest (uses story-only helpers).
const meta = {
  title: "Components/Button/Overview",
  id: 'components-button-overview',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** 주요 종류와 크기, 구성 방식을 한눈에 비교합니다. */
export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      <Section title="Button — 종류 × 모양 (md)">
        {BUTTON_TONES.map((tone) => (
          <Button key={`${tone.variant}-${tone.appearance}`} {...tone} size="md" leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            {figmaCase(tone.variant)} {figmaCase(tone.appearance)}
          </Button>
        ))}
      </Section>
      <Section title="Button — 크기 (xs · sm · md · lg)">
        {BUTTON_SIZES.map((size) => (
          <Button key={size} size={size} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </Button>
        ))}
      </Section>
      <Section title="Button — 모서리 모양 (square · rounded)">
        {BUTTON_SHAPES.map((shape) => (
          <Button key={shape} size="md" shape={shape} variant="tertiary" appearance="outline">
            {figmaCase(shape)}
          </Button>
        ))}
      </Section>
      <Section title="IconButton — 종류 × 모양 (md) · 크기 (xs · sm · md)">
        {BUTTON_TONES.map((tone) => (
          <IconButton key={`${tone.variant}-${tone.appearance}`} {...tone} size="md" icon={<PlusIcon />} aria-label={`${tone.variant} ${tone.appearance}`} />
        ))}
        {ICON_BUTTON_SIZES.map((size) => (
          <IconButton key={size} size={size} variant="tertiary" appearance="outline" icon={<PlusIcon />} aria-label={size} />
        ))}
      </Section>
      <Section title="TextButton — 크기 (sm · md)">
        {TEXT_BUTTON_SIZES.map((size) => (
          <TextButton key={size} size={size} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
            라벨명
          </TextButton>
        ))}
      </Section>
    </div>
  ),
};
