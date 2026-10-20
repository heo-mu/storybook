import { forwardRef, type CSSProperties } from 'react';
import { ProgressBar, type ProgressBarProps } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type ProgressProps = Omit<ProgressBarProps, 'className' | 'children' | 'isIndeterminate' | 'style'> & {
  className?: string;
  style?: CSSProperties;
};

/**
 * 작업이 얼마나 진행되었는지 보여 주는 진행 막대입니다. `value`는 `minValue`와 `maxValue` 사이 값이며 기본 범위는 0 – 100입니다.
 * 이름은 `aria-label` 또는 `aria-labelledby`로 꼭 붙입니다.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ className, ...rest }, ref) {
  return (
    <ProgressBar {...rest} ref={ref} className={cx('ds-progress', className)}>
      {({ percentage }) => <div className="ds-progress__bar" style={{ width: `${percentage ?? 0}%` }} />}
    </ProgressBar>
  );
});
