import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useSegmentedControl } from './SegmentedControlContext';

export type SegmentedControlItemProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'className' | 'style' | 'children' | 'size'> & {
  /** Value of this item in the SegmentedControl. */
  value: string;
  /** Figma "Label". */
  children: ReactNode;
  /** Figma State "Disabled" for this item only. */
  disabled?: boolean;
  /** Class name of the item `<label>`. */
  className?: string;
  /** Style of the item `<label>`. */
  style?: CSSProperties;
};

/**
 * One segment (Figma `segmented-item`). Variant Selected = the control's value; State Hover / Pressed are
 * :hover / :active, Disabled = `disabled` here or on the control. Renders a visually hidden native radio.
 */
export const SegmentedControlItem = forwardRef<HTMLInputElement, SegmentedControlItemProps>(function SegmentedControlItem(
  { value, children, disabled, className, style, onChange, ...rest },
  ref,
) {
  const group = useSegmentedControl();
  const isDisabled = disabled ?? group?.disabled;
  return (
    <label className={cx('ds-segmented__item', className)} style={style} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        className="ds-segmented__input"
        name={group?.name}
        value={value}
        checked={group ? group.selected === value : undefined}
        disabled={isDisabled}
        onChange={(event) => {
          if (event.target.checked) group?.select(value);
          onChange?.(event);
        }}
      />
      <span className="ds-segmented__segment">
        <span className="ds-segmented__label">{children}</span>
      </span>
    </label>
  );
});
