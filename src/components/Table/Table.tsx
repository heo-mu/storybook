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
 * Data table built from the Figma `table_header` (351:3452) and `table_body` (355:3739) cells, composed as in the
 * Figma table_data example (react-aria-components Table: grid keyboard navigation, selection, sorting, row actions).
 * Rows are clickable when `onRowAction` is set (Figma example Hover / Pressed).
 */
export function Table({ className, ...rest }: TableProps) {
  return <RACTable {...rest} className={cx('ds-table', className)} />;
}

export type TableHeaderProps<T> = Omit<RACTableHeaderProps<T>, 'className'> & { className?: string };

/** Header row of `TableColumn`s. */
export function TableHeader<T extends object>({ className, ...rest }: TableHeaderProps<T>) {
  return <RACTableHeader {...rest} className={cx('ds-table__header', className)} />;
}

export type TableColumnProps = Omit<ColumnProps, 'className' | 'children'> & {
  /** Figma "Title". */
  children: ReactNode;
  /** Figma "Info": help text shown in a tooltip on the info icon. */
  info?: ReactNode;
  /** Accessible name of the info icon. @default '도움말' */
  infoLabel?: string;
  className?: string;
};

/**
 * Figma `table_header` Type Text. "Filter" = `allowsSorting` (CaretUpDown; the sort order is announced with
 * aria-sort, the icon turns …/icon/active while sorted), "Info" = `info`.
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

/** Figma `table_header` Type Checkbox: the select-all column (selectionMode="multiple"). */
export function TableSelectionColumn({ className, ...rest }: { className?: string; [dataAttribute: `data-${string}`]: string | undefined }) {
  return (
    <Column {...rest} className={cx('ds-table__column', className)} data-type="checkbox">
      <TableCheckbox />
    </Column>
  );
}

/** Figma `table_header` Type Empty: a column without a title (e.g. for actions); name it with `aria-label`. */
export function TableEmptyColumn({ className, ...rest }: Omit<ColumnProps, 'className' | 'children'> & { className?: string }) {
  return <Column {...rest} className={cx('ds-table__column', className)} data-type="empty" />;
}

export type TableBodyProps<T> = Omit<RACTableBodyProps<T>, 'className'> & { className?: string };

/** Rows of the table; `renderEmptyState` shows e.g. an `EmptyState` when there are no rows. */
export function TableBody<T extends object>({ className, ...rest }: TableBodyProps<T>) {
  return <RACTableBody {...rest} className={cx('ds-table__body', className)} />;
}

export type TableRowProps<T> = Omit<RowProps<T>, 'className'> & { className?: string };

/** A body row. Hover / Pressed backgrounds (Figma example) apply when the row has an action. */
export function TableRow<T extends object>({ className, ...rest }: TableRowProps<T>) {
  return <Row {...rest} className={cx('ds-table__row', className)} />;
}

export type TableCellProps = Omit<CellProps, 'className'> & {
  /** Figma `table_body` Type: Text (default) or Strong Text. Other types are their components inside the cell. */
  variant?: 'text' | 'strong';
  className?: string;
};

/** Figma `table_body` cell. */
export function TableCell({ variant = 'text', className, children, ...rest }: TableCellProps) {
  return (
    <Cell {...rest} className={cx('ds-table__cell', className)} data-variant={variant}>
      {(renderProps) => <span className="ds-table__cell-content">{typeof children === 'function' ? children(renderProps) : children}</span>}
    </Cell>
  );
}

/** Figma `table_body` Type Checkbox: the row selection cell. */
export function TableSelectionCell({ className, ...rest }: { className?: string; [dataAttribute: `data-${string}`]: string | undefined }) {
  return (
    <Cell {...rest} className={cx('ds-table__cell', className)} data-type="checkbox">
      <TableCheckbox />
    </Cell>
  );
}

/** Figma `table_body` Type Reorder: drag handle (List icon) for tables with `dragAndDropHooks`. */
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
 * Figma table_key-value (example 855:9118): `KeyValueItem`s in a two-column list (`<dl>`). Keys share one column
 * (at least 160px), values fill the rest; only the first row has a top border.
 */
export function KeyValueTable({ className, ...rest }: KeyValueTableProps) {
  return <dl {...rest} className={cx('ds-kv', className)} />;
}

export type KeyValueItemProps = {
  /** Figma `table_key` "Title". */
  label: ReactNode;
  /** Figma `table_key` Type Required: red dot after the label (and `requiredLabel` for screen readers). */
  required?: boolean;
  /** Text read for the required dot. @default '필수' */
  requiredLabel?: string;
  /** Figma `table_value` content: text (Type Text) or a component such as `Badge` (Type Badge). */
  children: ReactNode;
  /**
   * Figma `table_value_editable` (management mode) with a field — Input, Select, DatePicker (or two for a range):
   * the field shows no frame until it is hovered or focused, so the value reads like text. @default false
   */
  editable?: boolean;
  /** Figma `table_value_editable` State Disabled: the cell background (the controls inside take `disabled`). */
  disabled?: boolean;
  /** Text after the value (Figma "단위", "Show unit"). */
  unit?: ReactNode;
  /** Stack the value content vertically, m-2 apart (Figma File Upload cell). @default false */
  stack?: boolean;
  /** Data attributes for the key cell (e.g. test ids). */
  keyProps?: ComponentPropsWithoutRef<'dt'> & { [dataAttribute: `data-${string}`]: string | undefined };
  /** Data attributes for the value cell. */
  valueProps?: ComponentPropsWithoutRef<'dd'> & { [dataAttribute: `data-${string}`]: string | undefined };
};

/** One row: Figma `table_key` (355:4193) + `table_value` (355:4460). */
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

/** A row of value content m-2 apart (e.g. a button and its hint, or chips and a reset button). */
export function KeyValueGroup({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return <span {...rest} className={cx('ds-kv__group', className)} />;
}
