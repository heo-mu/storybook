import { forwardRef, type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChoiceSize } from '../Choice';
import { useRadioGroup } from './RadioGroupContext';

export type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children' | 'value'> & {
  /** 크기. `RadioGroup` 안에서는 그룹 크기를 따릅니다. @default 'sm' */
  size?: ChoiceSize;
  /** 원 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 이 옵션의 값. `RadioGroup` 안에서는 그룹 값에서 이 옵션을 구분합니다. */
  value: string;
  /** 라벨을 포함한 바깥 요소의 클래스 이름. */
  className?: string;
  /** 라벨을 포함한 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * 여러 옵션 중 하나만 고르는 라디오 버튼입니다. 보통 `RadioGroup` 안에서 쓰고, 단독으로 쓸 때는 `name` · `checked`를
 * 직접 지정합니다. 같은 그룹 안에서는 방향키로 선택이 이동합니다.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size, label, value, className, style, disabled, name, checked, onChange, required, ...rest },
  ref,
) {
  const group = useRadioGroup();
  const isDisabled = disabled ?? group?.disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (group && event.target.checked) group.select(value);
    onChange?.(event);
  };

  return (
    <label className={cx('ds-choice', 'ds-radio', className)} style={style} data-size={size ?? group?.size ?? 'sm'} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        className="ds-choice__input ds-radio__input"
        name={group ? group.name : name}
        value={value}
        checked={group ? group.selected === value : checked}
        onChange={handleChange}
        disabled={isDisabled}
        required={required ?? group?.required}
      />
      <span className="ds-choice__decoration ds-radio__dot" aria-hidden="true" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
