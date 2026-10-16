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
  Text,
  type Key,
  type MenuItemProps,
  type Placement,
} from 'react-aria-components';
import { CaretRightIcon } from '../../icons';
import { cx } from '../../utils/cx';

export type DropdownMenuProps = {
  /**
   * The element that opens the menu: a react-aria Button / FilterChip, or any element that forwards its ref and
   * props (e.g. the design-system `Button`).
   */
  trigger: ReactElement<DOMAttributes<HTMLElement>, string> | ReactElement;
  /** Accessible name of the menu. */
  'aria-label'?: string;
  /** `DropdownMenuItem`, `DropdownMenuSection` and `DropdownMenuSeparator` elements. */
  children: ReactNode;
  /** Called with the id of the activated item. */
  onAction?: (key: Key) => void;
  /** Open state (controlled). */
  open?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Position relative to the trigger. @default 'bottom start' */
  placement?: Placement;
  /** Gap between the trigger and the panel in px (4 as Select / Date Picker; the Figma breadcrumb menu uses 2). @default 4 */
  offset?: number;
  /** Item ids that cannot be activated (Figma State "Disabled"). */
  disabledKeys?: Iterable<Key>;
  className?: string;
};

/**
 * Dropdown menu built from the Figma `dropdownmenu_item` (179:4819) and `dropdownmenu_line` (179:5082)
 * components and the menu panel of the Figma examples (Menu Container): padding p-1, 1px border,
 * border-radius/rounded, effect elevation-3. Keyboard, focus and ARIA (menu / menuitem) come from
 * react-aria-components; Escape closes and focus returns to the trigger.
 */
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
  /** Figma "Item" (label). */
  children: ReactNode;
  /** Figma "Sub" text under the label ("Sub Text" on). */
  description?: ReactNode;
  /** Figma "Left Icon". */
  icon?: ReactNode;
  /** Figma "Right Icon" — the caret, for items that open a submenu or a next step. @default false */
  chevron?: boolean;
  /** Figma State "Alert": a destructive action (danger colours). */
  danger?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  className?: string;
};

/** Figma `dropdownmenu_item` Type Content. State: Hover = pointer hover or keyboard focus, Alert = `danger`, Disabled = `disabled`. */
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
      <span className="ds-dropdown__text">
        <Text slot="label" className="ds-dropdown__label">
          {children}
        </Text>
        {description != null && description !== false && (
          <Text slot="description" className="ds-dropdown__description">
            {description}
          </Text>
        )}
      </span>
      {chevron && <CaretRightIcon className="ds-dropdown__chevron" />}
    </MenuItem>
  );
}

export type DropdownMenuSectionProps = {
  /** Figma `dropdownmenu_item` Type Title (group title). */
  title?: ReactNode;
  /** Items of the group. */
  children: ReactNode;
  /** Section id. */
  id?: Key;
  /** Accessible name when there is no visible title. */
  'aria-label'?: string;
};

/** A group of items with an optional title (Figma Type Title). */
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

/** Figma `dropdownmenu_line`: divider between groups. */
export function DropdownMenuSeparator() {
  return <Separator className="ds-dropdown__separator" />;
}
