import { forwardRef, type CSSProperties } from 'react';
import { ProgressBar, type ProgressBarProps } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type ProgressProps = Omit<ProgressBarProps, 'className' | 'children' | 'isIndeterminate' | 'style'> & {
  className?: string;
  style?: CSSProperties;
};

/**
 * Figma component `progress` (185:6518): a 6px track (border-radius/rounded-full, colors/progress/border/surface)
 * with the bar (…/indicator) clipped by it. `value` between `minValue` and `maxValue` (0 – 100 by default);
 * role="progressbar" and its values come from react-aria-components. Name it with `aria-label` or `aria-labelledby`.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ className, ...rest }, ref) {
  return (
    <ProgressBar {...rest} ref={ref} className={cx('ds-progress', className)}>
      {({ percentage }) => <div className="ds-progress__bar" style={{ width: `${percentage ?? 0}%` }} />}
    </ProgressBar>
  );
});
