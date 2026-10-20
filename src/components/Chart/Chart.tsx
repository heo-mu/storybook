import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { Badge } from '../Badge';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChartColor, ChartType, ChartVariant } from './Chart.options';
import { ChartLegendItem } from './ChartLegendItem';
import { ChartTooltip } from './ChartTooltip';
import { areaPath, bands, barPath, extendToEdges, intersect, niceTicks, placeTooltip, polyline, roundedPolyline, scale, type Point, type Rect } from './chartGeometry';

export type ChartSeries = {
  /** 계열 이름. 범례 · 툴팁 · 화면 낭독기용 표에 쓰입니다. */
  label: string;
  /** 값. 항목마다 하나씩 `categories` 순서대로 넣습니다. */
  data: number[];
};

export type ChartProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  /** 종류 — 선 · 세로 막대 · 가로 막대. @default 'bar-vertical' */
  type?: ChartType;
  /**
   * 스타일. `default`는 축 이름 · 값 눈금 · 범례가 있고, `simple`은 마지막 항목이 현재 기간인 160px 높이의 간단한 차트입니다.
   * @default 'default'
   */
  variant?: ChartVariant;
  /** 항목 이름. 가로 막대 차트는 세로축, 나머지는 가로축에 표시됩니다. */
  categories: string[];
  /** 계열 1개 또는 2개. 두 번째는 비교 계열이며, 세 번째부터는 표시하지 않습니다. */
  series: ChartSeries[];
  /** 세로축 이름(기본 스타일). */
  yAxisLabel?: ReactNode;
  /** 가로축 이름(기본 스타일). */
  xAxisLabel?: ReactNode;
  /** 기본 스타일의 값 눈금(작은 값부터). 첫 값부터 끝 값까지가 축 범위입니다. 없으면 0부터 4칸으로 나눕니다. */
  ticks?: number[];
  /** 값 표시 형식(눈금 · 툴팁 · 화면 낭독기용 표). @default value.toLocaleString('ko-KR') */
  formatValue?: (value: number) => string;
  /** 첫 계열의 가장 큰 값 위에 붙는 배지(선 차트, 기본 스타일). `false`면 숨깁니다. @default '최고' */
  maxLabel?: ReactNode;
  /** 툴팁을 표시할 항목 번호. 넘기면 직접 제어하며, `null`이면 툴팁을 숨깁니다. */
  activeIndex?: number | null;
  /** 처음 툴팁을 표시할 항목 번호(직접 제어하지 않을 때). @default null */
  defaultActiveIndex?: number | null;
  /** 마우스 · 탭 · 키보드로 툴팁 항목이 바뀔 때 호출됩니다. 닫히면 `null`을 받습니다. */
  onActiveIndexChange?: (index: number | null) => void;
  /** 키보드로 선택하는 그림 영역의 이름(화면 낭독기용). @default '차트 항목: 화살표 키로 값 확인' */
  plotLabel?: string;
};

// Plot geometry is declared in Chart.css (Figma values and spacing tokens) and read here: --_<name> on .ds-chart__plot.
const METRICS = [
  'plot-height',
  'plot-left',
  'value-label-width',
  'grid-top',
  'grid-bottom',
  'label-top',
  'label-width',
  'line-corner',
  'point-radius',
  'ring-radius',
  'badge-offset',
  'tooltip-gap',
  'tooltip-margin',
  'category-gap',
  'bar-size',
  'bar-radius',
  'pair-gap',
  'highlight-size',
  'pad-top',
  'body-height',
  'axis-gap',
  'row-label-width',
  'row-label-gap',
  'row-height',
  'row-gap',
  'draw-top',
  'draw-height',
  'bar-max',
] as const;
type Metrics = Record<(typeof METRICS)[number], number>;

function readMetrics(el: HTMLElement): Metrics {
  const style = getComputedStyle(el);
  return Object.fromEntries(METRICS.map((name) => [name, parseFloat(style.getPropertyValue(`--_${name}`)) || 0])) as Metrics;
}

/**
 * Bar / line colour of series `k` — the same rule for vertical and horizontal bars (Figma Chart Component tokens
 * colors/chart/bar/* and colors/chart/line/*): main series brand, comparison `compare` (bars) or `02` (lines); in
 * simple bar charts the past periods are `history` / `history-compare` and the current period brand / `compare`.
 */
function markColor(type: ChartType, variant: ChartVariant, k: number, current: boolean): ChartColor {
  if (variant === 'simple' && type !== 'line') {
    if (current) return k === 0 ? 'brand' : 'compare';
    return k === 0 ? 'history' : 'history-compare';
  }
  if (k === 0) return 'brand';
  return type === 'line' ? '02' : 'compare';
}

/** Legend and tooltip colour of series `k`. */
const keyColor = (type: ChartType, k: number): ChartColor => (k === 0 ? 'brand' : type === 'line' ? '02' : 'compare');

type TooltipAnchor = { x: number; y: number; gap: number; vertical: 'top' | 'center' };

type Scene = {
  svg: ReactNode;
  labels: ReactNode;
  overlay?: ReactNode;
  anchor?: TooltipAnchor;
  /** Category under a plot point, or null outside the data (e.g. over the value-label column). */
  hit?: (x: number, y: number) => number | null;
};

type SceneInput = {
  type: ChartType;
  variant: ChartVariant;
  categories: string[];
  series: ChartSeries[];
  ticks: number[];
  width: number;
  m: Metrics;
  active: number | null;
  format: (value: number) => string;
  maxLabel: ReactNode;
  fill: (color: ChartColor, kind: 'v' | 'h' | 'area') => string;
};

const clampIndex = (i: number, n: number) => Math.min(n - 1, Math.max(0, i));
/** Index of the band (columns or rows `pitch` apart, `gap` between them) that a coordinate falls in. */
const bandIndex = (pos: number, start: number, pitch: number, gap: number, n: number) => clampIndex(Math.floor((pos - start + gap / 2) / pitch), n);
/** How far the simple line continues past the plot edges before the SVG clips it (more than half its width). */
const EDGE_OVERRUN = 4;
const valueAt = (s: ChartSeries, i: number) => (Number.isFinite(s.data[i]) ? s.data[i] : 0);

/**
 * Value-axis labels centred on their grid lines, right-aligned to the 32px label column: a fixed right-aligned box
 * (bar charts) or a box hugging the text that ends at the column edge (line chart) — as drawn in Figma.
 */
function valueLabels({ ticks, m, format }: SceneInput, yOf: (v: number) => number, hug: boolean) {
  return ticks.map((t) => (
    <span
      key={t}
      className="ds-chart__tick"
      data-axis="value"
      data-anchor={hug ? 'end-middle' : 'middle'}
      style={hug ? { left: m['value-label-width'], top: yOf(t) } : { left: 0, width: m['value-label-width'], top: yOf(t) }}
    >
      {format(t)}
    </span>
  ));
}

function lineScene(input: SceneInput): Scene {
  const { variant, categories, series, ticks, width, m, active, maxLabel, fill } = input;
  const n = categories.length;
  const group = series.length > 1;
  const simple = variant === 'simple';
  let xs: number[];
  let yOf: (v: number) => number;
  let base: number;
  let labels: ReactNode;
  let hit: Scene['hit'];
  if (simple) {
    const cols = bands(n, width, m['category-gap']);
    const pitch = n > 1 ? cols[1][0] - cols[0][0] : width;
    hit = (x) => bandIndex(x, 0, pitch, m['category-gap'], n);
    const max = Math.max(0, ...series.flatMap((s) => categories.map((_, i) => valueAt(s, i)))) || 1;
    base = m['draw-height'];
    xs = cols.map(([x, w]) => x + w / 2);
    yOf = (v) => scale(v, 0, max, base, m['draw-top']);
    labels = cols.map(([x, w], i) => (
      <span key={i} className="ds-chart__tick" data-anchor="band" style={{ left: x, width: w, top: m['label-top'] }}>
        {categories[i]}
      </span>
    ));
  } else {
    const left = m['plot-left'];
    const plotW = width - left;
    base = m['grid-bottom'];
    xs = categories.map((_, i) => left + (n > 1 ? (plotW * i) / (n - 1) : plotW / 2));
    const step = n > 1 ? plotW / (n - 1) : 1;
    // Nearest category; the value-label column is not part of the hover area.
    hit = (x) => (x < m['value-label-width'] ? null : clampIndex(Math.round((x - left) / step), n));
    yOf = (v) => scale(v, ticks[0], ticks[ticks.length - 1], base, m['grid-top']);
    labels = (
      <>
        {valueLabels(input, yOf, true)}
        {categories.map((c, i) => (
          <span key={i} className="ds-chart__tick" data-axis="category" data-anchor={i === n - 1 && n > 1 ? 'end' : 'center'} style={{ left: xs[i], top: m['label-top'] }}>
            {c}
          </span>
        ))}
      </>
    );
  }
  const points = series.map((s) => categories.map((_, i): Point => [xs[i], yOf(valueAt(s, i))]));
  // Simple: the line runs on past the plot edges (Figma; clipped there), continuing its first and last segments.
  const run = (k: number) => (simple ? extendToEdges(points[k], -EDGE_OVERRUN, width + EDGE_OVERRUN, 0, base) : points[k]);
  const order = series.map((_, k) => k).reverse();
  // The active (hovered / keyboard) category gets a ring on every series (Figma hover=yes); the default style draws
  // no markers at the first and last category.
  const dots = (k: number) => {
    const color = markColor('line', variant, k, false);
    return (
      <g key={`dots-${k}`}>
        {points[k].map(([x, y], i) =>
          i === active || (!simple && (i === 0 || i === n - 1)) ? null : (
            <circle key={i} className="ds-chart__point" data-color={color} cx={x} cy={y} r={m['point-radius']} />
          ),
        )}
        {active != null && (
          <circle className="ds-chart__point" data-current="" data-color={color} cx={points[k][active][0]} cy={points[k][active][1]} r={m['ring-radius']} />
        )}
      </g>
    );
  };
  const line = (k: number) => (
    <path
      key={`line-${k}`}
      className="ds-chart__line"
      data-series={k}
      data-color={markColor('line', variant, k, false)}
      d={!simple && k === 0 ? roundedPolyline(run(k), m['line-corner']) : polyline(run(k))}
    />
  );
  const area = !group && <path key="area" className="ds-chart__area" d={areaPath(run(0), base)} fill={fill('brand', 'area')} />;
  // Hover guide under everything: over the grid (default) or the whole drawing height (simple).
  const guide = active != null && <line key="guide" className="ds-chart__guide" x1={xs[active]} x2={xs[active]} y1={simple ? 0 : m['grid-top']} y2={base} />;
  let svg: ReactNode;
  if (simple) {
    const baseline = <line key="baseline" className="ds-chart__baseline" x1={0} x2={width} y1={base} y2={base} />;
    svg = group ? [guide, baseline, ...order.flatMap((k) => [line(k), dots(k)])] : [guide, area, baseline, line(0), dots(0)];
  } else {
    svg = (
      <>
        {guide}
        {ticks.map((t) => (
          <line key={t} className="ds-chart__grid" x1={m['plot-left']} x2={width} y1={yOf(t)} y2={yOf(t)} />
        ))}
        {order.map(line)}
        {area}
        {order.map(dots)}
      </>
    );
  }
  let overlay: ReactNode;
  if (!simple && maxLabel !== false && maxLabel != null && n > 0) {
    const values = categories.map((_, i) => valueAt(series[0], i));
    const top = values.indexOf(Math.max(...values));
    overlay = (
      <Badge
        className="ds-chart__max"
        status="basic"
        appearance="outline"
        size="sm"
        shape="rounded"
        dot={false}
        aria-hidden="true"
        style={{ left: points[0][top][0], top: points[0][top][1] - m['badge-offset'] }}
      >
        {maxLabel}
      </Badge>
    );
  }
  return {
    svg,
    labels,
    overlay,
    anchor: active != null ? { x: xs[active], y: points[0][active][1], gap: m['tooltip-gap'], vertical: 'center' } : undefined,
    hit,
  };
}

function barVerticalScene(input: SceneInput): Scene {
  const { variant, categories, series, ticks, width, m, active, fill } = input;
  const n = categories.length;
  const simple = variant === 'simple';
  const left = simple ? 0 : m['plot-left'];
  const top = simple ? m['draw-top'] : m['grid-top'];
  const bottom = simple ? m['draw-height'] : m['grid-bottom'];
  const max = simple ? Math.max(0, ...series.flatMap((s) => categories.map((_, i) => valueAt(s, i)))) || 1 : 0;
  const yOf = simple ? (v: number) => scale(v, 0, max, bottom, top) : (v: number) => scale(v, ticks[0], ticks[ticks.length - 1], bottom, top);
  const cols = bands(n, width - left, m['category-gap'], left);
  const barW = m['bar-size'];
  const gap = m['pair-gap'];
  const pairW = series.length * barW + (series.length - 1) * gap;
  // Hover highlight: over the grid (default) or from the top of the chart to the baseline (simple).
  const highlightTop = simple ? 0 : top;
  const svg = (
    <>
      {simple ? (
        <line className="ds-chart__baseline" x1={0} x2={width} y1={bottom} y2={bottom} />
      ) : (
        // Figma LINE strokes (1px, centred) render on the pixel row above their y.
        ticks.map((t) => <line key={t} className="ds-chart__grid" x1={left} x2={width} y1={yOf(t) - 0.5} y2={yOf(t) - 0.5} />)
      )}
      {cols.map(([x, w], i) => {
        const c = x + w / 2;
        return (
          <g key={i}>
            {active === i && <rect className="ds-chart__highlight" x={c - m['highlight-size'] / 2} y={highlightTop} width={m['highlight-size']} height={bottom - highlightTop} />}
            {series.map((s, k) => {
              const y = yOf(valueAt(s, i));
              const color = markColor('bar-vertical', variant, k, i === n - 1);
              return <path key={k} className="ds-chart__bar" data-color={color} d={barPath(c - pairW / 2 + k * (barW + gap), y, barW, bottom - y, m['bar-radius'], 'up')} fill={fill(color, 'v')} />;
            })}
          </g>
        );
      })}
    </>
  );
  const labels = (
    <>
      {!simple && valueLabels(input, yOf, false)}
      {cols.map(([x, w], i) =>
        simple ? (
          <span key={i} className="ds-chart__tick" data-anchor="band" style={{ left: x, width: w, top: m['label-top'] }}>
            {categories[i]}
          </span>
        ) : (
          <span key={i} className="ds-chart__category" data-anchor="band" style={{ left: x + w / 2 - m['label-width'] / 2, width: m['label-width'], top: m['label-top'] }}>
            {categories[i]}
          </span>
        ),
      )}
    </>
  );
  const pitch = cols.length > 1 ? cols[1][0] - cols[0][0] : width;
  return {
    svg,
    labels,
    anchor: active != null && cols[active] ? { x: cols[active][0] + cols[active][1] / 2, y: highlightTop, gap: 0, vertical: 'top' } : undefined,
    // The value-label column (default style) is not part of the hover area.
    hit: (x) => (!simple && x < m['value-label-width'] ? null : bandIndex(x, left, pitch, m['category-gap'], n)),
  };
}

function barHorizontalScene(input: SceneInput): Scene {
  const { variant, categories, series, ticks, width, m, active, fill } = input;
  const n = categories.length;
  const simple = variant === 'simple';
  const trackLeft = m['row-label-width'] + m['row-label-gap'];
  const trackW = width - trackLeft;
  const barH = m['bar-size'];
  const gap = m['pair-gap'];
  const pairH = series.length * barH + (series.length - 1) * gap;
  let rows: Array<[number, number]>;
  let lengthOf: (v: number) => number;
  if (simple) {
    // Rows are centred in the chart; the largest value spans --_bar-max of the track (Figma 224 → 252 of 280).
    const total = n * m['row-height'] + (n - 1) * m['row-gap'];
    const max = Math.max(0, ...series.flatMap((s) => categories.map((_, i) => valueAt(s, i)))) || 1;
    rows = bands(n, total, m['row-gap'], (m['plot-height'] - total) / 2);
    lengthOf = (v) => scale(v, 0, max, 0, trackW * m['bar-max']);
  } else {
    rows = bands(n, m['body-height'], 0, m['pad-top']);
    lengthOf = (v) => scale(v, ticks[0], ticks[ticks.length - 1], 0, trackW);
  }
  const bodyTop = m['pad-top'];
  const bodyBottom = bodyTop + m['body-height'];
  const svg = (
    <>
      {!simple && (
        <>
          <line className="ds-chart__axis" x1={trackLeft} x2={trackLeft} y1={bodyTop} y2={bodyBottom} />
          {ticks.slice(1, -1).map((t) => (
            <line key={t} className="ds-chart__grid" x1={trackLeft + lengthOf(t)} x2={trackLeft + lengthOf(t)} y1={bodyTop} y2={bodyBottom} />
          ))}
          <line className="ds-chart__axis" x1={trackLeft} x2={width} y1={bodyBottom} y2={bodyBottom} />
        </>
      )}
      {rows.map(([y, h], i) => (
        <g key={i}>
          {active === i && <rect className="ds-chart__highlight" x={trackLeft} y={y + h / 2 - m['highlight-size'] / 2} width={trackW} height={m['highlight-size']} />}
          {series.map((s, k) => {
            const color = markColor('bar-horizontal', variant, k, i === n - 1);
            const d = barPath(trackLeft, y + h / 2 - pairH / 2 + k * (barH + gap), lengthOf(valueAt(s, i)), barH, m['bar-radius'], 'right');
            return <path key={k} className="ds-chart__bar" data-color={color} d={d} fill={fill(color, 'h')} />;
          })}
        </g>
      ))}
    </>
  );
  const axisTop = bodyBottom + m['axis-gap'];
  const labels = (
    <>
      {rows.map(([y, h], i) => (
        <span key={i} className={simple ? 'ds-chart__tick' : 'ds-chart__category'} data-anchor="middle" style={{ left: 0, width: m['row-label-width'], top: y + h / 2 }}>
          {categories[i]}
        </span>
      ))}
      {!simple &&
        ticks.map((t, i) => (
          <span key={t} className="ds-chart__tick" data-axis="value" data-anchor={i === ticks.length - 1 && i > 0 ? 'end' : 'center'} style={{ left: trackLeft + lengthOf(t), top: axisTop }}>
            {input.format(t)}
          </span>
        ))}
    </>
  );
  return {
    svg,
    labels,
    anchor:
      active != null && rows[active]
        ? {
            x: trackLeft + Math.max(...series.map((s) => lengthOf(valueAt(s, active)))),
            y: rows[active][0] + rows[active][1] / 2,
            gap: m['tooltip-gap'],
            vertical: 'center',
          }
        : undefined,
    // Rows only: not the value-axis labels below them (default) or the space around the rows (simple).
    hit: (_x, y) => {
      const pitch = rows.length > 1 ? rows[1][0] - rows[0][0] : rows[0][1];
      const rowGap = pitch - rows[0][1];
      const last = rows[rows.length - 1];
      if (y < rows[0][0] - rowGap / 2 || y > last[0] + last[1] + rowGap / 2) return null;
      return bandIndex(y, rows[0][0], pitch, rowGap, n);
    },
  };
}

const defaultFormat = (value: number) => value.toLocaleString('ko-KR');

/**
 * The part of the plot that can be seen, in viewport coordinates: the plot ∩ the viewport (inset by `margin`, the
 * 12px of the react-aria overlays) ∩ every ancestor that clips its content (overflow other than visible).
 */
function visibleArea(plotEl: HTMLElement, plot: Rect, margin: number): Rect {
  const root = document.documentElement;
  const rects: Rect[] = [{ left: margin, top: margin, right: root.clientWidth - margin, bottom: root.clientHeight - margin }];
  for (let el = plotEl.parentElement; el && el !== document.body && el !== root; el = el.parentElement) {
    const style = getComputedStyle(el);
    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') rects.push(el.getBoundingClientRect());
  }
  return intersect(plot, ...rects);
}

/**
 * 항목별 수치를 선 · 세로 막대 · 가로 막대 차트로 보여 줍니다. 마우스를 올리거나 탭하거나 키보드(화살표 · Home · End · Esc)로
 * 항목을 고르면 그 항목이 강조되고 툴팁에 값이 보입니다. 너비는 감싼 영역에 맞춰지고, 모든 값은 화면 낭독기용 표로도 제공합니다.
 */
export const Chart = forwardRef<HTMLElement, ChartProps>(function Chart(
  {
    type = 'bar-vertical',
    variant = 'default',
    categories,
    series: allSeries,
    yAxisLabel,
    xAxisLabel,
    ticks: ticksProp,
    formatValue = defaultFormat,
    maxLabel = '최고',
    activeIndex,
    defaultActiveIndex = null,
    onActiveIndexChange,
    plotLabel = '차트 항목: 화살표 키로 값 확인',
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const series = allSeries.slice(0, 2);
  const group = series.length > 1;
  const n = categories.length;
  const simple = variant === 'simple';
  const interactive = n > 0;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [activeValue, setActive] = useControllableState<number | null>(activeIndex, defaultActiveIndex, onActiveIndexChange);
  const active = interactive && activeValue != null && activeValue >= 0 && activeValue < n ? activeValue : null;
  const [announcement, setAnnouncement] = useState('');

  const plotRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; m: Metrics } | null>(null);
  useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const update = () => {
      const width = parseFloat(getComputedStyle(el).width) || 0;
      const m = readMetrics(el);
      setSize((prev) => (prev && prev.width === width && METRICS.every((k) => prev.m[k] === m[k]) ? prev : { width, m }));
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [type, variant, group]);

  const ticks = ticksProp && ticksProp.length > 1 ? ticksProp : niceTicks(Math.max(0, ...series.flatMap((s) => categories.map((_, i) => valueAt(s, i)))));
  const gradients = new Map<string, { color: ChartColor; kind: 'v' | 'h' | 'area' }>();
  const fill = (color: ChartColor, kind: 'v' | 'h' | 'area') => {
    const id = `${uid}-${kind}-${color}`;
    gradients.set(id, { color, kind });
    return `url(#${id})`;
  };
  const scene =
    size && n > 0
      ? (type === 'line' ? lineScene : type === 'bar-horizontal' ? barHorizontalScene : barVerticalScene)({
          type,
          variant,
          categories,
          series,
          ticks,
          width: size.width,
          m: size.m,
          active,
          format: formatValue,
          maxLabel,
          fill,
        })
      : null;

  // The tooltip belongs to its plot (position: absolute inside it — no portal): it moves with its own chart on scroll,
  // layout shifts and transforms, and other charts never share it. It is placed beside its anchor inside the part of
  // the plot that can be seen (viewport and clipping ancestors), or inside the plot when that part is too small
  // (placeTooltip). Scrolling and resizing only re-check which part is visible.
  const anchor = scene?.anchor;
  const positionTooltip = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    positionTooltip.current = () => {
      const el = tooltipRef.current;
      const plotEl = plotRef.current;
      if (!el || !plotEl || !anchor || !size) return;
      const plot = plotEl.getBoundingClientRect();
      const k = size.width ? plot.width / size.width : 1;
      const { width, height } = el.getBoundingClientRect();
      const { left, top } = placeTooltip(
        { x: plot.left + anchor.x * k, y: plot.top + anchor.y * k, gap: anchor.gap * k, vertical: anchor.vertical },
        { width, height },
        plot,
        visibleArea(plotEl, plot, size.m['tooltip-margin']),
      );
      el.style.left = `${(left - plot.left) / k}px`;
      el.style.top = `${(top - plot.top) / k}px`;
    };
    positionTooltip.current();
  });
  const tooltipOpen = active != null && anchor != null;
  useEffect(() => {
    if (!tooltipOpen) return;
    const update = () => positionTooltip.current();
    window.addEventListener('scroll', update, { capture: true, passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, { capture: true });
      window.removeEventListener('resize', update);
    };
  }, [tooltipOpen]);

  const summary = (i: number) => `${categories[i]}: ${series.map((s) => `${s.label} ${formatValue(valueAt(s, i))}`).join(', ')}`;
  // Latest requested category, so two handlers of one event (blur + outside press) report a change only once.
  const activeRef = useRef(active);
  const move = (next: number | null, announce: boolean) => {
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
    if (announce) setAnnouncement(next == null ? '' : summary(next));
  };
  // A tap shows the tooltip until the next press outside the plot (touch has no hover to leave); a tap does not always
  // move focus away from the plot (WebKit), so blur alone cannot close it.
  const closeOnOutsidePress = useRef<(e: Event) => void>(() => {});
  useLayoutEffect(() => {
    activeRef.current = active;
    closeOnOutsidePress.current = (e) => {
      if (!plotRef.current?.contains(e.target as Node)) move(null, false);
    };
  });
  useEffect(() => {
    if (!tooltipOpen) return;
    const onPress = (e: Event) => closeOnOutsidePress.current(e);
    document.addEventListener('pointerdown', onPress, true);
    return () => document.removeEventListener('pointerdown', onPress, true);
  }, [tooltipOpen]);
  const pointerIndex = (e: PointerEvent<HTMLDivElement>) => {
    if (!scene?.hit || !size) return null;
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width ? size.width / r.width : 1;
    return scene.hit((e.clientX - r.left) * k, (e.clientY - r.top) * k);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => number | null> = {
      ArrowRight: () => (active == null ? 0 : Math.min(n - 1, active + 1)),
      ArrowDown: () => (active == null ? 0 : Math.min(n - 1, active + 1)),
      ArrowLeft: () => (active == null ? 0 : Math.max(0, active - 1)),
      ArrowUp: () => (active == null ? 0 : Math.max(0, active - 1)),
      Home: () => 0,
      End: () => n - 1,
      Escape: () => null,
    };
    if (!keys[e.key]) return;
    e.preventDefault();
    move(keys[e.key](), true);
  };

  const legend = !simple && (
    <div className="ds-chart__legend" aria-hidden="true">
      {series.map((s, k) => (
        <ChartLegendItem key={k} type={type === 'line' ? 'line' : 'bar'} color={keyColor(type, k)}>
          {s.label}
        </ChartLegendItem>
      ))}
    </div>
  );

  return (
    <figure {...rest} ref={ref} className={cx('ds-chart', className)} data-type={type} data-variant={variant} data-group={group ? 'yes' : 'no'} aria-label={ariaLabel}>
      {!simple && (yAxisLabel != null || xAxisLabel != null) && (
        <div className="ds-chart__axes">
          <span className="ds-chart__axis-label">{yAxisLabel}</span>
          <span className="ds-chart__axis-label" data-axis="x">
            {xAxisLabel}
          </span>
        </div>
      )}
      <div
        ref={plotRef}
        className="ds-chart__plot"
        {...(interactive
          ? {
              tabIndex: 0,
              role: 'group',
              'aria-label': plotLabel,
              onKeyDown,
              onBlur: () => move(null, false),
              // pointerdown: taps (touch fires no pointermove without dragging) and clicks.
              onPointerDown: (e: PointerEvent<HTMLDivElement>) => move(pointerIndex(e), false),
              onPointerMove: (e: PointerEvent<HTMLDivElement>) => move(pointerIndex(e), false),
              // Touch fires pointerleave when the finger lifts: keep the tapped category (closed by an outside press).
              onPointerLeave: (e: PointerEvent<HTMLDivElement>) => {
                if (e.pointerType !== 'touch') move(null, false);
              },
            }
          : { 'aria-hidden': true })}
      >
        {scene && size && (
          <>
            <svg className="ds-chart__svg" width={size.width} height={size.m['plot-height']} aria-hidden="true" focusable="false">
              <defs>
                {[...gradients].map(([id, { color, kind }]) => (
                  <linearGradient key={id} id={id} data-color={color} data-kind={kind} {...(kind === 'h' ? { x1: 1, y1: 0, x2: 0, y2: 0 } : { x1: 0, y1: 0, x2: 0, y2: 1 })}>
                    <stop offset={0} className="ds-chart__stop" />
                    <stop offset={1} className="ds-chart__stop" data-end="" />
                  </linearGradient>
                ))}
              </defs>
              {scene.svg}
            </svg>
            <div className="ds-chart__labels" aria-hidden="true">
              {scene.labels}
            </div>
            {scene.overlay}
            {active != null && anchor && (
              <ChartTooltip
                ref={tooltipRef}
                className="ds-chart__tooltip"
                data-mark={type === 'line' ? 'line' : 'bar'}
                aria-hidden="true"
                title={categories[active]}
                items={series.map((s, k) => ({ label: s.label, value: formatValue(valueAt(s, active)), color: keyColor(type, k) }))}
              />
            )}
          </>
        )}
      </div>
      {legend}
      {/* The wrapper hides the table: a clipped <table> still paints its caption in Firefox. */}
      <div className="ds-chart__sr">
        <table>
          {ariaLabel && <caption>{ariaLabel}</caption>}
          <thead>
            <tr>
              <td />
              {categories.map((c, i) => (
                <th key={i} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((s, k) => (
              <tr key={k}>
                <th scope="row">{s.label}</th>
                {categories.map((_, i) => (
                  <td key={i}>{formatValue(valueAt(s, i))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {interactive && (
        <div className="ds-chart__sr" aria-live="polite">
          {announcement}
        </div>
      )}
    </figure>
  );
});
