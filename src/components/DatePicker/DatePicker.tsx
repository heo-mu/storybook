import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { CalendarDotsIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Calendar, type ISODate } from '../Calendar';
import { FieldLabelRow, FieldMessage, type FieldMessageType, type FieldSize } from '../Field';
import { formatDateText, parseDateText } from './dateText';

export type DatePickerProps = {
  /** 크기. @default 'sm' */
  size?: FieldSize;
  /** 입력 칸 위 라벨. 라벨이 없으면 `aria-label`을 붙입니다. */
  label?: ReactNode;
  /** 비어 있을 때 보이는 안내 글자. @default 'YYYY.MM.DD' */
  placeholder?: string;
  /** 입력 칸 아래 도움말 메시지. */
  message?: ReactNode;
  /** 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. @default 오류이면 'error', 그 밖에는 'helper' */
  messageType?: FieldMessageType;
  /** 오류 상태. 없는 날짜나 고를 수 없는 날짜를 입력해도 오류 상태가 됩니다. */
  invalid?: boolean;
  /** 비활성 — 입력할 수 없습니다. */
  disabled?: boolean;
  /** 읽기 전용 — 날짜만 보여 주고 달력 버튼이 없습니다. */
  readOnly?: boolean;
  /** 꼭 입력해야 하는 칸 — 라벨 뒤에 점을 붙이고, 입력 칸에 `required`를 넘겨 화면 낭독기가 "필수"로 읽습니다. */
  required?: boolean;
  /** 선택된 날짜 'YYYY-MM-DD'. 넘기면 바깥에서 값을 관리합니다. `null`이면 비어 있습니다. */
  value?: ISODate | null;
  /** 처음 날짜. `value` 없이 입력 칸이 스스로 값을 관리할 때 씁니다. @default null */
  defaultValue?: ISODate | null;
  /** 날짜가 바뀌면 새 날짜로, 입력 칸을 비우면 `null`로 호출됩니다. */
  onChange?: (value: ISODate | null) => void;
  /** 고를 수 있는 가장 이른 날짜. */
  minValue?: ISODate;
  /** 고를 수 있는 가장 늦은 날짜. */
  maxValue?: ISODate;
  /** 날짜별로 고를 수 없는 날을 정합니다. `true`를 돌려주면 고를 수 없습니다. */
  isDateUnavailable?: (date: ISODate) => boolean;
  /** 달력이 열렸는지 여부. 넘기면 바깥에서 관리합니다. */
  open?: boolean;
  /** 달력이 열리거나 닫히면 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 폼 필드 이름. 폼을 보낼 때 'YYYY-MM-DD' 값이 전송됩니다. */
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  /** 화면 낭독기가 읽는 달력 버튼 이름. @default '달력 열기' */
  calendarButtonLabel?: string;
  /** 가장 바깥 요소의 클래스 이름. */
  className?: string;
  /** 가장 바깥 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * 날짜를 직접 입력하거나 달력에서 고르는 입력 칸입니다. 입력한 날짜는 Enter를 누르거나 입력 칸을 벗어나면 확정되고,
 * 달력 버튼이나 Alt + ↓로 달력을 엽니다.
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
  required = false,
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
      data-open={isOpen || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {hasLabel && (
        <FieldLabelRow required={required}>
          <label className="ds-field__label" id={labelId} htmlFor={inputId}>
            {label}
          </label>
        </FieldLabelRow>
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
        <FieldMessage id={messageId} type={messageType ?? (isInvalid ? 'error' : 'helper')}>
          {message}
        </FieldMessage>
      )}
    </div>
  );
}
