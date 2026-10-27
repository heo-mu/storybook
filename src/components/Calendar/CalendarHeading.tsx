import { useContext, useMemo } from 'react';
import { CalendarDate } from '@internationalized/date';
import { Button, CalendarStateContext, RangeCalendarStateContext, Heading, Select, SelectValue, Popover, ListBox, ListBoxItem } from 'react-aria-components';
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, CheckIcon } from '../../icons';
import { toCalendarDate } from './dates';

type Props = { minValue?: string; maxValue?: string; isDateUnavailable?: (date: string) => boolean; disabled?: boolean };

/** Shared header; all date arithmetic stays in the Gregorian calendar, without timezone conversion. */
export function CalendarHeading({ minValue, maxValue, isDateUnavailable, disabled }: Props) {
  const single = useContext(CalendarStateContext);
  const range = useContext(RangeCalendarStateContext);
  const state = range ?? single!;
  const date = state.focusedDate;
  const min = useMemo(() => toCalendarDate(minValue), [minValue]);
  const max = useMemo(() => toCalendarDate(maxValue), [maxValue]);
  const monthsByYear = useMemo(() => {
    const map = new Map<number, number[]>();
    // A moving window avoids rendering thousands of options. Bounds remain authoritative.
    const first = Math.max(min?.year ?? 1, date.year - 10);
    const last = Math.min(max?.year ?? 9999, date.year + 10);
    for (let year = first; year <= last; year++) {
      const months: number[] = [];
      for (let month = 1; month <= 12; month++) {
        const start = new CalendarDate(year, month, 1);
        const end = start.add({ months: 1 }).subtract({ days: 1 });
        if ((min && end.compare(min) < 0) || (max && start.compare(max) > 0)) continue;
        let day = min && start.compare(min) < 0 ? min : start;
        while (day.month === month && day.year === year && (!max || day.compare(max) <= 0)) {
          if (!isDateUnavailable?.(day.toString())) { months.push(month); break; }
          day = day.add({ days: 1 });
        }
      }
      if (months.length) map.set(year, months);
    }
    return map;
  }, [date.year, min, max, isDateUnavailable]);
  const move = (year: number, month: number) => {
    const months = monthsByYear.get(year) ?? [];
    const nextMonth = months.includes(month) ? month : months.reduce((a, b) => Math.abs(b - month) < Math.abs(a - month) ? b : a, months[0]);
    if (!nextMonth) return;
    let next = date.set({ year, month: nextMonth });
    if (min && next.compare(min) < 0) next = min;
    if (max && next.compare(max) > 0) next = max;
    state.setFocusedDate(next);
  };
  const picker = (kind: 'year' | 'month', values: number[]) => (
    <Select aria-label={kind === 'year' ? '연도' : '월'} selectedKey={date[kind]} isDisabled={disabled || !values.length}
      onSelectionChange={(key) => move(kind === 'year' ? Number(key) : date.year, kind === 'month' ? Number(key) : date.month)}>
      {/* Keep the Select trigger semantics; Figma date-picker_header (144:1377) places button_text Type=Primary, Size=md, Right Icon only (2026-10-27). */}
      <Button className="ds-button-base ds-text-button" data-variant="primary" data-size="md">
        <SelectValue className="ds-button__label">{date[kind]}{kind === 'year' ? '년' : '월'}</SelectValue>
        <span className="ds-button__icon"><CaretDownIcon /></span>
      </Button>
      <Popover className="ds-calendar__select-popover" placement="bottom start" offset={4}>
        <ListBox className="ds-listbox ds-calendar__select-list">
          {values.map((value) => <ListBoxItem key={value} id={value} textValue={`${value}${kind === 'year' ? '년' : '월'}`} className="ds-option" data-size="sm">
            {({ isSelected }) => <><span className="ds-option__text">{value}{kind === 'year' ? '년' : '월'}</span>{isSelected && <span className="ds-option__check"><CheckIcon /></span>}</>}
          </ListBoxItem>)}
        </ListBox>
      </Popover>
    </Select>
  );
  return <div className="ds-calendar__header">
    <Heading className="ds-calendar__accessible-title" />
    <div className="ds-calendar__selectors">
      {picker('year', [...monthsByYear.keys()])}
      {picker('month', monthsByYear.get(date.year) ?? [])}
    </div>
    <div className="ds-calendar__nav">
      <Button slot="previous" className="ds-calendar__nav-button"><CaretLeftIcon /></Button>
      <Button slot="next" className="ds-calendar__nav-button"><CaretRightIcon /></Button>
    </div>
  </div>;
}
