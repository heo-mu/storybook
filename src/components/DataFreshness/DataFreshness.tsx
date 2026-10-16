import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Badge } from '../Badge';
import type { BadgeStatus } from '../Badge';
import type { DataFreshnessState } from './DataFreshness.options';

export type DataFreshnessProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "State": Fresh (Success badge), Stale (Warning), Offline (Gray). @default 'fresh' */
  state?: DataFreshnessState;
  /** Badge text. @default '최근 수신' · '수신 지연' · '연결 끊김' */
  label?: ReactNode;
  /** Figma "Timestamp Text" — when the data was last received. */
  timestamp: ReactNode;
  /** Machine-readable `timestamp` (renders a `<time datetime>`). */
  dateTime?: string;
  /** Figma "Interval Text" — after a "·", e.g. "자동 갱신 1분". */
  interval?: ReactNode;
};

const STATUS: Record<DataFreshnessState, BadgeStatus> = { fresh: 'success', stale: 'warning', offline: 'gray' };
const LABELS: Record<DataFreshnessState, string> = { fresh: '최근 수신', stale: '수신 지연', offline: '연결 끊김' };

/**
 * Figma component set `data-freshness` (697:4543): how current the data is — a status badge (Outline · sm · Rounded,
 * with dot) and the last-received time with the refresh interval (xs/leading-normal/normal; time text/secondary,
 * "·" and interval text/tertiary, m-0_5 apart), p-2 after the badge.
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
