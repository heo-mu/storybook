// Chart entrance motion (Design System Rules 09 "차트 그리기"): when a chart is first seen, its data marks draw in the
// direction of the data — lines from the left, bars from their baseline, one category after another. The motion is SVG
// animation (SMIL <animate>) on the real geometry: bar paths grow (radius and width kept), the line is revealed by a
// clip rectangle that widens from its first point, so every series, the area and the points follow one time axis.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { usePrefersReducedMotion } from '../../utils/usePrefersReducedMotion';

/** Ease-out (cubic): starts fast and slows into the final value, no bounce. `cubic-bezier(0.33, 1, 0.68, 1)`. */
const EASE: readonly [number, number, number, number] = [0.33, 1, 0.68, 1];
export const ENTRANCE_EASING = `cubic-bezier(${EASE.join(', ')})`;
/** Line: the whole reveal, first point to last. */
export const LINE_DURATION = 700;
/** Bar: one bar from the baseline to its value. */
export const BAR_DURATION = 500;
/** Bar: delay between categories, shortened so the last category starts at most BAR_STAGGER_SPAN after the first. */
export const BAR_STAGGER = 50;
const BAR_STAGGER_SPAN = 300;
/** "최고" badge of the line chart: fades in when the line reaches its point (Chart.css ds-chart-badge-in, 150ms). */
export const BADGE_FADE = 150;

export const barStagger = (count: number) => (count > 1 ? Math.min(BAR_STAGGER, BAR_STAGGER_SPAN / (count - 1)) : 0);
/** Time from the start of a bar chart's entrance until its last bar is complete. */
export const barTimeline = (count: number) => BAR_DURATION + Math.max(0, count - 1) * barStagger(count);

type Pt = [number, number];
const lerp = (a: Pt, b: Pt, s: number): Pt => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
const CURVE: [Pt, Pt, Pt, Pt] = [[0, 0], [EASE[0], EASE[1]], [EASE[2], EASE[3]], [1, 1]];
const at = (s: number): Pt => {
  const [p0, p1, p2, p3] = CURVE;
  const a = lerp(p0, p1, s), b = lerp(p1, p2, s), c = lerp(p2, p3, s);
  return lerp(lerp(a, b, s), lerp(b, c, s), s);
};
/** Curve parameter where coordinate `axis` (0 time, 1 progress — both increase along the curve) reaches `v`. */
const paramAt = (v: number, axis: 0 | 1) => {
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid)[axis] < v) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};
/** Fraction of the duration after which the eased progress reaches `p` (0–1). */
export const timeToReach = (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : at(paramAt(p, 1))[0]);

/** The easing curve between parameters s0 and s1, rescaled to the unit square — a SMIL keySpline (de Casteljau). */
function subSpline(s0: number, s1: number): string {
  const split = (pts: Pt[], s: number): [Pt[], Pt[]] => {
    const [p0, p1, p2, p3] = pts;
    const a = lerp(p0, p1, s), b = lerp(p1, p2, s), c = lerp(p2, p3, s), d = lerp(a, b, s), e = lerp(b, c, s), f = lerp(d, e, s);
    return [[p0, a, d, f], [f, e, c, p3]];
  };
  const right = split(CURVE, s0)[1];
  const seg = split(right, s0 >= 1 ? 0 : (s1 - s0) / (1 - s0))[0];
  const [q0, q1, q2, q3] = seg;
  const nx = (x: number) => (q3[0] === q0[0] ? 0 : (x - q0[0]) / (q3[0] - q0[0]));
  const ny = (y: number) => (q3[1] === q0[1] ? 0 : (y - q0[1]) / (q3[1] - q0[1]));
  const c = (v: number) => +Math.min(1, Math.max(0, v)).toFixed(4);
  return [nx(q1[0]), ny(q1[1]), nx(q2[0]), ny(q2[1])].map(c).join(' ');
}

export type Keyframes = { keyTimes: string; values: string; keySplines: string; dur: string };

/**
 * SMIL keyframes of a bar that grows from 0 to `size` (its height or length): it waits `delay` ms, grows for
 * BAR_DURATION ms with the entrance easing, and holds until `total` ms. `shape(v)` is the bar at size v — the same
 * commands for every v, its corner radius min(radius, v) — so the path is linear in v below `kink` (the radius) and
 * above it: a keyframe at the kink makes every segment an exact bar, and keySplines carry the easing exactly.
 */
export function growKeyframes(size: number, kink: number, delay: number, total: number, shape: (v: number) => string): Keyframes {
  const frames: Array<{ t: number; v: number; spline: string }> = [];
  const linear = '0 0 1 1';
  const push = (time: number, v: number, spline: string) => frames.push({ t: time / total, v, spline });
  push(0, 0, '');
  if (delay > 0) push(delay, 0, linear);
  if (kink > 0 && kink < size) {
    const sk = paramAt(kink / size, 1);
    push(delay + at(sk)[0] * BAR_DURATION, kink, subSpline(0, sk));
    push(delay + BAR_DURATION, size, subSpline(sk, 1));
  } else {
    push(delay + BAR_DURATION, size, EASE.join(' '));
  }
  if (delay + BAR_DURATION < total - 0.5) push(total, size, linear);
  frames[frames.length - 1].t = 1;
  const time = (t: number) => +Math.min(1, Math.max(0, t)).toFixed(5);
  return {
    keyTimes: frames.map((f) => time(f.t)).join(';'),
    values: frames.map((f) => shape(f.v)).join(';'),
    keySplines: frames.slice(1).map((f) => f.spline).join(';'),
    dur: `${total}ms`,
  };
}

/** Keyframes of the line reveal: the clip rectangle widens from 0 to `width` over LINE_DURATION. */
export const revealKeyframes = (width: number): Keyframes => ({ keyTimes: '0;1', values: `0;${+width.toFixed(3)}`, keySplines: EASE.join(' '), dur: `${LINE_DURATION}ms` });

export type EntrancePhase = 'pending' | 'running' | 'done';

/** The plot counts as seen when this much of it is inside the viewport and every clipping ancestor. */
const VISIBLE_RATIO = 0.3;

/**
 * Entrance state of one chart: `pending` until its plot is first seen (IntersectionObserver), then `running` for
 * `duration` ms, then `done` for good. With reduced motion (or without IntersectionObserver) it is `done` from the
 * start; `finish()` ends it at once (the user opened a tooltip). Hover, focus, re-renders and leaving / re-entering the
 * viewport never replay it; a new mount (React `key`) does. `start` runs on the next frame after the switch to `running`.
 */
export function useEntrance(target: RefObject<Element | null>, ready: boolean, duration: number, start: () => void) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<EntrancePhase>(() => (typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined' ? 'done' : 'pending'));
  const phase: EntrancePhase = reduced ? 'done' : state;
  const startRef = useRef(start);
  const durationRef = useRef(duration);
  useLayoutEffect(() => {
    startRef.current = start;
    durationRef.current = duration;
  });
  useEffect(() => {
    const el = target.current;
    if (phase !== 'pending' || !ready || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= VISIBLE_RATIO)) setState((p) => (p === 'pending' ? 'running' : p));
      },
      { threshold: [0, VISIBLE_RATIO] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, ready, target]);
  useLayoutEffect(() => {
    if (phase !== 'running') return;
    // Start on the next frame: SMIL begins at the document's current time, which lags behind after a long task (the
    // opening of the motion would be skipped); at a frame the clock is current. Until then the marks show their empty
    // start shape. Only a phase change starts it: later renders (resize, new data, hover) neither restart nor stretch it.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      startRef.current();
      timer = setTimeout(() => setState('done'), durationRef.current);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [phase]);
  const finish = useCallback(() => setState('done'), []);
  return { phase, finish };
}
