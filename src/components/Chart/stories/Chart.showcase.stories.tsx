import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, type Mock } from 'storybook/test';
import { Chart, type ChartProps } from '../Chart';
import { ChartLegendItem } from '../ChartLegendItem';
import { ChartTooltip } from '../ChartTooltip';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs chart` (sets chart, chart-legend-item, chart-tooltip).

const meta = {
  title: '컴포넌트/Chart/전체 보기',
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
  { name: `${name}, hover=no`, width, props },
  { name: `${name}, hover=yes`, width, props: { ...props, activeIndex: hover } },
]);

/** The 24 Figma variants with the Figma sample data (hover=yes: the active category drawn in Figma). */
export const Figma: Story = {
  name: '모든 변형',
  render: () => (
    <div style={{ display: 'grid', gap: 40, justifyItems: 'start' }}>
      {FIGMA_CHARTS.map(({ name, width, props }) => (
        <Chart key={name} data-figma={name} aria-label={name} style={{ width }} {...props} />
      ))}
    </div>
  ),
};

/** chart-legend-item (3 variants, Figma sample label "유형" since the 2026-10-19 chart rework) and chart-tooltip on their own. */
export const FigmaParts: Story = {
  name: '구성 요소',
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
  name: '동작',
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
  name: '간단 스타일 동작',
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
  name: '접근성',
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
  name: '툴팁 뒤집기',
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

/**
 * Series names in the tooltip are at least 40 and at most 80px wide (Figma "Pressure label" min / max width): a short
 * name keeps the 40px column, a longer one wraps, and the values stay in one column.
 */
export const TooltipLabelWidth: Story = {
  name: '툴팁 계열 이름 너비',
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

/**
 * Inside a container that clips its content (overflow: hidden) the tooltip stays in the part that can be seen: it
 * belongs to its chart (no portal) and is placed inside the visible part of the plot (Design System Rules 05).
 */
export const TooltipInClippingContainer: Story = {
  name: '잘리는 영역 안의 툴팁',
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
  name: '여러 차트',
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
