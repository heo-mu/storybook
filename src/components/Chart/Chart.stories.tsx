import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chart } from './Chart';
import { CHART_TYPES, CHART_VARIANTS } from './Chart.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Chart.showcase.stories.tsx
const BUILDINGS = ['101동', '102동', '103동', '104동', '105동'];
const MONTHS = ['6월', '7월', '8월', '9월', '10월'];

const meta = {
  title: 'Components/Chart/Chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **chart** (698:4399, 12 variants) with chart-legend-item (697:4514) and chart-tooltip (693:9776). ' +
          'Type → `type` (line · bar-vertical · bar-horizontal), Style → `variant` (default · simple), Group → the number of ' +
          '`series` (one = no, two = yes: the second is the comparison). Default style: Y / X axis labels → `yAxisLabel` / ' +
          '`xAxisLabel`, value grid → `ticks`, legend from the series labels, hover / keyboard tooltip (`activeIndex`). ' +
          'Simple style: 160px, the last category is the current period. Width follows the container.',
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
    type: { control: 'inline-radio', options: CHART_TYPES, description: 'Figma "Type"', table: { defaultValue: { summary: 'bar-vertical' } } },
    variant: { control: 'inline-radio', options: CHART_VARIANTS, description: 'Figma "Style"', table: { defaultValue: { summary: 'default' } } },
  },
  render: (args) => (
    <div style={{ width: args.variant === 'simple' ? 320 : 600, maxWidth: '100%' }}>
      <Chart {...args} />
    </div>
  ),
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Group=no: one series. */
export const SingleSeries: Story = {
  args: { series: [{ label: '조회 기간', data: [320, 265, 301, 305, 384] }] },
};

export const BarHorizontal: Story = {
  args: { type: 'bar-horizontal', yAxisLabel: 'Y축: 동별 구분', xAxisLabel: 'X축: 전력 사용량 (kWh)' },
};

/** Line chart over dates; one series also draws an area, and the highest point gets the "최고" badge (`maxLabel`). */
export const Line: Story = {
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

/** Simple style: compact, no axes or legend; the last category is the current period (brand colour). */
export const Simple: Story = {
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

/** The tooltip category can be controlled; `null` hides it. */
export const ControlledTooltip: Story = {
  args: { activeIndex: 3 },
};
