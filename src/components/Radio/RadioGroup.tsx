import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChoiceGroupOrientation, ChoiceSize } from '../Choice';
import { RadioGroupContext } from './RadioGroupContext';

export type RadioGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** Selected value (controlled); `null` = nothing selected. */
  value?: string | null;
  /** Initially selected value (uncontrolled). @default null */
  defaultValue?: string | null;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** `name` of the radios (form submission and arrow-key grouping). @default generated */
  name?: string;
  /** Size applied to every radio that does not set its own. */
  size?: ChoiceSize;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Marks the choice as required (native validation). */
  required?: boolean;
  /** Stacking direction. Figma defines no spacing between items — pass a gap via `style` / `className`. @default 'vertical' */
  orientation?: ChoiceGroupOrientation;
};

/**
 * Groups `Radio`s (role="radiogroup") and manages the selected value. Not a Figma component — semantic
 * wrapper only; label it with `aria-label` or `aria-labelledby`.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, defaultValue = null, onChange, name, size, disabled, required, orientation = 'vertical', className, children, ...rest },
  ref,
) {
  const autoName = useId();
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange as ((v: string | null) => void) | undefined);
  const context = useMemo(
    () => ({ name: name ?? autoName, size, disabled, required, selected, select: (v: string) => setSelected(v) }),
    [name, autoName, size, disabled, required, selected, setSelected],
  );
  return (
    <div
      {...rest}
      ref={ref}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      aria-required={required || undefined}
      className={cx('ds-choice-group', className)}
      data-orientation={orientation}
    >
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </div>
  );
});
