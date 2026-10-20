import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { ButtonIconSlot } from './ButtonIconSlot';
import { resolveAppearance, type ButtonDisabledProp, type ButtonShape, type ButtonToneProps, type IconButtonSize } from './Button.options';

export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'aria-label' | 'disabled'> &
  ButtonToneProps &
  ButtonDisabledProp & {
    /** 크기. @default 'xs' */
    size?: IconButtonSize;
    /** 모서리 모양. @default 'square' */
    shape?: ButtonShape;
    /** 표시할 아이콘. 버튼 크기에 맞춰집니다. */
    icon: ReactNode;
    /** 화면 낭독기가 읽는 버튼 이름(필수). */
    'aria-label': string;
  };

/**
 * 아이콘만 있는 버튼입니다. 종류 · 모양 · 상태는 Button과 같고, `aria-label`로 이름을 꼭 붙입니다.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'primary', appearance, size = 'xs', shape = 'square', icon, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx('ds-button-base', 'ds-icon-button', className)}
      data-variant={variant}
      data-appearance={resolveAppearance(variant, appearance)}
      data-size={size}
      data-shape={shape}
    >
      <ButtonIconSlot>{icon}</ButtonIconSlot>
    </button>
  );
});
