import { forwardRef, useId, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldLabelRow, FieldMessage, useFieldValue, type FieldMessageType } from '../Field';

import type { TextareaSize } from './Textarea.options';

export type TextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'className' | 'style' | 'required'> & {
  /** 크기. @default 'sm' */
  size?: TextareaSize;
  /** 입력 칸 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 꼭 입력해야 하는 칸 — 라벨 뒤에 점을 붙이고, 입력 칸에 `required`를 넘겨 화면 낭독기가 "필수"로 읽고 폼 제출 때 빈 값을 검사합니다. */
  required?: boolean;
  /** 입력 칸 아래에 보이는 도움말 메시지. */
  message?: ReactNode;
  /** 도움말 메시지 종류. @default 'info' (`invalid`이면 'error') */
  messageType?: FieldMessageType;
  /** 오류 — 오류 테두리로 표시합니다. */
  invalid?: boolean;
  /** `maxLength`가 있을 때 `입력한 글자 수/최대 글자 수`를 보여 줍니다. @default true */
  showCount?: boolean;
  /** 바깥 요소의 클래스 이름. */
  className?: string;
  /** 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * 여러 줄 글자를 입력받는 입력 칸입니다. 높이가 고정되어 내용이 넘치면 안에서 스크롤되고,
 * 나머지 `<textarea>` 속성과 `ref`는 입력 칸에 그대로 전달됩니다.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'sm', label, required = false, message, messageType, invalid = false, showCount = true, className, style, id, value, defaultValue, onChange, disabled, readOnly, maxLength, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const autoId = useId();
  const textareaId = id ?? `${autoId}-textarea`;
  const messageId = `${autoId}-message`;
  const counterId = `${autoId}-counter`;
  const { current, filled, handleChange } = useFieldValue(value, defaultValue, onChange);
  const hasMessage = message !== undefined && message !== null && message !== false;
  const hasCount = showCount && maxLength !== undefined;

  return (
    <div
      className={cx('ds-field', 'ds-textarea', className)}
      style={style}
      data-size={size}
      data-filled={filled || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {label != null && label !== false && (
        <FieldLabelRow required={required}>
          <label className="ds-field__label" htmlFor={textareaId}>
            {label}
          </label>
        </FieldLabelRow>
      )}
      <div className="ds-field__control ds-textarea__control">
        <textarea
          {...rest}
          ref={ref}
          id={textareaId}
          className="ds-field__input ds-textarea__input"
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={invalid || undefined}
          aria-describedby={cx(describedBy, hasMessage && messageId, hasCount && counterId) || undefined}
        />
      </div>
      {(hasMessage || hasCount) && (
        <div className="ds-textarea__footer">
          {hasMessage && (
            <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'info')} className="ds-textarea__message">
              {message}
            </FieldMessage>
          )}
          {hasCount && (
            <span id={counterId} className="ds-textarea__count">
              <span className="ds-textarea__count-current">{current.length}</span>
              <span className="ds-textarea__count-rest">/</span>
              <span className="ds-textarea__count-rest">{maxLength}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
});
