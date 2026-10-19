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
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

/**
 * Shows a toast in the default region. `timeout` (ms) closes it automatically — at least 5000 so it can be
 * read; pass `null` to keep it until closed. Returns the key for `closeToast(key)`.
 */
export function showToast(message: ReactNode, { status = 'information', timeout = 5000 }: { status?: AlertStatus; timeout?: number | null } = {}) {
  return toastQueue.add({ status, message }, timeout === null ? undefined : { timeout: Math.max(5000, timeout) });
}

/** Closes a toast shown with `showToast` (its returned key). */
export function closeToast(key: string) {
  toastQueue.close(key);
}
