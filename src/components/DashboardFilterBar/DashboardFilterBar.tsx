import { Children, forwardRef, Fragment, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type DashboardFilterBarProps = ComponentPropsWithoutRef<'div'> & {
  /** 조건 묶음(`DashboardFilterGroup`). 묶음 사이에 구분선이 들어갑니다. */
  children: ReactNode;
  /** 오른쪽 끝 버튼(예: 초기화 아이콘 버튼과 "조회"). */
  actions?: ReactNode;
  /** 화면 낭독기가 읽는 검색 영역 이름. @default '조회 조건' */
  'aria-label'?: string;
};

/** 대시보드의 조회 조건과 실행 버튼을 한곳에 배치합니다. 조건을 그룹으로 구성할 수 있습니다. */
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
  /** 묶음 라벨(예: "조회 대상", "조회 기간"). 화면 낭독기도 이 라벨을 묶음 이름으로 읽습니다. */
  label?: ReactNode;
  /** 컨트롤(Select · FilterChip · SegmentedControl · DatePicker 등). 컨트롤마다 `aria-label`을 붙입니다. */
  children: ReactNode;
};

/** `DashboardFilterBar` 안의 라벨이 붙은 컨트롤 묶음입니다. */
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
  /** 시작 컨트롤(예: `aria-label="시작일"`인 DatePicker). */
  from: ReactNode;
  /** 끝 컨트롤. */
  to: ReactNode;
};

/** 두 컨트롤을 "~"로 이어 기간을 나타냅니다. */
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
