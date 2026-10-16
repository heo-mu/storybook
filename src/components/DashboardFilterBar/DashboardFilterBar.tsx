import { Children, forwardRef, Fragment, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type DashboardFilterBarProps = ComponentPropsWithoutRef<'div'> & {
  /** `DashboardFilterGroup`s; a "|" divider is drawn between them. */
  children: ReactNode;
  /** Buttons at the right end (Figma: reset icon button and "조회"). */
  actions?: ReactNode;
  /** Name of the search landmark. @default '조회 조건' */
  'aria-label'?: string;
};

/**
 * Figma component `dashboard-filter-bar` (698:4163): the query conditions of a dashboard — filter groups m-6 apart
 * with "|" dividers, and actions p-3 apart at the right, m-4 from the filters, in a white card (padding 16,
 * radius 12, elevation-3 shadow). A `search` landmark.
 */
export const DashboardFilterBar = forwardRef<HTMLDivElement, DashboardFilterBarProps>(function DashboardFilterBar(
  { children, actions, className, 'aria-label': ariaLabel = '조회 조건', ...rest },
  ref,
) {
  const groups = Children.toArray(children);
  return (
    <div role="search" aria-label={ariaLabel} {...rest} ref={ref} className={cx('ds-filter-bar', className)}>
      <div className="ds-filter-bar__filters">
        {groups.map((group, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span className="ds-filter-bar__divider" aria-hidden="true">
                |
              </span>
            )}
            {group}
          </Fragment>
        ))}
      </div>
      {actions != null && actions !== false && <div className="ds-filter-bar__actions">{actions}</div>}
    </div>
  );
});

export type DashboardFilterGroupProps = ComponentPropsWithoutRef<'div'> & {
  /** Figma group label ("조회 대상", "조회 기간" …, sm/leading-normal/medium, text/tertiary); names the group. */
  label?: ReactNode;
  /** The controls (Select, FilterChip, SegmentedControl, DatePicker …), p-2 apart. Give each an `aria-label`. */
  children: ReactNode;
};

/** A labelled group of controls in a `DashboardFilterBar` (`role="group"`, named by its label). */
export const DashboardFilterGroup = forwardRef<HTMLDivElement, DashboardFilterGroupProps>(function DashboardFilterGroup(
  { label, children, className, ...rest },
  ref,
) {
  const labelId = useId();
  const hasLabel = label != null && label !== false;
  return (
    <div role="group" aria-labelledby={hasLabel ? labelId : undefined} {...rest} ref={ref} className={cx('ds-filter-bar__group', className)}>
      {hasLabel && (
        <span id={labelId} className="ds-filter-bar__label">
          {label}
        </span>
      )}
      {children}
    </div>
  );
});

export type DashboardFilterRangeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Start control (e.g. a DatePicker with `aria-label="시작일"`). */
  from: ReactNode;
  /** End control. */
  to: ReactNode;
};

/** Two controls joined by "~" (text/tertiary), m-2 apart — the Figma date range. */
export const DashboardFilterRange = forwardRef<HTMLDivElement, DashboardFilterRangeProps>(function DashboardFilterRange(
  { from, to, className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('ds-filter-bar__range', className)}>
      {from}
      <span className="ds-filter-bar__range-separator" aria-hidden="true">
        ~
      </span>
      {to}
    </div>
  );
});
