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
  /** Selected date, 'YYYY-MM-DD' (controlled); `null` = none. */
  value?: ISODate | null;
  /** Initially selected date (uncontrolled). @default null */
  defaultValue?: ISODate | null;
  /** Called with the selected date ('YYYY-MM-DD'). */
  onChange?: (value: ISODate) => void;
  /** Earliest selectable date; earlier days use the Disabled look. */
  minValue?: ISODate;
  /** Latest selectable date. */
  maxValue?: ISODate;
  /** Marks individual days as unavailable (Disabled look). */
  isDateUnavailable?: (date: ISODate) => boolean;
  /** Month shown initially when there is no value (any day of that month). @default today */
  defaultFocusedValue?: ISODate;
  /** Disables the whole calendar. */
  disabled?: boolean;
  /** Moves focus into the grid on mount (used by DatePicker). */
  autoFocus?: boolean;
  /** Accessible name. @default the month heading */
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

/**
 * Figma `date-picker_calendar` (144:1644) with `date-picker_header` (144:1377), `date-picker_navigation`
 * (144:1328) and `date-picker_day` (144:1033). Month grid with keyboard navigation (arrows, Page Up / Down,
 * Home / End), from react-aria-components. Weekday and month names follow the locale (react-aria I18nProvider,
 * otherwise the browser).
 */
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
