import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { hasSlot } from '../../utils/hasSlot';
import { ButtonIconSlot } from './ButtonIconSlot';
import { resolveAppearance, type ButtonDisabledProp, type ButtonShape, type ButtonSize, type ButtonToneProps } from './Button.options';

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  ButtonToneProps &
  ButtonDisabledProp & {
    /** Figma "Size". @default 'xs' */
    size?: ButtonSize;
    /** Figma "Shape". @default 'square' */
    shape?: ButtonShape;
    /** Figma "Left Icon" (boolean + icon instance): rendered when provided. Sized to 16px (20px at lg). */
    leftIcon?: ReactNode;
    /** Figma "Right Icon" (boolean + icon instance): rendered when provided. Sized to 16px (20px at lg). */
    rightIcon?: ReactNode;
    /** Figma "Label Text". */
    children: ReactNode;
  };

/**
 * Figma component set `button_basic` (54:2904).
 * State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.
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
