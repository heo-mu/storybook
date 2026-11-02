import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { Button } from '../../Button';
import { Chart, type ChartProps } from '../Chart';
import { ChartLegendItem } from '../ChartLegendItem';
import { ChartTooltip } from '../ChartTooltip';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs chart` (sets chart, chart-legend-item, chart-tooltip).

const meta = {
  title: "Components/Chart/Gallery",
  id: 'components-chart-showcase',
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

// Figma State values retain their original spelling. `hover` identifies the selected category.
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
      series: [{ label: '유형', data: [364.9124, 323.7883, 301.7372, 251.4526, 319.7883] }],
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
        { label: '유형', data: [331.5036, 289.1679, 255.5474, 276.4307, 289.2482] },
        { label: '유형', data: [367.1825, 319.7372, 283.0511, 306.1825, 320.3796] },
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
        { label: '유형', data: [320.2326, 264.9302, 301.2093, 304.6744, 384] },
        { label: '유형', data: [330.2326, 273.2093, 310.6279, 314.186, 396] },
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
      series: [{ label: '유형', data: [320.2326, 264.9302, 301.2093, 304.6744, 384] }],
    },
  },
  {
    name: 'Type=Line, Style=Simple, Group=no',
    width: 320,
    hover: 4,
    props: { type: 'line', variant: 'simple', categories: DATES.slice(0, 5), series: [{ label: '전기', data: [83.0725, 161, 142.8, 224, 165.095] }] },
  },
  {
    name: 'Type=Line, Style=Simple, Group=yes',
    width: 320,
    hover: 4,
    props: {
      type: 'line',
      variant: 'simple',
      categories: DATES.slice(0, 5),
      series: [
        { label: '전기', data: [83.0725, 161, 142.8, 224, 165.095] },
        { label: '가스', data: [97.0725, 128.8, 84.35, 175, 194.4075] },
      ],
    },
  },
  {
    name: 'Type=Bar Vertical, Style=Simple, Group=no',
    width: 320,
    hover: 4,
    props: { type: 'bar-vertical', variant: 'simple', categories: MONTHS, series: [{ label: '이번달', data: [148, 198, 136, 224, 184] }] },
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
        { label: '이번달', data: [148, 198, 136, 224, 184] },
        { label: '저번달', data: [170, 185, 168, 204, 212] },
      ],
    },
  },
  {
    name: 'Type=Bar Horizontal, Style=Simple, Group=no',
    width: 320,
    hover: 3,
    props: { type: 'bar-horizontal', variant: 'simple', categories: MONTHS.slice(1), series: [{ label: '이번달', data: [198, 136, 224, 184] }] },
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
        { label: '이번달', data: [198, 136, 224, 184] },
        { label: '저번달', data: [185, 168, 204, 212] },
      ],
    },
  },
];

const FIGMA_CHARTS = FIGMA_BASE.flatMap(({ name, width, hover, props }) => [
  { name: `${name}, State=Default`, width, props },
  { name: `${name}, State=Hover`, width, props: { ...props, activeIndex: hover } },
  ...(props.type !== 'line' || name === 'Type=Line, Style=Default, Group=yes'
    ? [{ name: `${name}, State=Hilighted`, width, props: { ...props, highlightedIndex: hover } }]
    : []),
]);

/** 지원하는 구성과 상태를 비교합니다. */
export const Figma: Story = {
  name: "Variants",
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.ds-chart__bar').length).toBeGreaterThan(0));
    for (const chart of canvasElement.querySelectorAll('.ds-chart')) {
      const state = chart.getAttribute('data-state');
      const isLine = chart.getAttribute('data-type') === 'line';
      if (!isLine) {
        const colors = [...chart.querySelectorAll('.ds-chart__bar')].map(n => n.getAttribute('data-color'));
        await expect(colors.every(c => c === 'brand' || c === 'compare')).toBe(true);
      }
      if (state === 'highlighted') {
        await expect(chart.querySelector('.ds-chart__highlight')).not.toBeNull();
        await expect(chart.querySelector('.ds-chart__tooltip')).toBeNull();
        if (isLine) await expect(chart.querySelector('.ds-chart__point[data-current]')).toBeNull();
      } else if (state === 'default') {
        await expect(chart.querySelector('.ds-chart__highlight')).toBeNull();
      }
    }
  },
  render: () => (
    <div style={{ display: 'grid', gap: 40, justifyItems: 'start' }}>
      {FIGMA_CHARTS.map(({ name, width, props }) => (
        <Chart key={name} data-figma={name} aria-label={name} style={{ width }} {...props} />
      ))}
    </div>
  ),
};

/** 범례와 툴팁의 구성 요소를 비교합니다. */
export const FigmaParts: Story = {
  name: "Parts",
  render: () => (
    // Whole-pixel 120px slots: without calc-size (Firefox, WebKit) a label is a fractional width, and a part laid out
    // after it would start between pixels.
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 120px)', columnGap: 40, alignItems: 'start', justifyItems: 'start' }}>
      <ChartLegendItem data-figma="legend:Type=Line" type="line">
        유형
      </ChartLegendItem>
      <ChartLegendItem data-figma="legend:Type=Dash Line" type="dash-line">
        유형
      </ChartLegendItem>
      <ChartLegendItem data-figma="legend:Type=Bar" type="bar">
        유형
      </ChartLegendItem>
      <ChartTooltip
        data-figma="tooltip:chart-tooltip"
        title="yyyy년 mm월 dd일"
        items={[
          { label: '유형', value: '1.025', color: 'brand' },
          { label: '유형', value: '1.025', color: 'compare' },
        ]}
      />
    </div>
  ),
};

/** Pointer and keyboard: the plot takes focus; arrow keys move the tooltip and announce the values. */
export const Interaction: StoryObj<{ onActiveIndexChange: Mock<(index: number | null) => void> }> = {
  name: "Interaction",
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

/** 간결한 차트에서 키보드로 항목을 이동하며 툴팁을 확인합니다. */
export const SimpleInteraction: Story = {
  name: "Simple Interaction",
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
    await expect(indicators).toEqual([token('--colors-chart-bar-primary-gradient-start-default'), token('--colors-chart-bar-compare-gradient-start-default')]);
    await expect(indicators.every(Boolean)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect(document.querySelector('.ds-chart__tooltip')).toBeNull();
  },
};

/** The values are also a table for screen readers; the drawing is hidden from assistive technology. */
export const Accessibility: Story = {
  name: "Accessibility",
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
  name: '화면 가장자리의 툴팁',
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
  name: "툴팁 위치 전환",
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

/** 짧거나 긴 범례 이름을 사용해도 툴팁의 값 열이 정렬되는지 확인합니다. */
export const TooltipLabelWidth: Story = {
  name: "긴 범례의 툴팁",
  render: () => (
    <ChartTooltip
      title="10월 1일"
      items={[
        { label: '전기', value: '324', color: 'brand' },
        { label: '공용 전기 사용량(지하 주차장)', value: '332', color: 'compare' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const [short, long] = [...canvasElement.querySelectorAll('.ds-chart-tooltip__text')].map((el) => el.getBoundingClientRect());
    await expect(short.width).toBeCloseTo(40, 0);
    await expect(long.width).toBeLessThanOrEqual(80);
    await expect(long.height).toBeGreaterThan(short.height);
    const values = [...canvasElement.querySelectorAll('.ds-chart-tooltip__value')].map((el) => el.getBoundingClientRect().left);
    await expect(values[0]).toBeCloseTo(values[1], 1);
  },
};

/** 높이가 제한된 컨테이너 안에서 툴팁이 잘리지 않고 표시되는지 확인합니다. */
export const TooltipInClippingContainer: Story = {
  name: "스크롤 영역의 툴팁",
  render: () => (
    <div data-clip="" style={{ width: 600, height: 150, overflow: 'hidden' }}>
      <Chart aria-label="잘림" type="bar-horizontal" categories={BUILDINGS} series={PLACEMENT_SERIES} activeIndex={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tip = canvasElement.querySelector('.ds-chart__tooltip')!;
    await expect(tip.closest('.ds-chart__plot')).toBe(canvasElement.querySelector('.ds-chart__plot'));
    await expect(getComputedStyle(tip).position).toBe('absolute');
    const clip = canvasElement.querySelector('[data-clip]')!.getBoundingClientRect();
    const r = tip.getBoundingClientRect();
    await expect(r.top).toBeGreaterThanOrEqual(clip.top - 0.5);
    await expect(r.bottom).toBeLessThanOrEqual(clip.bottom + 0.5);
    await expect(r.left).toBeGreaterThanOrEqual(clip.left - 0.5);
    await expect(r.right).toBeLessThanOrEqual(clip.right + 0.5);
  },
};

const ownTooltip = (plot: Element) => plot.querySelector('.ds-chart__tooltip');
/** The part of an element that can be seen: its box ∩ every ancestor that clips (overflow other than visible). */
const seenRect = (el: Element) => {
  let r = el.getBoundingClientRect().toJSON() as { left: number; top: number; right: number; bottom: number };
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
    const b = p.getBoundingClientRect();
    r = { left: Math.max(r.left, b.left), top: Math.max(r.top, b.top), right: Math.min(r.right, b.right), bottom: Math.min(r.bottom, b.bottom) };
  }
  return r;
};
/** Every tooltip on the page lies inside its own plot, and the part of it that can be seen covers no other plot. */
const tooltipsStayHome = (root: ParentNode) => {
  const plots = [...root.querySelectorAll('.ds-chart__plot')];
  return [...document.querySelectorAll('.ds-chart__tooltip')].every((t) => {
    const own = t.closest('.ds-chart__plot');
    if (!own || !plots.includes(own)) return false;
    const box = t.getBoundingClientRect();
    const p = own.getBoundingClientRect();
    const inside = box.left >= p.left - 1 && box.right <= p.right + 1 && box.top >= p.top - 1 && box.bottom <= p.bottom + 1;
    const r = seenRect(t);
    if (r.right - r.left <= 1 || r.bottom - r.top <= 1) return inside; // clipped away by a scroll container
    const overOther = plots.some((o) => {
      if (o === own) return false;
      const q = o.getBoundingClientRect();
      return Math.min(r.right, q.right) - Math.max(r.left, q.left) > 1 && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 1;
    });
    return inside && !overOther;
  });
};

/**
 * A dashboard with three charts (line, vertical bar, horizontal bar). Each chart reacts only to its own data: hovering
 * one shows its tooltip in its own plot, moving to another closes the first, quick moves leave no stale tooltip,
 * keyboard focus works per chart, and scrolling the page or a scroll container keeps every tooltip with its chart.
 */
export const MultipleCharts: Story = {
  name: "여러 차트 배치",
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 600px)', gap: 24 }}>
        <Chart data-chart="line" aria-label="일별 사용량" type="line" {...AXES_DATES} categories={DATES} series={[{ label: '전기', data: [140, 194, 132, 186, 150, 210, 205] }, { label: '가스', data: [120, 150, 160, 140, 170, 160, 200] }]} />
        <Chart data-chart="vertical" aria-label="동별 사용량" type="bar-vertical" {...AXES_BUILDINGS} categories={BUILDINGS} series={PLACEMENT_SERIES} />
        <Chart data-chart="horizontal" aria-label="동별 사용량 (가로)" type="bar-horizontal" {...AXES_HORIZONTAL} categories={BUILDINGS} series={PLACEMENT_SERIES} />
        <div data-scroller="" style={{ height: 220, overflow: 'auto', border: '1px dashed var(--colors-border-gray-subtler)' }}>
          <div style={{ height: 120 }} />
          <Chart data-chart="scrolled" aria-label="스크롤 영역 안" type="bar-vertical" variant="simple" style={{ width: 320 }} categories={MONTHS} series={[{ label: '사용량', data: [148, 198, 136, 224, 184] }]} activeIndex={4} />
          <div style={{ height: 400 }} />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const plotOf = (name: string) => canvasElement.querySelector(`[data-chart="${name}"] .ds-chart__plot`)!;
    const hoverAt = async (name: string, fx: number, fy = 0.5) => {
      const plot = plotOf(name);
      const b = plot.getBoundingClientRect();
      await userEvent.pointer({ target: plot, coords: { clientX: b.left + b.width * fx, clientY: b.top + b.height * fy } });
    };
    const openTooltips = () => [...canvasElement.querySelectorAll('[data-chart]:not([data-chart="scrolled"]) .ds-chart__tooltip')];
    await step('each chart shows its own tooltip, in its own plot', async () => {
      for (const [name, title] of [['line', '10.11'], ['vertical', '103동'], ['horizontal', '103동']] as const) {
        await hoverAt(name, name === 'horizontal' ? 0.5 : 0.62, name === 'horizontal' ? 0.5 : 0.5);
        await waitFor(() => expect(ownTooltip(plotOf(name))).not.toBeNull());
        await expect(openTooltips()).toHaveLength(1);
        await expect(ownTooltip(plotOf(name))).toHaveTextContent(title);
        await expect(tooltipsStayHome(canvasElement)).toBe(true);
      }
    });
    await step('quick moves between charts leave one tooltip, no stale copy', async () => {
      for (const name of ['line', 'vertical', 'horizontal', 'vertical', 'line']) await hoverAt(name, 0.3);
      await waitFor(() => expect(openTooltips()).toHaveLength(1));
      await expect(ownTooltip(plotOf('line'))).not.toBeNull();
      await userEvent.unhover(plotOf('line'));
      await waitFor(() => expect(openTooltips()).toHaveLength(0));
    });
    await step('keyboard: focus and arrow keys open the tooltip of the focused chart only', async () => {
      (plotOf('vertical') as HTMLElement).focus();
      await userEvent.keyboard('{End}');
      await expect(ownTooltip(plotOf('vertical'))).toHaveTextContent('105동');
      await expect(openTooltips()).toHaveLength(1);
      await userEvent.keyboard('{Escape}');
      await expect(openTooltips()).toHaveLength(0);
    });
    await step('a chart inside a scroll container keeps its tooltip in its plot while scrolled', async () => {
      const scroller = canvasElement.querySelector('[data-scroller]')!;
      const tip = ownTooltip(plotOf('scrolled'))!;
      await expect(tip).toHaveTextContent('10월');
      for (const top of [0, 60, 140, 260]) {
        scroller.scrollTop = top;
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        await expect(tooltipsStayHome(canvasElement)).toBe(true);
      }
      // Scrolled out of the container: the tooltip went with its chart, it is not pinned over the visible area.
      const box = scroller.getBoundingClientRect();
      const r = tip.getBoundingClientRect();
      await expect(r.bottom <= box.top || r.top >= box.bottom).toBe(true);
      scroller.scrollTop = 0;
    });
  },
};

// ── Entrance motion (Rules 09 "차트 그리기") ─────────────────────────────────────────────────────────────────────────
// The real Chart draws its data in when it is first seen. "다시 그리기" remounts the charts (React key) — the way an
// app draws a chart again. The plays record every animation frame and check the motion itself, then the final state.

const sample = (name: string) => FIGMA_BASE.find((b) => b.name === name)!;

/** One of the Figma sample charts (the Variants story), drawn in by the real component. */
function SampleChart({ name, ...props }: { name: string } & Partial<ChartProps>) {
  const s = sample(name);
  return <Chart aria-label={name} style={{ width: s.width }} {...s.props} {...props} />;
}

/** Remounts its charts with a new key: they wait to be seen and draw in again. */
function Replay({ children }: { children: ReactNode }) {
  const [round, setRound] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Button size="sm" variant="secondary" onClick={() => setRound((r) => r + 1)}>
        다시 그리기
      </Button>
      <div key={round} data-round={round} style={{ display: 'grid', gap: 32, justifyItems: 'start' }}>
        {children}
      </div>
    </div>
  );
}

type EntranceFrame = { phase: string | null; hidden: boolean; sizes: number[]; reveal: number | null };

/** Every frame of a chart's entrance until it is done: the drawn size of each bar (its animated path) or the share of the line that is revealed. */
function recordEntrance(chart: Element): Promise<EntranceFrame[]> {
  const horizontal = chart.getAttribute('data-type') === 'bar-horizontal';
  const frames: EntranceFrame[] = [];
  return new Promise((resolve) => {
    const tick = () => {
      const clip = chart.querySelector<SVGRectElement>('clipPath rect');
      const mark = chart.querySelector('.ds-chart__bar, .ds-chart__line');
      frames.push({
        phase: chart.getAttribute('data-entrance'),
        hidden: !!mark && getComputedStyle(mark).visibility === 'hidden',
        sizes: [...chart.querySelectorAll<SVGGraphicsElement>('.ds-chart__bar')].map((b) => (horizontal ? b.getBBox().width : b.getBBox().height)),
        // share of the plot right of the clip start that is revealed (the clip base width is 0 while drawing)
        reveal: clip ? clip.width.animVal.value / (Number(chart.querySelector('.ds-chart__svg')!.getAttribute('width')) - clip.x.baseVal.value) : null,
      });
      if (frames[frames.length - 1].phase === 'done') resolve(frames);
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

/**
 * The marks are hidden until the chart is seen, then grow from (almost) nothing and never shrink — bars category by
 * category (a pair together), the line revealed from the left — and end at the finished geometry with no clip left.
 */
async function expectDrawnIn(frames: EntranceFrame[], seriesCount: number) {
  const running = frames.filter((f) => f.phase === 'running');
  const done = frames[frames.length - 1];
  await expect(frames.filter((f) => f.phase === 'pending').every((f) => f.hidden)).toBe(true);
  await expect(running.length).toBeGreaterThan(5);
  if (done.sizes.length) {
    for (let i = 0; i < done.sizes.length; i++) {
      const seq = running.map((f) => f.sizes[i]);
      await expect(seq[0]).toBeLessThanOrEqual(done.sizes[i] * 0.25);
      await expect(seq.every((v, k) => k === 0 || v >= seq[k - 1] - 1e-3)).toBe(true);
      await expect(Math.max(...seq)).toBeLessThanOrEqual(done.sizes[i] + 1e-3);
    }
    const starts = done.sizes.map((_, i) => running.findIndex((f) => f.sizes[i] > 0.5));
    const categoryStart = (c: number) => Math.min(...starts.slice(c * seriesCount, (c + 1) * seriesCount).map((s) => (s < 0 ? Infinity : s)));
    for (let c = 1; c < done.sizes.length / seriesCount; c++) await expect(categoryStart(c)).toBeGreaterThanOrEqual(categoryStart(c - 1));
    await expect(categoryStart(done.sizes.length / seriesCount - 1)).toBeGreaterThan(categoryStart(0));
  } else {
    const reveal = running.map((f) => f.reveal ?? 1);
    await expect(reveal[0]).toBeLessThan(0.3);
    await expect(reveal.every((v, k) => k === 0 || v >= reveal[k - 1] - 1e-6)).toBe(true);
    await expect(done.reveal).toBeNull();
  }
}

/** Presses "다시 그리기", brings each new chart into view and checks its recorded entrance. */
async function replayAndCheck(canvasElement: HTMLElement, userEvent: { click: (el: Element) => Promise<void> }) {
  const round = Number(canvasElement.querySelector('[data-round]')!.getAttribute('data-round')) + 1;
  await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 그리기' }));
  await waitFor(() => expect(canvasElement.querySelector(`[data-round="${round}"] .ds-chart__svg`)).not.toBeNull());
  const charts = [...canvasElement.querySelectorAll(`[data-round="${round}"] .ds-chart`)];
  const recordings = charts.map(recordEntrance);
  for (const chart of charts) {
    if (chart.getAttribute('data-entrance') !== 'pending') continue;
    chart.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 50));
  }
  const all = await Promise.all(recordings);
  for (const [i, frames] of all.entries()) await expectDrawnIn(frames, charts[i].getAttribute('data-group') === 'yes' ? 2 : 1);
  window.scrollTo(0, 0);
}

/** 선은 첫 점부터 오른쪽으로 그려지며, 두 계열 · 면 · 점이 같은 시간축으로 나타나고 "최고" 배지는 선이 닿을 때 보입니다. */
export const LineEntrance: Story = {
  name: '진입 — 선 차트',
  render: () => (
    <Replay>
      <SampleChart name="Type=Line, Style=Default, Group=yes" />
      <SampleChart name="Type=Line, Style=Default, Group=no" />
      <div style={{ display: 'flex', gap: 40 }}>
        <SampleChart name="Type=Line, Style=Simple, Group=no" />
        <SampleChart name="Type=Line, Style=Simple, Group=yes" />
      </div>
    </Replay>
  ),
  play: async ({ canvasElement, userEvent }) => replayAndCheck(canvasElement, userEvent),
};

/** 세로 막대는 기준선에서 위로 실제 높이만큼 자랍니다(너비 · 모서리 유지). 항목마다 차례로, 비교 막대는 함께 나타납니다. */
export const BarVerticalEntrance: Story = {
  name: '진입 — 세로 막대',
  render: () => (
    <Replay>
      <SampleChart name="Type=Bar Vertical, Style=Default, Group=yes" />
      <SampleChart name="Type=Bar Vertical, Style=Default, Group=no" />
      <div style={{ display: 'flex', gap: 40 }}>
        <SampleChart name="Type=Bar Vertical, Style=Simple, Group=no" />
        <SampleChart name="Type=Bar Vertical, Style=Simple, Group=yes" />
      </div>
    </Replay>
  ),
  play: async ({ canvasElement, userEvent }) => replayAndCheck(canvasElement, userEvent),
};

/** 가로 막대는 축에서 오른쪽으로 값만큼 채워집니다(높이 · 모서리 · 그라데이션 유지). 항목마다 차례로 나타납니다. */
export const BarHorizontalEntrance: Story = {
  name: '진입 — 가로 막대',
  render: () => (
    <Replay>
      <SampleChart name="Type=Bar Horizontal, Style=Default, Group=yes" />
      <SampleChart name="Type=Bar Horizontal, Style=Default, Group=no" />
      <div style={{ display: 'flex', gap: 40 }}>
        <SampleChart name="Type=Bar Horizontal, Style=Simple, Group=no" />
        <SampleChart name="Type=Bar Horizontal, Style=Simple, Group=yes" />
      </div>
    </Replay>
  ),
  play: async ({ canvasElement, userEvent }) => replayAndCheck(canvasElement, userEvent),
};

/**
 * 강조 상태(`highlightedIndex`)의 배경은 그리는 동안에도 그대로이고, 그리는 중에 마우스를 올리거나 키보드로 항목을 고르면
 * 차트가 바로 완성된 뒤 툴팁이 열립니다. 다시 그리지는 않습니다.
 */
export const EntranceHighlighted: Story = {
  name: '진입 — 강조 상태와 툴팁',
  render: () => (
    <Replay>
      <SampleChart name="Type=Bar Vertical, Style=Default, Group=yes" highlightedIndex={3} />
      <SampleChart name="Type=Line, Style=Default, Group=yes" highlightedIndex={4} />
    </Replay>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    await step('the highlight stays while the data draws in', async () => {
      await replayAndCheck(canvasElement, userEvent);
      for (const chart of canvasElement.querySelectorAll('.ds-chart')) {
        await expect(chart).toHaveAttribute('data-state', 'highlighted');
        await expect(chart.querySelector('.ds-chart__highlight')).not.toBeNull();
      }
    });
    await step('hovering while it draws shows the finished chart and the right values', async () => {
      await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 그리기' }));
      const chart = await waitFor(() => {
        const c = canvasElement.querySelector('[data-round="2"] .ds-chart');
        expect(c).toHaveAttribute('data-entrance', 'running');
        return c!;
      });
      const plot = chart.querySelector('.ds-chart__plot')!;
      const box = plot.getBoundingClientRect();
      await userEvent.pointer({ target: plot, coords: { clientX: box.left + box.width * 0.9, clientY: box.top + 100 } });
      await expect(chart).toHaveAttribute('data-entrance', 'done');
      await expect(chart.querySelector('animate')).toBeNull();
      await expect(chart.querySelector('.ds-chart__tooltip')).toHaveTextContent('105동');
      const heights = [...chart.querySelectorAll<SVGGraphicsElement>('.ds-chart__bar')].map((b) => b.getBBox().height);
      await userEvent.unhover(plot);
      await waitFor(() => expect(chart).toHaveAttribute('data-state', 'highlighted'));
      await expect(chart).toHaveAttribute('data-entrance', 'done');
      await expect([...chart.querySelectorAll<SVGGraphicsElement>('.ds-chart__bar')].map((b) => b.getBBox().height)).toEqual(heights);
    });
    await step('the keyboard does the same', async () => {
      await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 그리기' }));
      const line = await waitFor(() => {
        const c = canvasElement.querySelectorAll('[data-round="3"] .ds-chart')[1];
        expect(c).toBeDefined();
        return c;
      });
      line.scrollIntoView({ block: 'center' });
      await waitFor(() => expect(line).toHaveAttribute('data-entrance', 'running'));
      (line.querySelector('.ds-chart__plot') as HTMLElement).focus();
      await userEvent.keyboard('{End}');
      await expect(line).toHaveAttribute('data-entrance', 'done');
      await expect(line.querySelector('clipPath')).toBeNull();
      await expect(line.querySelector('.ds-chart__tooltip')).toHaveTextContent('10.13');
      await userEvent.keyboard('{Escape}');
      window.scrollTo(0, 0);
    });
  },
};

/** 여러 차트가 함께 보이면 각자 그려지고, 한 차트를 조작해도 다른 차트의 움직임에는 영향이 없습니다. */
export const EntranceMultiple: Story = {
  name: '진입 — 여러 차트',
  render: () => (
    <Replay>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 320px)', gap: 32 }}>
        <SampleChart name="Type=Line, Style=Simple, Group=no" />
        <SampleChart name="Type=Bar Vertical, Style=Simple, Group=no" />
        <SampleChart name="Type=Bar Horizontal, Style=Simple, Group=no" />
        <SampleChart name="Type=Line, Style=Simple, Group=yes" />
        <SampleChart name="Type=Bar Vertical, Style=Simple, Group=yes" />
        <SampleChart name="Type=Bar Horizontal, Style=Simple, Group=yes" />
      </div>
    </Replay>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    await step('all draw in together', async () => replayAndCheck(canvasElement, userEvent));
    await step('finishing one by hovering it leaves the others drawing', async () => {
      await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 그리기' }));
      const charts = await waitFor(() => {
        const list = [...canvasElement.querySelectorAll('[data-round="2"] .ds-chart')];
        expect(list).toHaveLength(6);
        for (const c of list) expect(c).toHaveAttribute('data-entrance', 'running');
        return list;
      });
      const plot = charts[1].querySelector('.ds-chart__plot')!;
      const box = plot.getBoundingClientRect();
      await userEvent.pointer({ target: plot, coords: { clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 } });
      await expect(charts[1]).toHaveAttribute('data-entrance', 'done');
      for (const c of [charts[0], ...charts.slice(2)]) await expect(c).toHaveAttribute('data-entrance', 'running');
      await userEvent.unhover(plot);
      await waitFor(() => charts.forEach((c) => expect(c).toHaveAttribute('data-entrance', 'done')), { timeout: 3000 });
    });
  },
};

/** 화면 밖의 차트는 스크롤해서 보일 때 그려지고, 밖으로 나갔다 다시 들어와도 다시 그리지 않습니다. */
export const EntranceOnScroll: Story = {
  name: '진입 — 스크롤해서 보일 때',
  render: () => (
    <div data-scroller="" style={{ width: 360, height: 320, overflow: 'auto', border: '1px dashed var(--colors-border-gray-subtler)' }}>
      <p style={{ margin: 16, font: 'inherit', color: 'var(--colors-text-tertiary)' }}>아래로 스크롤하면 차트가 보일 때 그려집니다.</p>
      <div style={{ height: 480 }} />
      <SampleChart name="Type=Bar Vertical, Style=Simple, Group=yes" style={{ width: 320, margin: 16 }} />
      <div style={{ height: 480 }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector<HTMLElement>('[data-scroller]')!;
    const chart = canvasElement.querySelector('.ds-chart')!;
    const phases: string[] = [];
    const observer = new MutationObserver(() => phases.push(chart.getAttribute('data-entrance')!));
    observer.observe(chart, { attributes: true, attributeFilter: ['data-entrance'] });
    await waitFor(() => expect(chart.querySelector('.ds-chart__svg')).not.toBeNull());
    await new Promise((r) => setTimeout(r, 300));
    await expect(chart).toHaveAttribute('data-entrance', 'pending');
    const recording = recordEntrance(chart);
    scroller.scrollTop = 420;
    await expectDrawnIn(await recording, 2);
    for (const top of [0, 420, 0, 420]) {
      scroller.scrollTop = top;
      await new Promise((r) => setTimeout(r, 120));
    }
    observer.disconnect();
    await expect(phases).toEqual(['running', 'done']);
  },
};

/**
 * 운영체제의 "동작 줄이기"를 켜면 차트는 처음부터 완성된 모습으로 표시됩니다. 이 스토리는 그 설정을 흉내 냅니다
 * (이 화면에서만 `prefers-reduced-motion: reduce`로 응답).
 */
export const EntranceReducedMotion: Story = {
  name: '진입 — 동작 줄이기',
  beforeEach: () => {
    const original = window.matchMedia;
    window.matchMedia = (query: string) => {
      const real = original.call(window, query);
      if (!query.includes('prefers-reduced-motion')) return real;
      return { matches: true, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false } as MediaQueryList;
    };
    return () => {
      window.matchMedia = original;
    };
  },
  render: () => (
    <Replay>
      <SampleChart name="Type=Bar Vertical, Style=Default, Group=yes" />
      <div style={{ display: 'flex', gap: 40 }}>
        <SampleChart name="Type=Line, Style=Simple, Group=yes" />
        <SampleChart name="Type=Bar Horizontal, Style=Simple, Group=yes" />
      </div>
    </Replay>
  ),
  play: async ({ canvasElement, userEvent }) => {
    for (let round = 0; round < 2; round++) {
      if (round) await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 그리기' }));
      const charts = await waitFor(() => {
        const list = [...canvasElement.querySelectorAll(`[data-round="${round}"] .ds-chart`)];
        expect(list).toHaveLength(3);
        list.forEach((c) => expect(c.querySelector('.ds-chart__svg')).not.toBeNull());
        return list;
      });
      for (const chart of charts) {
        await expect(chart).toHaveAttribute('data-entrance', 'done');
        await expect(chart.querySelector('animate, clipPath')).toBeNull();
      }
    }
  },
};
