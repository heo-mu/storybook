import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChipSize } from './Chip.options';

export type FilterChipProps = Omit<ButtonProps, 'children' | 'className' | 'isDisabled'> & {
  /** 크기. @default 'xs' */
  size?: ChipSize;
  /** 칩 글자 — 필터 이름이나 지금 적용된 값. */
  children: ReactNode;
  /** 선택됨 — 필터 값이 적용된 상태입니다. */
  selected?: boolean;
  /**
   * 펼침 — 메뉴나 패널이 열린 상태로, 위쪽 화살표가 보입니다.
   * `MenuTrigger` · `DialogTrigger` 안에서는 자동으로 정해집니다.
   */
  expanded?: boolean;
  /** 비활성 — 누를 수 없고 키보드 포커스를 받지 않습니다. */
  disabled?: boolean;
  className?: string;
};

/** 필터 메뉴나 패널을 여는 칩입니다. 적용된 조건과 펼침 상태를 표시하며 메뉴는 별도로 연결합니다. */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { size = 'xs', children, selected = false, expanded, disabled, className, ...rest },
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      className={cx('ds-chip', className)}
      data-kind="filter"
      data-size={size}
      data-selected={selected || undefined}
      {...(expanded !== undefined && { 'aria-expanded': expanded })}
      isDisabled={disabled}
    >
      <span className="ds-chip__label">{children}</span>
      <CaretDownIcon className="ds-chip__icon ds-chip__caret-down" />
      <CaretUpIcon className="ds-chip__icon ds-chip__caret-up" />
    </Button>
  );
});
