import { useId, type DOMAttributes, type ReactElement, type ReactNode } from 'react';
import { Dialog as RACDialog, DialogTrigger, Heading, Modal, ModalOverlay, Pressable } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type DialogProps = {
  /** Figma "title". */
  title: ReactNode;
  /** Figma "description" — read as the dialog description. */
  description?: ReactNode;
  /** Content between the header and the buttons (not in the Figma component — see Dialog.mdx). */
  children?: ReactNode;
  /**
   * Figma "dialog_footer": the buttons (Figma: Button Tertiary · Solid · lg and Primary · Solid · lg, equal width).
   * A function receives `close`.
   */
  actions?: ReactNode | ((close: () => void) => ReactNode);
  /** Element that opens the dialog (forwards its ref and props, e.g. `Button`). Without it use `open`. */
  trigger?: ReactElement;
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Close by clicking outside. Escape always closes unless `keyboardDismissDisabled`. @default false */
  dismissable?: boolean;
  /** Keep the dialog open on Escape. @default false */
  keyboardDismissDisabled?: boolean;
  /** `alertdialog` for confirmations that interrupt the user. @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** Class of the dialog panel. */
  className?: string;
  /** Data attributes for the dialog panel (e.g. test ids). */
  [dataAttribute: `data-${string}`]: string | undefined;
};

/**
 * Figma component `dialog` (149:2838): a modal panel with title, description and buttons
 * (react-aria-components Modal + Dialog: focus moves in and is trapped, Escape closes, focus returns).
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
