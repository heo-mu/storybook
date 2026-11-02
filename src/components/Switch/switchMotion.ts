import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

/*
 * Switch motion — reference: HeroUI Native Switch (heroui-native src/components/switch/switch.animation.ts).
 *   Press  — while pressed the switch (track and thumb, not the label) shrinks to 0.96, 150 ms each way (Switch.css).
 *   Thumb  — slides to its other end on HeroUI's spring withSpring({ damping: 120, stiffness: 1600, mass: 2 }) (here).
 *   Track  — the off ↔ on colour blends over 175 ms, cubic-bezier(0.25, 0.1, 0.25, 1) (Switch.css).
 * The thumb rests at its CSS `left` (whole pixels, the Figma variant); the motion is a transform on top of it that ends
 * at 0, so a switch at rest is exactly the static design. With prefers-reduced-motion nothing moves or shrinks.
 */

// Reanimated (src/animation/spring) runs this config with its critically damped solution — the damping ratio
// 120 / (2·√(1600·2)) ≈ 1.06 is ≥ 1 — at ω0 = √(1600 / 2) ≈ 28.3 rad/s, so the thumb slows into place without
// overshoot. Leaving from rest, the share of the distance still to go after t seconds is e^(−ω0·t)·(1 + ω0·t). A spring
// that reverses starts again at rest from where the thumb is drawn (Reanimated drops a velocity pointing away from the
// new target), and it stops once its energy is 6e-9 of the start (energyThreshold) — the same time for any distance.
const OMEGA = Math.sqrt(1600 / 2);
const remaining = (seconds: number) => Math.exp(-OMEGA * seconds) * (1 + OMEGA * seconds);
const energyLeft = (u: number) => Math.exp(-2 * u) * ((1 + u) ** 2 + u ** 2);
const settleAt = (() => {
  let u = 0;
  while (energyLeft(u) > 6e-9) u += 0.001;
  return u / OMEGA;
})();
/** Thumb spring from one end to the other, ms (≈ 437; within half a pixel after ≈ 180). */
export const THUMB_SPRING_MS = Math.round(settleAt * 1000);
// Sampled at 240 Hz: straight segments between samples stay within 0.03px of the curve.
const STEPS = Math.ceil(THUMB_SPRING_MS / (1000 / 240));
const CURVE = Array.from({ length: STEPS + 1 }, (_, i) => (i === STEPS ? 0 : remaining((i / STEPS) * settleAt)));

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Glide = { animation: Animation; from: number; to: number };
// checked state the thumb was last placed for (null before the first layout: no motion on mount), and its running slide
type ThumbState = { placed: boolean | null; glide: Glide | null };

/** Starts the slide when the input's checked state differs from where the thumb was last placed. */
function placeThumb(el: HTMLInputElement | null, knob: HTMLElement | null, state: ThumbState) {
  if (!el || !knob) return;
  if (state.placed === null || state.placed === el.checked) {
    state.placed = el.checked;
    return;
  }
  state.placed = el.checked;
  // New resting place (CSS `left`); the thumb was at the other end — the padding is the same on both sides.
  const to = parseFloat(getComputedStyle(knob).left);
  let from = el.offsetWidth - knob.offsetWidth - to;
  const running = state.glide;
  if (running) {
    // still sliding: carry on from where it is drawn now
    if (running.animation.playState !== 'finished') {
      from = running.to + (running.from - running.to) * remaining(Number(running.animation.currentTime ?? 0) / 1000);
    }
    running.animation.cancel();
    state.glide = null;
  }
  if (from === to || prefersReducedMotion() || typeof knob.animate !== 'function') return;
  const animation = knob.animate(
    CURVE.map((share) => ({ transform: `translateX(${(from - to) * share}px)` })),
    { duration: THUMB_SPRING_MS, easing: 'linear' },
  );
  const glide = { animation, from, to };
  state.glide = glide;
  animation.addEventListener('finish', () => {
    if (state.glide === glide) state.glide = null;
  });
}

/**
 * Slides the thumb whenever the input's checked state changes after mount — click, Space, or a controlled `checked`.
 * Returns the callback for the input's change event.
 */
export function useThumbSpring(input: RefObject<HTMLInputElement | null>, thumb: RefObject<HTMLElement | null>) {
  const state = useRef<ThumbState>({ placed: null, glide: null });

  // Every render: a controlled `checked` changes the input in the commit, so the slide starts in the same frame.
  useLayoutEffect(() => placeThumb(input.current, thumb.current, state.current));
  useEffect(() => {
    const thumbState = state.current;
    return () => thumbState.glide?.animation.cancel();
  }, []);
  // Click / Space on an uncontrolled switch changes the input without a render. Look once the event is over — React
  // restores a controlled input whose `checked` was not updated, and that must not slide.
  return () => queueMicrotask(() => placeThumb(input.current, thumb.current, state.current));
}

/**
 * Pressed look (Switch.css `data-pressed`). A pointer press lasts from pointer down until the pointer is released or
 * cancelled (a touch that turns into a scroll, the window losing focus) and shows only while the pointer is over the
 * switch or its label — where letting go toggles it. Holding Space on the focused switch is a press too.
 */
export function useSwitchPress(root: RefObject<HTMLElement | null>, disabled: boolean) {
  const [pointer, setPointer] = useState(false);
  const [key, setKey] = useState(false);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => () => stop.current?.(), []);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    // button 0: the main mouse button, a finger or a pen tip
    if (disabled || !event.isPrimary || event.button !== 0) return;
    stop.current?.();
    const id = event.pointerId;
    const move = (e: PointerEvent) => {
      const box = root.current?.getBoundingClientRect();
      if (e.pointerId !== id || !box) return;
      setPointer(e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom);
    };
    const end = (e: Event) => {
      if (e instanceof PointerEvent && e.pointerId !== id) return;
      stop.current?.();
    };
    // listened from the press on (not in an effect), so a release in the same task is never missed
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerup', end, true);
    document.addEventListener('pointercancel', end, true);
    window.addEventListener('blur', end);
    stop.current = () => {
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerup', end, true);
      document.removeEventListener('pointercancel', end, true);
      window.removeEventListener('blur', end);
      stop.current = null;
      setPointer(false);
    };
    setPointer(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') setKey(true);
  };
  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') setKey(false);
  };
  const onBlur = () => setKey(false);

  return { pressed: !disabled && (pointer || key), onPointerDown, onKeyDown, onKeyUp, onBlur };
}
