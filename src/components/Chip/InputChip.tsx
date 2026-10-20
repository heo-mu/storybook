import { forwardRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react';
import { XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { ChipSize } from './Chip.options';

export type InputChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  /** 크기. @default 'xs' */
  size?: ChipSize;
  /** 칩 글자 — 입력한 값. */
  children: ReactNode;
  /** 칩을 누르거나(클릭 · Enter · Space) Delete · Backspace를 누르면 호출됩니다. */
  onRemove?: () => void;
  /** 화면 낭독기가 라벨 뒤에 읽는 말. @default '삭제' */
  removeLabel?: string;
};

/**
 * 입력한 값을 보여 주고 지울 수 있는 칩입니다. 칩 전체가 지우기 버튼이고, `disabled`이면 누를 수 없습니다.
 */
export const InputChip = forwardRef<HTMLButtonElement, InputChipProps>(function InputChip(
  { size = 'xs', children, onRemove, removeLabel = '삭제', onClick, onKeyDown, className, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={cx('ds-chip', className)}
      data-kind="input"
      data-size={size}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onRemove?.();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.key === 'Delete' || event.key === 'Backspace')) {
          event.preventDefault();
          onRemove?.();
        }
      }}
    >
      <span className="ds-chip__label">{children}</span>
      <span className="ds-chip__sr"> {removeLabel}</span>
      <XIcon className="ds-chip__icon" />
    </button>
  );
});
