import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChartColor } from './Chart.options';

export type ChartTooltipItem = {
  /** 계열 이름. 길면 줄바꿈됩니다. */
  label: ReactNode;
  /** 오른쪽에 표시할 값. */
  value: ReactNode;
  /** 계열 표시 색. @default 'brand' */
  color?: ChartColor;
};

export type ChartTooltipProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** 툴팁 제목(항목 이름이나 날짜). */
  title?: ReactNode;
  /** 계열마다 한 줄씩 표시할 색 · 이름 · 값. */
  items: ChartTooltipItem[];
};

/**
 * 한 항목의 계열별 값을 보여 주는 툴팁입니다. `Chart`는 툴팁을 직접 표시하므로, 툴팁 모양을 따로 쓸 때만 씁니다.
 */
export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(function ChartTooltip({ title, items, className, ...rest }, ref) {
  return (
    <div {...rest} ref={ref} className={cx('ds-chart-tooltip', className)}>
      {title != null && title !== false && <div className="ds-chart-tooltip__title">{title}</div>}
      <dl className="ds-chart-tooltip__items">
        {items.map((item, i) => (
          <div key={i} className="ds-chart-tooltip__row">
            <dt className="ds-chart-tooltip__label">
              <span className="ds-chart-tooltip__indicator" data-color={item.color ?? 'brand'} aria-hidden="true" />
              <span className="ds-chart-tooltip__text">{item.label}</span>
            </dt>
            <dd className="ds-chart-tooltip__value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
});
