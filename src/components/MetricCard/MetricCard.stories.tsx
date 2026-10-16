import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from './MetricCard';
import { MetricTrend } from '../MetricTrend';
import { LightningIcon } from '../../icons';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/MetricCard.showcase.stories.tsx
const meta = {
  title: 'Components/MetricCard/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component **metric-card** (697:4487): Title → `title` (heading, `headingLevel`), header icon → `icon` (20px), ' +
          'Value → `value`, Unit → `unit`, comparison row → `trend` (a `MetricTrend`) + `comparison`. Fills its container ' +
          '(Figma 386px).',
      },
    },
  },
  args: {
    title: '누적 전력 사용량',
    icon: <LightningIcon />,
    value: '1,248',
    unit: 'kWh',
    trend: (
      <MetricTrend direction="down" tone="positive">
        4.8%p
      </MetricTrend>
    ),
    comparison: '이전 7일 대비',
  },
  argTypes: { icon: { control: false }, trend: { control: false } },
  render: (args) => (
    <div style={{ width: 386, maxWidth: '100%' }}>
      <MetricCard {...args} />
    </div>
  ),
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Value only. */
export const ValueOnly: Story = {
  args: { icon: undefined, trend: undefined, comparison: undefined, title: '가동 설비', value: '128', unit: '대' },
};

/** Several cards in a dashboard row. */
export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, width: 900, maxWidth: '100%' }}>
      <MetricCard
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
      <MetricCard
        title="최대 수요 전력"
        icon={<LightningIcon />}
        value="96"
        unit="kW"
        trend={
          <MetricTrend direction="up" tone="negative">
            2.1%
          </MetricTrend>
        }
        comparison="이전 7일 대비"
      />
      <MetricCard
        title="평균 역률"
        value="0.97"
        trend={
          <MetricTrend direction="flat" tone="neutral">
            0%
          </MetricTrend>
        }
        comparison="이전 7일 대비"
      />
    </div>
  ),
};
