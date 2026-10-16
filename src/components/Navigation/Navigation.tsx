import { Children, forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';

export type NavigationProps = ComponentPropsWithoutRef<'nav'> & {
  /** Area above the menu (the Figma example's logo area), m-4 above the items. */
  header?: ReactNode;
  /** `NavLink` and `NavGroup` elements; each is placed in a list item. */
  children: ReactNode;
};

/**
 * LNB container from the Figma Navigation example (180:2023): padding p-5, colors/navigation/lnb/background,
 * items m-1_5 apart. Width comes from the layout (240px in the Figma example).
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
  /** Figma "Menu Text". */
  children: ReactNode;
  /** Figma "Icon" (20px; the Figma placeholder is List). */
  icon?: ReactNode;
};

export type NavLinkProps = ComponentPropsWithoutRef<'a'> &
  ItemBase & {
    /** Figma Variant "Selected": the current page (`aria-current="page"`). */
    selected?: boolean;
  };

/** Figma component set `item_link` (180:6174): a top-level page link. State Hover = :hover. */
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
    /** Figma "Expanded". */
    expanded?: boolean;
  };

/** Figma component set `item_parent` (180:5246): the button of a menu group. State Hover = :hover. */
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
  /** Group label (Figma "Menu Text" of item_parent). */
  label: ReactNode;
  /** `NavChild` elements shown when expanded. */
  children?: ReactNode;
  /** Expanded (controlled). */
  expanded?: boolean;
  /** Initial state (uncontrolled). @default false */
  defaultExpanded?: boolean;
  /** Called when the group opens or closes. */
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

/**
 * Menu group: `item_parent` and, when expanded, its `item_child` list — indented p-4 with a 1px line
 * (…/child/selected/indicator/selected) and m-2_5 to the items, as in the Figma LNB example.
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
  /** Figma "Menu Text". */
  children: ReactNode;
  /** Figma Variant "Selected": the current page (`aria-current="page"`). */
  selected?: boolean;
};

/** Figma component set `item_child` (180:6249): a second-level page link. State Hover = :hover. */
export const NavChild = forwardRef<HTMLAnchorElement, NavChildProps>(function NavChild({ children, selected = false, className, ...rest }, ref) {
  return (
    <a {...rest} ref={ref} className={cx('ds-nav-child', className)} data-selected={selected || undefined} aria-current={selected ? 'page' : undefined}>
      <span className="ds-nav-child__label">{children}</span>
    </a>
  );
});
