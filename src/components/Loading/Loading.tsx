import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { LoadingSize } from './Loading.options';

export type LoadingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 크기. @default 'md' */
  size?: LoadingSize;
  /** 회전 표시 아래 글자. 없으면 `aria-label`이 이름이 됩니다. */
  label?: ReactNode;
};

/**
 * 불러오거나 처리하는 중임을 알리는 회전 표시입니다. 화면 낭독기가 `label`(없으면 `aria-label`, 기본 '로딩 중')을
 * 다른 안내를 끊지 않고 읽어 줍니다.
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
