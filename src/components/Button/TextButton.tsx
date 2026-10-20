import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { hasSlot } from '../../utils/hasSlot';
import { ButtonIconSlot } from './ButtonIconSlot';
import type { ButtonDisabledProp, TextButtonSize, TextButtonVariant } from './Button.options';

export type TextButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'disabled'> &
  ButtonDisabledProp & {
  /** 종류. @default 'primary' */
  variant?: TextButtonVariant;
  /** 크기. @default 'sm' */
  size?: TextButtonSize;
  /** 글자 왼쪽 아이콘. */
  leftIcon?: ReactNode;
  /** 글자 오른쪽 아이콘. */
  rightIcon?: ReactNode;
  /** 버튼 글자. */
  children: ReactNode;
};

/** 더보기 등 강조도가 낮은 보조 동작에 사용하는 텍스트 버튼입니다. */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton(
  { variant = 'primary', size = 'sm', leftIcon, rightIcon, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx('ds-button-base', 'ds-text-button', className)}
      data-variant={variant}
      data-size={size}
    >
      {hasSlot(leftIcon) && <ButtonIconSlot>{leftIcon}</ButtonIconSlot>}
      <span className="ds-button__label">{children}</span>
      {hasSlot(rightIcon) && <ButtonIconSlot>{rightIcon}</ButtonIconSlot>}
    </button>
  );
});
