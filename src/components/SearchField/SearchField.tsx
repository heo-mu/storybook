import { forwardRef, useId, useRef, type ComponentPropsWithoutRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { MagnifyingGlassIcon, XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { setNativeValue, useFieldValue, useMergedRef, type FieldSize } from '../Field';

import type { SearchFieldAppearance } from './SearchField.options';

export type SearchFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style'> & {
  /** 크기. @default 'sm' */
  size?: FieldSize;
  /** 모양 — 테두리(outline) · 채움(solid). @default 'outline' */
  appearance?: SearchFieldAppearance;
  /** 입력 칸 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 오류 — 오류 테두리로 표시합니다. */
  invalid?: boolean;
  /** Enter 키를 누르면 현재 검색어와 함께 호출됩니다. */
  onSearch?: (value: string) => void;
  /** 지우기 버튼으로 값을 비운 뒤 호출됩니다. */
  onClear?: () => void;
  /** 바깥 요소의 클래스 이름. */
  className?: string;
  /** 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * 검색어를 입력받는 입력 칸입니다. Enter 키를 누르면 `onSearch`가 호출되고, 키보드로 선택했거나 오류일 때
 * 지우기 버튼(X)이 나타납니다. 나머지 `<input>` 속성과 `ref`는 입력 칸에 그대로 전달됩니다.
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
