import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { TextButton } from '../Button';
import { EmptyState } from '../EmptyState';
import { Skeleton } from '../Skeleton';
import { ArrowCounterClockwiseIcon, CaretRightIcon, DatabaseIcon, InfoIcon, WarningCircleIcon, WarningIcon } from '../../icons';
import type { DataStateValue } from './DataState.options';

export type DataStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Figma "State". */
  state: DataStateValue;
  /** Figma "Empty Title", "Error Title" … of the state. Defaults to the Figma text of the state. */
  title?: ReactNode;
  /** Figma "Empty Description", "Error Description" … of the state. Defaults to the Figma text of the state (Partial: none — pass the counts); `null` hides it. */
  description?: ReactNode;
  /** Loading text. @default '데이터를 불러오는 중입니다' */
  loadingLabel?: ReactNode;
  /** Text of the button below the message (TextButton Primary · sm). Defaults to the Figma text of the state. */
  actionLabel?: ReactNode;
  /** Shows the button and is called when it is pressed. */
  onAction?: () => void;
  /** A custom element instead of the button. */
  action?: ReactNode;
};

type Content = { icon: ReactNode; title: string; description?: string; actionLabel: string; actionIcon: ReactNode };

// Figma text property defaults and icons of each state.
const CONTENT: Record<Exclude<DataStateValue, 'loading'>, Content> = {
  empty: {
    icon: <DatabaseIcon />,
    title: '아직 수집된 데이터가 없습니다',
    description: '수집 설정과 데이터 연결을 확인하세요.',
    actionLabel: '수집 설정 확인',
    actionIcon: <CaretRightIcon />,
  },
  'no-results': {
    icon: <InfoIcon />,
    title: '조회 결과가 없습니다',
    description: '기간이나 조회 대상을 변경해 보세요.',
    actionLabel: '조건 초기화',
    actionIcon: <ArrowCounterClockwiseIcon />,
  },
  error: {
    icon: <WarningCircleIcon />,
    title: '데이터를 불러오지 못했습니다',
    description: '연결 상태를 확인한 뒤 다시 시도하세요.',
    actionLabel: '다시 시도',
    actionIcon: <ArrowCounterClockwiseIcon />,
  },
  'no-access': {
    icon: <InfoIcon />,
    title: '조회 권한이 없습니다',
    description: '관리자에게 데이터 접근 권한을 요청하세요.',
    actionLabel: '권한 안내',
    actionIcon: <CaretRightIcon />,
  },
  partial: {
    icon: <WarningIcon />,
    title: '일부 데이터가 누락되었습니다',
    // Figma sample "130대 중 128대 수신 · 누락된 2대를 확인하세요." carries real counts — no default.
    actionLabel: '누락 내역 확인',
    actionIcon: <CaretRightIcon />,
  },
};

/**
 * Figma component set `data-state` (698:4359): what a data area shows instead of its content — Loading (three
 * skeleton bars and a label) or an empty-state message (Empty · No-results · Error · No-access · Partial) with an
 * icon, title, description and a TextButton. The region is a polite live region (`role="status"`).
 */
export const DataState = forwardRef<HTMLDivElement, DataStateProps>(function DataState(
  { state, title, description, loadingLabel = '데이터를 불러오는 중입니다', actionLabel, onAction, action, className, ...rest },
  ref,
) {
  if (state === 'loading') {
    return (
      <div role="status" aria-busy="true" {...rest} ref={ref} className={cx('ds-data-state', className)} data-state={state}>
        <div className="ds-data-state__skeleton">
          <Skeleton shape="line" />
          <Skeleton shape="shape4" />
          <Skeleton shape="block" />
        </div>
        <p className="ds-data-state__loading">{loadingLabel}</p>
      </div>
    );
  }
  const content = CONTENT[state];
  const button = onAction ? (
    <TextButton variant="primary" size="sm" rightIcon={content.actionIcon} onClick={onAction}>
      {actionLabel ?? content.actionLabel}
    </TextButton>
  ) : null;
  return (
    <div role="status" {...rest} ref={ref} className={cx('ds-data-state', className)} data-state={state}>
      <EmptyState
        icon={content.icon}
        title={title ?? content.title}
        description={description === undefined ? content.description : description}
        action={action ?? button}
      />
    </div>
  );
});
