import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Chart, type ChartProps } from '../components/Chart';
import { DataFreshness } from '../components/DataFreshness';
import { DataState } from '../components/DataState';
import { MetricCard } from '../components/MetricCard';
import { MetricTrend } from '../components/MetricTrend';
import { FilterBarSample } from '../components/DashboardFilterBar/stories/FilterBarSample';
import { LightningIcon } from '../icons';

// Mirrors the Figma usage example "Dashboard 화면 예시" (section 사용 예시 화면) with the library components.
const meta = {
  title: "Examples/Dashboard",
  id: 'patterns-dashboard',
  tags: ['autodocs', '!manifest'],
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '대시보드 화면을 만드는 방법입니다. 위에서부터 제목과 데이터 기준 시각(`DataFreshness`), 조회 조건(`DashboardFilterBar`), 지표 카드(`MetricCard`), ' +
          '차트(`Chart`) 순서로 놓습니다. 데이터가 없거나 불러오는 중이면 차트 자리에 `DataState`를 보여 줍니다.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Figma frame "차트 카드": surface/page, rounded-[12px], elevation-3, p-4, m-3 between title and content. */
function ChartCard({ title, children, style }: { title: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <section
      aria-label={title}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-margin-m-3)',
        minWidth: 0,
        padding: 'var(--spacing-padding-p-4)',
        borderRadius: 'var(--border-radius-rounded-12px)',
        backgroundColor: 'var(--colors-surface-page)',
        boxShadow: 'var(--effect-elevation-3)',
        ...style,
      }}
    >
      <h3 className="ds-typography-base-leading-normal-semibold" style={{ margin: 0, color: 'var(--colors-text-primary)' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

/** A chart that starts with the tooltip of one item open (as in the example) and still follows the pointer. */
function ChartWithTooltip({ initial, ...props }: ChartProps & { initial: number | null }) {
  const [active, setActive] = useState<number | null>(initial);
  return <Chart {...props} activeIndex={active} onActiveIndexChange={setActive} />;
}

const metrics = [
  { title: '누적 전력 사용량', value: '1,248', unit: 'kWh', comparison: '이전 7일 대비' },
  { title: '가스 사용량', value: '312', unit: 'm³', comparison: '이전 7일 대비' },
  { title: '수도 사용량', value: '86', unit: '톤', comparison: '이전 7일 대비' },
  { title: '참여 세대', value: '128', unit: '세대', comparison: '전체 130세대' },
];

const row = { display: 'flex', gap: 'var(--spacing-margin-m-6)', flexWrap: 'wrap' } as const;

/** 조회 조건 · 지표 카드 4개 · 선/막대 차트(툴팁) · 결과 없음 · 불러오는 중을 한 화면에 모은 예시입니다. */
export const Dashboard: Story = {
  name: '에너지 사용 현황',
  render: () => (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-8)', padding: 'var(--spacing-padding-p-6)', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-margin-m-4)', flexWrap: 'wrap' }}>
        <h2 className="ds-typography-xl-leading-normal-semibold" style={{ margin: 0, color: 'var(--colors-text-primary)' }}>
          에너지 사용 현황
        </h2>
        <DataFreshness state="fresh" timestamp="2026.10.14 09:30" dateTime="2026-10-14T09:30" interval="자동 갱신 1분" />
      </div>
      <FilterBarSample />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-margin-m-6)' }}>
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            icon={<LightningIcon />}
            value={m.value}
            unit={m.unit}
            trend={
              <MetricTrend direction="down" tone="positive">
                4.8%p
              </MetricTrend>
            }
            comparison={m.comparison}
          />
        ))}
      </div>
      <div style={row}>
        <ChartCard title="일별 전력 사용 추이" style={{ flex: '1016 1 480px' }}>
          <Chart
            type="line"
            aria-label="일별 전력 사용 추이"
            yAxisLabel="Y축: 전력 사용량 (kWh)"
            xAxisLabel="X축: 날짜 (월.일)"
            categories={['10.07', '10.08', '10.09', '10.10', '10.11', '10.12', '10.13']}
            ticks={[0, 60, 120, 180, 240]}
            series={[
              { label: '전기', data: [140, 194, 132, 186, 159, 219, 219] },
              { label: '가스', data: [175, 185, 171, 199, 205, 209, 216] },
            ]}
          />
        </ChartCard>
        <ChartCard title="동별 전력 사용량" style={{ flex: '640 1 400px' }}>
          <ChartWithTooltip
            initial={3}
            type="bar-vertical"
            aria-label="동별 전력 사용량"
            yAxisLabel="Y축: 전력 사용량 (kWh)"
            xAxisLabel="X축: 동별 구분"
            categories={['101동', '102동', '103동', '104동', '105동']}
            ticks={[0, 100, 200, 300, 400]}
            series={[
              { label: '이번달', data: [320, 265, 301, 324, 384] },
              { label: '저번달', data: [330, 273, 311, 332, 396] },
            ]}
          />
        </ChartCard>
      </div>
      <div style={row}>
        <ChartCard title="동별 가스 사용량" style={{ flex: '1 1 400px' }}>
          <DataState state="no-results" onAction={() => {}} />
        </ChartCard>
        <ChartCard title="설비별 사용량" style={{ flex: '1 1 400px', alignSelf: 'flex-start' }}>
          <DataState state="loading" />
        </ChartCard>
      </div>
    </main>
  ),
  play: async ({ canvas, step }) => {
    await step('구성', async () => {
      await expect(canvas.getByRole('heading', { level: 2, name: '에너지 사용 현황' })).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: '조회' })).toBeInTheDocument();
      for (const name of ['일별 전력 사용 추이', '동별 전력 사용량', '동별 가스 사용량', '설비별 사용량']) await expect(canvas.getByRole('region', { name })).toBeInTheDocument();
      await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(8); // 지표 카드 4 · 차트 카드 4
      await expect(canvas.getByText('조회 결과가 없습니다')).toBeInTheDocument();
      // Two reset buttons: the filter bar's icon button and the no-results action.
      await expect(within(canvas.getByRole('region', { name: '동별 가스 사용량' })).getByRole('button', { name: '조건 초기화' })).toBeInTheDocument();
    });
    await step('막대 차트 툴팁 — 처음에 104동이 열려 있음', async () => {
      const bar = canvas.getByRole('region', { name: '동별 전력 사용량' });
      await waitFor(() => expect(bar.querySelector('[role="tooltip"], .ds-chart__tooltip')).not.toBeNull());
      await expect(bar).toHaveTextContent('324');
      await expect(bar).toHaveTextContent('332');
    });
  },
};
