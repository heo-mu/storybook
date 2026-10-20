import { forwardRef, type AnchorHTMLAttributes, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';
import type { Key } from 'react-aria-components';
import { CaretRightIcon, DotsThreeIcon, HouseIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection } from '../DropdownMenu';
import type { BreadcrumbLayout, BreadcrumbSize } from './Breadcrumb.options';

export type BreadcrumbItemProps = Omit<AnchorHTMLAttributes<HTMLElement>, 'children'> & {
  /** 항목 글자. 없으면 아이콘만 보이므로 `aria-label`을 붙입니다. */
  children?: ReactNode;
  /** 글자 앞 아이콘(홈 아이콘, … 아이콘 등). */
  icon?: ReactNode;
  /** 크기. @default 'md' */
  size?: BreadcrumbSize;
  /** 현재 페이지 — 링크가 아닌 글자로 보이고, 화면 낭독기에 현재 페이지로 알려집니다. */
  current?: boolean;
  /** 메뉴가 열린 항목 — 강조된 글자로 보입니다. */
  open?: boolean;
};

/**
 * 경로의 한 단계입니다. `href`가 있으면 링크, 없으면 버튼이 됩니다. `Breadcrumb`이 안에서 그립니다.
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
 * 경로 단계 사이의 오른쪽 화살표입니다. `Breadcrumb`이 안에서 그립니다.
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
  /** `onAction`에 넘겨지는 값. @default `items`에서의 순서(0부터) */
  id?: Key;
  /** 페이지 이름. */
  label: string;
  /** 페이지 주소. 없으면 버튼이 되고, 누르면 `onAction`이 호출됩니다. */
  href?: string;
};

export type BreadcrumbProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  /** 맨 위 단계부터 현재 페이지의 바로 위 페이지까지의 경로. */
  items: BreadcrumbEntry[];
  /** 현재 페이지 이름. */
  current: ReactNode;
  /** 홈 아이콘의 링크 주소. @default '/' */
  homeHref?: string;
  /** 화면 낭독기가 읽는 홈 이름. @default '홈' */
  homeLabel?: string;
  /** 크기. @default 'md' */
  size?: BreadcrumbSize;
  /**
   * 배치. `collapsed`는 홈 · 상위 페이지 · 현재 페이지만 보여 주고 나머지 경로를 … 메뉴에 넣습니다. @default 'full'
   */
  layout?: BreadcrumbLayout;
  /** `collapsed`에서 상위 페이지를 현재 페이지 옆에 보여 줄지 여부. @default true */
  showParent?: boolean;
  /** … 메뉴가 열렸는지 여부. 넘기면 바깥에서 관리합니다. */
  expanded?: boolean;
  /** 처음에 … 메뉴를 열어 둘지 여부. `expanded` 없이 스스로 관리할 때 씁니다. @default false */
  defaultExpanded?: boolean;
  /** … 메뉴가 열리거나 닫히면 호출됩니다. */
  onExpandedChange?: (expanded: boolean) => void;
  /** `href`가 없는 경로를 누르면(경로나 … 메뉴에서) 그 경로의 `id`로 호출됩니다. */
  onAction?: (id: Key) => void;
  /** 화면 낭독기가 읽는 … 버튼 이름. @default '중간 경로 보기' */
  moreLabel?: string;
  /** … 메뉴의 제목. @default '상위 경로' */
  menuTitle?: string;
};

/** 홈에서 현재 페이지까지의 계층 경로를 표시하고 상위 페이지로 이동할 수 있게 합니다. */
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
