import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { CalendarDotsIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Calendar, type ISODate } from '../Calendar';
import { FieldMessage, type FieldMessageType, type FieldSize } from '../Field';
import { formatDateText, parseDateText } from './dateText';

export type DatePickerProps = {
  /** Figma "Size". @default 'sm' */
  size?: FieldSize;
  /** Figma "Label" + "Label Text". Without a label, set `aria-label`. */
  label?: ReactNode;
  /** Figma "Display Text" while empty. @default 'YYYY.MM.DD' */
  placeholder?: string;
  /** Figma "Alert" + date-picker_message text. */
  message?: ReactNode;
  /** Figma date-picker_message "Type". @default 'error' when invalid, otherwise 'info' */
  messageType?: FieldMessageType;
  /** Figma State "Error". Text that is not a valid, selectable date also shows the Error state. */
  invalid?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Figma State "Read-only": shows the date without the calendar button. */
  readOnly?: boolean;
  required?: boolean;
  /** Selected date 'YYYY-MM-DD' (controlled); `null` = empty. */
  value?: ISODate | null;
  /** Initial date (uncontrolled). @default null */
  defaultValue?: ISODate | null;
  /** Called with the new date, or null when the field is cleared. */
  onChange?: (value: ISODate | null) => void;
  /** Earliest selectable date. */
  minValue?: ISODate;
  /** Latest selectable date. */
  maxValue?: ISODate;
  /** Marks individual days as unavailable. */
  isDateUnavailable?: (date: ISODate) => boolean;
  /** Calendar popover open (controlled). */
  open?: boolean;
  /** Called when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Form field name — submitted as 'YYYY-MM-DD' through a hidden input. */
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  /** Accessible name of the calendar button. @default '달력 열기' */
  calendarButtonLabel?: string;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element. */
  style?: CSSProperties;
};

/**
 * Figma component sets `date-picker_trigger` (144:723) and `date-picker_message` (144:888) with the
 * `Calendar` (date-picker_calendar) in a popover. The field accepts typed dates (YYYY.MM.DD, YYYY-MM-DD,
 * YYYYMMDD …, committed on Enter or blur); the calendar button (or Alt + ↓) opens the calendar.
 * State: Hover / Focus = :hover / :focus-within, Completed = has a date, Error = `invalid` or an unusable
 * typed date, Disabled = `disabled`, Read-only = `readOnly`.
 */
export function DatePicker({
  size = 'sm',
  label,
  placeholder = 'YYYY.MM.DD',
  message,
  messageType,
  invalid = false,
  disabled = false,
  readOnly = false,
  required,
  value,
  defaultValue = null,
  onChange,
  minValue,
  maxValue,
  isDateUnavailable,
  open,
  onOpenChange,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': describedBy,
  calendarButtonLabel = '달력 열기',
  className,
  style,
}: DatePickerProps) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const labelId = `${autoId}-label`;
  const messageId = `${autoId}-message`;
  const controlRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useControllableState<ISODate | null>(value, defaultValue, onChange);
  const [isOpen, setOpen] = useControllableState(open, false, onOpenChange);
  // Text being typed; null while the field shows the committed date.
  const [draft, setDraft] = useState<string | null>(null);
  const [entryError, setEntryError] = useState(false);
  const hasMessage = message !== undefined && message !== null && message !== false;
  const hasLabel = label != null && label !== false;
  const isInvalid = invalid || entryError;

  const selectable = (iso: ISODate) =>
    (!minValue || iso >= minValue) && (!maxValue || iso <= maxValue) && !(isDateUnavailable?.(iso) ?? false);

  const commit = () => {
    if (draft === null) return;
    const text = draft.trim();
    if (text === '') {
      setDraft(null);
      setEntryError(false);
      if (date !== null) setDate(null);
      return;
    }
    const parsed = parseDateText(text);
    if (parsed && selectable(parsed)) {
      setDraft(null);
      setEntryError(false);
      if (parsed !== date) setDate(parsed);
    } else {
      setEntryError(true);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit();
    if (event.key === 'ArrowDown' && event.altKey && !readOnly && !disabled) {
      event.preventDefault();
      commit();
      setOpen(true);
    }
  };

  return (
    <div
      className={cx('ds-field', 'ds-date-picker', className)}
      style={style}
      data-size={size}
      data-filled={(draft ?? date) ? true : undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {hasLabel && (
        <label className="ds-field__label" id={labelId} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ds-field__control" ref={controlRef}>
        <input
          id={inputId}
          className="ds-field__input"
          value={draft ?? formatDateText(date)}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={hasLabel ? undefined : ariaLabel}
          aria-invalid={isInvalid || undefined}
          aria-describedby={cx(describedBy, hasMessage && messageId) || undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setEntryError(false);
          }}
          onBlur={commit}
          onKeyDown={onKeyDown}
        />
        {!readOnly && (
          <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
            <Button className="ds-field__action ds-date-picker__button" aria-label={calendarButtonLabel} isDisabled={disabled}>
              <CalendarDotsIcon />
            </Button>
            {/* Figma example: the calendar sits 4px (spacing/margin/m-1) below the field, aligned to its start. */}
            <Popover className="ds-date-picker__popover" triggerRef={controlRef} placement="bottom start" offset={4}>
              <Dialog className="ds-date-picker__dialog" aria-labelledby={hasLabel ? labelId : undefined} aria-label={hasLabel ? undefined : (ariaLabel ?? '날짜 선택')}>
                <Calendar
                  value={date}
                  onChange={(next) => {
                    setDate(next);
                    setDraft(null);
                    setEntryError(false);
                    setOpen(false);
                  }}
                  minValue={minValue}
                  maxValue={maxValue}
                  isDateUnavailable={isDateUnavailable}
                  autoFocus
                />
              </Dialog>
            </Popover>
          </DialogTrigger>
        )}
      </div>
      {name !== undefined && <input type="hidden" name={name} value={date ?? ''} />}
      {hasMessage && (
        <FieldMessage id={messageId} type={messageType ?? (isInvalid ? 'error' : 'info')}>
          {message}
        </FieldMessage>
      )}
    </div>
  );
}
