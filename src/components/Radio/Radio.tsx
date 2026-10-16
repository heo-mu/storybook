import { forwardRef, type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ChoiceSize } from '../Choice';
import { useRadioGroup } from './RadioGroupContext';

export type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'className' | 'style' | 'children' | 'value'> & {
  /** Figma "Size". Inside a `RadioGroup` the group size is the default. @default 'sm' */
  size?: ChoiceSize;
  /** Figma "Label" + "Label Text". Without a label, give the radio an `aria-label`. */
  label?: ReactNode;
  /** Value of this option (required inside a `RadioGroup`). */
  value: string;
  /** Class name of the root `<label>`. */
  className?: string;
  /** Style of the root `<label>`. */
  style?: CSSProperties;
};

/**
 * Figma component set `radio` (102:2677). Selection "Selected" = checked; State: Hover / Pressed are the
 * native :hover / :active, Disabled = `disabled`. Renders a native `<input type="radio">` (arrow keys move
 * between radios of the same name). Use inside `RadioGroup`, or standalone with `name` / `checked`.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size, label, value, className, style, disabled, name, checked, onChange, required, ...rest },
  ref,
) {
  const group = useRadioGroup();
  const isDisabled = disabled ?? group?.disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (group && event.target.checked) group.select(value);
    onChange?.(event);
  };

  return (
    <label className={cx('ds-choice', 'ds-radio', className)} style={style} data-size={size ?? group?.size ?? 'sm'} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        className="ds-choice__input ds-radio__input"
        name={group ? group.name : name}
        value={value}
        checked={group ? group.selected === value : checked}
        onChange={handleChange}
        disabled={isDisabled}
        required={required ?? group?.required}
      />
      <span className="ds-choice__decoration ds-radio__dot" aria-hidden="true" />
      {label != null && label !== false && <span className="ds-choice__label">{label}</span>}
    </label>
  );
});
