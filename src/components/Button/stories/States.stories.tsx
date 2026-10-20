import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { TextButton } from '../TextButton';
import { BUTTON_STATES, BUTTON_TONES, TEXT_BUTTON_SIZES } from '../Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';
import { MatrixTable } from './StoryLayout';
import { PSEUDO_PARAMETERS, figmaCase, stateProps } from './story-helpers';

// Figma "State": Default → Hover → Pressed → Disabled. Hover/Pressed are forced with
// storybook-addon-pseudo-states; in an app they come from the real pointer (:hover / :active).
const meta = {
  title: '컴포넌트/Button/상태별 보기',
  id: 'components-button-states',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ButtonStates: Story = {
  name: 'Button',
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

export const IconButtonStates: Story = {
  name: 'IconButton',
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

/** Label and icon colours also change with the state. */
export const TextButtonStates: Story = {
  name: 'TextButton',
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
