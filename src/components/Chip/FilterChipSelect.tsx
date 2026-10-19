import { forwardRef, useRef, useState, type ForwardedRef } from 'react';
import { ListBox, Popover, Select as AriaSelect, SelectValue, type Key } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { SelectSizeContext } from '../Select/SelectContext';
import { SelectOption } from '../Select/SelectOption';
import type { ChipSize } from './Chip.options';
import { FilterChip } from './FilterChip';
import { filterChipText } from './filterChipText';

export type FilterChipSelectOption = {
  /** Value of the option. */
  id: Key;
  /** Option text — also shown in the chip once applied. */
  label: string;
  /** Figma option State "Disabled". */
  disabled?: boolean;
};

type FilterChipSelectBase = {
  /** Filter name: the chip text while nothing is applied, then "name: value, value". */
  label: string;
  /** The choices, in order. */
  options: FilterChipSelectOption[];
  /** Figma chip "Size". @default 'md' */
  size?: ChipSize;
  /** Figma chip State "Disabled". */
  disabled?: boolean;
  /** How many applied values the chip names before "외 N". @default 3 */
  maxDisplayed?: number;
  /** Form field name (a hidden native select carries the value). */
  name?: string;
  /** Called when the panel opens or closes. */
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
};

export type FilterChipSelectMultipleProps = FilterChipSelectBase & {
  /** Several values (default): the panel stays open while choosing and the choice is applied when it closes. */
  selectionMode?: 'multiple';
  /** Applied values (controlled). */
  value?: Key[];
  /** Initially applied values (uncontrolled). @default [] */
  defaultValue?: Key[];
  /** Called with the applied values when the panel closes with a changed choice. */
  onChange?: (value: Key[]) => void;
};

export type FilterChipSelectSingleProps = FilterChipSelectBase & {
  /** One value: choosing an option applies it and closes the panel. */
  selectionMode: 'single';
  /** Applied value (controlled); `null` = no filter. */
  value?: Key | null;
  /** Initially applied value (uncontrolled). @default null */
  defaultValue?: Key | null;
  /** Called with the applied value (`null` when cleared). */
  onChange?: (value: Key | null) => void;
  /** First option that clears the filter (`null` value). @default '전체' */
  clearLabel?: string;
};

export type FilterChipSelectProps = FilterChipSelectMultipleProps | FilterChipSelectSingleProps;

/** Key of the clearing option of a single-select filter. */
const CLEAR = '__ds-filter-clear__';

/**
 * A filter chip with its option panel — Figma `chip-filter` (558:25704) + `listbox` / `option` Size=sm, as in the
 * Figma "chip-filter 선택 예시" (Design System Rules 04 · 07).
 * - Multiple (default): options toggle with a check while the panel stays open; the chip text follows the choice and
 *   the choice is applied (`onChange`, Selected look) when the panel closes — Esc, a press outside or the chip.
 *   Turning every option off and closing removes the filter.
 * - Single: choosing an option applies it and closes the panel; the first option (`clearLabel`, "전체") removes it.
 * The chip is Selected while a value is applied. Keyboard and screen readers follow the react-aria Select
 * (button + listbox: Enter · Space · ↓ open, arrows · type-ahead move, Space · Enter choose, Esc close).
 */
export const FilterChipSelect = forwardRef(function FilterChipSelect(props: FilterChipSelectProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { label, options, size = 'md', disabled, maxDisplayed = 3, name, onOpenChange, className } = props;
  const single = props.selectionMode === 'single';
  const clearLabel = single ? ((props as FilterChipSelectSingleProps).clearLabel ?? '전체') : undefined;

  // Applied values, always as a list (single: 0 or 1). `undefined` = uncontrolled; a controlled single filter uses
  // `null` for "no filter".
  const toList = (v: readonly Key[] | Key | null) => (v == null ? [] : Array.isArray(v) ? [...v] : [v as Key]);
  const [applied, setApplied] = useControllableState<Key[]>(props.value === undefined ? undefined : toList(props.value), toList(props.defaultValue ?? null), (next) => {
    if (single) (props as FilterChipSelectSingleProps).onChange?.(next[0] ?? null);
    else (props as FilterChipSelectMultipleProps).onChange?.(next);
  });
  const [open, setOpen] = useState(false);
  // The choice while the panel is open. A ref as well: react-aria closes a single Select in the same event as the
  // change, before the state update is rendered.
  const [pending, setPendingState] = useState<Key[]>(applied);
  const pendingRef = useRef(pending);
  const setPending = (next: Key[]) => {
    pendingRef.current = next;
    setPendingState(next);
  };
  const shown = open ? pending : applied;

  const labelOf = (id: Key) => options.find((o) => o.id === id)?.label ?? String(id);
  const text = filterChipText(label, shown.map(labelOf), maxDisplayed);
  const same = (a: Key[], b: Key[]) => a.length === b.length && a.every((k) => b.includes(k));

  const changeOpen = (isOpen: boolean) => {
    if (isOpen) setPending(applied);
    else if (!same(pendingRef.current, applied)) setApplied(pendingRef.current);
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const items = single && clearLabel != null ? [{ id: CLEAR, label: clearLabel } as FilterChipSelectOption, ...options] : options;
  const common = {
    className: cx('ds-filter-chip-select', className),
    'aria-label': label,
    name,
    isDisabled: disabled,
    isOpen: open,
    onOpenChange: changeOpen,
  };
  const content = (
    <>
      <FilterChip ref={ref} size={size} selected={applied.length > 0} disabled={disabled}>
        {/* SelectValue: react-aria names the trigger with it, so the name holds the visible text (WCAG 2.5.3). */}
        <SelectValue className="ds-filter-chip-select__value">{() => text}</SelectValue>
      </FilterChip>
      <Popover className="ds-filter-chip-select__popover" placement="bottom start" offset={4}>
        <SelectSizeContext.Provider value="sm">
          <ListBox className="ds-listbox" data-size="sm" items={items}>
            {(o) => (
              <SelectOption id={o.id} disabled={o.disabled} textValue={o.label}>
                {o.label}
              </SelectOption>
            )}
          </ListBox>
        </SelectSizeContext.Provider>
      </Popover>
    </>
  );

  return single ? (
    <AriaSelect<FilterChipSelectOption, 'single'>
      {...common}
      selectionMode="single"
      value={pending[0] ?? (clearLabel != null ? CLEAR : null)}
      onChange={(key) => setPending(key == null || key === CLEAR ? [] : [key])}
    >
      {content}
    </AriaSelect>
  ) : (
    <AriaSelect<FilterChipSelectOption, 'multiple'> {...common} selectionMode="multiple" value={pending} onChange={(keys) => setPending([...keys])}>
      {content}
    </AriaSelect>
  );
});
