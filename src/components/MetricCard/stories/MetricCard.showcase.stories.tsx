import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MetricCard } from '../MetricCard';
import { MetricTrend } from '../../MetricTrend';
import { LightningIcon } from '../../../icons';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs metric-card`.
const meta = {
  title: '컴포넌트/MetricCard/전체 보기',
  id: 'components-metriccard-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The Figma metric card (386px). */
export const Figma: Story = {
  name: '모든 변형',
  render: () => (
    <MetricCard
      data-figma="metric-card"
      style={{ width: 386 }}
      title="누적 전력 사용량"
      icon={<LightningIcon />}
      value="1,248"
      unit="kWh"
      trend={
        <MetricTrend direction="down" tone="positive">
          4.8%p
        </MetricTrend>
      }
      comparison="이전 7일 대비"
    />
  ),
};

/** A group named by its title heading. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => <MetricCard title="누적 전력 사용량" value="1,248" unit="kWh" headingLevel={2} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: '누적 전력 사용량' })).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: '누적 전력 사용량' })).toHaveTextContent('1,248kWh');
  },
};
