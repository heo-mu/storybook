import { forwardRef, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  Button,
  Text,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastRegion as RACToastRegion,
  type UNSTABLE_ToastQueue,
} from 'react-aria-components';
import { XCircleFillIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { AlertStatus } from '../Alert/Alert.options';
import { STATUS_ICON } from '../Alert/statusIcon';
import { ButtonIconSlot } from '../Button/ButtonIconSlot';
import { TextButton } from '../Button/TextButton';
import { useToastStackMotion } from './toastMotion';
import { toastQueue, wasPushedOut, type ToastContent } from './toastQueue';

/** Figma toast close: `button_text` Primary sm, label "닫기" with the XCircle (fill) right icon. */
const CLOSE_TEXT = '닫기';

export type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 종류 — 안내 · 성공 · 주의 · 오류. @default 'information' */
  status?: AlertStatus;
  /** 제목(메시지). 한 줄로 보이며 길면 말줄임으로 잘립니다. */
  children: ReactNode;
  /** 제목 아래 설명(Figma Sub Text). 한 줄로 보이며 길면 말줄임으로 잘립니다. */
  description?: ReactNode;
  /** 종류 아이콘을 표시합니다(Figma Show Icon). @default true */
  showIcon?: boolean;
  /** "닫기" 버튼을 표시합니다. @default true */
  showClose?: boolean;
  /** 닫기 버튼을 누르면 호출됩니다. */
  onClose?: () => void;
  /** 화면 낭독기가 읽는 닫기 버튼 이름(보이는 글자는 "닫기"). @default '알림 닫기' */
  closeLabel?: string;
};

/** 작업 결과를 화면 아래 오른쪽에 잠깐 알립니다. 5초 뒤 자동으로 닫히고, "닫기"로 바로 닫을 수 있습니다. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { status = 'information', children, description, showIcon = true, showClose = true, onClose, closeLabel = '알림 닫기', className, ...rest },
  ref,
) {
  const Icon = STATUS_ICON[status];
  const hasDescription = description != null && description !== false;
  return (
    <div role="status" {...rest} ref={ref} className={cx('ds-toast', className)} data-status={status}>
      <div className="ds-toast__body">
        {showIcon && <Icon className="ds-toast__icon" />}
        <div className="ds-toast__content">
          <span className="ds-toast__message">{children}</span>
          {hasDescription && <span className="ds-toast__description">{description}</span>}
        </div>
      </div>
      {showClose && (
        <TextButton size="sm" className="ds-toast__close" rightIcon={<XCircleFillIcon />} aria-label={closeLabel} onClick={() => onClose?.()}>
          {CLOSE_TEXT}
        </TextButton>
      )}
    </div>
  );
});

export type ToastRegionProps = {
  /** 보여 줄 토스트 목록. 지정하지 않으면 `showToast`가 쓰는 기본 목록을 보여 줍니다. @default toastQueue */
  queue?: UNSTABLE_ToastQueue<ToastContent>;
  /** 화면 낭독기가 읽는 토스트 영역 이름. @default '알림' */
  'aria-label'?: string;
  /** 화면 낭독기가 읽는 닫기 버튼 이름(보이는 글자는 "닫기"). @default '알림 닫기' */
  closeLabel?: string;
  /** 영역의 클래스. 토스트가 나타나는 위치를 바꿀 때 씁니다. */
  className?: string;
};

/**
 * `showToast()`로 띄운 토스트가 나타나는 영역입니다. 앱에 한 번만 둡니다.
 * 화면 아래 오른쪽에 최신 토스트가 아래에서 위로 쌓이고(최대 3개), 토스트가 나타나면 화면 낭독기가 읽습니다.
 * 새 토스트는 아래에서 올라오며 먼저 온 토스트를 위로 밀어 올리고, 4번째가 오면 가장 오래된 토스트가 위로 밀려 나가 사라집니다.
 * 기기의 동작 줄이기 설정에서는 움직임 없이 바로 바뀝니다.
 * 마우스를 올리거나 키보드 포커스가 있는 동안에는 자동으로 닫히지 않습니다.
 */
export function ToastRegion({ queue = toastQueue, 'aria-label': ariaLabel = '알림', closeLabel = '알림 닫기', className }: ToastRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  useToastStackMotion(queue, regionRef, wasPushedOut);
  return (
    <RACToastRegion ref={regionRef} queue={queue} aria-label={ariaLabel} className={cx('ds-toast-region', className)}>
      {({ toast }) => {
        const status = toast.content.status ?? 'information';
        const Icon = STATUS_ICON[status];
        const hasDescription = toast.content.description != null && toast.content.description !== false;
        return (
          <RACToast toast={toast} className="ds-toast" data-status={status} data-toast-key={toast.key}>
            <RACToastContent className="ds-toast__body">
              {toast.content.showIcon !== false && <Icon className="ds-toast__icon" />}
              <div className="ds-toast__content">
                <Text slot="title" className="ds-toast__message">
                  {toast.content.message}
                </Text>
                {hasDescription && (
                  <Text slot="description" className="ds-toast__description">
                    {toast.content.description}
                  </Text>
                )}
              </div>
            </RACToastContent>
            {/* The same DOM and classes as TextButton (sm, primary) on react-aria's close button (focus management + queue.close). */}
            <Button slot="close" className="ds-button-base ds-text-button ds-toast__close" data-variant="primary" data-size="sm" aria-label={closeLabel}>
              <span className="ds-button__label">{CLOSE_TEXT}</span>
              <ButtonIconSlot>
                <XCircleFillIcon />
              </ButtonIconSlot>
            </Button>
          </RACToast>
        );
      }}
    </RACToastRegion>
  );
}
