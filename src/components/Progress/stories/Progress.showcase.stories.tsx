import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Progress } from '../Progress';
import { Button } from '../../Button';

// Visual verification (not in the MCP manifest). The cell carries the data-figma name checked by
// `node scripts/verify-figma.mjs progress` (single component `progress`).
const meta = {
  title: 'Components/Progress/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, width: 430 }}>
      <Progress aria-label="업로드" value={25} />
      <Progress aria-label="처리" value={60} />
      <Progress aria-label="완료" value={100} />
    </div>
  ),
};

/** Figma `progress`: 430px track, bar 189px (value 189 of 430). */
export const Figma: Story = {
  render: () => (
    <div data-figma="progress" style={{ width: 430 }}>
      <Progress aria-label="진행률" value={189} maxValue={430} />
    </div>
  ),
};

/** The bar follows `value`; role="progressbar" exposes it (aria-valuenow / aria-valuetext). */
export const Interaction: Story = {
  render: function Render() {
    const [value, setValue] = useState(30);
    return (
      <div style={{ display: 'grid', gap: 12, width: 430 }}>
        <Progress aria-label="다운로드" value={value} />
        <Button onClick={() => setValue((v) => Math.min(100, v + 20))}>20% 더</Button>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const bar = canvas.getByRole('progressbar', { name: '다운로드' });
    await expect(bar).toHaveAttribute('aria-valuenow', '30');
    await userEvent.click(canvas.getByRole('button', { name: '20% 더' }));
    await expect(bar).toHaveAttribute('aria-valuenow', '50');
    await expect(bar).toHaveAttribute('aria-valuetext', '50%');
  },
};

export const Accessibility: Story = {
  render: () => (
    <div style={{ width: 430 }}>
      <span id="p-label">보고서 생성</span>
      <Progress aria-labelledby="p-label" value={3} maxValue={10} valueLabel="10개 중 3개" />
    </div>
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: '보고서 생성' });
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '10');
    await expect(bar).toHaveAttribute('aria-valuetext', '10개 중 3개');
  },
};
