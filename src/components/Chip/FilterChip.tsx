import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChipSize } from './Chip.options';

export type FilterChipProps = Omit<ButtonProps, 'children' | 'className' | 'isDisabled'> & {
  /** Figma "Size". @default 'xs' */
  size?: ChipSize;
  /** Figma "Label Text" — the filter name or its current value. */
  children: ReactNode;
  /** Figma Variant "Selected": the filter has a value applied. */
  selected?: boolean;
  /**
   * Figma "Expanded": its menu or panel is open (caret up, `aria-expanded`). Inside a react-aria trigger
   * (e.g. `MenuTrigger`, `DialogTrigger`) this is set automatically.
   */
  expanded?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  className?: string;
};

/**
 * Figma component set `chip-filter` (558:25704) — a chip that opens a filter menu or panel.
 * State Hover / Pressed are :hover / pressed, Disabled = `disabled`. Built on the react-aria `Button`, so it
 * can be the trigger of react-aria overlays; `onPress` (or `onClick`) handles activation.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { size = 'xs', children, selected = false, expanded, disabled, className, ...rest },
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      className={cx('ds-chip', className)}
      data-kind="filter"
      data-size={size}
      data-selected={selected || undefined}
      {...(expanded !== undefined && { 'aria-expanded': expanded })}
      isDisabled={disabled}
    >
      <span className="ds-chip__label">{children}</span>
      <CaretDownIcon className="ds-chip__icon ds-chip__caret-down" />
      <CaretUpIcon className="ds-chip__icon ds-chip__caret-up" />
    </Button>
  );
});
