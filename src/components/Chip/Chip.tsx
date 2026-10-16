import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { CheckIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChipSize } from './Chip.options';

export type ChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  /** Figma "Size". @default 'xs' */
  size?: ChipSize;
  /** Figma "Label Text". */
  children: ReactNode;
  /** Figma Variant "Selected" (controlled). */
  selected?: boolean;
  /** Initially selected (uncontrolled). @default false */
  defaultSelected?: boolean;
  /** Called with the new selection when the chip is toggled. */
  onSelectedChange?: (selected: boolean) => void;
};

/**
 * Figma component set `chip-multi` (201:12711) — a toggle chip for multi-select filters.
 * Variant Selected = `selected` (check icon after the label); State Hover / Pressed are :hover / :active,
 * Disabled = `disabled`. Renders `<button aria-pressed>`.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size = 'xs', children, selected, defaultSelected = false, onSelectedChange, onClick, className, ...rest },
  ref,
) {
  const [isSelected, setSelected] = useControllableState(selected, defaultSelected, onSelectedChange);
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-chip', className)}
      data-kind="toggle"
      data-size={size}
      aria-pressed={isSelected}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) setSelected(!isSelected);
      }}
    >
      <span className="ds-chip__label">{children}</span>
      {isSelected && <CheckIcon className="ds-chip__icon" />}
    </button>
  );
});
