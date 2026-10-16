import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { SwitchSize } from './Switch.options';

export type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children'> & {
  /** Figma "Size". @default 'sm' */
  size?: SwitchSize;
  /** Figma "Label" + "Label Text". Without a label, give the switch an `aria-label`. */
  label?: ReactNode;
  /** Class name of the root `<label>`. */
  className?: string;
  /** Style of the root `<label>`. */
  style?: CSSProperties;
};

/**
 * Figma component set `switch` (107:409). Checked = `checked` / `defaultChecked`; State: Hover / Pressed are
 * the native :hover / :active, Disabled = `disabled`. Renders `<input type="checkbox" role="switch">`; its
 * props (name, checked, onChange, …) and the ref go to it. Space toggles it.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ size = 'sm', label, className, style, disabled, ...rest }, ref) {
  return (
    <label className={cx('ds-choice', 'ds-switch', className)} style={style} data-size={size} data-disabled={disabled || undefined}>
      <input {...rest} ref={ref} type="checkbox" role="switch" className="ds-choice__input ds-switch__track" disabled={disabled} />
      <span className="ds-choice__decoration ds-switch__thumb" aria-hidden="true" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
