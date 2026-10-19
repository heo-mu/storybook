import { forwardRef, useMemo, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChoiceGroupOrientation, ChoiceSize } from '../Choice';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export type CheckboxGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** Selected values (controlled). */
  value?: string[];
  /** Initially selected values (uncontrolled). @default [] */
  defaultValue?: string[];
  /** Called with the new list of selected values. */
  onChange?: (value: string[]) => void;
  /** `name` given to every checkbox in the group (form submission). */
  name?: string;
  /** Size applied to every checkbox that does not set its own. */
  size?: ChoiceSize;
  /** Disables every checkbox in the group. */
  disabled?: boolean;
  /** Stacking direction — items are 8px apart (16px in a row), Design System Rules 08. @default 'vertical' */
  orientation?: ChoiceGroupOrientation;
};

/**
 * Groups `Checkbox`es that have a `value` (role="group") and manages the selected values.
 * Not a Figma component — semantic wrapper only; label it with `aria-label` or `aria-labelledby`.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { value, defaultValue = [], onChange, name, size, disabled, orientation = 'vertical', className, children, ...rest },
  ref,
) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
  const context = useMemo(
    () => ({
      name,
      size,
      disabled,
      isSelected: (v: string) => selected.includes(v),
      toggle: (v: string, on: boolean) => setSelected(on ? [...selected.filter((x) => x !== v), v] : selected.filter((x) => x !== v)),
    }),
    [name, size, disabled, selected, setSelected],
  );
  return (
    <div {...rest} ref={ref} role="group" className={cx('ds-choice-group', className)} data-orientation={orientation}>
      <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
    </div>
  );
});
