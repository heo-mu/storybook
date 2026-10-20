import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChoiceGroupOrientation, ChoiceSize } from '../Choice';
import { FieldMessage } from '../Field';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export type CheckboxGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** 선택한 값 목록(제어). */
  value?: string[];
  /** 처음 선택된 값 목록(비제어). @default [] */
  defaultValue?: string[];
  /** 새 선택값 목록과 함께 호출됩니다. */
  onChange?: (value: string[]) => void;
  /** 그룹 안 모든 체크박스에 주는 `name`(폼 전송용). */
  name?: string;
  /** 크기를 따로 정하지 않은 체크박스에 적용할 크기. */
  size?: ChoiceSize;
  /** 그룹 안 모든 체크박스를 비활성으로 만듭니다. */
  disabled?: boolean;
  /** 배치 방향 — 세로(vertical) · 가로(horizontal). 항목 사이 간격은 자동으로 맞춰집니다. @default 'vertical' */
  orientation?: ChoiceGroupOrientation;
  /** 선택이 올바르지 않음(예: 필수 항목을 고르지 않음) — 항목에 오류 상태를 알리고 `message`를 오류 메시지로 보여 줍니다. */
  invalid?: boolean;
  /** 묶음 아래에 보이는 메시지. `invalid`이면 오류 메시지, 아니면 회색 도움말입니다. 화면 낭독기는 각 항목의 설명으로 읽습니다. */
  message?: ReactNode;
};

/**
 * `value`가 있는 체크박스들을 묶어 선택한 값 목록을 관리합니다. `aria-label` 또는 `aria-labelledby`로 그룹 이름을 붙입니다.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { value, defaultValue = [], onChange, name, size, disabled, orientation = 'vertical', invalid = false, message, className, children, ...rest },
  ref,
) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const messageId = `${useId()}-message`;
  const hasMessage = message !== undefined && message !== null && message !== false;
  const describedBy = hasMessage ? messageId : undefined;
  const context = useMemo(
    () => ({
      name,
      size,
      disabled,
      invalid,
      describedBy,
      isSelected: (v: string) => selected.includes(v),
      toggle: (v: string, on: boolean) => setSelected(on ? [...selected.filter((x) => x !== v), v] : selected.filter((x) => x !== v)),
    }),
    [name, size, disabled, invalid, describedBy, selected, setSelected],
  );
  const group = (
    <div {...rest} ref={ref} role="group" className={cx('ds-choice-group', className)} data-orientation={orientation}>
      <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
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
