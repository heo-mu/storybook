import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  Button,
  Text,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastRegion as RACToastRegion,
  type UNSTABLE_ToastQueue,
} from 'react-aria-components';
import { XIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { AlertStatus } from '../Alert/Alert.options';
import { STATUS_ICON } from '../Alert/statusIcon';
import { toastQueue, type ToastContent } from './toastQueue';

export type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "Status". @default 'information' */
  status?: AlertStatus;
  /** Figma "Alert Text". */
  children: ReactNode;
  /** Figma "Close Icon". @default true */
  showClose?: boolean;
  /** Called by the close button. */
  onClose?: () => void;
  /** Accessible name of the close button. @default '알림 닫기' */
  closeLabel?: string;
};

/**
 * Figma component set `toast` (91:5927) as a static element (e.g. inside a page). For notifications that appear
 * and disappear use `<ToastRegion />` with `showToast()`.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { status = 'information', children, showClose = true, onClose, closeLabel = '알림 닫기', className, ...rest },
  ref,
) {
  const Icon = STATUS_ICON[status];
  return (
    <div role="status" {...rest} ref={ref} className={cx('ds-toast', className)} data-status={status}>
      <div className="ds-toast__body">
        <Icon className="ds-toast__icon" />
        <span className="ds-toast__message">{children}</span>
      </div>
      {showClose && (
        <button type="button" className="ds-toast__close" aria-label={closeLabel} onClick={onClose}>
          <XIcon />
        </button>
      )}
    </div>
  );
});

export type ToastRegionProps = {
  /** Queue to show. @default toastQueue (used by `showToast`) */
  queue?: UNSTABLE_ToastQueue<ToastContent>;
  /** Accessible name of the region. @default '알림' */
  'aria-label'?: string;
  /** Accessible name of the close buttons. @default '알림 닫기' */
  closeLabel?: string;
  className?: string;
};

/**
 * Shows queued toasts (react-aria-components Toast — UNSTABLE in 1.22, wrapped here so the package API stays stable):
 * a labelled region, each toast announced, timers paused while hovered or focused, close button dismisses.
 */
export function ToastRegion({ queue = toastQueue, 'aria-label': ariaLabel = '알림', closeLabel = '알림 닫기', className }: ToastRegionProps) {
  return (
    <RACToastRegion queue={queue} aria-label={ariaLabel} className={cx('ds-toast-region', className)}>
      {({ toast }) => {
        const status = toast.content.status ?? 'information';
        const Icon = STATUS_ICON[status];
        return (
          <RACToast toast={toast} className="ds-toast" data-status={status}>
            <RACToastContent className="ds-toast__body">
              <Icon className="ds-toast__icon" />
              <Text slot="title" className="ds-toast__message">
                {toast.content.message}
              </Text>
            </RACToastContent>
            <Button slot="close" className="ds-toast__close" aria-label={closeLabel}>
              <XIcon />
            </Button>
          </RACToast>
        );
      }}
    </RACToastRegion>
  );
}
