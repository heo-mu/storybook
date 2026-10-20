import { useId, type DOMAttributes, type ReactElement, type ReactNode } from 'react';
import { Dialog as RACDialog, DialogTrigger, Heading, Modal, ModalOverlay, Pressable } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type DialogProps = {
  /** 제목. 화면 낭독기가 대화상자의 이름으로 읽습니다. */
  title: ReactNode;
  /** 제목 아래 설명. 화면 낭독기가 대화상자의 설명으로 읽습니다. */
  description?: ReactNode;
  /** 제목과 버튼 사이에 넣는 내용. */
  children?: ReactNode;
  /**
   * 아래쪽 버튼들. 같은 너비로 나란히 놓입니다(예: 취소는 Tertiary · Solid · lg, 주 행동은 Primary · Solid · lg).
   * 함수로 넘기면 대화상자를 닫는 `close`를 받습니다.
   */
  actions?: ReactNode | ((close: () => void) => ReactNode);
  /** 누르면 대화상자를 여는 요소. ref와 props를 전달하는 컴포넌트여야 합니다(예: `Button`). 없으면 `open`으로 엽니다. */
  trigger?: ReactElement;
  /** 열림 여부. 직접 제어할 때 씁니다. */
  open?: boolean;
  /** 처음 열림 여부. 직접 제어하지 않을 때 씁니다. */
  defaultOpen?: boolean;
  /** 대화상자가 열리거나 닫힐 때 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 바깥을 누르면 닫힙니다. Esc는 `keyboardDismissDisabled`가 아니면 항상 닫습니다. @default false */
  dismissable?: boolean;
  /** Esc를 눌러도 닫히지 않게 합니다. @default false */
  keyboardDismissDisabled?: boolean;
  /** 삭제 확인처럼 사용자의 흐름을 멈추는 확인에는 `alertdialog`를 씁니다. @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** 대화상자 패널의 클래스. */
  className?: string;
  /** 대화상자 패널에 붙일 data 속성(예: 테스트 id). */
  [dataAttribute: `data-${string}`]: string | undefined;
};

/**
 * 화면 위에 떠서 사용자의 응답을 받는 대화상자입니다.
 * 열리면 포커스가 안으로 옮겨져 머물고, Esc로 닫으면 연 요소로 돌아갑니다.
 */
export function Dialog({
  title,
  description,
  children,
  actions,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  dismissable = false,
  keyboardDismissDisabled = false,
  role = 'dialog',
  className,
  ...dataAttributes
}: DialogProps) {
  const descriptionId = useId();
  const hasDescription = description != null && description !== false;
  const overlay = (
    <ModalOverlay
      className="ds-dialog-overlay"
      isDismissable={dismissable}
      isKeyboardDismissDisabled={keyboardDismissDisabled}
      {...(trigger ? {} : { isOpen: open, defaultOpen, onOpenChange })}
    >
      <Modal className="ds-dialog-modal">
        <RACDialog {...dataAttributes} role={role} aria-describedby={hasDescription ? descriptionId : undefined} className={cx('ds-dialog', className)}>
          {({ close }) => (
            <>
              <div className="ds-dialog__header">
                <Heading slot="title" className="ds-dialog__title">
                  {title}
                </Heading>
                {hasDescription && (
                  <p id={descriptionId} className="ds-dialog__description">
                    {description}
                  </p>
                )}
              </div>
              {children != null && children !== false && <div className="ds-dialog__body">{children}</div>}
              {actions != null && actions !== false && <div className="ds-dialog__footer">{typeof actions === 'function' ? actions(close) : actions}</div>}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
  if (!trigger) return overlay;
  return (
    <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger as ReactElement<DOMAttributes<HTMLElement>, string>}</Pressable>
      {overlay}
    </DialogTrigger>
  );
}
