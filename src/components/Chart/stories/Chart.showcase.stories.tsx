import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, type Mock } from 'storybook/test';
import { Chart, type ChartProps } from '../Chart';
import { ChartLegendItem } from '../ChartLegendItem';
import { ChartTooltip } from '../ChartTooltip';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs chart` (sets chart, chart-legend-item, chart-tooltip).

const meta = {
  title: 'Components/Chart/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Figma sample data. The layer names carry placeholder values ("Bar / 101동 / current / 384" on every bar), so the
// values are derived from the drawn geometry: bar height × 400 / 172, bar width × 400 / 548, line vertex y on the
// 0–240 grid (196 − y) × 240 / 184. Simple bars use the values in their layer names (they match the geometry); simple
// line points: (132 − y) × 224 / 128.
const BUILDINGS = ['101동', '102동', '103동', '104동', '105동'];
const DATES = ['10.07', '10.08', '10.09', '10.10', '10.11', '10.12', '10.13'];
const MONTHS = ['6월', '7월', '8월', '9월', '10월'];
const BAR_TICKS = [0, 100, 200, 300, 400];
const LINE_TICKS = [0, 60, 120, 180, 240];
const AXES_BUILDINGS = { yAxisLabel: 'Y축: 전력 사용량 (kWh)', xAxisLabel: 'X축: 동별 구분' };
const AXES_HORIZONTAL = { yAxisLabel: 'Y축: 동별 구분', xAxisLabel: 'X축: 전력 사용량 (kWh)' };
const AXES_DATES = { yAxisLabel: 'Y축: 전력 사용량 (kWh)', xAxisLabel: 'X축: 날짜 (월.일)' };

// The Figma variants without the hover property; `hover` is the category drawn in their hover=yes copy.
const FIGMA_BASE: Array<{ name: string; width: number; hover: number; props: ChartProps }> = [
  {
    name: 'Type=Line, Style=Default, Group=yes',
    width: 984,
    hover: 4,
    props: {
      type: 'line',
      ...AXES_DATES,
      categories: DATES,
      ticks: LINE_TICKS,
      series: [
        { label: '전기', data: [140.3337, 194.4758, 132.0042, 185.5513, 159.3727, 218.8696, 218.8696] },
        { label: '가스', data: [175, 185, 171, 199, 205, 209, 216] },
      ],
    },
  },
  {
    name: 'Type=Line, Style=Default, Group=no',
    width: 984,
    hover: 4,
    props: {
      type: 'line',
      ...AXES_DATES,
      categories: DATES,
      ticks: LINE_TICKS,
      series: [{ label: '전기', data: [140.3337, 194.4758, 132.0042, 185.5513, 159.3727, 218.8696, 218.8696] }],
    },
  },
  {
    name: 'Type=Bar Horizontal, Style=Default, Group=no',
    width: 600,
    hover: 1,
    props: {
      type: 'bar-horizontal',
      ...AXES_HORIZONTAL,
      categories: BUILDINGS,
      ticks: BAR_TICKS,
      series: [{ label: '조회 기간', data: [364.9124, 323.7883, 301.7372, 251.4526, 319.7883] }],
    },
  },
  {
    name: 'Type=Bar Horizontal, Style=Default, Group=yes',
    width: 600,
    hover: 1,
    props: {
      type: 'bar-horizontal',
      ...AXES_HORIZONTAL,
      categories: BUILDINGS,
      ticks: BAR_TICKS,
      series: [
        { label: '조회 기간', data: [331.5036, 289.1679, 255.5474, 276.4307, 289.2482] },
        { label: '이전 기간', data: [367.1825, 319.7372, 283.0511, 306.1825, 320.3796] },
      ],
    },
  },
  {
    name: 'Type=Bar Vertical, Style=Default, Group=yes',
    width: 600,
    hover: 3,
    props: {
      type: 'bar-vertical',
      ...AXES_BUILDINGS,
      categories: BUILDINGS,
      ticks: BAR_TICKS,
      series: [
        { label: '조회 기간', data: [320.2326, 264.9302, 301.2093, 304.6744, 384] },
        { label: '이전 기간', data: [330.2326, 273.2093, 310.6279, 314.186, 396] },
      ],
    },
  },
  {
    name: 'Type=Bar Vertical, Style=Default, Group=no',
    width: 600,
    hover: 3,
    props: {
      type: 'bar-vertical',
      ...AXES_BUILDINGS,
      categories: BUILDINGS,
      ticks: BAR_TICKS,
      series: [{ label: '조회 기간', data: [320.2326, 264.9302, 301.2093, 304.6744, 384] }],
    },
  },
  {
    name: 'Type=Line, Style=Simple, Group=no',
    width: 320,
    hover: 4,
    props: { type: 'line', variant: 'simple', categories: BUILDINGS, series: [{ label: '조회 기간', data: [83.0725, 161, 142.8, 224, 165.095] }] },
  },
  {
    name: 'Type=Line, Style=Simple, Group=yes',
    width: 320,
    hover: 4,
    props: {
      type: 'line',
      variant: 'simple',
      categories: BUILDINGS,
      series: [
        { label: '조회 기간', data: [83.0725, 161, 142.8, 224, 165.095] },
        { label: '비교 기간', data: [97.0725, 128.8, 84.35, 175, 194.4075] },
      ],
    },
  },
  {
    name: 'Type=Bar Vertical, Style=Simple, Group=no',
    width: 320,
    hover: 4,
    props: { type: 'bar-vertical', variant: 'simple', categories: MONTHS, series: [{ label: '조회 기간', data: [148, 198, 136, 224, 184] }] },
  },
  {
    name: 'Type=Bar Vertical, Style=Simple, Group=yes',
    width: 320,
    hover: 4,
    props: {
      type: 'bar-vertical',
      variant: 'simple',
      categories: MONTHS,
      series: [
        { label: '조회 기간', data: [148, 198, 136, 224, 184] },
        { label: '비교 기간', data: [170, 185, 168, 204, 212] },
      ],
    },
  },
  {
    name: 'Type=Bar Horizontal, Style=Simple, Group=no',
    width: 320,
    hover: 3,
    props: { type: 'bar-horizontal', variant: 'simple', categories: MONTHS.slice(1), series: [{ label: '조회 기간', data: [198, 136, 224, 184] }] },
  },
  {
    name: 'Type=Bar Horizontal, Style=Simple, Group=yes',
    width: 320,
    hover: 3,
    props: {
      type: 'bar-horizontal',
      variant: 'simple',
      categories: MONTHS.slice(1),
      series: [
        { label: '조회 기간', data: [198, 136, 224, 184] },
        { label: '비교 기간', data: [185, 168, 204, 212] },
      ],
    },
  },
];

const FIGMA_CHARTS = FIGMA_BASE.flatMap(({ name, width, hover, props }) => [
  { name: `${name}, hover=no`, width, props },
  { name: `${name}, hover=yes`, width, props: { ...props, activeIndex: hover } },
]);

/** The 24 Figma variants with the Figma sample data (hover=yes: the active category drawn in Figma). */
export const Figma: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 40, justifyItems: 'start' }}>
      {FIGMA_CHARTS.map(({ name, width, props }) => (
        <Chart key={name} data-figma={name} aria-label={name} style={{ width }} {...props} />
      ))}
    </div>
  ),
};

/** chart-legend-item (3 variants) and chart-tooltip on their own. */
export const FigmaParts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <ChartLegendItem data-figma="legend:Type=Line" type="line">
        조회 기간
      </ChartLegendItem>
      <ChartLegendItem data-figma="legend:Type=Dash Line" type="dash-line">
        조회 기간
      </ChartLegendItem>
      <ChartLegendItem data-figma="legend:Type=Bar" type="bar">
        조회 기간
      </ChartLegendItem>
      <ChartTooltip
        data-figma="tooltip:chart-tooltip"
        title="yyyy년 mm월 dd일"
        items={[
          { label: 'RS-139', value: '1.025', color: 'brand' },
          { label: 'RS-201', value: '1.025', color: 'compare' },
        ]}
      />
    </div>
  ),
};

/** Pointer and keyboard: the plot takes focus; arrow keys move the tooltip and announce the values. */
export const Interaction: StoryObj<{ onActiveIndexChange: Mock<(index: number | null) => void> }> = {
  args: { onActiveIndexChange: fn() },
  render: (args) => (
    <Chart
      style={{ width: 600 }}
      aria-label="동별 전력 사용량"
      type="bar-vertical"
      {...AXES_BUILDINGS}
      categories={BUILDINGS}
      series={[
        { label: '조회 기간', data: [320, 265, 301, 305, 384] },
        { label: '이전 기간', data: [330, 273, 311, 314, 396] },
      ]}
      onActiveIndexChange={args.onActiveIndexChange}
    />
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const plot = canvas.getByRole('group', { name: '차트 항목: 화살표 키로 값 확인' });
    await step('keyboard', async () => {
      await userEvent.tab();
      await expect(plot).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(0);
      await expect(canvas.getByText('101동: 조회 기간 320, 이전 기간 330')).toBeInTheDocument();
      await expect(document.querySelector('.ds-chart__tooltip')).toHaveTextContent('101동조회 기간320이전 기간330');
      await userEvent.keyboard('{End}');
      await expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(4);
      await userEvent.keyboard('{ArrowRight}');
      await expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(4);
      await userEvent.keyboard('{Escape}');
      await expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(null);
      await expect(document.querySelector('.ds-chart__tooltip')).toBeNull();
    });
    await step('pointer', async () => {
      const box = plot.getBoundingClientRect();
      // Over the 4th category (plot area from x 44, five 98.4px columns 16px apart).
      await userEvent.pointer({ target: plot, coords: { clientX: box.left + 44 + 3 * 114.4 + 49, clientY: box.top + 100 } });
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(3));
      await expect(canvasElement.querySelector('.ds-chart__highlight')).not.toBeNull();
      await userEvent.unhover(plot);
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(null));
    });
    await step('the value-label column is not part of the hover area', async () => {
      const box = plot.getBoundingClientRect();
      await userEvent.pointer({ target: plot, coords: { clientX: box.left + 44 + 49, clientY: box.top + 100 } });
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(0));
      await userEvent.pointer({ target: plot, coords: { clientX: box.left + 10, clientY: box.top + 100 } });
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(null));
      await expect(document.querySelector('.ds-chart__tooltip')).toBeNull();
      await userEvent.unhover(plot);
    });
    await step('touch: a tap shows the category until a press outside the plot', async () => {
      const box = plot.getBoundingClientRect();
      // A tap fires pointerdown / pointerup / pointerleave (finger lifted) and no pointermove.
      await userEvent.pointer({ keys: '[TouchA]', target: plot, coords: { clientX: box.left + 44 + 2 * 114.4 + 49, clientY: box.top + 100 } });
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(2));
      await expect(document.querySelector('.ds-chart__tooltip')).toHaveTextContent('103동');
      await userEvent.pointer({ keys: '[TouchA]', target: canvasElement.ownerDocument.body, coords: { clientX: 5, clientY: 5 } });
      await waitFor(() => expect(args.onActiveIndexChange).toHaveBeenLastCalledWith(null));
      await expect(document.querySelector('.ds-chart__tooltip')).toBeNull();
    });
  },
};

/** Simple style: the plot takes focus too (Figma hover=yes) — arrow keys show the highlight and the tooltip. */
export const SimpleInteraction: Story = {
  render: () => (
    <Chart
      style={{ width: 320 }}
      aria-label="월별 사용량"
      type="bar-vertical"
      variant="simple"
      categories={MONTHS}
      series={[
        { label: '사용량', data: [148, 198, 136, 224, 184] },
        { label: '비교 기간', data: [170, 185, 168, 204, 212] },
      ]}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole('group', { name: '차트 항목: 화살표 키로 값 확인' });
    await userEvent.tab();
    await expect(plot).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByText('10월: 사용량 184, 비교 기간 212')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.ds-chart__highlight')).not.toBeNull();
    const tip = document.querySelector('.ds-chart__tooltip');
    await expect(tip).toHaveTextContent('10월사용량184비교 기간212');
    // Indicators use the bar tokens of the series: current period brand, comparison compare (Figma hover=yes).
    const indicators = [...tip!.querySelectorAll('.ds-chart-tooltip__indicator')].map((el) => getComputedStyle(el).getPropertyValue('--_c').trim());
    const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    await expect(indicators).toEqual([token('--colors-chart-bar-primary'), token('--colors-chart-bar-compare')]);
    await expect(indicators.every(Boolean)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect(document.querySelector('.ds-chart__tooltip')).toBeNull();
  },
};

/** The values are also a table for screen readers; the drawing is hidden from assistive technology. */
export const Accessibility: Story = {
  render: () => (
    <Chart
      style={{ width: 320 }}
      aria-label="월별 사용량"
      type="bar-vertical"
      variant="simple"
      categories={MONTHS}
      series={[{ label: '사용량', data: [148, 198, 136, 224, 184] }]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('figure', { name: '월별 사용량' })).toBeInTheDocument();
    const table = canvas.getByRole('table', { name: '월별 사용량' });
    await expect(table).toBeInTheDocument();
    await expect(canvas.getByRole('columnheader', { name: '10월' })).toBeInTheDocument();
    await expect(canvas.getByRole('rowheader', { name: '사용량' })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: '224' })).toBeInTheDocument();
    // The plot is a focusable group in both styles (simple charts have a hover / keyboard tooltip since Figma hover=yes).
    await expect(canvas.getByRole('group', { name: '차트 항목: 화살표 키로 값 확인' })).toHaveAttribute('tabindex', '0');
  },
};

const tooltipRect = () => {
  const el = document.querySelector('.ds-chart__tooltip');
  if (!el) throw new Error('no tooltip');
  return el.getBoundingClientRect();
};
/** The visible part of the plot, inset by the 12px viewport margin. */
const visiblePlot = (plot: Element) => {
  const r = plot.getBoundingClientRect();
  const root = document.documentElement;
  return { left: Math.max(r.left, 12), top: Math.max(r.top, 12), right: Math.min(r.right, root.clientWidth - 12), bottom: Math.min(r.bottom, root.clientHeight - 12) };
};
const PLACEMENT_SERIES = [
  { label: '조회 기간', data: [320, 265, 301, 305, 384] },
  { label: '이전 기간', data: [330, 273, 311, 314, 396] },
];

/** The last category of a chart that runs past the right edge of the screen: the tooltip stays on screen and in the plot. */
export const TooltipAtViewportEdge: Story = {
  render: () => (
    <div style={{ marginLeft: 'calc(100vw - 340px)', width: 600 }}>
      <Chart aria-label="화면 경계" type="bar-vertical" categories={BUILDINGS} series={PLACEMENT_SERIES} activeIndex={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const area = visiblePlot(canvasElement.querySelector('.ds-chart__plot')!);
    const tip = tooltipRect();
    await expect(tip.left).toBeGreaterThanOrEqual(area.left - 0.5);
    await expect(tip.right).toBeLessThanOrEqual(area.right + 0.5);
    await expect(tip.top).toBeGreaterThanOrEqual(area.top - 0.5);
    await expect(tip.bottom).toBeLessThanOrEqual(area.bottom + 0.5);
  },
};

/** At the last point of a line chart the tooltip flips to the left of the point. */
export const TooltipFlip: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Chart aria-label="뒤집기" type="line" categories={['10.07', '10.08', '10.09', '10.10']} series={[{ label: '전기', data: [140, 194, 132, 186] }]} activeIndex={3} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const plot = canvasElement.querySelector('.ds-chart__plot')!.getBoundingClientRect();
    const tip = tooltipRect();
    // The last point sits on the plot's right edge; the tooltip ends 12px (p-3) before it.
    await expect(Math.abs(tip.right - (plot.right - 12))).toBeLessThan(1);
    const area = visiblePlot(canvasElement.querySelector('.ds-chart__plot')!);
    await expect(tip.top).toBeGreaterThanOrEqual(area.top - 0.5);
    await expect(tip.bottom).toBeLessThanOrEqual(area.bottom + 0.5);
  },
};

/** Inside a container that clips its content (overflow: hidden) the tooltip is not cut off: it is rendered in <body>. */
export const TooltipInClippingContainer: Story = {
  render: () => (
    <div style={{ width: 600, height: 150, overflow: 'hidden' }}>
      <Chart aria-label="잘림" type="bar-horizontal" categories={BUILDINGS} series={PLACEMENT_SERIES} activeIndex={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tip = document.querySelector('.ds-chart__tooltip')!;
    await expect(tip.parentElement).toBe(document.body);
    await expect(canvasElement.contains(tip)).toBe(false);
    await expect(getComputedStyle(tip).position).toBe('fixed');
  },
};
