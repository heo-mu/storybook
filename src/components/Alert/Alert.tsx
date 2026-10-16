import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { AlertStatus } from './Alert.options';
import { STATUS_ICON } from './statusIcon';

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'children'> & {
  /** Figma "Status". @default 'information' */
  status?: AlertStatus;
  /** Figma "Alert Text". */
  title: ReactNode;
  /** Figma "Sub Text" ("Sub" on). */
  description?: ReactNode;
  /** Figma "Icon". @default true */
  showIcon?: boolean;
  /** Figma "Button": e.g. `<Button variant="tertiary" appearance="outline" size="xs">`. */
  action?: ReactNode;
};

/**
 * Figma component set `alert` (179:6087): an inline message with a status icon, title, description and an
 * optional action. Error alerts use role="alert" (announced at once), the others role="status".
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { status = 'information', title, description, showIcon = true, action, className, role, ...rest },
  ref,
) {
  const Icon = STATUS_ICON[status];
  return (
    <div {...rest} ref={ref} role={role ?? (status === 'error' ? 'alert' : 'status')} className={cx('ds-alert', className)} data-status={status}>
      <div className="ds-alert__body">
        {showIcon && <Icon className="ds-alert__icon" />}
        <div className="ds-alert__text">
          <div className="ds-alert__title">{title}</div>
          {description != null && description !== false && <div className="ds-alert__description">{description}</div>}
        </div>
      </div>
      {action != null && action !== false && <div className="ds-alert__action">{action}</div>}
    </div>
  );
});
