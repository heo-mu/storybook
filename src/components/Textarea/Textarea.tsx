import { forwardRef, useId, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldMessage, useFieldValue, type FieldMessageType } from '../Field';

import type { TextareaSize } from './Textarea.options';

export type TextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'className' | 'style'> & {
  /** Figma "Size". @default 'sm' */
  size?: TextareaSize;
  /** Figma "Label" + "Label Text". */
  label?: ReactNode;
  /** Figma "Alert" + "Alert Text" (textarea_message). */
  message?: ReactNode;
  /** Figma textarea_message "Type". @default 'error' when invalid, otherwise 'info' */
  messageType?: FieldMessageType;
  /** Figma State "Error". */
  invalid?: boolean;
  /** Figma "Counter": shows `current/maxLength` when `maxLength` is set. @default true */
  showCount?: boolean;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element. */
  style?: CSSProperties;
};

/**
 * Figma component set `textarea` (86:2597) with `textarea_message` (86:2733).
 * The container is 100px high as in Figma; the text scrolls inside it.
 * Native textarea props and the ref go to the `<textarea>`.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'sm', label, message, messageType, invalid = false, showCount = true, className, style, id, value, defaultValue, onChange, disabled, readOnly, maxLength, 'aria-describedby': describedBy, ...rest },
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
        <label className="ds-field__label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <div className="ds-field__control ds-textarea__control">
        <textarea
          {...rest}
          ref={ref}
          id={textareaId}
          className="ds-field__input ds-textarea__input"
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
