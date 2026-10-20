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
  /** 종류 — 안내 · 성공 · 주의 · 오류. @default 'information' */
  status?: AlertStatus;
  /** 메시지. 한 줄로 보이며 길면 말줄임으로 잘립니다. */
  children: ReactNode;
  /** 닫기 버튼을 표시합니다. @default true */
  showClose?: boolean;
  /** 닫기 버튼을 누르면 호출됩니다. */
  onClose?: () => void;
  /** 화면 낭독기가 읽는 닫기 버튼 이름. @default '알림 닫기' */
  closeLabel?: string;
};

/**
 * 토스트를 페이지 안에 고정으로 그립니다.
 * 나타났다 사라지는 토스트는 `<ToastRegion />`과 `showToast()`를 씁니다.
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
        <button type="button" className="ds-toast__close" aria-label={closeLabel} onClick={() => onClose?.()}>
          <XIcon />
        </button>
      )}
    </div>
  );
});

export type ToastRegionProps = {
  /** 보여 줄 토스트 목록. 지정하지 않으면 `showToast`가 쓰는 기본 목록을 보여 줍니다. @default toastQueue */
  queue?: UNSTABLE_ToastQueue<ToastContent>;
  /** 화면 낭독기가 읽는 토스트 영역 이름. @default '알림' */
  'aria-label'?: string;
  /** 화면 낭독기가 읽는 닫기 버튼 이름. @default '알림 닫기' */
  closeLabel?: string;
  /** 영역의 클래스. 토스트가 나타나는 위치를 바꿀 때 씁니다. */
  className?: string;
};

/**
 * `showToast()`로 띄운 토스트가 나타나는 영역입니다. 앱에 한 번만 둡니다.
 * 토스트가 나타나면 화면 낭독기가 읽고, 마우스를 올리거나 키보드로 선택한 동안에는 자동으로 닫히지 않습니다.
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
