import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { BadgeAppearance, BadgeShape, BadgeSize, BadgeStatus } from './Badge.options';

export type BadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** Figma "Label Text". */
  children: ReactNode;
  /** Figma "Status". @default 'basic' */
  status?: BadgeStatus;
  /** Figma "Appearance". @default 'filled' */
  appearance?: BadgeAppearance;
  /** Figma "Size". @default 'sm' */
  size?: BadgeSize;
  /** Figma "Shape". @default 'square' */
  shape?: BadgeShape;
  /** Figma "Dot". @default true */
  dot?: boolean;
};

/**
 * Figma component set `badge_status` (91:6152): a status label with an optional dot.
 * Status colours come from colors/badge/status/{filled|outline}/*.
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
  /** Figma "Status". @default 'basic' */
  status?: BadgeStatus;
  /** Figma "Size": 4 · 6 · 8px. @default 'sm' */
  size?: BadgeSize;
  /** Accessible name; without it the dot is decorative (`aria-hidden`). */
  'aria-label'?: string;
};

/** Figma component set `badge_dot` (95:2681): a status dot (e.g. a new-item marker). */
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
  /** The number shown. */
  count: number;
  /** Larger counts show "{max}+" (Figma Digits Multiple: "99+"). @default 99 */
  max?: number;
  /** Figma "Status". @default 'basic' */
  status?: BadgeStatus;
};

/** Figma component set `badge_count` (95:2762): a count pill (Digits Single / Multiple follow the number). */
export const BadgeCount = forwardRef<HTMLSpanElement, BadgeCountProps>(function BadgeCount({ count, max = 99, status = 'basic', className, ...rest }, ref) {
  return (
    <span {...rest} ref={ref} className={cx('ds-badge-count', className)} data-status={status}>
      <span className="ds-badge-count__label">{count > max ? `${max}+` : count}</span>
    </span>
  );
});
