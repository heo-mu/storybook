import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { SegmentedControlContext } from './SegmentedControlContext';
import type { SegmentedControlSize } from './SegmentedControl.options';

export type SegmentedControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** 크기. @default 'md' */
  size?: SegmentedControlSize;
  /** 선택한 옵션의 값(제어). */
  value?: string | null;
  /** 처음 선택된 옵션의 값(비제어). @default null */
  defaultValue?: string | null;
  /** 새로 고른 값과 함께 호출됩니다. */
  onChange?: (value: string) => void;
  /** 폼 전송에 쓰는 이름. @default 자동 생성 */
  name?: string;
  /** 모든 옵션을 비활성으로 만듭니다. */
  disabled?: boolean;
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Rules 09 (2026-10-29, reference HeroUI Segment): one selection indicator paints the selected segment's background and
 * shadow and slides to the newly selected item. It is measured from the selected segment's real box (relative to the
 * control, transforms of ancestors divided out) and placed with left / top / width / height so that at rest it sits on
 * the same layout pixels as the segment itself (no sub-pixel transform blur). Until it has been measured (server
 * render, no JS) the segment keeps its own selected background.
 */
function placeIndicator(root: HTMLElement, indicator: HTMLElement, animate: boolean) {
  const input = root.querySelector<HTMLInputElement>(':scope > .ds-segmented__item > .ds-segmented__input:checked');
  const segment = input?.nextElementSibling as HTMLElement | null | undefined;
  const wasShown = indicator.dataset.shown !== undefined;
  if (!segment) {
    delete indicator.dataset.shown;
    return;
  }
  const r = root.getBoundingClientRect();
  const s = segment.getBoundingClientRect();
  const scaleX = root.offsetWidth ? r.width / root.offsetWidth : 1;
  const scaleY = root.offsetHeight ? r.height / root.offsetHeight : 1;
  const instant = !animate || !wasShown;
  if (instant) indicator.dataset.instant = '';
  indicator.style.setProperty('--_x', `${(s.left - r.left) / scaleX - root.clientLeft}px`);
  indicator.style.setProperty('--_y', `${(s.top - r.top) / scaleY - root.clientTop}px`);
  indicator.style.setProperty('--_w', `${s.width / scaleX}px`);
  indicator.style.setProperty('--_h', `${s.height / scaleY}px`);
  indicator.dataset.shown = '';
  root.dataset.indicator = '';
  if (instant) {
    void indicator.offsetWidth; // apply the new box without a transition, then re-enable transitions
    delete indicator.dataset.instant;
  }
}

/** 관련 옵션을 나란히 표시하고 하나를 선택합니다. 일간·주간·월간처럼 소수의 옵션을 전환할 때 사용합니다. */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { size = 'md', value, defaultValue = null, onChange, name, disabled, className, children, ...rest },
  ref,
) {
  const autoName = useId();
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange as ((v: string | null) => void) | undefined);
  const context = useMemo(
    () => ({ name: name ?? autoName, size, disabled, selected, select: (v: string) => setSelected(v) }),
    [name, autoName, size, disabled, selected, setSelected],
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Selection change (pointer, keyboard, or a controlled value): slide to the new segment.
  useIsomorphicLayoutEffect(() => {
    if (rootRef.current && indicatorRef.current) placeIndicator(rootRef.current, indicatorRef.current, true);
  }, [selected, size, children]);

  // Size changes (container width, a web font arriving, items): follow at once, without sliding. Every report re-places
  // the indicator (a no-op when nothing moved) — including the first report after (re)subscribing, which is when a font
  // that loaded between the first measurement and the subscription shows up. A slide in progress is never cut short:
  // the indicator is re-placed once it has arrived.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const sync = () => {
      const r = rootRef.current;
      const indicator = indicatorRef.current;
      if (!r || !indicator) return;
      const running = typeof indicator.getAnimations === 'function' ? indicator.getAnimations().filter((a) => a.playState === 'running') : [];
      if (running.length > 0) {
        void Promise.all(running.map((a) => a.finished.catch(() => undefined))).then(sync);
        return;
      }
      placeIndicator(r, indicator, false);
    };
    const observer = new ResizeObserver(sync);
    observer.observe(root);
    root.querySelectorAll(':scope > .ds-segmented__item > .ds-segmented__segment').forEach((segment) => observer.observe(segment));
    return () => observer.disconnect();
  }, [children, size]);

  return (
    <div {...rest} ref={setRootRef} role="radiogroup" aria-disabled={disabled || undefined} className={cx('ds-segmented', className)} data-size={size}>
      <span ref={indicatorRef} className="ds-segmented__indicator" aria-hidden="true" />
      <SegmentedControlContext.Provider value={context}>{children}</SegmentedControlContext.Provider>
    </div>
  );
});
