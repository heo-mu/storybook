import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** 제목. */
  title: ReactNode;
  /** 제목 아래 설명. 가운데 정렬되며 길면 줄을 바꿉니다. */
  description?: ReactNode;
  /** 제목 위 아이콘(16px). 꾸밈으로 처리되어 화면 낭독기가 읽지 않습니다. */
  icon?: ReactNode;
  /** 글 아래 버튼. 할 일이 없으면 넣지 않습니다. 예: `<TextButton rightIcon={<CaretRightIcon />}>` */
  action?: ReactNode;
};

/** 목록이나 차트에 표시할 내용이 없을 때 이유와 다음 행동을 안내합니다. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState({ title, description, icon, action, className, ...rest }, ref) {
  return (
    <div {...rest} ref={ref} className={cx('ds-empty-state', className)}>
      <div className="ds-empty-state__text">
        {icon && (
          <span className="ds-empty-state__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <p className="ds-empty-state__title">{title}</p>
        {description != null && description !== false && <p className="ds-empty-state__description">{description}</p>}
      </div>
      {action != null && action !== false && <div className="ds-empty-state__action">{action}</div>}
    </div>
  );
});
