import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChartColor, ChartLegendType } from './Chart.options';

export type ChartLegendItemProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'> & {
  /** Figma "Label". */
  children: ReactNode;
  /** Figma "Type": a line, a dashed line (5 / 3) or a 12px square. @default 'bar' */
  type?: ChartLegendType;
  /** Series colour of the marker. @default '02' for `dash-line` (Figma: colors/chart/line/compare), otherwise 'brand' */
  color?: ChartColor;
};

/**
 * Figma component set `chart-legend-item` (697:4514): a series marker and its label, m-1_5 apart
 * (label xs/leading-normal/normal, colors/chart/legend/label/default; marker colors/chart/bar/* for `bar`, colors/chart/line/*
 * for the lines). `Chart` renders its own legend; use this for custom legends.
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
