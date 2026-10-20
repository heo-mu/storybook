import { Children, forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';

export type NavigationProps = ComponentPropsWithoutRef<'nav'> & {
  /** 메뉴 위 영역(로고 등). */
  header?: ReactNode;
  /** `NavLink`와 `NavGroup`들. 각각 목록 항목으로 들어갑니다. */
  children: ReactNode;
};

/**
 * 화면 왼쪽에 두는 메뉴(LNB)의 틀입니다. 너비는 화면 배치에서 정하고, 메뉴 항목은 그 너비를 꽉 채웁니다.
 */
export const Navigation = forwardRef<HTMLElement, NavigationProps>(function Navigation({ header, children, className, ...rest }, ref) {
  return (
    <nav {...rest} ref={ref} className={cx('ds-nav', className)}>
      {header != null && header !== false && <div className="ds-nav__header">{header}</div>}
      <ul className="ds-nav__list">
        {Children.map(children, (child) => (child == null || child === false ? null : <li className="ds-nav__entry">{child}</li>))}
      </ul>
    </nav>
  );
});

type ItemBase = {
  /** 메뉴 이름. */
  children: ReactNode;
  /** 메뉴 이름 앞 아이콘. */
  icon?: ReactNode;
};

export type NavLinkProps = ComponentPropsWithoutRef<'a'> &
  ItemBase & {
    /** 선택됨 — 지금 페이지입니다. 화면 낭독기에 현재 페이지로 알려집니다. */
    selected?: boolean;
  };

/** 누르면 바로 페이지로 이동하는 첫 단계 메뉴입니다. 마우스를 올리면 모양이 바뀝니다. */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ children, icon, selected = false, className, ...rest }, ref) {
  return (
    <a {...rest} ref={ref} className={cx('ds-nav-item', className)} data-kind="link" data-selected={selected || undefined} aria-current={selected ? 'page' : undefined}>
      {icon && (
        <span className="ds-nav-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ds-nav-item__label">{children}</span>
    </a>
  );
});

export type NavParentItemProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  ItemBase & {
    /** 펼침 — 하위 메뉴가 열린 상태입니다. */
    expanded?: boolean;
  };

/**
 * 메뉴 그룹을 펼치고 접는 버튼입니다. `NavGroup`이 안에서 그립니다.
 * @internal Rendered by `NavGroup` — use that (docs/public-api.md).
 */
export const NavParentItem = forwardRef<HTMLButtonElement, NavParentItemProps>(function NavParentItem(
  { children, icon, expanded = false, className, ...rest },
  ref,
) {
  const Caret = expanded ? CaretUpIcon : CaretDownIcon;
  return (
    <button {...rest} ref={ref} type="button" className={cx('ds-nav-item', className)} data-kind="parent" data-expanded={expanded || undefined} aria-expanded={expanded}>
      {icon && (
        <span className="ds-nav-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ds-nav-item__label">{children}</span>
      <Caret className="ds-nav-item__caret" />
    </button>
  );
});

export type NavGroupProps = ItemBase & {
  /** 그룹 이름. */
  label: ReactNode;
  /** 펼쳤을 때 보이는 `NavChild`들. */
  children?: ReactNode;
  /** 펼침 여부. 넘기면 바깥에서 관리합니다. */
  expanded?: boolean;
  /** 처음에 펼쳐 둘지 여부. `expanded` 없이 스스로 관리할 때 씁니다. @default false */
  defaultExpanded?: boolean;
  /** 그룹이 펼쳐지거나 접히면 호출됩니다. */
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

/**
 * 눌러서 펼치고 접는 메뉴 그룹입니다. 펼치면 하위 메뉴(`NavChild`)가 왼쪽 선과 함께 안쪽으로 들여 보입니다.
 */
export function NavGroup({ label, icon, children, expanded, defaultExpanded = false, onExpandedChange, className }: NavGroupProps) {
  const [isExpanded, setExpanded] = useControllableState(expanded, defaultExpanded, onExpandedChange);
  const listId = useId();
  const items = Children.toArray(children);
  return (
    <div className={cx('ds-nav__group', className)}>
      <NavParentItem icon={icon} expanded={isExpanded} aria-controls={items.length ? listId : undefined} onClick={() => setExpanded(!isExpanded)}>
        {label}
      </NavParentItem>
      {items.length > 0 && (
        <div className="ds-nav__children" hidden={!isExpanded}>
          <svg className="ds-nav__line" aria-hidden="true" focusable="false">
            <rect />
          </svg>
          <ul id={listId} className="ds-nav__children-list">
            {items.map((child, index) => (
              <li key={index} className="ds-nav__entry">
                {child}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export type NavChildProps = ComponentPropsWithoutRef<'a'> & {
  /** 메뉴 이름. */
  children: ReactNode;
  /** 선택됨 — 지금 페이지입니다. 화면 낭독기에 현재 페이지로 알려집니다. */
  selected?: boolean;
};

/** `NavGroup` 안의 하위 메뉴 링크입니다. 마우스를 올리면 모양이 바뀝니다. */
export const NavChild = forwardRef<HTMLAnchorElement, NavChildProps>(function NavChild({ children, selected = false, className, ...rest }, ref) {
  return (
    <a {...rest} ref={ref} className={cx('ds-nav-child', className)} data-selected={selected || undefined} aria-current={selected ? 'page' : undefined}>
      <span className="ds-nav-child__label">{children}</span>
    </a>
  );
});
