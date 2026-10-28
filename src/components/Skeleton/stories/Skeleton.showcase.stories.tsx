import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Skeleton } from '../Skeleton';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs skeleton`.
const meta = {
  title: "Components/Skeleton/Gallery",
  id: 'components-skeleton-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** 지원하는 구성과 상태를 비교합니다. */
export const Figma: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Skeleton data-figma="Shape=Line" shape="line" />
      <Skeleton data-figma="Shape=Shape4" shape="shape4" />
      <Skeleton data-figma="Shape=Block" shape="block" />
      <Skeleton data-figma="Shape=Circle" shape="circle" />
    </div>
  ),
};

/** Rules 09 (2026-10-28): the skeleton pulses like the reference — opacity 1 → 0.5 → 1 every 2 s, repeating. */
export const Motion: Story = {
  name: 'Motion',
  render: () => <Skeleton data-testid="skeleton" shape="block" />,
  play: async ({ canvas }) => {
    const el = canvas.getByTestId('skeleton');
    const cs = getComputedStyle(el);
    await expect(cs.animationName).toBe('ds-skeleton-pulse');
    await expect(cs.animationDuration).toBe('2s');
    await expect(cs.animationIterationCount).toBe('infinite');
    await expect(cs.animationTimingFunction).toBe('cubic-bezier(0.4, 0, 0.6, 1)');
    const [anim] = el.getAnimations();
    await expect(anim).toBeTruthy();
    const opacities = (anim.effect as KeyframeEffect).getKeyframes().map((frame) => String(frame.opacity));
    await expect(opacities).toContain('0.5');
    await expect(cs.opacity === '1' || Number(cs.opacity) >= 0.5).toBe(true);
  },
};

/** Skeletons are decorative. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => <Skeleton data-testid="skeleton" shape="block" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  },
};
