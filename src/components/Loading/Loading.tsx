import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { LoadingSize } from './Loading.options';

export type LoadingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "size". @default 'md' */
  size?: LoadingSize;
  /** Figma "text" (Loading text under the spinner). Without it, `aria-label` names the status. */
  label?: ReactNode;
};

/**
 * Figma component set `loading` (675:5644): a spinning arc (gradient from colors/border/transparency to
 * colors/border/brand) with an optional label. Renders `role="status"`, so the label (or `aria-label`,
 * default '로딩 중') is announced politely.
 */
export const Loading = forwardRef<HTMLDivElement, LoadingProps>(function Loading(
  { size = 'md', label, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const hasLabel = label != null && label !== false;
  return (
    <div
      {...rest}
      ref={ref}
      role="status"
      aria-label={hasLabel ? ariaLabel : (ariaLabel ?? '로딩 중')}
      className={cx('ds-loading', className)}
      data-size={size}
    >
      <span className="ds-loading__spinner" aria-hidden="true" />
      {hasLabel && <span className="ds-loading__label">{label}</span>}
    </div>
  );
});
