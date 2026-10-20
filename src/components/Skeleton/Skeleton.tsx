import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import type { SkeletonShape } from './Skeleton.options';

export type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 모양 — line(60 × 8) · shape4(100 × 10) · block(140 × 12) · circle(24 × 24). 크기는 `style`의 width · height로 바꿀 수 있습니다. @default 'line' */
  shape?: SkeletonShape;
};

/** 콘텐츠를 불러오는 동안 표시할 영역의 형태를 미리 보여 줍니다. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ shape = 'line', className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-skeleton', className)} data-shape={shape} aria-hidden="true" />;
});
