import { useId, type CSSProperties, type ReactNode } from 'react';
import { Button, Label, ListBox, Popover, Select as AriaSelect, SelectValue, type Key } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { FieldLabelRow, FieldMessage, type FieldMessageType, type FieldSize } from '../Field';
import { SelectSizeContext } from './SelectContext';

export type SelectProps<T extends object = object> = {
  /** 크기. 옵션 높이도 함께 맞춰집니다. @default 'sm' */
  size?: FieldSize;
  /** 선택 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. */
  label?: ReactNode;
  /** 아무것도 고르지 않았을 때 보이는 글자. @default '내용 선택' */
  placeholder?: string;
  /** 선택 필드 아래에 보이는 도움말 메시지. */
  message?: ReactNode;
  /** 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. @default 오류이면 'error', 그 밖에는 'helper' */
  messageType?: FieldMessageType;
  /** 오류 — 오류 테두리로 표시합니다. */
  invalid?: boolean;
  /** 비활성 — 고를 수 없고 키보드 포커스를 받지 않습니다. */
  disabled?: boolean;
  /** 읽기 전용 — 화살표 없이 값만 보이고 목록이 펼쳐지지 않습니다. */
  readOnly?: boolean;
  /** 꼭 골라야 하는 칸 — 라벨 뒤에 점을 붙이고 화면 낭독기에 "필수"를 알립니다. `name`과 함께 쓰면 폼을 보낼 때 선택 여부를 검사합니다. */
  required?: boolean;
  /** 선택한 옵션의 `id`(제어). `null`이면 선택 없음입니다. */
  value?: Key | null;
  /** 처음 선택된 옵션의 `id`(비제어). @default null */
  defaultValue?: Key | null;
  /** 새로 고른 옵션의 `id`와 함께 호출됩니다. */
  onChange?: (value: Key | null) => void;
  /** 목록 펼침 여부(제어). */
  open?: boolean;
  /** 처음에 목록을 펼쳐 둘지 정합니다(비제어). */
  defaultOpen?: boolean;
  /** 목록이 펼쳐지거나 닫힐 때 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 폼 필드 이름. 주면 폼을 보낼 때 선택값이 함께 전송됩니다. */
  name?: string;
  /** 선택값을 보낼 폼의 `id`. */
  form?: string;
  /** 고를 수 없는 옵션의 `id` 목록. */
  disabledKeys?: Iterable<Key>;
  /** 옵션을 데이터로 만들 때 쓰는 목록. 이때 `children`은 `(item) => <SelectOption id={…}>…</SelectOption>` 함수입니다. */
  items?: Iterable<T>;
  /** `SelectOption` 요소들. `items`를 쓰면 옵션을 만드는 함수입니다. */
  children: ReactNode | ((item: T) => ReactNode);
  id?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** 바깥 요소의 클래스 이름. */
  className?: string;
  /** 바깥 요소의 스타일. 너비를 정하면 목록도 같은 너비로 펼쳐집니다. */
  style?: CSSProperties;
};

/** 옵션 목록에서 항목 하나를 선택합니다. SelectOption으로 목록을 구성합니다. */
export function Select<T extends object = object>({
  size = 'sm',
  label,
  placeholder = '내용 선택',
  message,
  messageType,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
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
  const requiredId = `${autoId}-required`;
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
        // The trigger is a button, which has no required state: "필수" is read as its description instead.
        aria-describedby={cx(describedBy, hasMessage && messageId, readOnly && readOnlyId, required && requiredId) || undefined}
      >
        {({ isOpen }) => (
          <>
            {label != null && label !== false && (
              <FieldLabelRow required={required}>
                <Label className="ds-field__label">{label}</Label>
              </FieldLabelRow>
            )}
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
            {required && (
              <span id={requiredId} hidden>
                필수
              </span>
            )}
            {hasMessage && (
              <FieldMessage id={messageId} type={messageType ?? (invalid ? 'error' : 'helper')}>
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
