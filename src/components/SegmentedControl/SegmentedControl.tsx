import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { SegmentedControlContext } from './SegmentedControlContext';
import type { SegmentedControlSize } from './SegmentedControl.options';

export type SegmentedControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** Figma "Size". @default 'md' */
  size?: SegmentedControlSize;
  /** Selected item value (controlled). */
  value?: string | null;
  /** Initially selected item value (uncontrolled). @default null */
  defaultValue?: string | null;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** `name` of the underlying radios (form submission). @default generated */
  name?: string;
  /** Disables every item (Figma State "Disabled"). */
  disabled?: boolean;
};

/**
 * Figma component set `segmented-control` (531:24471) with `segmented-item` (524:24397): one choice out
 * of a few options. Items share the width equally (Figma: items fill the control). Built from native
 * radios (role="radiogroup"): arrow keys move the selection, forms receive the value.
 * Label the control with `aria-label` or `aria-labelledby`.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { size = 'md', value, defaultValue = null, onChange, name, disabled, className, children, ...rest },
  ref,
) {
  const autoName = useId();
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange as ((v: string | null) => void) | undefined);
  const context = useMemo(
    () => ({ name: name ?? autoName, size, disabled, selected, select: (v: string) => setSelected(v) }),
    [name, autoName, size, disabled, selected, setSelected],
  );
  return (
    <div {...rest} ref={ref} role="radiogroup" aria-disabled={disabled || undefined} className={cx('ds-segmented', className)} data-size={size}>
      <SegmentedControlContext.Provider value={context}>{children}</SegmentedControlContext.Provider>
    </div>
  );
});
