import { forwardRef, useId, useRef, type ComponentPropsWithoutRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { MagnifyingGlassIcon, XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { setNativeValue, useFieldValue, useMergedRef, type FieldSize } from '../Field';

import type { SearchFieldAppearance } from './SearchField.options';

export type SearchFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style'> & {
  /** Figma "Size". @default 'sm' */
  size?: FieldSize;
  /** Figma "Type" (Outline / Solid). @default 'outline' */
  appearance?: SearchFieldAppearance;
  /** Figma "Label" + "Label Text". Without a label, pass `aria-label`. */
  label?: ReactNode;
  /** Figma State "Error". */
  invalid?: boolean;
  /** Called with the current value when Enter is pressed. */
  onSearch?: (value: string) => void;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element. */
  style?: CSSProperties;
};

/**
 * Figma component set `search-field` (216:6570).
 * State: Hover / Focus = :hover / :focus-within, Completed = has a value, Error = `invalid`,
 * Disabled = `disabled`. The clear (X) button appears in Focus and Error as in Figma.
 * Native input props and the ref go to the `<input type="search">`.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { size = 'sm', appearance = 'outline', label, invalid = false, onSearch, onClear, className, style, id, value, defaultValue, onChange, onKeyDown, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-search`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const { current, filled, handleChange } = useFieldValue(value, defaultValue, onChange);

  const clear = () => {
    const input = inputRef.current;
    if (!input) return;
    setNativeValue(input, '');
    input.focus();
    onClear?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') onSearch?.(current);
  };

  return (
    <div
      className={cx('ds-field', 'ds-search-field', className)}
      style={style}
      data-size={size}
      data-appearance={appearance}
      data-filled={filled || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      {label != null && label !== false && (
        <label className="ds-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ds-field__control">
        <span className="ds-field__icon ds-search-field__icon" aria-hidden="true">
          <MagnifyingGlassIcon />
        </span>
        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          type="search"
          className="ds-field__input"
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={invalid || undefined}
        />
        {!disabled && (
          <button type="button" className="ds-field__action ds-search-field__clear" aria-label="검색어 지우기" tabIndex={-1} onClick={clear}>
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
});
