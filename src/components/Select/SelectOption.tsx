import type { CSSProperties, ReactNode } from 'react';
import { ListBoxItem, type ListBoxItemProps } from 'react-aria-components';
import { CheckIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useSelectSize } from './SelectContext';

export type SelectOptionProps<T extends object = object> = Omit<ListBoxItemProps<T>, 'className' | 'style' | 'children' | 'isDisabled'> & {
  /** Figma "Option Text". */
  children: ReactNode;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Figma "Check Icon": the check after the text of the selected option. Off: the semibold brand text alone marks it. @default true */
  checkIcon?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Figma component set `option` (97:2286) — one choice of a `Select`; `id` identifies it in the Select value.
 * State: Hover / Pressed = pointer hover / press (keyboard focus uses the Hover look), Selected = the Select
 * value (semibold brand text + check icon), Disabled = `disabled`.
 */
export function SelectOption<T extends object = object>({ children, disabled, checkIcon = true, className, style, textValue, ...rest }: SelectOptionProps<T>) {
  const size = useSelectSize();
  return (
    <ListBoxItem
      {...rest}
      isDisabled={disabled}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={cx('ds-option', className)}
      style={style}
      data-size={size}
    >
      {({ isSelected }) => (
        <>
          <span className="ds-option__text">{children}</span>
          {isSelected && checkIcon && (
            <span className="ds-option__check" aria-hidden="true">
              <CheckIcon />
            </span>
          )}
        </>
      )}
    </ListBoxItem>
  );
}
