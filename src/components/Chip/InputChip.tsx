import { forwardRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react';
import { XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChipSize } from './Chip.options';

export type InputChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  /** Figma "Size". @default 'xs' */
  size?: ChipSize;
  /** Figma "Label Text" — an entered value. */
  children: ReactNode;
  /** Called when the chip is activated (click, Enter, Space) or Delete / Backspace is pressed on it. */
  onRemove?: () => void;
  /** Text appended to the label for screen readers. @default '삭제' */
  removeLabel?: string;
};

/**
 * Figma component set `chip-input` (558:26017) — an entered value that can be removed (X icon).
 * The whole chip is the remove button, so the target is the full chip height. State Hover / Pressed are
 * :hover / :active, Disabled = `disabled`.
 */
export const InputChip = forwardRef<HTMLButtonElement, InputChipProps>(function InputChip(
  { size = 'xs', children, onRemove, removeLabel = '삭제', onClick, onKeyDown, className, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-chip', className)}
      data-kind="input"
      data-size={size}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onRemove?.();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.key === 'Delete' || event.key === 'Backspace')) {
          event.preventDefault();
          onRemove?.();
        }
      }}
    >
      <span className="ds-chip__label">{children}</span>
      <span className="ds-chip__sr"> {removeLabel}</span>
      <XIcon className="ds-chip__icon" />
    </button>
  );
});
