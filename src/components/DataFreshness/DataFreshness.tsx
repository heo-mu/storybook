import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Badge } from '../Badge';
import type { BadgeStatus } from '../Badge';
import type { DataFreshnessState } from './DataFreshness.options';

export type DataFreshnessProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 상태 — 최근 수신(`fresh`, 성공 배지) · 수신 지연(`stale`, 경고 배지) · 연결 끊김(`offline`, 회색 배지). @default 'fresh' */
  state?: DataFreshnessState;
  /** 배지 글자. @default '최근 수신' · '수신 지연' · '연결 끊김' */
  label?: ReactNode;
  /** 마지막으로 데이터를 받은 시각. */
  timestamp: ReactNode;
  /** `timestamp`의 표준 형식 시각. 넘기면 `<time>` 요소로 표시합니다. */
  dateTime?: string;
  /** 갱신 주기. "·" 뒤에 표시합니다(예: "자동 갱신 1분"). */
  interval?: ReactNode;
};

const STATUS: Record<DataFreshnessState, BadgeStatus> = { fresh: 'success', stale: 'warning', offline: 'gray' };
const LABELS: Record<DataFreshnessState, string> = { fresh: '최근 수신', stale: '수신 지연', offline: '연결 끊김' };

/**
 * 데이터가 얼마나 최신인지 상태 배지, 마지막 수신 시각, 갱신 주기로 보여 줍니다.
 */
export const DataFreshness = forwardRef<HTMLDivElement, DataFreshnessProps>(function DataFreshness(
  { state = 'fresh', label = LABELS[state], timestamp, dateTime, interval, className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('ds-data-freshness', className)} data-state={state}>
      <Badge status={STATUS[state]} appearance="outline" size="sm" shape="rounded">
        {label}
      </Badge>
      <span className="ds-data-freshness__meta">
        {dateTime ? (
          <time className="ds-data-freshness__time" dateTime={dateTime}>
            {timestamp}
          </time>
        ) : (
          <span className="ds-data-freshness__time">{timestamp}</span>
        )}
        {interval != null && interval !== false && (
          <>
            <span className="ds-data-freshness__interval" aria-hidden="true">
              ·
            </span>
            <span className="ds-data-freshness__interval">{interval}</span>
          </>
        )}
      </span>
    </div>
  );
});
