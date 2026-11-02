import { forwardRef, useRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useMergedRef } from '../Field';
import type { SwitchSize } from './Switch.options';
import { useSwitchPress, useThumbSpring } from './switchMotion';

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
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'sm', label, className, style, disabled, onChange, onKeyDown, onKeyUp, onBlur, ...rest },
  ref,
) {
  const rootRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  // Motion (switchMotion.ts · Switch.css): press shrink, spring thumb, off ↔ on colour blend.
  const thumbMoved = useThumbSpring(inputRef, thumbRef);
  const press = useSwitchPress(rootRef, Boolean(disabled));

  return (
    <label
      ref={rootRef}
      className={cx('ds-choice', 'ds-switch', className)}
      style={style}
      data-size={size}
      data-disabled={disabled || undefined}
      data-pressed={press.pressed || undefined}
      onPointerDown={press.onPointerDown}
    >
      <input
        {...rest}
        ref={mergedRef}
        type="checkbox"
        role="switch"
        className="ds-choice__input ds-switch__track"
        disabled={disabled}
        onChange={(event) => {
          thumbMoved();
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          press.onKeyDown(event);
          onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          press.onKeyUp(event);
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          press.onBlur();
          onBlur?.(event);
        }}
      />
      <span ref={thumbRef} className="ds-choice__decoration ds-switch__thumb" aria-hidden="true" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
