import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Switch } from '../Switch';
import { SWITCH_SIZES, type SwitchSize } from '../Switch.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs switch`.
const meta = {
  title: "Components/Switch/Gallery",
  id: 'components-switch-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;
const CHECKED = ['False', 'True'] as const;
type State = (typeof STATES)[number];

/** Props reproducing one Figma variant. */
function figmaVariant(size: SwitchSize, state: State, checked: (typeof CHECKED)[number]) {
  return {
    size,
    label: '라벨명',
    defaultChecked: checked === 'True',
    disabled: state === 'Disabled',
    className: state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined,
  };
}

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      <StorySection title="Size (sm · md)">
        {SWITCH_SIZES.map((size) => (
          <Switch key={size} size={size} label={`스위치 ${size}`} defaultChecked />
        ))}
      </StorySection>
      <StorySection title="Checked · Disabled">
        <Switch label="꺼짐" />
        <Switch label="켜짐" defaultChecked />
        <Switch label="꺼짐 (비활성)" disabled />
        <Switch label="켜짐 (비활성)" defaultChecked disabled />
      </StorySection>
    </div>
  ),
};

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={CHECKED.flatMap((checked) =>
        SWITCH_SIZES.map((size) => ({
          label: `Checked ${checked} · ${size}`,
          cells: STATES.map((state) => ({
            figma: `Size=${size}, State=${state}, Checked=${checked}`,
            node: <Switch {...figmaVariant(size, state, checked)} />,
          })),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(16);
  },
};

/** Every state at size md. */
export const States: Story = {
  name: "States",
  render: () => (
    <div>
      {CHECKED.map((checked) => (
        <StorySection key={checked} title={`Checked ${checked}`}>
          {STATES.map((state) => (
            <Switch key={state} {...figmaVariant('md', state, checked)} label={koLabel(state)} />
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

/** Click or Space toggles; the thumb moves to the end of the track. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => <Switch size="md" label="알림 받기" />,
  play: async ({ canvas, userEvent, step }) => {
    const sw = canvas.getByRole('switch', { name: '알림 받기' });
    const thumb = sw.parentElement!.querySelector('.ds-switch__thumb')!;
    await step('click turns it on', async () => {
      await userEvent.click(canvas.getByText('알림 받기'));
      await expect(sw).toBeChecked();
      // Figma md Checked=True: thumb at x 20 (36 − 2 − 14)
      await expect(getComputedStyle(thumb).left).toBe('20px');
    });
    await step('Space turns it off', async () => {
      sw.focus();
      await userEvent.keyboard(' ');
      await expect(sw).not.toBeChecked();
      await expect(getComputedStyle(thumb).left).toBe('2px');
    });
  },
};

/** role="switch" exposes on/off; the label names it. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Switch label="자동 저장" defaultChecked />
      <Switch label="베타 기능" disabled />
      <Switch aria-label="라벨 없는 스위치" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: '자동 저장' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: '베타 기능' })).toBeDisabled();
    await expect(canvas.getByRole('switch', { name: '라벨 없는 스위치' })).not.toBeChecked();
  },
};
