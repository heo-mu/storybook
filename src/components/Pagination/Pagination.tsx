import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { PaginationShape, PaginationSize } from './Pagination.options';

type Look = { size?: PaginationSize; shape?: PaginationShape };

export type PaginationItemProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Look & {
    /** 페이지 번호. */
    page: number;
    /** 현재 페이지인지 여부. */
    current?: boolean;
  };

/**
 * 페이지 번호 버튼 하나입니다. `Pagination`이 안에서 그립니다.
 * @internal Rendered by `Pagination` — use that (docs/public-api.md).
 */
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
    /** 방향 — 이전(`previous`) · 다음(`next`). */
    direction: 'previous' | 'next';
  };

/**
 * 이전 · 다음 페이지 버튼입니다. `Pagination`이 안에서 그립니다.
 * @internal Rendered by `Pagination` — use that (docs/public-api.md).
 */
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
    /** 전체 페이지 수. */
    totalPages: number;
    /** 현재 페이지(1부터 셈). 넘기면 바깥에서 관리합니다. */
    page?: number;
    /** 처음 페이지. `page` 없이 스스로 관리할 때 씁니다. @default 1 */
    defaultPage?: number;
    /** 페이지가 바뀌면 새 페이지 번호로 호출됩니다. */
    onPageChange?: (page: number) => void;
    /** 한 번에 보이는 페이지 번호 수. 현재 페이지를 가운데 두고 보여 줍니다. @default 5 */
    visiblePages?: number;
  };

/** First page of a window of `count` pages that contains `page`, clamped to [1, total]. */
function windowStart(page: number, total: number, count: number) {
  const half = Math.floor(count / 2);
  return Math.max(1, Math.min(page - half, total - count + 1));
}

/** 여러 페이지로 나뉜 목록에서 현재 페이지를 표시하고 다른 페이지로 이동합니다. */
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
