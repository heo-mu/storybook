import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from './MetricCard';
import { MetricTrend } from '../MetricTrend';
import { LightningIcon } from '../../icons';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/MetricCard.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/MetricCard/MetricCard',
  id: 'components-metriccard-metriccard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '대시보드의 핵심 지표 하나를 보여 주는 카드입니다. 지표 이름은 `title`, 값은 `value` · `unit`, 증감은 `trend`(보통 `MetricTrend`)와 ' +
          '`comparison`으로 넣습니다.',
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

/** 모든 부분을 넣은 지표 카드입니다. */
export const Playground: Story = { name: '직접 체험' };

/** 아이콘과 비교 없이 값만 보여 주는 카드입니다. */
export const ValueOnly: Story = {
  name: '값만',
  args: { icon: undefined, trend: undefined, comparison: undefined, title: '가동 설비', value: '128', unit: '대' },
};

/** 대시보드에서 카드 여러 개를 가로로 나란히 둔 예입니다. */
export const Row: Story = {
  name: '가로 배치',
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
