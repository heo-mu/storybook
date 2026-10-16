import { forwardRef, useId, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { EyeIcon, XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { FieldMessage, setNativeValue, useFieldValue, useMergedRef, type FieldMessageType, type FieldSize } from '../Field';

export type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'className' | 'style'> & {
  /** Figma "Size". @default 'sm' */
  size?: FieldSize;
  /** Figma "Label" + "Label Text". */
  label?: ReactNode;
  /** Figma "Alert" + "Alert Text" (input_message). */
  message?: ReactNode;
  /** Figma input_message "Type". @default 'error' when invalid, otherwise 'info' */
  messageType?: FieldMessageType;
  /** Figma State "Error": red 2px border, `aria-invalid`. */
  invalid?: boolean;
  /** Clear button (Figma icon/X, shown on hover and focus). @default true */
  clearable?: boolean;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** For `type="password"`: show/hide toggle (Figma "Icon-eye"). @default true */
  revealable?: boolean;
  /** Initial visibility of a password value. @default false */
  defaultRevealed?: boolean;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element. */
  style?: CSSProperties;
};

/**
 * Figma component set `input` (76:2945) with `input_message` (83:3009).
 * State: Hover / Focus are the native :hover / :focus-within, Completed = the field has a value,
 * Error = `invalid`, Disabled = `disabled`, Read-only = `readOnly`.
 * Native input props (value, onChange, name, …) and the ref go to the `<input>`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'sm',
    label,
    message,
    messageType,
    invalid = false,
    clearable = true,
    onClear,
    revealable = true,
    defaultRevealed = false,
    className,
    style,
    id,
    type = 'text',
    value,
    defaultValue,
    onChange,
    disabled,
    readOnly,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const messageId = `${autoId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const { filled, handleChange } = useFieldValue(value, defaultValue, onChange);
  const [revealed, setRevealed] = useState(defaultRevealed);
  const isPassword = type === 'password';
  const hasMessage = message !== undefined && message !== null && message !== false;

  const clear = () => {
    const input = inputRef.current;
    if (!input) return;
    setNativeValue(input, '');
    input.focus();
    onClear?.();
  };

  return (
    <div
      className={cx('ds-field', 'ds-input', className)}
      style={style}
      data-size={size}
      data-filled={filled || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {label != null && label !== false && (
        <label className="ds-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ds-field__control">
        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          className="ds-field__input"
          type={isPassword && revealed ? 'text' : type}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={cx(describedBy, hasMessage && messageId) || undefined}
        />
        {isPassword && revealable && (
          <button
            type="button"
            className="ds-field__action ds-input__reveal"
            aria-label={revealed ? '비밀번호 숨기기' : '비밀번호 표시'}
            aria-pressed={revealed}
            aria-controls={inputId}
            disabled={disabled}
            onClick={() => setRevealed((r) => !r)}
          >
            <EyeIcon />
          </button>
        )}
        {clearable && !disabled && !readOnly && (
          <button type="button" className="ds-field__action ds-input__clear" aria-label="입력 내용 지우기" tabIndex={-1} onClick={clear}>
            <XIcon />
          </button>
        )}
      </div>
      {hasMessage && (
        <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'info')}>
          {message}
        </FieldMessage>
      )}
    </div>
  );
});
