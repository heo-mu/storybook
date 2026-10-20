import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { SegmentedControlContext } from './SegmentedControlContext';
import type { SegmentedControlSize } from './SegmentedControl.options';

export type SegmentedControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
  /** 크기. @default 'md' */
  size?: SegmentedControlSize;
  /** 선택한 옵션의 값(제어). */
  value?: string | null;
  /** 처음 선택된 옵션의 값(비제어). @default null */
  defaultValue?: string | null;
  /** 새로 고른 값과 함께 호출됩니다. */
  onChange?: (value: string) => void;
  /** 폼 전송에 쓰는 이름. @default 자동 생성 */
  name?: string;
  /** 모든 옵션을 비활성으로 만듭니다. */
  disabled?: boolean;
};

/**
 * 몇 개의 옵션을 나란히 보여 주고 그중 하나를 고르는 컨트롤입니다. 옵션들은 너비를 똑같이 나눠 쓰고,
 * 방향키로 선택이 이동합니다. `aria-label` 또는 `aria-labelledby`로 이름을 붙입니다.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { size = 'md', value, defaultValue = null, onChange, name, disabled, className, children, ...rest },
  ref,
) {
  const autoName = useId();
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange as ((v: string | null) => void) | undefined);
  const context = useMemo(
    () => ({ name: name ?? autoName, size, disabled, selected, select: (v: string) => setSelected(v) }),
    [name, autoName, size, disabled, selected, setSelected],
  );
  return (
    <div {...rest} ref={ref} role="radiogroup" aria-disabled={disabled || undefined} className={cx('ds-segmented', className)} data-size={size}>
      <SegmentedControlContext.Provider value={context}>{children}</SegmentedControlContext.Provider>
    </div>
  );
});
