import type { ReactNode } from 'react';
import { CheckCircleFillIcon, InfoFillIcon, XCircleFillIcon } from '../../icons';
import { cx } from '../../utils/cx';

import type { FieldMessageType } from './Field.options';

const ICONS = { info: InfoFillIcon, success: CheckCircleFillIcon, error: XCircleFillIcon } as const;

/** Status message under a field (Figma input_message / textarea_message / select_message / date-picker_message). */
export function FieldMessage({ id, type, className, children }: { id?: string; type: FieldMessageType; className?: string; children: ReactNode }) {
  const Icon = ICONS[type];
  return (
    <p id={id} className={cx('ds-field-message', className)} data-type={type}>
      <Icon className="ds-field-message__icon" />
      <span className="ds-field-message__text">{children}</span>
    </p>
  );
}
