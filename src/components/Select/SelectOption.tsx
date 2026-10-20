import type { CSSProperties, ReactNode } from 'react';
import { ListBoxItem, type ListBoxItemProps } from 'react-aria-components';
import { CheckIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useSelectSize } from './SelectContext';

export type SelectOptionProps<T extends object = object> = Omit<ListBoxItemProps<T>, 'className' | 'style' | 'children' | 'isDisabled'> & {
  /** 옵션 글자. */
  children: ReactNode;
  /** 비활성 — 고를 수 없고 키보드로 이동할 때 건너뜁니다. */
  disabled?: boolean;
  /** 선택된 옵션 글자 뒤에 체크 아이콘을 보여 줍니다. 끄면 굵은 글자로만 선택을 표시합니다. @default true */
  checkIcon?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * `Select` 목록 안의 옵션 하나입니다. `id`로 옵션을 구분하고, 선택되면 굵은 글자와 체크 아이콘으로 표시됩니다.
 */
export function SelectOption<T extends object = object>({ children, disabled, checkIcon = true, className, style, textValue, ...rest }: SelectOptionProps<T>) {
  const size = useSelectSize();
  return (
    <ListBoxItem
      {...rest}
      isDisabled={disabled}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={cx('ds-option', className)}
      style={style}
      data-size={size}
    >
      {({ isSelected }) => (
        <>
          <span className="ds-option__text">{children}</span>
          {isSelected && checkIcon && (
            <span className="ds-option__check" aria-hidden="true">
              <CheckIcon />
            </span>
          )}
        </>
      )}
    </ListBoxItem>
  );
}
