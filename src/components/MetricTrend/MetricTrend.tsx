import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { MinusIcon, TrendDownIcon, TrendUpIcon } from '../../icons';
import type { MetricTrendDirection, MetricTrendTone } from './MetricTrend.options';

export type MetricTrendProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** Figma "Change Text", e.g. "4.8%p". */
  children: ReactNode;
  /** Figma "Direction" — the icon (TrendUp · TrendDown · Minus); Disabled is greyed out. @default 'up' */
  direction?: MetricTrendDirection;
  /** Figma "Tone" — the colour: positive (text/brand), negative (status/danger/strong), neutral. @default 'positive' */
  tone?: MetricTrendTone;
  /**
   * Text read before the change for screen readers, since the direction is only an icon.
   * @default '증가' · '감소' · '변동 없음' (none for Disabled)
   */
  directionLabel?: string;
};

const ICONS = { up: TrendUpIcon, down: TrendDownIcon, flat: MinusIcon, disabled: MinusIcon };
const LABELS: Record<MetricTrendDirection, string | undefined> = { up: '증가', down: '감소', flat: '변동 없음', disabled: undefined };

/**
 * Figma component set `metric-trend` (697:4482): the change of a metric — a 12px direction icon and the change text
 * (xs/leading-normal/medium) on dashboard/background, p-1 padding and gap, rounded-sm.
 */
export const MetricTrend = forwardRef<HTMLSpanElement, MetricTrendProps>(function MetricTrend(
  { children, direction = 'up', tone = 'positive', directionLabel = LABELS[direction], className, ...rest },
  ref,
) {
  const Icon = ICONS[direction];
  return (
    <span {...rest} ref={ref} className={cx('ds-metric-trend', className)} data-direction={direction} data-tone={tone}>
      <Icon className="ds-metric-trend__icon" size={12} />
      {directionLabel && <span className="ds-metric-trend__sr">{directionLabel} </span>}
      <span className="ds-metric-trend__label">{children}</span>
    </span>
  );
});
