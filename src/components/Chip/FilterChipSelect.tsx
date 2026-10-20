import { forwardRef, useLayoutEffect, useRef, useState, type ForwardedRef } from 'react';
import { ListBox, Popover, Select as AriaSelect, SelectValue, type Key } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { SelectSizeContext } from '../Select/SelectContext';
import { SelectOption } from '../Select/SelectOption';
import type { ChipSize } from './Chip.options';
import { FilterChip } from './FilterChip';
import { filterChipText } from './filterChipText';

export type FilterChipSelectOption = {
  /** 옵션 값. */
  id: Key;
  /** 옵션 글자. 적용되면 칩 글자에도 보입니다. */
  label: string;
  /** 비활성 — 고를 수 없는 옵션입니다. */
  disabled?: boolean;
};

type FilterChipSelectBase = {
  /** 필터 이름. 적용된 값이 없을 때 칩 글자이고, 값이 있으면 "필터명: 값, 값"이 됩니다. */
  label: string;
  /** 고를 수 있는 옵션 목록(보이는 순서대로). */
  options: FilterChipSelectOption[];
  /** 크기. @default 'md' */
  size?: ChipSize;
  /** 비활성 — 누를 수 없고 키보드로도 선택되지 않습니다. */
  disabled?: boolean;
  /** 칩에 이름을 보여 줄 값의 수. 넘치면 "외 N"으로 줄입니다. @default 3 */
  maxDisplayed?: number;
  /** 폼으로 값을 보낼 때 쓰는 필드 이름. */
  name?: string;
  /** 목록이 열리거나 닫히면 호출됩니다. */
  onOpenChange?: (isOpen: boolean) => void;
  /** 처음부터 목록을 연 채로 보여 줄지 여부. @default false */
  defaultOpen?: boolean;
  className?: string;
};

export type FilterChipSelectMultipleProps = FilterChipSelectBase & {
  /** 여러 개 고르기(기본). 목록이 열린 채로 고르고, 닫을 때 적용됩니다. */
  selectionMode?: 'multiple';
  /** 적용된 값. 넘기면 바깥에서 값을 관리합니다. */
  value?: Key[];
  /** 처음 적용된 값. `value` 없이 필터가 스스로 값을 관리할 때 씁니다. @default [] */
  defaultValue?: Key[];
  /** 고른 값이 바뀐 채로 목록이 닫히면 적용된 값으로 호출됩니다. */
  onChange?: (value: Key[]) => void;
};

export type FilterChipSelectSingleProps = FilterChipSelectBase & {
  /** 하나 고르기. 옵션을 고르면 바로 적용되고 목록이 닫힙니다. */
  selectionMode: 'single';
  /** 적용된 값. 넘기면 바깥에서 값을 관리합니다. `null`이면 필터가 없습니다. */
  value?: Key | null;
  /** 처음 적용된 값. `value` 없이 필터가 스스로 값을 관리할 때 씁니다. @default null */
  defaultValue?: Key | null;
  /** 적용된 값으로 호출됩니다. 필터를 풀면 `null`입니다. */
  onChange?: (value: Key | null) => void;
  /** 필터를 푸는 첫 옵션의 글자. @default '전체' */
  clearLabel?: string;
};

export type FilterChipSelectProps = FilterChipSelectMultipleProps | FilterChipSelectSingleProps;

/** Key of the clearing option of a single-select filter. */
const CLEAR = '__ds-filter-clear__';

/**
 * 필터 칩과 옵션 목록이 함께 있는 필터입니다. 값이 적용되면 칩이 선택됨 모양이 됩니다.
 * - 여러 개 고르기(기본): 목록이 열린 채로 옵션을 켜고 끄고, 목록을 닫을 때 적용됩니다. 모두 끄고 닫으면 필터가 풀립니다.
 * - 하나 고르기: 고르면 바로 적용되고 닫힙니다. 첫 옵션 "전체"(`clearLabel`)를 고르면 필터가 풀립니다.
 */
export const FilterChipSelect = forwardRef(function FilterChipSelect(props: FilterChipSelectProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { label, options, size = 'md', disabled, maxDisplayed = 3, name, onOpenChange, defaultOpen = false, className } = props;
  const single = props.selectionMode === 'single';
  const clearLabel = single ? ((props as FilterChipSelectSingleProps).clearLabel ?? '전체') : undefined;

  // Applied values, always as a list (single: 0 or 1). `undefined` = uncontrolled; a controlled single filter uses
  // `null` for "no filter".
  const toList = (v: readonly Key[] | Key | null) => (v == null ? [] : Array.isArray(v) ? [...v] : [v as Key]);
  const [applied, setApplied] = useControllableState<Key[]>(props.value === undefined ? undefined : toList(props.value), toList(props.defaultValue ?? null), (next) => {
    if (single) (props as FilterChipSelectSingleProps).onChange?.(next[0] ?? null);
    else (props as FilterChipSelectMultipleProps).onChange?.(next);
  });
  const [open, setOpen] = useState(defaultOpen);
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

  // react-aria labels the trigger with "value + aria-label"; the value text already begins with the label, which made
  // the name "상태: 주의 상태". The SelectValue id is react-aria's, so it is read after mount.
  const valueRef = useRef<HTMLSpanElement>(null);
  const [valueId, setValueId] = useState<string>();
  useLayoutEffect(() => setValueId(valueRef.current?.id || undefined), []);

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
      <FilterChip ref={ref} aria-labelledby={valueId} size={size} selected={applied.length > 0} disabled={disabled}>
        {/* The chip is named by this visible text only (WCAG 2.5.3) — see valueId. */}
        <SelectValue ref={valueRef} className="ds-filter-chip-select__value">{() => text}</SelectValue>
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
