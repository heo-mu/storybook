import type { DOMAttributes, ReactElement, ReactNode } from 'react';
import { Focusable, OverlayArrow, Tooltip as RACTooltip, TooltipTrigger } from 'react-aria-components';
import { cx } from '../../utils/cx';
import type { TooltipPlacement } from './Tooltip.options';

export type TooltipProps = {
  /** 툴팁에 보여 줄 설명. */
  content: ReactNode;
  /** 툴팁을 띄울 요소. ref와 props를 전달하는 컴포넌트여야 합니다(예: `Button`). */
  children: ReactElement;
  /** 나타날 쪽. 공간이 없으면 반대쪽에 나타납니다. @default 'top' */
  placement?: TooltipPlacement;
  /** 화살표를 표시합니다. @default true */
  showArrow?: boolean;
  /** 마우스를 올린 뒤 나타나기까지의 시간(ms). 키보드로 선택하면 바로 나타납니다. @default 500 */
  delay?: number;
  /** 마우스나 포커스가 떠난 뒤 닫히기까지의 시간(ms). @default 500 */
  closeDelay?: number;
  /** 열림 여부. 직접 제어할 때 씁니다. */
  open?: boolean;
  /** 처음 열림 여부. 직접 제어하지 않을 때 씁니다. */
  defaultOpen?: boolean;
  /** 툴팁이 열리거나 닫힐 때 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 툴팁을 끕니다. */
  disabled?: boolean;
  /** 툴팁 말풍선의 클래스. */
  className?: string;
  /** 툴팁 말풍선에 붙일 data 속성(예: 테스트 id). */
  [dataAttribute: `data-${string}`]: string | undefined;
};

/** Figma arrow (10 × 8 triangle) pointing at the trigger. */
const ARROW: Record<TooltipPlacement, { w: number; h: number; d: string }> = {
  top: { w: 10, h: 8, d: 'M0 0H10L5 8Z' },
  bottom: { w: 10, h: 8, d: 'M5 0L10 8H0Z' },
  left: { w: 8, h: 10, d: 'M0 0L8 5L0 10Z' },
  right: { w: 8, h: 10, d: 'M8 0V10L0 5Z' },
};

/**
 * 마우스를 올리거나 키보드로 선택하면 짧은 설명을 보여 주는 툴팁입니다. Esc를 누르면 닫힙니다.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  showArrow = true,
  delay = 500,
  closeDelay,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
  ...dataAttributes
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay} isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} isDisabled={disabled}>
      <Focusable>{children as ReactElement<DOMAttributes<Element>, string>}</Focusable>
      <RACTooltip {...dataAttributes} placement={placement} offset={8} className={cx('ds-tooltip', className)}>
        {showArrow && (
          <OverlayArrow className="ds-tooltip__arrow">
            {({ placement: side }) => {
              const a = ARROW[(side ?? placement) as TooltipPlacement] ?? ARROW[placement];
              return (
                <svg width={a.w} height={a.h} viewBox={`0 0 ${a.w} ${a.h}`} aria-hidden="true">
                  <path d={a.d} />
                </svg>
              );
            }}
          </OverlayArrow>
        )}
        <span className="ds-tooltip__text">{content}</span>
      </RACTooltip>
    </TooltipTrigger>
  );
}
