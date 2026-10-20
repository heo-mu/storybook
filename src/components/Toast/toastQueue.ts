import type { ReactNode } from 'react';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import type { AlertStatus } from '../Alert/Alert.options';

/** 토스트 목록에 들어가는 토스트 하나의 내용. */
export type ToastContent = {
  /** 종류 — 안내 · 성공 · 오류. @default 'information' */
  status?: AlertStatus;
  /** 메시지. */
  message: ReactNode;
};

/**
 * `<ToastRegion />`이 보여 주는 기본 토스트 목록입니다.
 * @internal 직접 쓰지 말고 `showToast` · `closeToast`를 씁니다.
 */
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 3 });

/**
 * 토스트를 띄우고, `closeToast(key)`에 넘길 key를 돌려줍니다.
 * `timeout`(ms)이 지나면 자동으로 닫히며 5000보다 짧게 정할 수 없습니다. 기본은 5000이고, `status: 'error'` · `'warning'`은 `null`(닫을 때까지 유지)입니다.
 * 한 번에 3개까지 보이고 오래된 토스트는 기다립니다. 같은 문구와 종류를 다시 보내면 겹쳐 쌓지 않고 새로 바꿔 보여 줍니다.
 */
export function showToast(message: ReactNode, { status = 'information', timeout = status === 'error' || status === 'warning' ? null : 5000 }: { status?: AlertStatus; timeout?: number | null } = {}) {
  if (typeof message === 'string' || typeof message === 'number') {
    for (const toast of toastQueue.visibleToasts) {
      if (toast.content.message === message && (toast.content.status ?? 'information') === status) toastQueue.close(toast.key);
    }
  }
  return toastQueue.add({ status, message }, timeout === null ? undefined : { timeout: Math.max(5000, timeout) });
}

/** `showToast`가 돌려준 key로 그 토스트를 닫습니다. */
export function closeToast(key: string) {
  toastQueue.close(key);
}
