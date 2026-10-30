import type { DOMAttributes, ReactElement, ReactNode } from 'react';
import {
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Pressable,
  Separator,
  SubmenuTrigger,
  type Key,
  type MenuItemProps,
  type Placement,
} from 'react-aria-components';
import { CaretRightIcon } from '../../icons';
import { cx } from '../../utils/cx';

export type DropdownMenuProps = {
  /**
   * 메뉴를 여는 요소. `Button`이나 `FilterChip`처럼 ref와 props를 그대로 전달하는 요소를 넘깁니다.
   */
  trigger: ReactElement<DOMAttributes<HTMLElement>, string> | ReactElement;
  /** 화면 낭독기가 읽는 메뉴 이름. */
  'aria-label'?: string;
  /** `DropdownMenuItem` · `DropdownMenuSection` · `DropdownMenuSeparator`들. */
  children: ReactNode;
  /** 항목을 고르면 그 항목의 `id`로 호출됩니다. */
  onAction?: (key: Key) => void;
  /** 메뉴가 열렸는지 여부. 넘기면 바깥에서 관리합니다. */
  open?: boolean;
  /** 메뉴가 열리거나 닫히면 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 트리거를 기준으로 한 메뉴 위치. @default 'bottom start' */
  placement?: Placement;
  /** 트리거와 메뉴 사이 간격(px). @default 4 */
  offset?: number;
  /** 고를 수 없는 항목의 `id` 목록(비활성). */
  disabledKeys?: Iterable<Key>;
  className?: string;
};

/** 버튼을 누르면 관련 동작 목록이 열립니다. 이동·복제·삭제처럼 같은 대상에 적용할 작업을 모아 제공합니다. */
export function DropdownMenu({
  trigger,
  children,
  open,
  onOpenChange,
  placement = 'bottom start',
  offset = 4,
  className,
  ...menuProps
}: DropdownMenuProps) {
  return (
    <MenuTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Pressable>{trigger as ReactElement<DOMAttributes<HTMLElement>, string>}</Pressable>
      <Popover className="ds-dropdown__popover" placement={placement} offset={offset}>
        <Menu {...menuProps} className={cx('ds-dropdown', className)}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export type DropdownMenuItemProps = Omit<MenuItemProps, 'className' | 'children' | 'isDisabled'> & {
  /** 항목 이름. */
  children: ReactNode;
  /** 이름 아래 설명. */
  description?: ReactNode;
  /** 이름 앞 아이콘. */
  icon?: ReactNode;
  /** 오른쪽 화살표 — 다른 화면으로 이동하는 항목이라는 표시입니다. @default false */
  chevron?: boolean;
  /** 삭제처럼 위험한 작업 — 경고 색으로 보입니다. */
  danger?: boolean;
  /** 비활성 — 고를 수 없고, 방향키로 옮길 때도 건너뜁니다. */
  disabled?: boolean;
  className?: string;
};

/** 메뉴 항목 하나입니다. 마우스를 올리거나 키보드 포커스를 받으면 같은 모양으로 바뀝니다. */
export function DropdownMenuItem({ children, description, icon, chevron = false, danger = false, disabled, className, textValue, ...rest }: DropdownMenuItemProps) {
  return (
    <MenuItem
      {...rest}
      isDisabled={disabled}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={cx('ds-dropdown__item', className)}
      data-danger={danger || undefined}
    >
      {icon && (
        <span className="ds-dropdown__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {/* Plain text, no label / description slots: the item is named by all of its visible text (label, then
          description), so the name holds what is shown (WCAG 2.5.3 Label in Name). */}
      <span className="ds-dropdown__text">
        <span className="ds-dropdown__label">{children}</span>
        {description != null && description !== false && <span className="ds-dropdown__description">{description}</span>}
      </span>
      {chevron && <CaretRightIcon className="ds-dropdown__chevron" />}
    </MenuItem>
  );
}

export type DropdownMenuSectionProps = {
  /** 묶음 제목. */
  title?: ReactNode;
  /** 묶음 안의 항목들. */
  children: ReactNode;
  /** 묶음 `id`. */
  id?: Key;
  /** 보이는 제목이 없을 때 화면 낭독기가 읽는 묶음 이름. */
  'aria-label'?: string;
};

/** 메뉴 항목 묶음입니다. 위에 제목을 붙일 수 있습니다. */
export function DropdownMenuSection({ title, children, id, 'aria-label': ariaLabel }: DropdownMenuSectionProps) {
  return (
    <MenuSection id={id} aria-label={ariaLabel} className="ds-dropdown__section">
      {title != null && title !== false && (
        <Header className="ds-dropdown__title">
          <span className="ds-dropdown__title-text">{title}</span>
        </Header>
      )}
      {children}
    </MenuSection>
  );
}

/** 메뉴 항목 묶음 사이의 구분선입니다. */
export function DropdownMenuSeparator() {
  return <Separator className="ds-dropdown__separator" />;
}

export type DropdownMenuSubProps = {
  /** 하위 메뉴를 여는 항목의 이름. */
  label: ReactNode;
  /** 이름 앞 아이콘. */
  icon?: ReactNode;
  /** 항목 `id`. */
  id?: Key;
  /** 글자로 찾을 때 쓰는 이름. `label`이 글자가 아니면 넘깁니다. */
  textValue?: string;
  /** 비활성 — 하위 메뉴를 열 수 없습니다. */
  disabled?: boolean;
  /** 화면 낭독기가 읽는 하위 메뉴 이름. @default label 글자 */
  'aria-label'?: string;
  /** 하위 메뉴 항목을 고르면 그 항목의 `id`로 호출됩니다. */
  onAction?: (key: Key) => void;
  /** 하위 메뉴의 `DropdownMenuItem` · `DropdownMenuSeparator`들. Figma `dropdown-menu-sub`처럼 글자만 있는 항목을 씁니다. */
  children: ReactNode;
};

/**
 * 메뉴 안의 하위 메뉴(2단계)입니다. 항목에 마우스를 올리거나 → · Enter · Space를 누르면 옆에 열리고, ← · Esc로 닫힙니다.
 * Figma `dropdown-menu-sub`(140px, 글자만 있는 항목)의 모양입니다.
 */
export function DropdownMenuSub({ label, icon, id, textValue, disabled, 'aria-label': ariaLabel, onAction, children }: DropdownMenuSubProps) {
  const name = textValue ?? (typeof label === 'string' ? label : undefined);
  return (
    <SubmenuTrigger>
      <DropdownMenuItem id={id} icon={icon} chevron disabled={disabled} textValue={name}>
        {label}
      </DropdownMenuItem>
      {/* Figma "dropdown-menu 사용 예시" (217:6478): the sub panel starts right at the trigger item's edge — over the parent
          panel's p-1 padding, no gap — and its top is level with the item's top (offset 0 · crossOffset 0; react-aria's
          Popover would otherwise add its default 8px). Placed from the item, so it flips to the start side and shifts into the
          viewport when there is no room (react-aria shouldFlip · containerPadding). Rules 09 gives the dropdown no
          animation: it opens and closes at once like the parent menu. */}
      <Popover className="ds-dropdown__popover" placement="end top" offset={0} crossOffset={0}>
        <Menu aria-label={ariaLabel ?? name} onAction={onAction} className="ds-dropdown ds-dropdown--sub">
          {children}
        </Menu>
      </Popover>
    </SubmenuTrigger>
  );
}
