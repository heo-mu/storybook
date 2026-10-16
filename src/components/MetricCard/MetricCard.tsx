import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type MetricCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Figma "Title" — what the metric is. Rendered as a heading. */
  title: ReactNode;
  /** Figma header icon (20px, icon/tertiary; Lightning in Figma). Decorative. */
  icon?: ReactNode;
  /** Figma "Value" (3xl/leading-normal/semibold). */
  value: ReactNode;
  /** Figma "Unit", baseline-aligned after the value. */
  unit?: ReactNode;
  /** Figma comparison row: the change, usually a `MetricTrend`. */
  trend?: ReactNode;
  /** Figma "Comparison" text after the trend, e.g. "이전 7일 대비". */
  comparison?: ReactNode;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/**
 * Figma component `metric-card` (697:4487): a key figure — header (icon + title), value with unit, and a comparison
 * row (trend + text), m-3 apart inside a white card (padding 16, radius 12, elevation-3 shadow).
 */
export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(function MetricCard(
  { title, icon, value, unit, trend, comparison, headingLevel = 3, className, ...rest },
  ref,
) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  const hasComparison = (trend != null && trend !== false) || (comparison != null && comparison !== false);
  return (
    <div role="group" aria-labelledby={titleId} {...rest} ref={ref} className={cx('ds-metric-card', className)}>
      <div className="ds-metric-card__header">
        {icon && (
          <span className="ds-metric-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <Heading id={titleId} className="ds-metric-card__title">
          {title}
        </Heading>
      </div>
      <p className="ds-metric-card__value-row">
        <span className="ds-metric-card__value">{value}</span>
        {unit != null && unit !== false && <span className="ds-metric-card__unit">{unit}</span>}
      </p>
      {hasComparison && (
        <div className="ds-metric-card__comparison">
          {trend}
          {comparison != null && comparison !== false && <span className="ds-metric-card__comparison-text">{comparison}</span>}
        </div>
      )}
    </div>
  );
});
