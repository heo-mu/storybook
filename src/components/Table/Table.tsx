import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Button,
  Cell,
  CheckboxContext,
  Column,
  Row,
  Table as RACTable,
  TableBody as RACTableBody,
  TableHeader as RACTableHeader,
  useSlottedContext,
  type CellProps,
  type ColumnProps,
  type RowProps,
  type TableBodyProps as RACTableBodyProps,
  type TableHeaderProps as RACTableHeaderProps,
  type TableProps as RACTableProps,
} from 'react-aria-components';
import { CaretUpDownIcon, InfoIcon, ListIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { Checkbox } from '../Checkbox';
import { Tooltip } from '../Tooltip';

export type TableProps = Omit<RACTableProps, 'className'> & { className?: string };

/**
 * 여러 항목의 데이터를 행과 열로 보여 주는 표입니다. 화살표 키로 칸을 이동하고, 행 선택 · 정렬 · 행 동작을 지원합니다.
 * `onRowAction`이 있으면 행을 누를 수 있습니다.
 */
export function Table({ className, ...rest }: TableProps) {
  return <RACTable {...rest} className={cx('ds-table', className)} />;
}

export type TableHeaderProps<T> = Omit<RACTableHeaderProps<T>, 'className'> & { className?: string };

/** 열 머리글 행입니다. 안에 `TableColumn`을 넣습니다. */
export function TableHeader<T extends object>({ className, ...rest }: TableHeaderProps<T>) {
  return <RACTableHeader {...rest} className={cx('ds-table__header', className)} />;
}

export type TableColumnProps = Omit<ColumnProps, 'className' | 'children'> & {
  /** 열 제목. */
  children: ReactNode;
  /** 도움말. 넘기면 정보 아이콘이 붙고, 아이콘에 마우스를 올리거나 키보드로 선택하면 툴팁으로 보입니다. */
  info?: ReactNode;
  /** 화면 낭독기가 읽는 정보 아이콘 이름. @default '도움말' */
  infoLabel?: string;
  className?: string;
};

/**
 * 열 머리글입니다. `info`를 주면 도움말 아이콘, `allowsSorting`을 주면 정렬 아이콘이 붙습니다.
 * 정렬 중인 열은 아이콘 색이 바뀌고, 정렬 방향은 화면 낭독기에 전달됩니다.
 */
export function TableColumn({ children, info, infoLabel = '도움말', className, ...rest }: TableColumnProps) {
  return (
    <Column {...rest} className={cx('ds-table__column', className)}>
      {({ allowsSorting, sortDirection }) => (
        <span className="ds-table__column-content">
          <span className="ds-table__column-title">{children}</span>
          {info != null && info !== false && (
            <Tooltip content={info}>
              <span className="ds-table__info" role="img" aria-label={infoLabel} tabIndex={0}>
                <InfoIcon />
              </span>
            </Tooltip>
          )}
          {allowsSorting && <CaretUpDownIcon className="ds-table__sort" data-active={sortDirection ? true : undefined} />}
        </span>
      )}
    </Column>
  );
}

/** 전체 선택 체크박스 열입니다. `selectionMode="multiple"`일 때 씁니다. */
export function TableSelectionColumn({ className, ...rest }: { className?: string; [dataAttribute: `data-${string}`]: string | undefined }) {
  return (
    <Column {...rest} className={cx('ds-table__column', className)} data-type="checkbox">
      <TableCheckbox />
    </Column>
  );
}

/**
 * 제목이 보이지 않는 열입니다(예: 작업 · 편집 아이콘 열). `aria-label`로 열 이름을 붙이면 화면에는 보이지 않고 화면 낭독기가 읽습니다.
 */
export function TableEmptyColumn({
  className,
  'aria-label': label,
  ...rest
}: Omit<ColumnProps, 'className' | 'children'> & { className?: string; /** 열 이름. 화면에는 보이지 않고 화면 낭독기가 읽습니다. */ 'aria-label'?: string }) {
  return (
    <Column {...rest} aria-label={label} className={cx('ds-table__column', className)} data-type="empty">
      {label ? <span className="ds-table__sr">{label}</span> : null}
    </Column>
  );
}

export type TableBodyProps<T> = Omit<RACTableBodyProps<T>, 'className'> & { className?: string };

/** 표의 본문입니다. 행이 없을 때 보여 줄 내용(예: `EmptyState`)은 `renderEmptyState`로 넘깁니다. */
export function TableBody<T extends object>({ className, ...rest }: TableBodyProps<T>) {
  return <RACTableBody {...rest} className={cx('ds-table__body', className)} />;
}

export type TableRowProps<T> = Omit<RowProps<T>, 'className'> & { className?: string };

/** 본문 행입니다. 행 동작(`onRowAction`)이 있으면 마우스를 올리거나 누를 때 배경이 바뀝니다. */
export function TableRow<T extends object>({ className, ...rest }: TableRowProps<T>) {
  return <Row {...rest} className={cx('ds-table__row', className)} />;
}

export type TableCellProps = Omit<CellProps, 'className'> & {
  /** 글자 모양 — 보통(`text`, 기본) · 굵게(`strong`). 배지 · 버튼 같은 다른 내용은 칸 안에 그 컴포넌트를 넣습니다. */
  variant?: 'text' | 'strong';
  className?: string;
};

/** 본문 칸입니다. */
export function TableCell({ variant = 'text', className, children, ...rest }: TableCellProps) {
  return (
    <Cell {...rest} className={cx('ds-table__cell', className)} data-variant={variant}>
      {(renderProps) => <span className="ds-table__cell-content">{typeof children === 'function' ? children(renderProps) : children}</span>}
    </Cell>
  );
}

/** 행 선택 체크박스 칸입니다. */
export function TableSelectionCell({ className, ...rest }: { className?: string; [dataAttribute: `data-${string}`]: string | undefined }) {
  return (
    <Cell {...rest} className={cx('ds-table__cell', className)} data-type="checkbox">
      <TableCheckbox />
    </Cell>
  );
}

/** 행을 끌어서 순서를 바꾸는 손잡이입니다. `dragAndDropHooks`가 있는 표에서 씁니다. */
export function TableDragHandle({ 'aria-label': ariaLabel = '순서 이동' }: { 'aria-label'?: string }) {
  return (
    <Button slot="drag" className="ds-table__drag" aria-label={ariaLabel}>
      <ListIcon />
    </Button>
  );
}

/** The design-system Checkbox driven by react-aria's table selection (slot "selection"). */
function TableCheckbox() {
  const ctx = useSlottedContext(CheckboxContext, 'selection');
  if (!ctx) return null;
  return (
    <Checkbox
      size="md"
      checked={Boolean(ctx.isSelected)}
      indeterminate={Boolean(ctx.isIndeterminate)}
      disabled={ctx.isDisabled}
      aria-label={ctx['aria-label']}
      onChange={(event) => ctx.onChange?.(event.target.checked)}
    />
  );
}

export type KeyValueTableProps = ComponentPropsWithoutRef<'dl'>;

/**
 * 한 항목의 속성을 이름(키)과 값으로 보여 주는 표입니다. 안에 `KeyValueItem`을 넣습니다.
 * 키 열은 같은 너비(최소 160px)로 맞춰지고, 값 열이 나머지를 채웁니다.
 */
export function KeyValueTable({ className, ...rest }: KeyValueTableProps) {
  return <dl {...rest} className={cx('ds-kv', className)} />;
}

export type KeyValueItemProps = {
  /** 키(항목 이름). */
  label: ReactNode;
  /** 필수 표시. 이름 뒤에 빨간 점이 붙고, 화면 낭독기는 `requiredLabel`을 읽습니다. */
  required?: boolean;
  /** 필수 점을 화면 낭독기가 읽는 글자. @default '필수' */
  requiredLabel?: string;
  /** 값. 글자나 `Badge` 같은 컴포넌트를 넣습니다. */
  children: ReactNode;
  /**
   * 편집 칸. Input · Select · DatePicker(기간이면 두 개)를 넣으면 평소에는 글자처럼 보이고,
   * 마우스를 올리거나 편집하는 동안 입력 상자가 보입니다. @default false
   */
  editable?: boolean;
  /** 비활성 칸 배경. 안의 입력 컴포넌트에는 `disabled`를 따로 줍니다. */
  disabled?: boolean;
  /** 값 뒤에 붙는 단위 글자. */
  unit?: ReactNode;
  /** 값 내용을 세로로 쌓습니다(예: 파일 첨부 칸). @default false */
  stack?: boolean;
  /** 키 칸에 넘길 속성(예: 테스트 id). */
  keyProps?: ComponentPropsWithoutRef<'dt'> & { [dataAttribute: `data-${string}`]: string | undefined };
  /** 값 칸에 넘길 속성. */
  valueProps?: ComponentPropsWithoutRef<'dd'> & { [dataAttribute: `data-${string}`]: string | undefined };
};

/** 키-값 표의 한 행입니다. */
export function KeyValueItem({ label, required = false, requiredLabel = '필수', children, editable = false, disabled = false, unit, stack = false, keyProps, valueProps }: KeyValueItemProps) {
  return (
    <div className="ds-kv__row">
      <dt {...keyProps} className={cx('ds-kv__key', keyProps?.className)} data-required={required || undefined}>
        <span className="ds-kv__label">{label}</span>
        {required && (
          <span className="ds-kv__required" role="img" aria-label={requiredLabel} />
        )}
      </dt>
      <dd {...valueProps} className={cx('ds-kv__value', valueProps?.className)} data-editable={editable || undefined} data-disabled={disabled || undefined} data-stack={stack || undefined}>
        {children}
        {unit != null && unit !== false && <span className="ds-kv__unit">{unit}</span>}
      </dd>
    </div>
  );
}

/** 값 칸 안에서 여러 내용을 가로로 나란히 둡니다(예: 버튼과 안내 글자, 필터 칩과 초기화 버튼). */
export function KeyValueGroup({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return <span {...rest} className={cx('ds-kv__group', className)} />;
}
