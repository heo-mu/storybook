import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DataFreshness } from '../DataFreshness';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs data-freshness`.
const meta = {
  title: 'Components/DataFreshness/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The 3 Figma variants. */
export const Figma: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'start' }}>
      <DataFreshness data-figma="State=Fresh" state="fresh" timestamp="2026.10.14 09:30" interval="자동 갱신 1분" />
      <DataFreshness data-figma="State=Stale" state="stale" timestamp="2026.10.14 09:30" interval="자동 갱신 1분" />
      <DataFreshness data-figma="State=Offline" state="offline" timestamp="2026.10.14 09:30" interval="자동 갱신 1분" />
    </div>
  ),
};

/** Read as one phrase; the "·" separator is hidden. */
export const Accessibility: Story = {
  render: () => <DataFreshness data-testid="freshness" state="stale" timestamp="2026.10.14 09:30" dateTime="2026-10-14T09:30" interval="자동 갱신 1분" />,
  play: async ({ canvas }) => {
    const root = canvas.getByTestId('freshness');
    await expect(root.querySelector('time')).toHaveAttribute('datetime', '2026-10-14T09:30');
    await expect(root.querySelector('.ds-data-freshness__interval[aria-hidden="true"]')).toHaveTextContent('·');
    await expect(root).toHaveTextContent('수신 지연2026.10.14 09:30·자동 갱신 1분');
  },
};
