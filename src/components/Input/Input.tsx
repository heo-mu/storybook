import { forwardRef, useId, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { EyeIcon, EyeSlashIcon, XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { FieldLabelRow, FieldMessage, setNativeValue, useFieldValue, useMergedRef, type FieldMessageType, type FieldSize } from '../Field';

export type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'className' | 'style' | 'required'> & {
  /** 크기. @default 'sm' */
  size?: FieldSize;
  /** 입력 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 꼭 입력해야 하는 칸 — 라벨 뒤에 점을 붙이고, 입력 필드에 `required`를 넘겨 화면 낭독기가 "필수"로 읽고 폼 제출 때 빈 값을 검사합니다. */
  required?: boolean;
  /** 입력 필드 아래에 보이는 도움말 메시지. */
  message?: ReactNode;
  /** 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. @default 오류이면 'error', 그 밖에는 'helper' */
  messageType?: FieldMessageType;
  /** 오류 — 빨간 테두리로 표시하고 화면 낭독기에도 오류 상태를 알립니다. */
  invalid?: boolean;
  /** 마우스를 올리거나 키보드 포커스를 받으면 지우기 버튼(X)을 보여 줍니다. 비밀번호 칸(Figma `password_field`)에는 지우기 버튼이 없어 `type="password"`이면 기본으로 꺼집니다. @default type이 'password'가 아니면 true */
  clearable?: boolean;
  /** 지우기 버튼으로 값을 비운 뒤 호출됩니다. */
  onClear?: () => void;
  /** `type="password"`일 때 비밀번호를 보이거나 숨기는 눈 아이콘 버튼을 보여 줍니다(보이는 동안은 눈 가림 아이콘). @default true */
  revealable?: boolean;
  /** 비밀번호를 처음부터 보이게 할지 정합니다. @default false */
  defaultRevealed?: boolean;
  /** 바깥 요소의 클래스 이름. */
  className?: string;
  /** 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/** 이름·이메일 등 한 줄의 텍스트를 입력받습니다. 라벨, 도움말, 오류 메시지와 비밀번호 표시 기능을 제공합니다. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'sm',
    label,
    required = false,
    message,
    messageType,
    invalid = false,
    clearable,
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
  // Figma password_field (1440:8466) shows only the eye — no clear (X) icon in any state.
  const canClear = clearable ?? !isPassword;
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
        <FieldLabelRow required={required}>
          <label className="ds-field__label" htmlFor={inputId}>
            {label}
          </label>
        </FieldLabelRow>
      )}
      <div className="ds-field__control">
        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          className="ds-field__input"
          required={required}
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
            {revealed ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        )}
        {canClear && !disabled && !readOnly && (
          <button type="button" className="ds-field__action ds-input__clear" aria-label="입력 내용 지우기" tabIndex={-1} onClick={clear}>
            <XIcon />
          </button>
        )}
      </div>
      {hasMessage && (
        <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'helper')}>
          {message}
        </FieldMessage>
      )}
    </div>
  );
});
