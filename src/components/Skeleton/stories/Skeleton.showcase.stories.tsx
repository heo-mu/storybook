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

/** Skeletons are decorative. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => <Skeleton data-testid="skeleton" shape="block" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  },
};
