import type { ReactNode } from 'react';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import type { AlertStatus } from '../Alert/Alert.options';

/** 토스트 목록에 들어가는 토스트 하나의 내용. */
export type ToastContent = {
  /** 종류 — 안내 · 성공 · 주의 · 오류. @default 'information' */
  status?: AlertStatus;
  /** 제목(메시지). 한 줄로 보입니다. */
  message: ReactNode;
  /** 제목 아래 설명(Figma Sub Text). 없으면 제목만 보입니다. */
  description?: ReactNode;
  /** 종류 아이콘을 보일지 여부(Figma Show Icon). @default true */
  showIcon?: boolean;
};

/** 한 번에 보이는 토스트 수(Design System Rules 06: 최대 3개). */
export const MAX_VISIBLE_TOASTS = 3;
/** 토스트가 보이는 시간(ms) — Rules 06: 1개당 5초. 더 짧게 정할 수 없습니다. */
export const TOAST_TIMEOUT = 5000;

/**
 * `<ToastRegion />`이 보여 주는 기본 토스트 목록입니다.
 * @internal 직접 쓰지 말고 `showToast` · `closeToast`를 씁니다.
 */
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: MAX_VISIBLE_TOASTS });

/** Keys of toasts that a newer toast pushed out (Rules 06) — the region plays them rising out of the stack. */
const pushedOut = new Set<string>();

/**
 * Whether the toast `key` left because a newer toast pushed it out (it then rises and fades) rather than being closed.
 * Each mark is read once. @internal Used by `ToastRegion`'s stack motion.
 */
export function wasPushedOut(key: string) {
  return pushedOut.delete(key);
}

export type ShowToastOptions = {
  /** 종류. @default 'information' */
  status?: AlertStatus;
  /** 제목 아래 설명. */
  description?: ReactNode;
  /** 종류 아이콘 표시 여부. @default true */
  showIcon?: boolean;
  /** 자동으로 닫히는 시간(ms). 5000보다 짧게 정할 수 없고, `null`이면 닫을 때까지 남습니다. @default 5000 */
  timeout?: number | null;
};

/**
 * 토스트를 띄우고, `closeToast(key)`에 넘길 key를 돌려줍니다.
 * Design System Rules 06(2026-10-28): 모든 종류가 5초 뒤 자동으로 닫히고(`timeout`은 5000 이상, `null`이면 닫을 때까지 유지),
 * 한 번에 3개까지 보이며 네 번째가 오면 가장 오래된 토스트가 밀려 나가 사라집니다.
 * 같은 문구와 종류를 다시 보내면 겹쳐 쌓지 않고 새로 바꿔 보여 줍니다.
 */
export function showToast(message: ReactNode, { status = 'information', description, showIcon, timeout = TOAST_TIMEOUT }: ShowToastOptions = {}) {
  if (typeof message === 'string' || typeof message === 'number') {
    for (const toast of toastQueue.visibleToasts) {
      if (toast.content.message === message && (toast.content.status ?? 'information') === status) toastQueue.close(toast.key);
    }
  }
  // Rules 06: a fourth toast pushes the oldest one out (visibleToasts is newest first — the oldest is last).
  while (toastQueue.visibleToasts.length >= MAX_VISIBLE_TOASTS) {
    const oldest = toastQueue.visibleToasts[toastQueue.visibleToasts.length - 1];
    pushedOut.add(oldest.key);
    // A mark is normally read by the region at once; keep only the latest few if no region is showing them.
    if (pushedOut.size > MAX_VISIBLE_TOASTS * 4) pushedOut.delete(pushedOut.values().next().value!);
    toastQueue.close(oldest.key);
  }
  return toastQueue.add({ status, message, description, showIcon }, timeout === null ? undefined : { timeout: Math.max(TOAST_TIMEOUT, timeout) });
}

/** `showToast`가 돌려준 key로 그 토스트를 닫습니다. */
export function closeToast(key: string) {
  toastQueue.close(key);
}
