import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chart } from './Chart';
import { CHART_TYPES, CHART_VARIANTS } from './Chart.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Chart.showcase.stories.tsx에 있습니다.
const BUILDINGS = ['101동', '102동', '103동', '104동', '105동'];
const MONTHS = ['6월', '7월', '8월', '9월', '10월'];

const meta = {
  title: '컴포넌트/Chart/Chart',
  id: 'components-chart-chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '항목별 수치를 선이나 막대로 그려 보여 주는 차트입니다. 모양은 `type`, 스타일은 `variant`(기본 · 간단)로 고르고, ' +
          '계열은 `series`에 1개 또는 2개(두 번째는 비교 계열) 넣습니다.',
      },
    },
  },
  args: {
    type: 'bar-vertical',
    variant: 'default',
    'aria-label': '동별 전력 사용량',
    yAxisLabel: 'Y축: 전력 사용량 (kWh)',
    xAxisLabel: 'X축: 동별 구분',
    categories: BUILDINGS,
    series: [
      { label: '조회 기간', data: [320, 265, 301, 305, 384] },
      { label: '이전 기간', data: [330, 273, 311, 314, 396] },
    ],
    onActiveIndexChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: CHART_TYPES, description: '종류 — 선(line) · 세로 막대(bar-vertical) · 가로 막대(bar-horizontal)', table: { defaultValue: { summary: 'bar-vertical' } } },
    variant: { control: 'inline-radio', options: CHART_VARIANTS, description: '스타일 — 기본(default) · 간단(simple)', table: { defaultValue: { summary: 'default' } } },
  },
  render: (args) => (
    <div style={{ width: args.variant === 'simple' ? 320 : 600, maxWidth: '100%' }}>
      <Chart {...args} />
    </div>
  ),
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 두 계열을 비교하는 세로 막대 차트입니다. 종류와 스타일을 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

/** 계열이 하나인 차트입니다. */
export const SingleSeries: Story = {
  name: '계열 하나',
  args: { series: [{ label: '조회 기간', data: [320, 265, 301, 305, 384] }] },
};

/** 가로 막대 차트입니다. */
export const BarHorizontal: Story = {
  name: '가로 막대 차트',
  args: { type: 'bar-horizontal', yAxisLabel: 'Y축: 동별 구분', xAxisLabel: 'X축: 전력 사용량 (kWh)' },
};

/** 날짜별 선 차트입니다. 첫 계열의 가장 큰 값에 "최고" 배지(`maxLabel`)가 붙고, 계열이 하나면 선 아래 면도 채워집니다. */
export const Line: Story = {
  name: '선 차트',
  args: {
    type: 'line',
    'aria-label': '일별 전력 사용량',
    xAxisLabel: 'X축: 날짜 (월.일)',
    categories: ['10.07', '10.08', '10.09', '10.10', '10.11', '10.12', '10.13'],
    ticks: [0, 60, 120, 180, 240],
    series: [
      { label: '전기', data: [140, 194, 132, 186, 159, 219, 219] },
      { label: '가스', data: [175, 185, 171, 199, 205, 209, 216] },
    ],
  },
  render: (args) => (
    <div style={{ width: 984, maxWidth: '100%' }}>
      <Chart {...args} />
    </div>
  ),
};

/** 축과 범례가 없는 간단 스타일입니다. 마지막 항목이 현재 기간이며, 마우스를 올리거나 키보드로 선택하면 기본 스타일처럼 툴팁이 보입니다. */
export const Simple: Story = {
  name: '간단 스타일',
  args: {
    variant: 'simple',
    'aria-label': '월별 사용량',
    categories: MONTHS,
    series: [
      { label: '사용량', data: [148, 198, 136, 224, 184] },
      { label: '비교 기간', data: [170, 185, 168, 204, 212] },
    ],
  },
};

/** 툴팁을 표시할 항목을 `activeIndex`로 직접 정합니다. `null`이면 숨깁니다. */
export const ControlledTooltip: Story = {
  name: '툴팁 직접 제어',
  args: { activeIndex: 3 },
};
