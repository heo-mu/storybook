import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import type { SkeletonShape } from './Skeleton.options';

export type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 모양 — line(60 × 8) · shape4(100 × 10) · block(140 × 12) · circle(24 × 24). 크기는 `style`의 width · height로 바꿀 수 있습니다. @default 'line' */
  shape?: SkeletonShape;
};

/**
 * 내용을 불러오는 동안 자리를 표시하는 정지된 도형입니다. 화면 낭독기가 읽지 않으므로,
 * 불러오는 중이라는 사실은 감싸는 영역(예: `DataState state="loading"`)에서 알립니다.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ shape = 'line', className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-skeleton', className)} data-shape={shape} aria-hidden="true" />;
});
