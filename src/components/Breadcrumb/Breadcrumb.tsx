import { forwardRef, type AnchorHTMLAttributes, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';
import type { Key } from 'react-aria-components';
import { CaretRightIcon, DotsThreeIcon, HouseIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection } from '../DropdownMenu';
import type { BreadcrumbLayout, BreadcrumbSize } from './Breadcrumb.options';

export type BreadcrumbItemProps = Omit<AnchorHTMLAttributes<HTMLElement>, 'children'> & {
  /** Figma "Label Text" ("Show Label" on). Without it the item is icon-only and needs `aria-label`. */
  children?: ReactNode;
  /** Figma "Show Icon" + icon instance (House for home, DotsThree for the overflow trigger). */
  icon?: ReactNode;
  /** Figma "Size". @default 'md' */
  size?: BreadcrumbSize;
  /** Figma Role "Current": the current page — rendered as text with `aria-current="page"`. */
  current?: boolean;
  /** Figma Role "Open": the item whose menu is open (brand label). */
  open?: boolean;
};

/**
 * Figma component set `breadcrumb-item` (710:4794). Role Link = `href` (an `<a>`; without `href` a `<button>`),
 * Current = `current`, Open = `open`. State Hover / Pressed = :hover / :active.
 * @internal Rendered by `Breadcrumb` — use that (docs/public-api.md).
 */
export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, icon, size = 'md', current = false, open = false, href, className, ...rest },
  ref,
) {
  const content = (
    <>
      {icon && (
        <span className="ds-breadcrumb-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children != null && children !== false && <span className="ds-breadcrumb-item__label">{children}</span>}
    </>
  );
  const shared = {
    className: cx('ds-breadcrumb-item', className),
    'data-size': size,
    'data-current': current || undefined,
    'data-open': open || undefined,
  };
  if (current) {
    return (
      <span {...rest} {...shared} ref={ref as Ref<HTMLSpanElement>} aria-current="page">
        {content}
      </span>
    );
  }
  if (href !== undefined) {
    return (
      <a {...rest} {...shared} ref={ref as Ref<HTMLAnchorElement>} href={href}>
        {content}
      </a>
    );
  }
  return (
    <button {...(rest as ComponentPropsWithoutRef<'button'>)} {...shared} ref={ref as Ref<HTMLButtonElement>} type="button">
      {content}
    </button>
  );
});

/**
 * Figma `breadcrumb-modern-separator` (710:4795): CaretRight 12px between items.
 * @internal Rendered by `Breadcrumb` — use that (docs/public-api.md).
 */
export function BreadcrumbSeparator() {
  return (
    <span className="ds-breadcrumb__separator" aria-hidden="true">
      <CaretRightIcon />
    </span>
  );
}

export type BreadcrumbEntry = {
  /** Key passed to `onAction`. @default the index in `items` */
  id?: Key;
  /** Page name. */
  label: string;
  /** Link to the page. Without it the item is a button that calls `onAction`. */
  href?: string;
};

export type BreadcrumbProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  /** Pages from the top level down to the parent of the current page (Figma ancestors · parent). */
  items: BreadcrumbEntry[];
  /** Current page name (Figma Role "Current"). */
  current: ReactNode;
  /** Link of the home item (Figma "Home": House icon). @default '/' */
  homeHref?: string;
  /** Accessible name of the home item. @default '홈' */
  homeLabel?: string;
  /** Figma "Size". @default 'md' */
  size?: BreadcrumbSize;
  /**
   * Figma "Layout". `collapsed` keeps home, the parent and the current page and moves the other ancestors into a
   * menu behind the overflow trigger (DotsThree). @default 'full'
   */
  layout?: BreadcrumbLayout;
  /** Figma "Show Parent": in the collapsed layout keep the parent page next to the current page. @default true */
  showParent?: boolean;
  /** Figma "Expanded": overflow menu open (controlled). */
  expanded?: boolean;
  /** Initial overflow menu state (uncontrolled). @default false */
  defaultExpanded?: boolean;
  /** Called when the overflow menu opens or closes. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Called with the entry's `id` when an entry without `href` is chosen (in the trail or the menu). */
  onAction?: (id: Key) => void;
  /** Accessible name of the overflow trigger (Figma Label Text). @default '중간 경로 보기' */
  moreLabel?: string;
  /** Title of the overflow menu (Figma dropdownmenu_item Type Title). @default '상위 경로' */
  menuTitle?: string;
};

/**
 * Figma component set `breadcrumb` (712:5106): `<nav>` > `<ol>` of breadcrumb-item + separator groups.
 * Collapsed layout: home · overflow trigger (menu of the hidden ancestors) · parent · current page.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    current,
    homeHref = '/',
    homeLabel = '홈',
    size = 'md',
    layout = 'full',
    showParent = true,
    expanded,
    defaultExpanded = false,
    onExpandedChange,
    onAction,
    moreLabel = '중간 경로 보기',
    menuTitle = '상위 경로',
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [isExpanded, setExpanded] = useControllableState(expanded, defaultExpanded, onExpandedChange);
  const keyed = items.map((entry, index) => ({ ...entry, id: entry.id ?? index }));
  const visibleCount = layout === 'collapsed' ? (showParent ? 1 : 0) : keyed.length;
  const hidden = keyed.slice(0, Math.max(0, keyed.length - visibleCount));
  const visible = keyed.slice(hidden.length);

  return (
    <nav {...rest} ref={ref} className={cx('ds-breadcrumb', className)} data-size={size} aria-label={ariaLabel ?? '이동 경로'}>
      <ol className="ds-breadcrumb__list">
        <li className="ds-breadcrumb__group">
          <BreadcrumbItem href={homeHref} size={size} icon={<HouseIcon />} aria-label={homeLabel} data-home="" />
          <BreadcrumbSeparator />
        </li>
        {hidden.length > 0 && (
          <li className="ds-breadcrumb__group">
            <DropdownMenu
              trigger={<BreadcrumbItem size={size} icon={<DotsThreeIcon />} aria-label={moreLabel} />}
              open={isExpanded}
              onOpenChange={setExpanded}
              offset={2}
              className="ds-breadcrumb__menu"
              onAction={(key) => onAction?.(key)}
            >
              <DropdownMenuSection title={menuTitle}>
                {hidden.map((entry) => (
                  <DropdownMenuItem key={entry.id} id={entry.id} href={entry.href}>
                    {entry.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSection>
            </DropdownMenu>
            <BreadcrumbSeparator />
          </li>
        )}
        {visible.map((entry) => (
          <li key={entry.id} className="ds-breadcrumb__group">
            <BreadcrumbItem size={size} href={entry.href} onClick={entry.href === undefined ? () => onAction?.(entry.id) : undefined}>
              {entry.label}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </li>
        ))}
        <li className="ds-breadcrumb__group">
          <BreadcrumbItem size={size} current>
            {current}
          </BreadcrumbItem>
        </li>
      </ol>
    </nav>
  );
});
