import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { PaginationShape, PaginationSize } from './Pagination.options';

type Look = { size?: PaginationSize; shape?: PaginationShape };

export type PaginationItemProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Look & {
    /** Figma "Number". */
    page: number;
    /** Figma State "Current". */
    current?: boolean;
  };

/** Figma component set `pagination_item` (132:520): one page number button. */
export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(function PaginationItem(
  { page, current = false, size = 'sm', shape = 'square', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-pagination__item', className)}
      data-size={size}
      data-shape={shape}
      data-current={current || undefined}
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel ?? `${page} 페이지`}
    >
      <span className="ds-pagination__number">{page}</span>
    </button>
  );
});

export type PaginationControlProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Look & {
    /** Figma "Direction". */
    direction: 'previous' | 'next';
  };

/** Figma component set `pagination_control` (132:604): previous / next page button. */
export const PaginationControl = forwardRef<HTMLButtonElement, PaginationControlProps>(function PaginationControl(
  { direction, size = 'sm', shape = 'square', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const Icon = direction === 'previous' ? CaretLeftIcon : CaretRightIcon;
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-pagination__control', className)}
      data-size={size}
      data-shape={shape}
      aria-label={ariaLabel ?? (direction === 'previous' ? '이전 페이지' : '다음 페이지')}
    >
      <Icon className="ds-pagination__icon" />
    </button>
  );
});

export type PaginationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> &
  Look & {
    /** Number of pages. */
    totalPages: number;
    /** Current page, 1-based (controlled). */
    page?: number;
    /** Initial page (uncontrolled). @default 1 */
    defaultPage?: number;
    /** Called with the new page. */
    onPageChange?: (page: number) => void;
    /** How many page numbers are shown at once (a window around the current page). @default 5 */
    visiblePages?: number;
  };

/** First page of a window of `count` pages that contains `page`, clamped to [1, total]. */
function windowStart(page: number, total: number, count: number) {
  const half = Math.floor(count / 2);
  return Math.max(1, Math.min(page - half, total - count + 1));
}

/**
 * Figma component set `pagination` (132:871) built from `pagination_control` and `pagination_item`:
 * previous, a window of page numbers (Figma shows five, the first current), next. Renders
 * `<nav aria-label="페이지 이동">` with buttons; the current page has `aria-current="page"`.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { totalPages, page, defaultPage = 1, onPageChange, visiblePages = 5, size = 'sm', shape = 'square', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState(page, defaultPage, onPageChange);
  const total = Math.max(1, totalPages);
  const count = Math.min(visiblePages, total);
  const start = windowStart(current, total, count);
  const pages = Array.from({ length: count }, (_, i) => start + i);
  const go = (p: number) => {
    const next = Math.min(total, Math.max(1, p));
    if (next !== current) setCurrent(next);
  };
  return (
    <nav {...rest} ref={ref} className={cx('ds-pagination', className)} data-size={size} aria-label={ariaLabel ?? '페이지 이동'}>
      <PaginationControl direction="previous" size={size} shape={shape} disabled={current <= 1} onClick={() => go(current - 1)} />
      {pages.map((p) => (
        <PaginationItem key={p} page={p} size={size} shape={shape} current={p === current} onClick={() => go(p)} />
      ))}
      <PaginationControl direction="next" size={size} shape={shape} disabled={current >= total} onClick={() => go(current + 1)} />
    </nav>
  );
});
