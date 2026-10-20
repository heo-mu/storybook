import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { AlertStatus } from './Alert.options';
import { STATUS_ICON } from './statusIcon';

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'children'> & {
  /** 종류 — 안내 · 성공 · 오류. 종류마다 아이콘과 색이 다릅니다. @default 'information' */
  status?: AlertStatus;
  /** 제목. */
  title: ReactNode;
  /** 제목 아래 설명. 길면 줄을 바꿔 모두 보여 줍니다. */
  description?: ReactNode;
  /** 상태 아이콘을 표시합니다. @default true */
  showIcon?: boolean;
  /** 오른쪽에 놓는 버튼. 예: `<Button variant="tertiary" appearance="outline" size="xs">` */
  action?: ReactNode;
};

/**
 * 화면 안에 머물며 상태나 안내를 전하는 알림입니다.
 * 오류는 화면 낭독기가 바로 읽고(`role="alert"`), 안내 · 성공은 `role="status"`로 읽힙니다.
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
