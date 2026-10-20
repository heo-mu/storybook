import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChoiceGroupOrientation, ChoiceSize } from '../Choice';
import { FieldMessage } from '../Field';
import { RadioGroupContext } from './RadioGroupContext';

export type RadioGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** 선택한 값(제어). `null`이면 선택 없음입니다. */
  value?: string | null;
  /** 처음 선택된 값(비제어). @default null */
  defaultValue?: string | null;
  /** 새로 고른 값과 함께 호출됩니다. */
  onChange?: (value: string) => void;
  /** 그룹 안 라디오 버튼들의 `name`(폼 전송 · 방향키 이동 묶음). @default 자동 생성 */
  name?: string;
  /** 크기를 따로 정하지 않은 라디오 버튼에 적용할 크기. */
  size?: ChoiceSize;
  /** 그룹 안 모든 라디오 버튼을 비활성으로 만듭니다. */
  disabled?: boolean;
  /** 꼭 골라야 하는 항목으로 표시합니다(폼을 보낼 때 검사). */
  required?: boolean;
  /** 배치 방향 — 세로(vertical) · 가로(horizontal). 항목 사이 간격은 자동으로 맞춰집니다. @default 'vertical' */
  orientation?: ChoiceGroupOrientation;
  /** 선택이 올바르지 않음(예: 필수 항목을 고르지 않음) — 항목에 오류 상태를 알리고 `message`를 오류 메시지로 보여 줍니다. */
  invalid?: boolean;
  /** 묶음 아래에 보이는 메시지. `invalid`이면 오류 메시지, 아니면 회색 도움말입니다. 화면 낭독기는 각 항목의 설명으로 읽습니다. */
  message?: ReactNode;
};

/**
 * 라디오 버튼들을 묶어 선택한 값 하나를 관리합니다. `aria-label` 또는 `aria-labelledby`로 그룹 이름을 붙입니다.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, defaultValue = null, onChange, name, size, disabled, required, orientation = 'vertical', invalid = false, message, className, children, ...rest },
  ref,
) {
  const autoName = useId();
  const messageId = `${autoName}-message`;
  const hasMessage = message !== undefined && message !== null && message !== false;
  const describedBy = hasMessage ? messageId : undefined;
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange as ((v: string | null) => void) | undefined);
  const context = useMemo(
    () => ({ name: name ?? autoName, size, disabled, required, invalid, describedBy, selected, select: (v: string) => setSelected(v) }),
    [name, autoName, size, disabled, required, invalid, describedBy, selected, setSelected],
  );
  const group = (
    <div
      {...rest}
      ref={ref}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={cx(rest['aria-describedby'], describedBy) || undefined}
      className={cx('ds-choice-group', className)}
      data-orientation={orientation}
    >
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </div>
  );
  // Rules 04 "묶음 오류": the message under the group (Figma input_message), 6px below like a field's message. The wrapper
  // is always rendered (display: contents without a message) so the group is not remounted — and keyboard focus is not
  // lost — when an error appears.
  return (
    <div className="ds-choice-field" data-message={hasMessage || undefined} data-disabled={disabled || undefined}>
      {group}
      {hasMessage && (
        <FieldMessage id={messageId} type={invalid ? 'error' : 'helper'}>
          {message}
        </FieldMessage>
      )}
    </div>
  );
});
