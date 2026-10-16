import { useId, type CSSProperties, type ReactNode } from 'react';
import { Button, Label, ListBox, Popover, Select as AriaSelect, SelectValue, type Key } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { FieldMessage, type FieldMessageType, type FieldSize } from '../Field';
import { SelectSizeContext } from './SelectContext';

export type SelectProps<T extends object = object> = {
  /** Figma "Size". @default 'sm' */
  size?: FieldSize;
  /** Figma "Label" + "Label Text". Without a label, set `aria-label`. */
  label?: ReactNode;
  /** Figma "Display Text" while nothing is selected. @default '내용 선택' */
  placeholder?: string;
  /** Figma "Alert" + select_message text. */
  message?: ReactNode;
  /** Figma select_message "Type". @default 'error' when invalid, otherwise 'info' */
  messageType?: FieldMessageType;
  /** Figma State "Error". */
  invalid?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Figma State "Read-only": shows the value without the caret; the list does not open. */
  readOnly?: boolean;
  /** Requires a selection (native form validation through the hidden `<select>`). */
  required?: boolean;
  /** Selected option id (controlled); `null` = nothing selected. */
  value?: Key | null;
  /** Initially selected option id (uncontrolled). @default null */
  defaultValue?: Key | null;
  /** Called with the newly selected option id. */
  onChange?: (value: Key | null) => void;
  /** Figma State "Open" (controlled). */
  open?: boolean;
  /** Initially open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Form field name (renders a hidden native `<select>`). */
  name?: string;
  /** Id of the form the hidden `<select>` belongs to. */
  form?: string;
  /** Option ids that cannot be selected. */
  disabledKeys?: Iterable<Key>;
  /** Data for dynamic options; `children` is then a function `(item) => <SelectOption id={…}>…</SelectOption>`. */
  items?: Iterable<T>;
  /** `SelectOption` elements, or a render function when `items` is given. */
  children: ReactNode | ((item: T) => ReactNode);
  id?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Class name of the root element. */
  className?: string;
  /** Style of the root element (e.g. its width — the list is as wide as the field). */
  style?: CSSProperties;
};

/**
 * Figma component set `select` (95:4740) with `listbox` (97:2665), `option` (97:2286) and `select_message`
 * (95:2960). Keyboard, focus, typeahead and ARIA come from react-aria-components (button + listbox
 * popover); all styles are the Figma variables. State: Hover = :hover, Open = list open, Completed = has a
 * value, Error = `invalid`, Disabled = `disabled`, Read-only = `readOnly`.
 */
export function Select<T extends object = object>({
  size = 'sm',
  label,
  placeholder = '내용 선택',
  message,
  messageType,
  invalid = false,
  disabled = false,
  readOnly = false,
  required,
  value,
  defaultValue = null,
  onChange,
  open,
  defaultOpen,
  onOpenChange,
  items,
  children,
  className,
  style,
  'aria-describedby': describedBy,
  ...rest
}: SelectProps<T>) {
  const autoId = useId();
  const messageId = `${autoId}-message`;
  const readOnlyId = `${autoId}-readonly`;
  const [selected, setSelected] = useControllableState<Key | null>(value, defaultValue, onChange);
  const hasMessage = message !== undefined && message !== null && message !== false;

  return (
    <SelectSizeContext.Provider value={size}>
      <AriaSelect
        {...rest}
        className={cx('ds-field', 'ds-select', className)}
        style={style}
        data-size={size}
        data-filled={selected != null || undefined}
        data-readonly={readOnly || undefined}
        placeholder={placeholder}
        value={selected}
        onChange={(next) => {
          if (!readOnly) setSelected(next as Key | null);
        }}
        isOpen={readOnly ? false : open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        isInvalid={invalid}
        isDisabled={disabled}
        isRequired={required}
        aria-describedby={cx(describedBy, hasMessage && messageId, readOnly && readOnlyId) || undefined}
      >
        {({ isOpen }) => (
          <>
            {label != null && label !== false && <Label className="ds-field__label">{label}</Label>}
            <Button className="ds-field__control ds-select__trigger">
              <SelectValue className="ds-select__value" />
              {!readOnly && (
                <span className="ds-field__icon ds-select__icon" aria-hidden="true">
                  {isOpen ? <CaretUpIcon /> : <CaretDownIcon />}
                </span>
              )}
            </Button>
            {readOnly && (
              <span id={readOnlyId} hidden>
                읽기 전용
              </span>
            )}
            {hasMessage && (
              <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'info')}>
                {message}
              </FieldMessage>
            )}
            {/* Figma select_example: the list sits spacing/margin/m-1 (4px) below the field and is as wide as it. */}
            <Popover className="ds-select__popover" offset={4}>
              <ListBox className="ds-listbox" items={items} data-size={size}>
                {children}
              </ListBox>
            </Popover>
          </>
        )}
      </AriaSelect>
    </SelectSizeContext.Provider>
  );
}
