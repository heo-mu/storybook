import { useCallback, useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  type DateValue,
} from 'react-aria-components';
import { CaretLeftIcon, CaretRightIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { toCalendarDate, toISODate, type ISODate } from './dates';

export type CalendarProps = {
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
      {children}
    </span>
  );
}

/** 달력에서 날짜를 선택합니다. 입력 필드와 함께 사용하려면 DatePicker를 사용합니다. */
export function Calendar({
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
  const [selected, setSelected] = useControllableState<ISODate | null>(value, defaultValue, onChange as ((v: ISODate | null) => void) | undefined);
  const unavailable = useMemo(
    () => (isDateUnavailable ? (date: DateValue) => isDateUnavailable(date.toString().slice(0, 10)) : undefined),
    [isDateUnavailable],
  );
  return (
    <AriaCalendar
      {...rest}
      className={cx('ds-calendar', className)}
      style={style}
      value={toCalendarDate(selected)}
      onChange={(date) => setSelected(toISODate(date))}
      minValue={toCalendarDate(minValue) ?? undefined}
      maxValue={toCalendarDate(maxValue) ?? undefined}
      isDateUnavailable={unavailable}
      defaultFocusedValue={toCalendarDate(defaultFocusedValue) ?? undefined}
      isDisabled={disabled}
      autoFocus={autoFocus}
    >
      {/* A div, not <header>: the calendar title row is not a page banner landmark. */}
      <div className="ds-calendar__header">
        <Heading className="ds-calendar__title" />
        <div className="ds-calendar__nav">
          <Button slot="previous" className="ds-calendar__nav-button">
            <CaretLeftIcon />
          </Button>
          <Button slot="next" className="ds-calendar__nav-button">
            <CaretRightIcon />
          </Button>
        </div>
      </div>
      <div className="ds-calendar__grid-wrap">
        <CalendarGrid className="ds-calendar__grid">
          <CalendarGridHeader>{(day) => <CalendarHeaderCell className="ds-calendar__weekday">{day}</CalendarHeaderCell>}</CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell date={date} className="ds-calendar__day">
                {({ formattedDate }) => <DayLabel>{formattedDate}</DayLabel>}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </AriaCalendar>
  );
}
