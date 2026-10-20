import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { SwitchSize } from './Switch.options';

export type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children'> & {
  /** 크기. @default 'sm' */
  size?: SwitchSize;
  /** 스위치 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 라벨을 포함한 바깥 요소의 클래스 이름. */
  className?: string;
  /** 라벨을 포함한 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/** 알림·자동 저장 등 두 상태를 갖는 설정을 켜거나 끕니다. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ size = 'sm', label, className, style, disabled, ...rest }, ref) {
  return (
    <label className={cx('ds-choice', 'ds-switch', className)} style={style} data-size={size} data-disabled={disabled || undefined}>
      <input {...rest} ref={ref} type="checkbox" role="switch" className="ds-choice__input ds-switch__track" disabled={disabled} />
      <span className="ds-choice__decoration ds-switch__thumb" aria-hidden="true" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
