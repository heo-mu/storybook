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
  /** 글자 왼쪽 아이콘. 넣으면 왼쪽 안쪽 여백이 한 단계 좁아집니다(sm 2px · md 4px). */
  leftIcon?: ReactNode;
  /** 글자 오른쪽 아이콘(예: 더보기 ›, 초기화 ↺). 넣으면 오른쪽 안쪽 여백이 한 단계 좁아집니다(sm 2px · md 4px). */
  rightIcon?: ReactNode;
  /** 버튼 글자. */
  children: ReactNode;
};

/** 더보기 등 강조도가 낮은 보조 동작에 사용하는 텍스트 버튼입니다. */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton(
  { variant = 'primary', size = 'sm', leftIcon, rightIcon, children, className, type = 'button', ...rest },
  ref,
) {
  const hasLeftIcon = hasSlot(leftIcon);
  const hasRightIcon = hasSlot(rightIcon);
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx('ds-button-base', 'ds-text-button', className)}
      data-variant={variant}
      data-size={size}
      data-left-icon={hasLeftIcon || undefined}
      data-right-icon={hasRightIcon || undefined}
    >
      {hasLeftIcon && <ButtonIconSlot>{leftIcon}</ButtonIconSlot>}
      <span className="ds-button__label">{children}</span>
      {hasRightIcon && <ButtonIconSlot>{rightIcon}</ButtonIconSlot>}
    </button>
  );
});
