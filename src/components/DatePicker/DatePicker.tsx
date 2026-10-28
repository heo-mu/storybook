import { useId, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { CalendarDotsIcon } from '../../icons';
import { Calendar, type CalendarProps, type ISODate } from '../Calendar';
import type { DateRange } from '../Calendar/Calendar';
import { FieldLabelRow, FieldMessage, type FieldMessageType, type FieldSize } from '../Field';
import { useControllableState } from '../../utils/useControllableState';
import { cx } from '../../utils/cx';
import { formatDateText } from './dateText';

export type DatePickerVariant = 'input' | 'inline';

export type DatePickerProps = Omit<CalendarProps, 'onChange' | 'className' | 'style' | 'autoFocus'> & {
  /**
   * 표시 방식 — `input`은 날짜 필드를 누르면 달력이 열리고(Figma date-picker_trigger), `inline`은 달력만 보여 줍니다(date-picker_calendar).
   * @default 'input'
   */
  variant?: DatePickerVariant;
  /** 필드 크기(`input`일 때). 필드 높이 36 · 44 · 52px. @default 'sm' */
  size?: FieldSize;
  /** 비어 있을 때 필드에 보이는 안내 글자(`input`일 때). @default 'YYYY.MM.DD', 기간은 'YYYY.MM.DD ~ YYYY.MM.DD' */
  placeholder?: string;
  /** 필드(또는 달력) 위 라벨. 없으면 `aria-label`을 지정합니다. */
  label?: ReactNode;
  /** 아래 도움말 또는 상태 메시지. */
  message?: ReactNode;
  /** 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. @default 오류이면 'error', 그 밖에는 'helper' */
  messageType?: FieldMessageType;
  /** 날짜를 고르면 'YYYY-MM-DD'로 호출됩니다. */
  onChange?: (value: ISODate | null) => void;
  /** 달력이 열려 있는지(`input`일 때, 제어). */
  open?: boolean;
  /** 처음에 달력을 열어 둘지(`input`일 때, 비제어). @default false */
  defaultOpen?: boolean;
  /** 달력이 열리거나 닫힐 때 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 처음 그려질 때 포커스를 줍니다 — `input`은 필드, `inline`은 날짜 칸. */
  autoFocus?: boolean;
  /** 폼 필드 이름. 기간은 name.start / name.end로 전송합니다. */
  name?: string;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_PLACEHOLDER = { single: 'YYYY.MM.DD', range: 'YYYY.MM.DD ~ YYYY.MM.DD' } as const;

/** 날짜 또는 기간을 선택합니다. 필드를 누르면 달력이 열리고(`input`), 달력만 둘 수도 있습니다(`inline`). */
export function DatePicker({
  variant = 'input', size = 'sm', placeholder, label, message, messageType, required, invalid, disabled, readOnly,
  value, defaultValue = null, onChange, rangeValue, defaultRangeValue = null, onRangeChange,
  selectionMode = 'single', open, defaultOpen = false, onOpenChange, autoFocus, name, className, style, id,
  'aria-label': ariaLabel, 'aria-describedby': describedBy, ...calendarProps
}: DatePickerProps) {
  const autoId = useId();
  const labelId = `${autoId}-label`;
  const valueId = `${autoId}-value`;
  const messageId = `${autoId}-message`;
  const readOnlyId = `${autoId}-readonly`;
  const requiredId = `${autoId}-required`;
  const hiddenLabelId = `${autoId}-name`;
  const [date, setDate] = useControllableState(value, defaultValue, onChange);
  const [range, setRange] = useControllableState<DateRange | null>(rangeValue, defaultRangeValue, onRangeChange as ((v: DateRange | null) => void) | undefined);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const hasMessage = message !== undefined && message !== null && message !== false;
  const hasLabel = label != null && label !== false;
  const isRange = selectionMode === 'range';
  const text = isRange ? (range ? `${formatDateText(range.start)} ~ ${formatDateText(range.end)}` : '') : formatDateText(date);
  const defaultName = isRange ? '기간 선택' : '날짜 선택';

  const hiddenInputs = name !== undefined && (isRange ? <>
      <input type="hidden" name={`${name}.start`} value={range?.start ?? ''} disabled={disabled} />
      <input type="hidden" name={`${name}.end`} value={range?.end ?? ''} disabled={disabled} />
    </> : <input type="hidden" name={name} value={date ?? ''} disabled={disabled} />);
  const messageNode = hasMessage && <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'helper')}>{message}</FieldMessage>;

  if (variant === 'inline') {
    return <div className={cx('ds-field', 'ds-date-picker', className)} style={style} data-variant="inline"
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={invalid || undefined}>
      {hasLabel && <FieldLabelRow required={required}><span className="ds-field__label" id={labelId}>{label}</span></FieldLabelRow>}
      <Calendar {...calendarProps} id={id} selectionMode={selectionMode} autoFocus={autoFocus}
        value={date} onChange={setDate} rangeValue={range} onRangeChange={setRange}
        disabled={disabled} readOnly={readOnly} invalid={invalid} required={required}
        aria-labelledby={hasLabel ? labelId : calendarProps['aria-labelledby']}
        aria-label={hasLabel ? undefined : ariaLabel ?? defaultName}
        aria-describedby={cx(describedBy, hasMessage && messageId) || undefined} />
      {hiddenInputs}
      {messageNode}
    </div>;
  }

  const canOpen = !disabled && !readOnly;
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Like Select: ArrowDown opens the calendar (Enter / Space are the button's own activation).
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && canOpen) {
      event.preventDefault();
      setOpen(true);
    }
  };
  // Figma date-picker_trigger: Default → (has a date) Completed → :hover Hover → Focus (keyboard) → Open (calendar below)
  // → Error → Read-only → Disabled. Colours are the Figma bindings colors/date-picker/trigger/outline/* (DatePicker.css).
  return <div className={cx('ds-field', 'ds-date-picker', className)} style={style} data-variant="input" data-size={size}
    data-filled={text ? true : undefined} data-open={(canOpen && isOpen) || undefined}
    data-invalid={invalid || undefined} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    {hasLabel && <FieldLabelRow required={required}><span className="ds-field__label" id={labelId}>{label}</span></FieldLabelRow>}
    <DialogTrigger isOpen={canOpen ? isOpen : false} onOpenChange={(next) => { if (canOpen) setOpen(next); }}>
      <Button id={id} className="ds-field__control ds-date-picker__trigger" isDisabled={disabled} autoFocus={autoFocus}
        // react-aria's Button only forwards its own ARIA props: aria-invalid (the field's error state) is set on the DOM node.
        ref={(node) => { if (node) { if (invalid) node.setAttribute('aria-invalid', 'true'); else node.removeAttribute('aria-invalid'); } }}
        // Name = visible value + label (WCAG 2.5.3 Label in Name): without a visible label the aria-label text is a hidden span.
        aria-labelledby={`${valueId} ${hasLabel ? labelId : hiddenLabelId}`}
        aria-describedby={cx(describedBy, hasMessage && messageId, readOnly && readOnlyId, required && requiredId) || undefined}
        onKeyDown={onKeyDown}>
        <span id={valueId} className="ds-date-picker__value" data-placeholder={text ? undefined : true}>
          {text || placeholder || DEFAULT_PLACEHOLDER[isRange ? 'range' : 'single']}
        </span>
        {/* Figma Read-only has no calendar icon. */}
        {!readOnly && <span className="ds-field__icon ds-date-picker__icon" aria-hidden="true"><CalendarDotsIcon /></span>}
      </Button>
      {/* Figma 사용 예시: the calendar opens 4px (spacing/margin/m-1) below the field, aligned to its start; it flips upward when there is no room. */}
      <Popover className="ds-date-picker__popover" placement="bottom start" offset={4}>
        <Dialog className="ds-date-picker__dialog" aria-labelledby={hasLabel ? labelId : undefined} aria-label={hasLabel ? undefined : ariaLabel ?? defaultName}>
          <Calendar {...calendarProps} selectionMode={selectionMode} autoFocus
            value={date} onChange={(next) => { setDate(next); setOpen(false); }}
            rangeValue={range} onRangeChange={(next) => { setRange(next); setOpen(false); }}
            invalid={invalid} required={required}
            aria-label={hasLabel ? undefined : ariaLabel ?? defaultName} aria-labelledby={hasLabel ? labelId : undefined} />
        </Dialog>
      </Popover>
    </DialogTrigger>
    {!hasLabel && <span id={hiddenLabelId} hidden>{ariaLabel ?? defaultName}</span>}
    {readOnly && <span id={readOnlyId} hidden>읽기 전용</span>}
    {required && <span id={requiredId} hidden>필수</span>}
    {hiddenInputs}
    {messageNode}
  </div>;
}
