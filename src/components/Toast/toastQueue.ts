import type { ReactNode } from 'react';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import type { AlertStatus } from '../Alert/Alert.options';

/** Content of a queued toast. */
export type ToastContent = {
  /** Figma "Status". @default 'information' */
  status?: AlertStatus;
  /** Figma "Alert Text". */
  message: ReactNode;
};

/**
 * The default queue rendered by `<ToastRegion />`.
 * @internal A react-aria UNSTABLE_ToastQueue — use `showToast` / `closeToast` (docs/public-api.md).
 */
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 3 });

/**
 * Shows a toast in the default region (Design System Rules 06). `timeout` (ms) closes it automatically — at least
 * 5000 so it can be read; `null` keeps it until closed. Default: 5000, and `null` for `status: 'error'` (an error
 * must be acknowledged). At most 3 toasts are on screen (older ones wait). Showing the same text with the same status
 * again replaces the visible one instead of stacking a duplicate. Returns the key for `closeToast(key)`.
 */
export function showToast(message: ReactNode, { status = 'information', timeout = status === 'error' ? null : 5000 }: { status?: AlertStatus; timeout?: number | null } = {}) {
  if (typeof message === 'string' || typeof message === 'number') {
    for (const toast of toastQueue.visibleToasts) {
      if (toast.content.message === message && (toast.content.status ?? 'information') === status) toastQueue.close(toast.key);
    }
  }
  return toastQueue.add({ status, message }, timeout === null ? undefined : { timeout: Math.max(5000, timeout) });
}

/** Closes a toast shown with `showToast` (its returned key). */
export function closeToast(key: string) {
  toastQueue.close(key);
}
