import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { hasSlot } from '../../utils/hasSlot';
import { ButtonIconSlot } from './ButtonIconSlot';
import type { TextButtonSize, TextButtonVariant } from './Button.options';

export type TextButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  /** Figma "Type" ("Primary" / "SecondarySecondary"). Both are bound to the same variables in Ver 0.4. @default 'primary' */
  variant?: TextButtonVariant;
  /** Figma "Size". @default 'sm' */
  size?: TextButtonSize;
  /** Figma "Left Icon" (boolean + icon instance): rendered when provided. Sized to 16px. */
  leftIcon?: ReactNode;
  /** Figma "Right Icon" (boolean + icon instance): rendered when provided. Sized to 16px. */
  rightIcon?: ReactNode;
  /** Figma "Label Text". */
  children: ReactNode;
};

/**
 * Figma component set `button_text` (432:8395).
 * State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.
 */
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
