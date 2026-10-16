import { forwardRef, useLayoutEffect, useRef, type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { CheckBoldIcon, MinusBoldIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChoiceSize } from '../Choice';
import { useMergedRef } from '../Field';
import { useCheckboxGroup } from './CheckboxGroupContext';

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children' | 'value'> & {
  /** Figma "Size". Inside a `CheckboxGroup` the group size is the default. @default 'sm' */
  size?: ChoiceSize;
  /** Figma "Label" + "Label Text". Without a label, give the checkbox an `aria-label`. */
  label?: ReactNode;
  /** Figma Selection "Indeterminate" (mixed). Shown instead of the checked mark while true. @default false */
  indeterminate?: boolean;
  /** Form value; inside a `CheckboxGroup` it identifies the checkbox in the group value. */
  value?: string;
  /** Class name of the root `<label>`. */
  className?: string;
  /** Style of the root `<label>`. */
  style?: CSSProperties;
};

/**
 * Figma component set `checkbox` (99:2389). Selection: Checked = `checked` / `defaultChecked`,
 * Indeterminate = `indeterminate`. State: Hover / Pressed are the native :hover / :active, Disabled = `disabled`.
 * Renders a native `<input type="checkbox">`; its props (name, value, checked, onChange, …) and the ref go to it.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size, label, indeterminate = false, className, style, disabled, value, name, checked, onChange, ...rest },
  ref,
) {
  const group = useCheckboxGroup();
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const inGroup = group !== null && value !== undefined;
  const isDisabled = disabled ?? group?.disabled;

  // `indeterminate` is a DOM property only. Re-applied after every render because a click clears it.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inGroup) group.toggle(value, event.target.checked);
    onChange?.(event);
  };

  return (
    <label className={cx('ds-choice', 'ds-checkbox', className)} style={style} data-size={size ?? group?.size ?? 'sm'} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={mergedRef}
        type="checkbox"
        className="ds-choice__input ds-checkbox__input"
        name={name ?? group?.name}
        value={value}
        checked={inGroup ? group.isSelected(value) : checked}
        onChange={handleChange}
        disabled={isDisabled}
      />
      <CheckBoldIcon className="ds-choice__decoration ds-checkbox__icon ds-checkbox__check" />
      <MinusBoldIcon className="ds-choice__decoration ds-checkbox__icon ds-checkbox__minus" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
