import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { CheckIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import type { ChipSize } from './Chip.options';

export type ChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  /** 크기. @default 'xs' */
  size?: ChipSize;
  /** 칩 글자. */
  children: ReactNode;
  /** 선택됨 여부. 넘기면 선택 상태를 바깥에서 관리합니다. */
  selected?: boolean;
  /** 처음 선택됨 여부. `selected` 없이 칩이 스스로 상태를 관리할 때 씁니다. @default false */
  defaultSelected?: boolean;
  /** 칩을 눌러 선택이 바뀌면 새 값으로 호출됩니다. */
  onSelectedChange?: (selected: boolean) => void;
};

/**
 * 여러 개를 켜고 끄는 필터 칩입니다. 선택되면 글자 뒤에 체크 아이콘이 붙고, `disabled`이면 누를 수 없습니다.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size = 'xs', children, selected, defaultSelected = false, onSelectedChange, onClick, className, ...rest },
  ref,
) {
  const [isSelected, setSelected] = useControllableState(selected, defaultSelected, onSelectedChange);
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-chip', className)}
      data-kind="toggle"
      data-size={size}
      aria-pressed={isSelected}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) setSelected(!isSelected);
      }}
    >
      <span className="ds-chip__label">{children}</span>
      {isSelected && <CheckIcon className="ds-chip__icon" />}
    </button>
  );
});
