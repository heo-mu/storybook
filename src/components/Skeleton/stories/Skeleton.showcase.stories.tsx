import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Skeleton } from '../Skeleton';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs skeleton`.
const meta = {
  title: 'Components/Skeleton/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The 4 Figma variants. */
export const Figma: Story = {
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
  render: () => <Skeleton data-testid="skeleton" shape="block" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  },
};
