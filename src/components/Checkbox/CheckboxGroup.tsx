import { forwardRef, useMemo, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChoiceGroupOrientation, ChoiceSize } from '../Choice';
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
};

/**
 * `value`가 있는 체크박스들을 묶어 선택한 값 목록을 관리합니다. `aria-label` 또는 `aria-labelledby`로 그룹 이름을 붙입니다.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { value, defaultValue = [], onChange, name, size, disabled, orientation = 'vertical', className, children, ...rest },
  ref,
) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const context = useMemo(
    () => ({
      name,
      size,
      disabled,
      isSelected: (v: string) => selected.includes(v),
      toggle: (v: string, on: boolean) => setSelected(on ? [...selected.filter((x) => x !== v), v] : selected.filter((x) => x !== v)),
    }),
    [name, size, disabled, selected, setSelected],
  );
  return (
    <div {...rest} ref={ref} role="group" className={cx('ds-choice-group', className)} data-orientation={orientation}>
      <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
    </div>
  );
});
