import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { ButtonIconSlot } from './ButtonIconSlot';
import { resolveAppearance, type ButtonDisabledProp, type ButtonShape, type ButtonToneProps, type IconButtonSize } from './Button.options';

export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'aria-label'> &
  ButtonToneProps &
  ButtonDisabledProp & {
    /** Figma "Size". @default 'xs' */
    size?: IconButtonSize;
    /** Figma "Shape". @default 'square' */
    shape?: ButtonShape;
    /** The icon instance. Sized to 16px (20px at md). */
    icon: ReactNode;
    /** Accessible name — the Figma component keeps its "Label" text layer hidden. */
    'aria-label': string;
  };

/**
 * Figma component set `button_icon` (67:2368).
 * State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.
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
