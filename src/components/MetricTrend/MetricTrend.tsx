import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { MinusIcon, TrendDownIcon, TrendUpIcon } from '../../icons';
import type { MetricTrendDirection, MetricTrendTone } from './MetricTrend.options';

export type MetricTrendProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** 증감 글자(예: "4.8%p"). */
  children: ReactNode;
  /** 방향 — 아이콘이 바뀝니다. `disabled`(비교할 값이 없음)는 회색으로 표시합니다. @default 'up' */
  direction?: MetricTrendDirection;
  /** 좋고 나쁨 — 색이 바뀝니다. 좋음(`positive`) · 나쁨(`negative`) · 중립(`neutral`). @default 'positive' */
  tone?: MetricTrendTone;
  /**
   * 방향이 아이콘으로만 보이므로 화면 낭독기가 증감 앞에 읽는 글자.
   * @default '증가' · '감소' · '변동 없음' (`disabled`는 없음)
   */
  directionLabel?: string;
};

const ICONS = { up: TrendUpIcon, down: TrendDownIcon, flat: MinusIcon, disabled: MinusIcon };
const LABELS: Record<MetricTrendDirection, string | undefined> = { up: '증가', down: '감소', flat: '변동 없음', disabled: undefined };

/**
 * 지표의 증감을 방향 아이콘과 함께 보여 줍니다. 방향은 `direction`, 그 변화가 좋은지 나쁜지는 `tone`으로 고릅니다.
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
