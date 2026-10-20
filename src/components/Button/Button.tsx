import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { hasSlot } from '../../utils/hasSlot';
import { ButtonIconSlot } from './ButtonIconSlot';
import { resolveAppearance, type ButtonDisabledProp, type ButtonShape, type ButtonSize, type ButtonToneProps } from './Button.options';

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'disabled'> &
  ButtonToneProps &
  ButtonDisabledProp & {
    /** 크기. @default 'xs' */
    size?: ButtonSize;
    /** 모서리 모양. @default 'square' */
    shape?: ButtonShape;
    /** 글자 왼쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. */
    leftIcon?: ReactNode;
    /** 글자 오른쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. */
    rightIcon?: ReactNode;
    /** 버튼 글자. */
    children: ReactNode;
  };

/**
 * 사용자가 행동을 실행하는 버튼입니다. 마우스를 올리거나 누르면 모양이 바뀌고, `disabled`이면 누를 수 없습니다.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', appearance, size = 'xs', shape = 'square', leftIcon, rightIcon, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx('ds-button-base', 'ds-button', className)}
      data-variant={variant}
      data-appearance={resolveAppearance(variant, appearance)}
      data-size={size}
      data-shape={shape}
    >
      {hasSlot(leftIcon) && <ButtonIconSlot>{leftIcon}</ButtonIconSlot>}
      <span className="ds-button__label">{children}</span>
      {hasSlot(rightIcon) && <ButtonIconSlot>{rightIcon}</ButtonIconSlot>}
    </button>
  );
});
