import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { BadgeAppearance, BadgeShape, BadgeSize, BadgeStatus } from './Badge.options';

export type BadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 배지 글자. */
  children: ReactNode;
  /** 종류 — 상태를 나타내는 색. @default 'basic' */
  status?: BadgeStatus;
  /** 모양 — 채움(filled) · 테두리(outline). 테두리 모양은 배경이 없습니다. @default 'filled' */
  appearance?: BadgeAppearance;
  /** 크기. @default 'sm' */
  size?: BadgeSize;
  /** 모서리 모양. @default 'square' */
  shape?: BadgeShape;
  /** 글자 앞에 점을 표시합니다. @default true */
  dot?: boolean;
};

/**
 * 상태를 짧은 글자로 알려 주는 배지입니다. 보여 주기만 하며 누를 수 없습니다.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, status = 'basic', appearance = 'filled', size = 'sm', shape = 'square', dot = true, className, ...rest },
  ref,
) {
  return (
    <span {...rest} ref={ref} className={cx('ds-badge', className)} data-status={status} data-appearance={appearance} data-size={size} data-shape={shape}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      <span className="ds-badge__label">{children}</span>
    </span>
  );
});

export type BadgeDotProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 종류 — 상태를 나타내는 색. @default 'basic' */
  status?: BadgeStatus;
  /** 크기 — 점 지름 4 · 6 · 8px. @default 'sm' */
  size?: BadgeSize;
  /** 화면 낭독기가 읽는 이름. 없으면 꾸밈으로 처리되어 읽히지 않습니다. */
  'aria-label'?: string;
};

/** 글자 없이 점 하나로 상태를 알리는 배지입니다(예: 새 글 표시). */
export const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(function BadgeDot({ status = 'basic', size = 'sm', className, 'aria-label': ariaLabel, ...rest }, ref) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('ds-badge-dot', className)}
      data-status={status}
      data-size={size}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
});

export type BadgeCountProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 표시할 숫자. */
  count: number;
  /** 이 값보다 큰 수는 "99+"처럼 줄여 표시합니다. @default 99 */
  max?: number;
  /** 종류 — 상태를 나타내는 색. @default 'basic' */
  status?: BadgeStatus;
};

/** 개수를 숫자로 알려 주는 배지입니다. `max`보다 큰 수는 "99+"처럼 줄여 보여 줍니다. */
export const BadgeCount = forwardRef<HTMLSpanElement, BadgeCountProps>(function BadgeCount({ count, max = 99, status = 'basic', className, ...rest }, ref) {
  return (
    <span {...rest} ref={ref} className={cx('ds-badge-count', className)} data-status={status}>
      <span className="ds-badge-count__label">{count > max ? `${max}+` : count}</span>
    </span>
  );
});
