import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import type { SkeletonShape } from './Skeleton.options';

export type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "Shape": Line 60 × 8, Shape4 100 × 10, Block 140 × 12, Circle 24. Set `style` width / height to resize. @default 'line' */
  shape?: SkeletonShape;
};

/**
 * Figma component set `skeleton` (697:4486): a placeholder shape (colors/skeleton/background, border-radius/rounded;
 * Circle rounded-xl) while content loads. Decorative — announce the loading state on the surrounding region
 * (e.g. `DataState state="loading"`). Static, as in Figma (no animation).
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ shape = 'line', className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-skeleton', className)} data-shape={shape} aria-hidden="true" />;
});
