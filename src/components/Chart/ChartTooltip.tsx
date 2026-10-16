import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChartColor } from './Chart.options';

export type ChartTooltipItem = {
  /** Figma "Pressure label" (series name). */
  label: ReactNode;
  /** The value shown in the second column. */
  value: ReactNode;
  /** Figma "Indicator" colour. @default 'brand' */
  color?: ChartColor;
};

export type ChartTooltipProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Figma "Time" (the category or date). */
  title?: ReactNode;
  /** One row per series: indicator, label and value. */
  items: ChartTooltipItem[];
};

/**
 * Figma component `chart-tooltip` (693:9776): the values of one category — title (xs) above rows of an indicator,
 * the series label and its value. Padding p-2_5, m-1_5 between the title and the rows, rows m-1 apart,
 * alpha/white/800 background, rounded-sm, elevation-3. `Chart` shows it on hover / keyboard navigation.
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
