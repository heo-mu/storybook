import { forwardRef, useId, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { hasSlot } from '../../utils/hasSlot';
import { ButtonIconSlot } from './ButtonIconSlot';
import { resolveAppearance, type ButtonDisabledProp, type ButtonShape, type ButtonSize, type ButtonToneProps } from './Button.options';

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'disabled'> &
  ButtonToneProps &
  ButtonDisabledProp & {
    /** 크기. @default 'xs' */
    size?: ButtonSize;
    /** 모서리 모양. @default 'square' */
    shape?: ButtonShape;
    /** 글자 왼쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. */
    leftIcon?: ReactNode;
    /** 글자 오른쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. */
    rightIcon?: ReactNode;
    /** 버튼 글자. */
    children: ReactNode;
    /**
     * 처리 중(Figma Form 사용 예시 "저장 중"): 글자 자리에 회전 표시가 보이고 버튼은 Default 모양 · 크기를 유지합니다.
     * 누르거나 Enter · Space로 눌러도 `onClick` · 폼 제출이 일어나지 않고(중복 제출 방지), 포커스는 유지됩니다(`aria-busy` · `aria-disabled`).
     * @default false
     */
    loading?: boolean;
    /** 처리 중일 때 화면 낭독기가 읽는 상태 글자. @default '처리 중' */
    loadingLabel?: string;
  };

/** 저장·조회·다음 단계 이동 등 사용자 동작을 실행합니다. 동작의 중요도에 맞춰 종류를 선택합니다. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', appearance, size = 'xs', shape = 'square', leftIcon, rightIcon, children, className, type = 'button', loading = false, loadingLabel = '처리 중', onClick, ...rest },
  ref,
) {
  const labelId = useId();
  // While loading the name stays the label (the status text inside must not join it) unless the caller named the button.
  const labelledBy = loading && rest['aria-label'] == null && rest['aria-labelledby'] == null ? labelId : rest['aria-labelledby'];
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx('ds-button-base', 'ds-button', className)}
      data-variant={variant}
      data-appearance={resolveAppearance(variant, appearance)}
      data-size={size}
      data-shape={shape}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading ? true : rest['aria-disabled']}
      aria-labelledby={labelledBy}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (loading) {
          // Figma: the saving button cannot be pressed again — no second submit, no onClick.
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {hasSlot(leftIcon) && <ButtonIconSlot>{leftIcon}</ButtonIconSlot>}
      <span id={labelId} className="ds-button__label">
        {children}
      </span>
      {hasSlot(rightIcon) && <ButtonIconSlot>{rightIcon}</ButtonIconSlot>}
      {loading && (
        <>
          {/* Figma `loading` size=sm Type=Inverse (16px, 2px arc) centred over the hidden label; the arc takes the label colour. */}
          <span className="ds-button__loading ds-loading" data-size="sm" aria-hidden="true">
            <span className="ds-loading__spinner" />
          </span>
          {/* role=status takes no name from its content, so the label is also its aria-label. */}
          <span role="status" aria-label={loadingLabel} className="ds-button__sr">
            {loadingLabel}
          </span>
        </>
      )}
    </button>
  );
});
