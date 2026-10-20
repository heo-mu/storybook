import { forwardRef, type CSSProperties } from 'react';
import { ProgressBar, type ProgressBarProps } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type ProgressProps = Omit<ProgressBarProps, 'className' | 'children' | 'isIndeterminate' | 'style'> & {
  className?: string;
  style?: CSSProperties;
};

/** 작업의 진행률을 막대로 표시합니다. 진행률을 알 수 없는 작업에는 Loading을 사용합니다. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ className, ...rest }, ref) {
  return (
    <ProgressBar {...rest} ref={ref} className={cx('ds-progress', className)}>
      {({ percentage }) => <div className="ds-progress__bar" style={{ width: `${percentage ?? 0}%` }} />}
    </ProgressBar>
  );
});
