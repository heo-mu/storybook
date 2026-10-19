import type { DOMAttributes, ReactElement, ReactNode } from 'react';
import { Focusable, OverlayArrow, Tooltip as RACTooltip, TooltipTrigger } from 'react-aria-components';
import { cx } from '../../utils/cx';
import type { TooltipPlacement } from './Tooltip.options';

export type TooltipProps = {
  /** Figma "Message Text". */
  content: ReactNode;
  /** The element that shows the tooltip on hover and keyboard focus (must forward its ref and props, e.g. `Button`). */
  children: ReactElement;
  /** Figma "Placement": side of the trigger. Flips when there is no room. @default 'top' */
  placement?: TooltipPlacement;
  /** Figma "Arrow". @default true */
  showArrow?: boolean;
  /** Hover delay before showing, in ms (keyboard focus shows it at once) — Design System Rules 05. @default 500 */
  delay?: number;
  /** Delay before hiding, in ms. @default 500 */
  closeDelay?: number;
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Disables the tooltip. */
  disabled?: boolean;
  /** Class of the tooltip bubble. */
  className?: string;
  /** Data attributes for the tooltip bubble (e.g. test ids). */
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
 * Figma component set `tooltip` (149:1111): a short label shown on hover and keyboard focus
 * (react-aria-components TooltipTrigger: role="tooltip", aria-describedby on the trigger, Escape closes).
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
