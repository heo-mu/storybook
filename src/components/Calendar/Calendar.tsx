import { useCallback, useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import {
  Calendar as AriaCalendar,
  RangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  type DateValue,
} from 'react-aria-components';
import { CalendarHeading } from './CalendarHeading';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { toCalendarDate, toISODate, type ISODate } from './dates';

export type CalendarProps = {
  /** 단일 날짜 또는 연속된 기간. @default 'single' */
  selectionMode?: 'single' | 'range';
  /** 선택한 기간. 시작일과 종료일은 YYYY-MM-DD입니다. */
  rangeValue?: DateRange | null;
  defaultRangeValue?: DateRange | null;
  onRangeChange?: (value: DateRange) => void;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  id?: string;
  /** 선택된 날짜 'YYYY-MM-DD'. 넘기면 바깥에서 값을 관리합니다. `null`이면 선택이 없습니다. */
  value?: ISODate | null;
  /** 처음 선택된 날짜. `value` 없이 달력이 스스로 값을 관리할 때 씁니다. @default null */
  defaultValue?: ISODate | null;
  /** 날짜를 고르면 'YYYY-MM-DD' 값으로 호출됩니다. */
  onChange?: (value: ISODate) => void;
  /** 고를 수 있는 가장 이른 날짜. 이전 날짜는 비활성으로 보입니다. */
  minValue?: ISODate;
  /** 고를 수 있는 가장 늦은 날짜. */
  maxValue?: ISODate;
  /** 날짜별로 고를 수 없는 날을 정합니다. 고를 수 없는 날은 비활성으로 보입니다. */
  isDateUnavailable?: (date: ISODate) => boolean;
  /** 값이 없을 때 처음 보여 줄 달(그 달의 아무 날짜). @default 오늘 */
  defaultFocusedValue?: ISODate;
  /** 비활성 — 달력 전체를 고를 수 없게 합니다. */
  disabled?: boolean;
  /** 처음 그려질 때 키보드 위치를 날짜 칸으로 옮깁니다. */
  autoFocus?: boolean;
  /** 화면 낭독기가 읽는 달력 이름. @default 월 제목 */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
};

export type DateRange = { start: ISODate; end: ISODate };

/**
 * The day number of a cell. react-aria names the cell with the full date ("2026년 7월 28일 화요일"), where Korean joins
 * the number to "일", so the visible label "28" is not a word of that name (WCAG 2.5.3 Label in Name). The cell is
 * labelled by the visible number first, then by its own react-aria label (self reference keeps the selected / today
 * wording): "28 2026년 7월 28일 화요일". aria-labelledby is set on the DOM node (react-aria owns the cell's props).
 */
function DayLabel({ children }: { children: ReactNode }) {
  const id = useId();
  const ref = useCallback(
    (el: HTMLSpanElement | null) => {
      const cell = el?.parentElement;
      if (!cell) return;
      if (!cell.id) cell.id = `${id}-cell`;
      cell.setAttribute('aria-labelledby', `${id} ${cell.id}`);
    },
    [id],
  );
  return (
    <span id={id} ref={ref} className="ds-calendar__day-label">
      <span className="ds-calendar__day-number">{children}</span>
    </span>
  );
}

/** 단일 날짜 또는 기간을 선택하는 달력입니다. 라벨과 안내가 필요하면 DatePicker를 사용합니다. */
export function Calendar({
  selectionMode = 'single', rangeValue, defaultRangeValue = null, onRangeChange, readOnly, invalid, required,
  value,
  defaultValue = null,
  onChange,
  minValue,
  maxValue,
  isDateUnavailable,
  defaultFocusedValue,
  disabled,
  autoFocus,
  className,
  style,
  ...rest
}: CalendarProps) {
  const requiredId = useId();
  const [selected, setSelected] = useControllableState<ISODate | null>(value, defaultValue, onChange as ((v: ISODate | null) => void) | undefined);
  const unavailable = useMemo(
    () => (isDateUnavailable ? (date: DateValue) => isDateUnavailable(date.toString().slice(0, 10)) : undefined),
    [isDateUnavailable],
  );
  const [range, setRange] = useControllableState<DateRange | null>(rangeValue, defaultRangeValue, onRangeChange as ((v: DateRange | null) => void) | undefined);
  const rangeStart = toCalendarDate(range?.start);
  const rangeEnd = toCalendarDate(range?.end);
  const parsedRange = rangeStart && rangeEnd ? (rangeStart.compare(rangeEnd) <= 0 ? { start: rangeStart, end: rangeEnd } : { start: rangeEnd, end: rangeStart }) : null;
  const content = <>
      {required && <span id={requiredId} hidden>필수 선택</span>}
      <CalendarHeading minValue={minValue} maxValue={maxValue} isDateUnavailable={isDateUnavailable} disabled={disabled} />
      <div className="ds-calendar__grid-wrap">
        <CalendarGrid className="ds-calendar__grid">
          <CalendarGridHeader>{(day) => <CalendarHeaderCell className="ds-calendar__weekday">{day}</CalendarHeaderCell>}</CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell date={date} className="ds-calendar__day" data-date={date.toString()}>
                {({ formattedDate }) => <DayLabel>{formattedDate}</DayLabel>}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </>;
  const common = {
    ...rest,
    'aria-describedby': cx(rest['aria-describedby'], required && requiredId) || undefined,
    style,
    minValue: toCalendarDate(minValue) ?? undefined,
    maxValue: toCalendarDate(maxValue) ?? undefined,
    isDateUnavailable: unavailable,
    defaultFocusedValue: toCalendarDate(defaultFocusedValue) ?? undefined,
    isDisabled: disabled, isReadOnly: readOnly, isInvalid: invalid, autoFocus,
  };
  if (selectionMode === 'range') return <RangeCalendar {...common}
    className={({ state }) => cx('ds-calendar', 'ds-calendar--range', state.anchorDate && 'ds-calendar--preview', className)}
    value={parsedRange} onChange={(next) => setRange({ start: next.start.toString(), end: next.end.toString() })}
  >{content}</RangeCalendar>;
  return <AriaCalendar
      {...common}
      className={cx('ds-calendar', className)}
      value={toCalendarDate(selected)}
      onChange={(date) => setSelected(toISODate(date))}
    >{content}</AriaCalendar>;
}
