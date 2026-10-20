import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { LoadingSize } from './Loading.options';

export type LoadingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 크기. @default 'md' */
  size?: LoadingSize;
  /** 회전 표시 아래 글자. 없으면 `aria-label`이 이름이 됩니다. */
  label?: ReactNode;
};

/** 데이터를 불러오거나 작업을 처리 중임을 표시합니다. 진행률을 알 수 있는 작업에는 Progress를 사용합니다. */
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
