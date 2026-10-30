import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react';
import type { UNSTABLE_ToastQueue } from 'react-aria-components';

/*
 * Toast stack motion — Design System Rules 06 · 09 (reference: shadcn/ui Base UI toast). The newest toast rises from
 * below, the others glide up by its height and gap, a 4th toast pushes the oldest up and out, and a closed toast fades
 * while the rest close the gap. Movement uses the reference's 500 ms ease-out (cubic-bezier(0.22, 1, 0.36, 1) — no
 * overshoot, no scale). With prefers-reduced-motion the stack changes at once.
 *
 * react-aria renders the visible toasts and removes a closed one immediately, so this is FLIP on top of it: the
 * on-screen position of every toast is recorded inside the queue update (before React re-renders), and after the
 * commit each toast is animated from where it was to where it is. A removed toast leaves an inert, aria-hidden copy
 * that plays the exit and is then deleted — the queue, the DOM and the accessibility tree hold only the live toasts.
 */

/** Movement and enter / push-out duration (ms). */
export const TOAST_MOVE_MS = 500;
/** Fade of a toast closed by its button or its timer (ms). */
export const TOAST_FADE_MS = 250;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** A new toast starts this many of its own heights below its place (reference: translateY(150%)). */
const ENTER_FROM = 1.5;
/** Fallback push-out distance when no other toast moved: the toast's height plus the region gap (m-2). */
const GAP = 8;

type Shot = { rect: DOMRect; opacity: number; node: HTMLElement };
type Snapshot = { region: HTMLElement | null; container: Node | null; toasts: Map<string, Shot> };

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const liveToasts = (region: HTMLElement | null) => (region ? [...region.querySelectorAll<HTMLElement>('[data-toast-key]')] : []);

function snapshot(region: HTMLElement | null): Snapshot {
  const toasts = new Map<string, Shot>();
  for (const el of liveToasts(region)) {
    // getBoundingClientRect and the computed opacity include a running animation: a change in mid-motion continues from
    // where the toast is drawn, so the stack never jumps.
    toasts.set(el.dataset.toastKey!, { rect: el.getBoundingClientRect(), opacity: Number(getComputedStyle(el).opacity), node: el.cloneNode(true) as HTMLElement });
  }
  return { region, container: region?.parentNode ?? null, toasts };
}

/** A non-interactive copy of a removed toast, fixed where it was drawn. */
function ghostOf({ rect, node }: Shot) {
  for (const el of [node, ...node.querySelectorAll<HTMLElement>('*')]) {
    el.removeAttribute('id');
    el.removeAttribute('data-toast-key');
    el.removeAttribute('tabindex');
  }
  // out of the tab order even where `inert` is not understood (the copy's close button keeps its look — no `disabled`)
  for (const el of node.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea')) el.setAttribute('tabindex', '-1');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('inert', '');
  node.setAttribute('data-toast-exit', '');
  Object.assign(node.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    pointerEvents: 'none',
  });
  return node;
}

function play(before: Snapshot, region: HTMLElement | null, ghosts: Set<HTMLElement>, wasPushedOut: (key: string) => boolean) {
  const live = liveToasts(region);
  const liveKeys = new Set(live.map((el) => el.dataset.toastKey!));
  const removed = [...before.toasts.keys()].filter((key) => !liveKeys.has(key));
  const pushed = new Set(removed.filter(wasPushedOut));
  // Measure the resting layout: drop any movement still running from the previous change.
  for (const el of live) for (const animation of el.getAnimations()) animation.cancel();
  if (prefersReducedMotion()) return;

  let lift = 0;
  for (const el of live) {
    const now = el.getBoundingClientRect();
    const was = before.toasts.get(el.dataset.toastKey!);
    if (was) {
      const dy = was.rect.top - now.top;
      lift = Math.max(lift, dy);
      if (Math.abs(dy) >= 0.5 || was.opacity < 1) {
        el.animate([{ transform: `translateY(${dy}px)`, opacity: was.opacity }, { transform: 'translateY(0)', opacity: 1 }], { duration: TOAST_MOVE_MS, easing: EASE });
      }
    } else {
      // as in the reference, the new toast slides in from below without fading (it starts below the screen edge)
      el.animate([{ transform: `translateY(${now.height * ENTER_FROM}px)` }, { transform: 'translateY(0)' }], { duration: TOAST_MOVE_MS, easing: EASE });
    }
  }

  for (const key of removed) {
    const was = before.toasts.get(key)!;
    const ghost = ghostOf(was);
    // Under the region (earlier in the same container), so the live toasts move over a fading copy.
    const container = region?.parentNode ?? before.container ?? document.body;
    container.insertBefore(ghost, region && region.parentNode === container ? region : null);
    ghosts.add(ghost);
    const animation = pushed.has(key)
      ? ghost.animate([{ transform: 'translateY(0)', opacity: was.opacity }, { transform: `translateY(${-(lift || was.rect.height + GAP)}px)`, opacity: 0 }], { duration: TOAST_MOVE_MS, easing: EASE, fill: 'forwards' })
      : ghost.animate([{ opacity: was.opacity }, { opacity: 0 }], { duration: TOAST_FADE_MS, easing: EASE, fill: 'forwards' });
    const remove = () => {
      ghost.remove();
      ghosts.delete(ghost);
    };
    animation.addEventListener('finish', remove);
    animation.addEventListener('cancel', remove);
  }
}

/**
 * Animates the toasts of `queue` inside `regionRef` (toast elements carry `data-toast-key`). `wasPushedOut(key)` tells
 * whether a removed toast was pushed out by a newer one (it rises and fades) rather than closed (it fades in place).
 */
export function useToastStackMotion<T>(queue: UNSTABLE_ToastQueue<T>, regionRef: RefObject<HTMLDivElement | null>, wasPushedOut: (key: string) => boolean) {
  const pending = useRef<Snapshot | null>(null);
  const ghosts = useRef(new Set<HTMLElement>());
  const subscribe = useCallback(
    (onChange: () => void) =>
      queue.subscribe(() => {
        // Runs inside the queue update, before React re-renders: one snapshot per batch (close + add of a push-out).
        if (!pending.current) pending.current = snapshot(regionRef.current);
        onChange();
      }),
    [queue, regionRef],
  );
  const visible = useSyncExternalStore(subscribe, () => queue.visibleToasts, () => queue.visibleToasts);

  useLayoutEffect(() => {
    const before = pending.current;
    pending.current = null;
    if (before) play(before, regionRef.current, ghosts.current, wasPushedOut);
  }, [visible, regionRef, wasPushedOut]);

  useEffect(() => {
    const live = ghosts.current;
    return () => {
      for (const ghost of live) ghost.remove();
      live.clear();
    };
  }, []);
}
