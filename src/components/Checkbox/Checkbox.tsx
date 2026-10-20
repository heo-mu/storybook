import { forwardRef, useLayoutEffect, useRef, type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { CheckBoldIcon, MinusBoldIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChoiceSize } from '../Choice';
import { useMergedRef } from '../Field';
import { useCheckboxGroup } from './CheckboxGroupContext';

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children' | 'value'> & {
  /** 크기. `CheckboxGroup` 안에서는 그룹 크기를 따릅니다. @default 'sm' */
  size?: ChoiceSize;
  /** 상자 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 일부 선택 — 켜져 있는 동안 체크 표시 대신 가로줄을 보여 줍니다. @default false */
  indeterminate?: boolean;
  /** 폼 값. `CheckboxGroup` 안에서는 그룹 값에서 이 체크박스를 구분합니다. */
  value?: string;
  /** 라벨을 포함한 바깥 요소의 클래스 이름. */
  className?: string;
  /** 라벨을 포함한 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * 항목을 켜고 끄거나 여러 개를 고르는 체크박스입니다. 선택은 `checked` · `defaultChecked`, 일부 선택은
 * `indeterminate`로 정하고, 나머지 `<input>` 속성과 `ref`는 체크박스에 그대로 전달됩니다.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size, label, indeterminate = false, className, style, disabled, value, name, checked, onChange, ...rest },
  ref,
) {
  const group = useCheckboxGroup();
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const inGroup = group !== null && value !== undefined;
  const isDisabled = disabled ?? group?.disabled;

  // `indeterminate` is a DOM property only. Re-applied after every render because a click clears it.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inGroup) group.toggle(value, event.target.checked);
    onChange?.(event);
  };

  return (
    <label className={cx('ds-choice', 'ds-checkbox', className)} style={style} data-size={size ?? group?.size ?? 'sm'} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={mergedRef}
        type="checkbox"
        className="ds-choice__input ds-checkbox__input"
        name={name ?? group?.name}
        value={value}
        checked={inGroup ? group.isSelected(value) : checked}
        onChange={handleChange}
        disabled={isDisabled}
        aria-invalid={rest['aria-invalid'] ?? ((inGroup && group.invalid) || undefined)}
        aria-describedby={cx(rest['aria-describedby'], inGroup ? group.describedBy : undefined) || undefined}
      />
      <CheckBoldIcon className="ds-choice__decoration ds-checkbox__icon ds-checkbox__check" />
      <MinusBoldIcon className="ds-choice__decoration ds-checkbox__icon ds-checkbox__minus" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
