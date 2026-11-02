import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { Switch } from '../Switch';
import { SWITCH_SIZES, type SwitchSize } from '../Switch.options';
import { TextButton } from '../../Button';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { motionSettled } from '../../../storybook/motion';
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

type Parts = { input: HTMLInputElement; root: HTMLElement; thumb: HTMLElement };
// HeroUI spring withSpring({ damping: 120, stiffness: 1600, mass: 2 }) — critically damped in Reanimated at ω0 = √(1600 / 2):
// share of the distance still to go t seconds after leaving from rest.
const OMEGA = Math.sqrt(1600 / 2);
const remaining = (seconds: number) => Math.exp(-OMEGA * seconds) * (1 + OMEGA * seconds);

/** Thumb position (px from the track's left edge, press shrink removed) and colour progress on every frame while `act` runs. */
async function recordSlide({ input, thumb }: Parts, act: () => Promise<void>, ms = 600) {
  const frames: { x: number; at: number | null; on: number }[] = [];
  let running = true;
  const tick = () => {
    const a = input.getBoundingClientRect();
    const b = thumb.getBoundingClientRect();
    const scale = a.width / input.offsetWidth;
    const spring = thumb.getAnimations().find((animation) => !(animation instanceof CSSTransition));
    frames.push({
      x: input.offsetWidth / 2 + (b.left + b.width / 2 - (a.left + a.width / 2)) / scale - thumb.offsetWidth / 2,
      at: spring ? Number(spring.currentTime) : null,
      on: parseFloat(getComputedStyle(input).getPropertyValue('--ds-switch-on')),
    });
    if (running) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  await act();
  await new Promise((resolve) => setTimeout(resolve, ms));
  running = false;
  return frames;
}

/**
 * 누르면 스위치가 살짝 줄어들고, 켜거나 끄면 썸이 스프링으로 미끄러지며 트랙 색이 함께 바뀝니다(HeroUI Native Switch 참고).
 * Click or Space toggles; a controlled `checked` changed from outside slides the same way; a disabled switch does not react.
 */
export const Interaction: Story = {
  name: "Interaction",
  render: function Render() {
    const [autoSave, setAutoSave] = useState(false);
    return (
      <div>
        <StorySection title="크기 (sm · md)">
          <Switch size="sm" label="알림 받기 (sm)" />
          <Switch size="md" label="알림 받기 (md)" />
        </StorySection>
        <StorySection title="제어 컴포넌트">
          <Switch size="md" label="자동 저장" checked={autoSave} onChange={(event) => setAutoSave(event.target.checked)} />
          <TextButton onClick={() => setAutoSave((on) => !on)}>밖에서 바꾸기</TextButton>
        </StorySection>
        <StorySection title="비활성">
          <Switch label="꺼짐 (비활성)" disabled />
          <Switch label="켜짐 (비활성)" defaultChecked disabled />
        </StorySection>
      </div>
    );
  },
  play: async ({ canvas, userEvent, step }) => {
    const parts = (name: string): Parts => {
      const input = canvas.getByRole<HTMLInputElement>('switch', { name });
      const root = input.closest<HTMLElement>('.ds-switch')!;
      return { input, root, thumb: root.querySelector<HTMLElement>('.ds-switch__thumb')! };
    };
    // At rest the thumb sits on whole pixels at its end — the Figma variant (2px padding) — with no motion left on it.
    const expectRest = async ({ input, thumb }: Parts, x: number) => {
      await motionSettled();
      await expect(thumb.getBoundingClientRect().left - input.getBoundingClientRect().left).toBe(x);
      await expect(thumb.getBoundingClientRect().top - input.getBoundingClientRect().top).toBe(2);
      await expect(getComputedStyle(thumb).transform).toBe('none');
      await expect(getComputedStyle(input).scale).toBe('none');
    };
    const sm = parts('알림 받기 (sm)');
    const md = parts('알림 받기 (md)');

    await step('pressing shrinks track and thumb to 0.96; letting go restores them and toggles', async () => {
      await userEvent.pointer({ keys: '[MouseLeft>]', target: canvas.getByText('알림 받기 (sm)') });
      await expect(sm.root).toHaveAttribute('data-pressed');
      await waitFor(() => expect(getComputedStyle(sm.input).scale).toBe('0.96'));
      await expect(getComputedStyle(sm.thumb).scale).toBe('0.96');
      await expect(sm.input).not.toBeChecked();
      await userEvent.pointer({ keys: '[/MouseLeft]', target: canvas.getByText('알림 받기 (sm)') });
      await expect(sm.root).not.toHaveAttribute('data-pressed');
      await expect(sm.input).toBeChecked();
      // Figma sm Checked=True: thumb at x 18 (32 − 2 − 12)
      await expect(getComputedStyle(sm.thumb).left).toBe('18px');
      await expectRest(sm, 18);
    });

    await step('the thumb slides on the spring (no overshoot) while the track colour blends', async () => {
      const frames = await recordSlide(md, () => userEvent.click(canvas.getByText('알림 받기 (md)')));
      await expect(md.input).toBeChecked();
      const moving = frames.filter((frame) => frame.at !== null && frame.at > 0);
      const between = frames.filter((frame) => frame.x > 2.01 && frame.x < 19.99);
      await expect(between.length).toBeGreaterThanOrEqual(6);
      // every drawn frame on the spring curve, 2 → 20 (md: 36 − 2 − 14), always inside the track and moving one way
      for (const frame of moving) await expect(Math.abs(frame.x - (20 - 18 * remaining(frame.at! / 1000)))).toBeLessThan(0.35);
      await expect(frames.every((frame, i) => frame.x >= 1.98 && frame.x <= 20.02 && (!i || frame.x >= frames[i - 1].x - 0.02))).toBe(true);
      const blend = frames.filter((frame) => frame.on > 0.001 && frame.on < 0.999);
      await expect(blend.length).toBeGreaterThanOrEqual(4);
      await expect(frames.at(-1)!.on).toBe(1);
      await expectRest(md, 20);
    });

    await step('Space: held is pressed, released toggles', async () => {
      md.input.focus();
      await userEvent.keyboard('[Space>]');
      await expect(md.root).toHaveAttribute('data-pressed');
      await userEvent.keyboard('[/Space]');
      await expect(md.root).not.toHaveAttribute('data-pressed');
      await expect(md.input).not.toBeChecked();
      await expectRest(md, 2);
    });

    await step('rapid clicks turn back from where the thumb is and end on the last state', async () => {
      const frames = await recordSlide(md, async () => {
        for (let i = 0; i < 5; i++) await userEvent.click(canvas.getByText('알림 받기 (md)'));
      });
      await expect(md.input).toBeChecked();
      await expect(frames.every((frame) => frame.x >= 1.98 && frame.x <= 20.02)).toBe(true);
      await expectRest(md, 20);
    });

    await step('a controlled `checked` changed from outside slides too', async () => {
      const auto = parts('자동 저장');
      await userEvent.click(canvas.getByRole('button', { name: '밖에서 바꾸기' }));
      await expect(auto.input).toBeChecked();
      await expect(auto.thumb.getAnimations().length).toBe(1);
      await expectRest(auto, 20);
      await userEvent.click(canvas.getByText('자동 저장'));
      await expect(auto.input).not.toBeChecked();
      await expectRest(auto, 2);
    });

    await step('disabled: no press, no toggle, nothing moves', async () => {
      for (const [name, x] of [['꺼짐 (비활성)', 2], ['켜짐 (비활성)', 18]] as const) {
        const off = parts(name);
        await userEvent.pointer({ keys: '[MouseLeft>]', target: canvas.getByText(name) });
        await expect(off.root).not.toHaveAttribute('data-pressed');
        await userEvent.pointer({ keys: '[/MouseLeft]', target: canvas.getByText(name) });
        await expect(off.input.checked).toBe(x === 18);
        await expect(off.root.getAnimations({ subtree: true }).length).toBe(0);
        await expectRest(off, x);
      }
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
