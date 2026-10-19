// Pure geometry helpers for Chart (SVG paths and scales). Coordinates are CSS pixels inside the plot.

export type Point = readonly [number, number];

const f = (n: number) => +n.toFixed(3);

/**
 * Value-axis ticks for the default style when none are given: 4 equal steps from 0 (Figma: 0–400 by 100,
 * 0–240 by 60). The step is the smallest of 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 × 10ⁿ that fits the largest value.
 */
export function niceTicks(max: number, intervals = 4): number[] {
  if (!(max > 0)) return Array.from({ length: intervals + 1 }, (_, i) => i);
  const raw = max / intervals;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * pow).find((s) => s >= raw - 1e-9) ?? 10 * pow;
  return Array.from({ length: intervals + 1 }, (_, i) => +(i * step).toPrecision(12));
}

/** Position of `value` between `from` (value d0) and `to` (value d1), clamped to the domain. */
export function scale(value: number, d0: number, d1: number, from: number, to: number): number {
  const t = d1 === d0 ? 0 : Math.min(1, Math.max(0, (value - d0) / (d1 - d0)));
  return from + t * (to - from);
}

/** `count` equal bands with `gap` between them across `size`, starting at `start`: [start, width] of each band. */
export function bands(count: number, size: number, gap: number, start = 0): Array<[number, number]> {
  const band = count > 0 ? (size - gap * (count - 1)) / count : 0;
  return Array.from({ length: count }, (_, i) => [start + i * (band + gap), band]);
}

/** Straight polyline. */
export function polyline(points: readonly Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
}

/**
 * Polyline whose interior vertices are rounded with `radius` (Figma vector corner radius): each corner is an arc
 * tangent to both segments, shortened to at most half of either segment.
 */
export function roundedPolyline(points: readonly Point[], radius: number): string {
  if (points.length < 3 || radius <= 0) return polyline(points);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const [cx, cy] = points[i + 1];
    const l1 = Math.hypot(ax - bx, ay - by);
    const l2 = Math.hypot(cx - bx, cy - by);
    if (!l1 || !l2) continue;
    const u1 = [(ax - bx) / l1, (ay - by) / l1];
    const u2 = [(cx - bx) / l2, (cy - by) / l2];
    const angle = Math.acos(Math.min(1, Math.max(-1, u1[0] * u2[0] + u1[1] * u2[1])));
    const t = Math.tan(angle / 2);
    if (Math.PI - angle < 1e-6 || t < 1e-9) {
      d += ` L${f(bx)} ${f(by)}`;
      continue;
    }
    const dist = Math.min(radius / t, l1 / 2, l2 / 2);
    const r = dist * t;
    const sweep = (bx - ax) * (cy - by) - (by - ay) * (cx - bx) > 0 ? 1 : 0;
    d += ` L${f(bx + u1[0] * dist)} ${f(by + u1[1] * dist)} A${f(r)} ${f(r)} 0 0 ${sweep} ${f(bx + u2[0] * dist)} ${f(by + u2[1] * dist)}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${f(lx)} ${f(ly)}`;
}

/** Area between a polyline and the horizontal line `baseY`. */
export function areaPath(points: readonly Point[], baseY: number): string {
  if (!points.length) return '';
  return `${polyline(points)} L${f(points[points.length - 1][0])} ${f(baseY)} L${f(points[0][0])} ${f(baseY)} Z`;
}

/** Points extended along their first and last segments to the vertical lines x = `left` and x = `right`. */
export function extendToEdges(points: readonly Point[], left: number, right: number, minY: number, maxY: number): Point[] {
  if (points.length < 2) return points.length ? [[left, points[0][1]], points[0], [right, points[0][1]]] : [];
  const clampY = (y: number) => Math.min(maxY, Math.max(minY, y));
  const at = ([x1, y1]: Point, [x2, y2]: Point, x: number): Point => [x, clampY(x2 === x1 ? y1 : y1 + ((y2 - y1) * (x - x1)) / (x2 - x1))];
  const n = points.length;
  return [at(points[0], points[1], left), ...points, at(points[n - 2], points[n - 1], right)];
}

/** Bar with the two corners at its value end rounded (`up`: top corners, `right`: right corners). */
export function barPath(x: number, y: number, w: number, h: number, radius: number, direction: 'up' | 'right'): string {
  if (w <= 0 || h <= 0) return '';
  if (direction === 'up') {
    const r = Math.min(radius, w / 2, h);
    return `M${f(x)} ${f(y + h)} V${f(y + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)} H${f(x + w - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)} V${f(y + h)} Z`;
  }
  const r = Math.min(radius, h / 2, w);
  return `M${f(x)} ${f(y)} H${f(x + w - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)} V${f(y + h - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)} H${f(x)} Z`;
}

export type Rect = { left: number; top: number; right: number; bottom: number };

/** Intersection of rectangles (may be empty: right < left or bottom < top). */
export function intersect(a: Rect, ...rest: Rect[]): Rect {
  return rest.reduce(
    (r, b) => ({ left: Math.max(r.left, b.left), top: Math.max(r.top, b.top), right: Math.min(r.right, b.right), bottom: Math.min(r.bottom, b.bottom) }),
    a,
  );
}

/**
 * Tooltip placement (Design System Rules 05) — all rectangles in one coordinate space. The tooltip goes beside its
 * anchor — `gap` to the right, or to the left when that does not fit — inside `visible`, the part of the plot that can
 * be seen (plot ∩ viewport and clipping ancestors, shrunk by the margin). On an axis where it does not fit there, it
 * stays inside the plot instead. It never leaves its own chart for the viewport, so a chart scrolled out of view does
 * not leave its tooltip on top of another one.
 */
export function placeTooltip(
  anchor: { x: number; y: number; gap: number; vertical: 'top' | 'center' },
  size: { width: number; height: number },
  plot: Rect,
  visible: Rect,
): { left: number; top: number } {
  const clamp = (v: number, min: number, max: number) => (max < min ? min : Math.min(max, Math.max(min, v)));
  const fitsX = size.width <= visible.right - visible.left;
  const fitsY = size.height <= visible.bottom - visible.top;
  const ax: [number, number] = fitsX ? [visible.left, visible.right] : [plot.left, plot.right];
  const ay: [number, number] = fitsY ? [visible.top, visible.bottom] : [plot.top, plot.bottom];
  const right = anchor.x + anchor.gap;
  const left = anchor.x - anchor.gap - size.width;
  const fits = (x: number) => x >= ax[0] && x + size.width <= ax[1];
  let x: number;
  if (fits(right)) x = right;
  else if (fits(left)) x = left;
  else {
    // Neither side fits (the anchor is near or past an edge): keep the side with more room, moved into the area.
    const preferred = ax[1] - anchor.x >= anchor.x - ax[0] ? right : left;
    x = clamp(preferred, ax[0], ax[1] - size.width);
  }
  const y0 = anchor.vertical === 'top' ? anchor.y : anchor.y - size.height / 2;
  return { left: x, top: clamp(y0, ay[0], ay[1] - size.height) };
}
