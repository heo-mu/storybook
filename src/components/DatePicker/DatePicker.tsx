import { useId, type CSSProperties, type ReactNode } from 'react';
import { Calendar, type CalendarProps, type ISODate } from '../Calendar';
import type { DateRange } from '../Calendar/Calendar';
import { FieldLabelRow, FieldMessage, type FieldMessageType } from '../Field';
import { useControllableState } from '../../utils/useControllableState';
import { cx } from '../../utils/cx';

export type DatePickerProps = Omit<CalendarProps, 'onChange' | 'className' | 'style'> & {
  /** 달력 위 라벨. 없으면 aria-label을 지정합니다. */
  label?: ReactNode;
  /** 달력 아래 도움말 또는 상태 메시지. */
  message?: ReactNode;
  messageType?: FieldMessageType;
  onChange?: (value: ISODate | null) => void;
  /** Range는 name.start / name.end로 전송합니다. */
  name?: string;
  className?: string;
  style?: CSSProperties;
};

/** 입력창 없이 날짜 또는 기간을 선택합니다. */
export function DatePicker({ label, message, messageType, required, invalid, disabled, readOnly,
  value, defaultValue = null, onChange, rangeValue, defaultRangeValue = null, onRangeChange,
  selectionMode = 'single', name, className, style, id, 'aria-label': ariaLabel,
  'aria-describedby': describedBy, ...calendarProps }: DatePickerProps) {
  const autoId = useId();
  const labelId = `${autoId}-label`;
  const messageId = `${autoId}-message`;
  const [date, setDate] = useControllableState(value, defaultValue, onChange);
  const [range, setRange] = useControllableState<DateRange | null>(rangeValue, defaultRangeValue, onRangeChange as ((v: DateRange | null) => void) | undefined);
  const hasMessage = message !== undefined && message !== null && message !== false;
  const hasLabel = label != null && label !== false;
  return <div className={cx('ds-field', 'ds-date-picker', className)} style={style}
    aria-disabled={disabled || undefined}
    data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={invalid || undefined}>
    {hasLabel && <FieldLabelRow required={required}><span className="ds-field__label" id={labelId}>{label}</span></FieldLabelRow>}
    <Calendar {...calendarProps} id={id} selectionMode={selectionMode}
      value={date} onChange={setDate} rangeValue={range} onRangeChange={setRange}
      disabled={disabled} readOnly={readOnly} invalid={invalid} required={required}
      aria-labelledby={hasLabel ? labelId : calendarProps['aria-labelledby']}
      aria-label={hasLabel ? undefined : ariaLabel ?? (selectionMode === 'range' ? '기간 선택' : '날짜 선택')}
      aria-describedby={cx(describedBy, hasMessage && messageId) || undefined} />
    {name !== undefined && (selectionMode === 'range' ? <>
      <input type="hidden" name={`${name}.start`} value={range?.start ?? ''} disabled={disabled} />
      <input type="hidden" name={`${name}.end`} value={range?.end ?? ''} disabled={disabled} />
    </> : <input type="hidden" name={name} value={date ?? ''} disabled={disabled} />)}
    {hasMessage && <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'helper')}>{message}</FieldMessage>}
  </div>;
}
