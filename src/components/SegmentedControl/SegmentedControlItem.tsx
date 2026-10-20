import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useSegmentedControl } from './SegmentedControlContext';

export type SegmentedControlItemProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'className' | 'style' | 'children' | 'size'> & {
  /** `SegmentedControl` 안에서 이 옵션을 구분하는 값. */
  value: string;
  /** 옵션 글자. */
  children: ReactNode;
  /** 이 옵션만 비활성으로 만듭니다. */
  disabled?: boolean;
  /** 옵션 요소의 클래스 이름. */
  className?: string;
  /** 옵션 요소의 스타일. */
  style?: CSSProperties;
};

/**
 * `SegmentedControl` 안의 옵션 하나입니다. 컨트롤의 값이 이 옵션의 `value`와 같으면 선택됨으로 표시됩니다.
 */
export const SegmentedControlItem = forwardRef<HTMLInputElement, SegmentedControlItemProps>(function SegmentedControlItem(
  { value, children, disabled, className, style, onChange, ...rest },
  ref,
) {
  const group = useSegmentedControl();
  const isDisabled = disabled ?? group?.disabled;
  return (
    <label className={cx('ds-segmented__item', className)} style={style} data-disabled={isDisabled || undefined}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        className="ds-segmented__input"
        name={group?.name}
        value={value}
        checked={group ? group.selected === value : undefined}
        disabled={isDisabled}
        onChange={(event) => {
          if (event.target.checked) group?.select(value);
          onChange?.(event);
        }}
      />
      <span className="ds-segmented__segment">
        <span className="ds-segmented__label">{children}</span>
      </span>
    </label>
  );
});
