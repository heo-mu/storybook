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
import { createPortal } from 'react-dom';
import { Badge } from '../Badge';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChartColor, ChartType, ChartVariant } from './Chart.options';
import { ChartLegendItem } from './ChartLegendItem';
import { ChartTooltip } from './ChartTooltip';
import { areaPath, bands, barPath, extendToEdges, niceTicks, placeTooltip, polyline, roundedPolyline, scale, type Point } from './chartGeometry';

export type ChartSeries = {
  /** Series name — legend, tooltip and the data table for screen readers. */
  label: string;
  /** One value per category, in the order of `categories`. */
  data: number[];
};

export type ChartProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  /** Figma "Type". @default 'bar-vertical' */
  type?: ChartType;
  /**
   * Figma "Style": `default` has axes, a legend and a tooltip; `simple` is the compact 160px chart whose last category
   * is the current period. @default 'default'
   */
  variant?: ChartVariant;
  /** Category (x axis; y axis for `bar-horizontal`) labels. */
  categories: string[];
  /** One series (Figma Group=no) or two (Group=yes: the second is the comparison). Further series are ignored. */
  series: ChartSeries[];
  /** Figma "Y Axis Label" (default style). */
  yAxisLabel?: ReactNode;
  /** Figma "X Axis Label" (default style). */
  xAxisLabel?: ReactNode;
  /** Value-axis ticks of the default style, lowest first; the axis spans the first to the last. Default: 4 steps from 0. */
  ticks?: number[];
  /** Formats values (ticks, tooltip, data table). @default value.toLocaleString('ko-KR') */
  formatValue?: (value: number) => string;
  /** Badge over the highest value of the first series (line, default style); `false` hides it. @default '최고' */
  maxLabel?: ReactNode;
  /** Category whose tooltip is shown (default style), or `null` (controlled). */
  activeIndex?: number | null;
  /** Initial `activeIndex` (uncontrolled). @default null */
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  /** Accessible name of the plot, which takes keyboard focus (default style). @default '차트 항목: 화살표 키로 값 확인' */
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

/** Bar / line colour of series `k` (Figma per variant). */
function markColor(type: ChartType, variant: ChartVariant, group: boolean, k: number, current: boolean): ChartColor {
  if (variant === 'simple' && type !== 'line') {
    if (current) return k === 0 ? 'brand' : '02';
    if (group) return k === 0 ? 'history' : 'history-compare';
    return type === 'bar-vertical' ? 'compare' : 'history';
  }
  if (k === 0) return 'brand';
  if (type === 'line') return '02';
  // Comparison bars use the legend / tooltip colour colors/chart/series/compare in both directions. Figma binds the
  // Bar Horizontal ones to colors/chart/simple/history — a binding error reported for correction (F65, docs/analysis).
  return 'compare';
}

/** Legend and tooltip colour of series `k` (Figma: colors/chart/series/compare for the bar comparison). */
const keyColor = (type: ChartType, k: number): ChartColor => (k === 0 ? 'brand' : type === 'line' ? '02' : 'compare');

type TooltipAnchor = { x: number; y: number; gap: number; vertical: 'top' | 'center' };

type Scene = {
  svg: ReactNode;
  labels: ReactNode;
  overlay?: ReactNode;
  anchor?: TooltipAnchor;
  hit?: (x: number, y: number) => number;
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
  if (simple) {
    const cols = bands(n, width, m['category-gap']);
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
  const dots = (k: number) => {
    const color = markColor('line', variant, group, k, false);
    const current = simple ? n - 1 : active;
    return (
      <g key={`dots-${k}`}>
        {points[k].map(([x, y], i) =>
          i === current || (!simple && (i === 0 || i === n - 1)) ? null : (
            <circle key={i} className="ds-chart__point" data-color={color} cx={x} cy={y} r={m['point-radius']} />
          ),
        )}
        {current != null && current < n && (
          <circle className="ds-chart__point" data-current="" data-color={color} cx={points[k][current][0]} cy={points[k][current][1]} r={m['ring-radius']} />
        )}
      </g>
    );
  };
  const line = (k: number) => (
    <path
      key={`line-${k}`}
      className="ds-chart__line"
      data-series={k}
      data-color={markColor('line', variant, group, k, false)}
      d={!simple && k === 0 ? roundedPolyline(run(k), m['line-corner']) : polyline(run(k))}
    />
  );
  const area = !group && <path key="area" className="ds-chart__area" d={areaPath(run(0), base)} fill={fill('brand', 'area')} />;
  let svg: ReactNode;
  if (simple) {
    const baseline = <line key="baseline" className="ds-chart__baseline" x1={0} x2={width} y1={base} y2={base} />;
    svg = group ? [baseline, ...order.flatMap((k) => [line(k), dots(k)])] : [area, baseline, line(0), dots(0)];
  } else {
    svg = (
      <>
        {active != null && <line className="ds-chart__guide" x1={xs[active]} x2={xs[active]} y1={m['grid-top']} y2={base} />}
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
  const step = n > 1 ? (width - m['plot-left']) / (n - 1) : 1;
  return {
    svg,
    labels,
    overlay,
    anchor: active != null ? { x: xs[active], y: points[0][active][1], gap: m['tooltip-gap'], vertical: 'center' } : undefined,
    hit: (x) => clampIndex(Math.round((x - m['plot-left']) / step), n),
  };
}

function barVerticalScene(input: SceneInput): Scene {
  const { variant, categories, series, ticks, width, m, active, fill } = input;
  const n = categories.length;
  const group = series.length > 1;
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
            {!simple && active === i && <rect className="ds-chart__highlight" x={c - m['highlight-size'] / 2} y={top} width={m['highlight-size']} height={bottom - top} />}
            {series.map((s, k) => {
              const y = yOf(valueAt(s, i));
              const color = markColor('bar-vertical', variant, group, k, i === n - 1);
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
    anchor: active != null && cols[active] ? { x: cols[active][0] + cols[active][1] / 2, y: top, gap: 0, vertical: 'top' } : undefined,
    hit: (x) => clampIndex(Math.floor((x - left + m['category-gap'] / 2) / pitch), n),
  };
}

function barHorizontalScene(input: SceneInput): Scene {
  const { variant, categories, series, ticks, width, m, active, fill } = input;
  const n = categories.length;
  const group = series.length > 1;
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
          {!simple && active === i && <rect className="ds-chart__highlight" x={trackLeft} y={y} width={trackW} height={h} />}
          {series.map((s, k) => {
            const color = markColor('bar-horizontal', variant, group, k, i === n - 1);
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
    hit: (_x, y) => clampIndex(Math.floor((y - m['pad-top']) / (m['body-height'] / n)), n),
  };
}

const defaultFormat = (value: number) => value.toLocaleString('ko-KR');

/**
 * Figma component set `chart` (698:4399): line, vertical bar and horizontal bar charts in the default style (axis labels,
 * value grid, legend, hover / keyboard tooltip) or the simple style (160px, the last category is the current period).
 * One series is Figma Group=no, two are Group=yes. The drawing is SVG sized to the container width; the values are
 * also given to screen readers as a table.
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
  const interactive = !simple && n > 0;
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

  // The tooltip is portalled to <body> (position: fixed) so clipping ancestors cannot cut it off, and placed beside
  // its anchor inside the visible part of the plot and the viewport (placeTooltip); it follows scrolling and resizing.
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
      const root = document.documentElement;
      const { left, top } = placeTooltip(
        { x: plot.left + anchor.x * k, y: plot.top + anchor.y * k, gap: anchor.gap * k, vertical: anchor.vertical },
        { width, height },
        plot,
        { width: root.clientWidth, height: root.clientHeight },
        size.m['tooltip-margin'],
      );
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
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
  const move = (next: number | null, announce: boolean) => {
    if (next !== active) setActive(next);
    if (announce) setAnnouncement(next == null ? '' : summary(next));
  };
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
              onPointerMove: (e: PointerEvent<HTMLDivElement>) => move(pointerIndex(e), false),
              onPointerLeave: () => move(null, false),
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
            {active != null &&
              typeof document !== 'undefined' &&
              createPortal(
                <ChartTooltip
                  ref={tooltipRef}
                  className="ds-chart__tooltip"
                  aria-hidden="true"
                  title={categories[active]}
                  items={series.map((s, k) => ({ label: s.label, value: formatValue(valueAt(s, active)), color: keyColor(type, k) }))}
                />,
                document.body,
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
