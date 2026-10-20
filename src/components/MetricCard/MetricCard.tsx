import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type MetricCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** 지표 이름. 카드 제목 요소로 표시됩니다. */
  title: ReactNode;
  /** 제목 앞 아이콘. 꾸밈으로 처리되어 화면 낭독기가 읽지 않습니다. */
  icon?: ReactNode;
  /** 값. */
  value: ReactNode;
  /** 값 뒤에 붙는 단위. */
  unit?: ReactNode;
  /** 증감. 보통 `MetricTrend`를 넣습니다. */
  trend?: ReactNode;
  /** 증감 뒤에 붙는 비교 기준 문구(예: "이전 7일 대비"). */
  comparison?: ReactNode;
  /** 제목의 단계(h2–h6). @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/**
 * 대시보드의 핵심 지표 하나를 제목, 값과 단위, 비교로 보여 주는 카드입니다. 너비는 부모를 채웁니다.
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
