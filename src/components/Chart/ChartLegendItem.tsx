import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChartColor, ChartLegendType } from './Chart.options';

export type ChartLegendItemProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'> & {
  /** 범례 글자(계열 이름). */
  children: ReactNode;
  /** 표시 모양 — 선(`line`) · 점선(`dash-line`) · 네모(`bar`). @default 'bar' */
  type?: ChartLegendType;
  /** 표시 색. @default `dash-line`은 '02', 나머지는 'brand' */
  color?: ChartColor;
};

/**
 * 범례 항목 하나(표시 모양과 계열 이름)입니다. `Chart`는 범례를 직접 그리므로, 범례를 따로 만들 때만 씁니다.
 */
export const ChartLegendItem = forwardRef<HTMLSpanElement, ChartLegendItemProps>(function ChartLegendItem(
  { children, type = 'bar', color = type === 'dash-line' ? '02' : 'brand', className, ...rest },
  ref,
) {
  return (
    <span {...rest} ref={ref} className={cx('ds-chart-legend-item', className)} data-type={type}>
      <span className="ds-chart-legend-item__marker" data-color={color} aria-hidden="true" />
      <span className="ds-chart-legend-item__label">{children}</span>
    </span>
  );
});
