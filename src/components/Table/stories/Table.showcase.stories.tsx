import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useDragAndDrop, useListData } from 'react-aria-components';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import {
  KeyValueItem,
  KeyValueTable,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableDragHandle,
  TableEmptyColumn,
  TableHeader,
  TableRow,
  TableSelectionCell,
  TableSelectionColumn,
} from '../Table';
import { Badge } from '../../Badge';
import { Button } from '../../Button';
import { Switch } from '../../Switch';
import { NotePencilIcon } from '../../../icons';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs table` (sets table_header, table_body).
const meta = {
  title: "Components/Table/Gallery",
  id: 'components-table-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Item = { id: string; name: string; site: string; status: string };
const ROWS: Item[] = [
  { id: '1', name: '1호기 공조', site: '본관', status: '운영' },
  { id: '2', name: '2호기 공조', site: '별관', status: '점검' },
  { id: '3', name: '냉각탑', site: '옥상', status: '운영' },
];

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <Table aria-label="설비 목록" selectionMode="multiple" onRowAction={() => {}}>
      <TableHeader>
        <TableSelectionColumn />
        <TableColumn isRowHeader allowsSorting>
          설비명
        </TableColumn>
        <TableColumn info="설비가 설치된 건물">위치</TableColumn>
        <TableColumn>상태</TableColumn>
        <TableEmptyColumn aria-label="편집" />
      </TableHeader>
      <TableBody items={ROWS}>
        {(row) => (
          <TableRow id={row.id}>
            <TableSelectionCell />
            <TableCell variant="strong">{row.name}</TableCell>
            <TableCell>{row.site}</TableCell>
            <TableCell>
              <Badge dot={false} status={row.status === '운영' ? 'success' : 'warning'}>
                {row.status}
              </Badge>
            </TableCell>
            <TableCell>
              <NotePencilIcon aria-label="편집" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ),
};

/** One Figma header cell in a table of its own (one row, so select-all is enabled). */
function HeaderCell({ type }: { type: 'Text' | 'Checkbox' | 'Empty' }) {
  return (
    <Table aria-label={type} selectionMode={type === 'Checkbox' ? 'multiple' : 'none'}>
      <TableHeader>
        {type === 'Text' ? (
          <TableColumn isRowHeader data-figma="Type=Text">
            항목명
          </TableColumn>
        ) : type === 'Checkbox' ? (
          <TableSelectionColumn data-figma="Type=Checkbox" />
        ) : (
          <TableEmptyColumn aria-label="빈 열" data-figma="Type=Empty" />
        )}
      </TableHeader>
      <TableBody>
        <TableRow id="row">{type === 'Checkbox' ? <TableSelectionCell /> : <TableCell>-</TableCell>}</TableRow>
      </TableBody>
    </Table>
  );
}

/** 테이블 헤더의 구성과 상태를 비교합니다. */
export const HeaderMatrix: Story = {
  name: "Headers",
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <HeaderCell type="Text" />
      <HeaderCell type="Checkbox" />
      <HeaderCell type="Empty" />
    </div>
  ),
};

/** One Figma body cell: a table whose header is a narrow empty column, so the cell sets the width. */
function BodyCell({ figma, selection, variant, children }: { figma: string; selection?: boolean; variant?: 'text' | 'strong'; children?: ReactNode }) {
  return (
    <Table aria-label={figma} selectionMode={selection ? 'multiple' : 'none'}>
      <TableHeader>
        <TableEmptyColumn aria-label="열" isRowHeader />
      </TableHeader>
      <TableBody>
        <TableRow id="row">{selection ? <TableSelectionCell data-figma={figma} /> : <TableCell data-figma={figma} variant={variant}>{children}</TableCell>}</TableRow>
      </TableBody>
    </Table>
  );
}

function ReorderCell() {
  const list = useListData({ initialItems: [{ id: 'row' }] });
  const { dragAndDropHooks } = useDragAndDrop({ getItems: (keys) => [...keys].map((key) => ({ 'text/plain': String(key) })), onReorder: () => {} });
  return (
    <Table aria-label="Reorder" dragAndDropHooks={dragAndDropHooks}>
      <TableHeader>
        <TableEmptyColumn aria-label="열" isRowHeader />
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => (
          <TableRow id={item.id}>
            <TableCell data-figma="Type=Reorder">
              <TableDragHandle />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

/** 텍스트·버튼·아이콘 등 데이터 셀 구성을 비교합니다. */
export const BodyMatrix: Story = {
  name: "Cells",
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <BodyCell figma="Type=Text">데이터</BodyCell>
      <BodyCell figma="Type=Strong Text" variant="strong">
        데이터
      </BodyCell>
      <BodyCell figma="Type=Badge">
        <Badge dot={false}>라벨명</Badge>
      </BodyCell>
      <BodyCell figma="Type=Button">
        <Button variant="tertiary" appearance="outline" size="xs">
          라벨명
        </Button>
      </BodyCell>
      <BodyCell figma="Type=Checkbox" selection />
      <ReorderCell />
      <BodyCell figma="Type=Icon">
        {/* An icon that carries meaning is named (a row header needs text for screen readers). */}
        <NotePencilIcon aria-label="편집" />
      </BodyCell>
      <BodyCell figma="Type=Switch">
        <Switch size="sm" aria-label="사용" />
      </BodyCell>
    </div>
  ),
};

/** 상세 정보를 이름과 값으로 구성하는 예시입니다. */
export const KeyValueMatrix: Story = {
  name: "Key Value",
  render: () => (
    <KeyValueTable style={{ width: 480 }}>
      <KeyValueItem label="항목명">항목명</KeyValueItem>
      <KeyValueItem label="항목명" keyProps={{ 'data-figma': 'key:Type=Default' }} valueProps={{ 'data-figma': 'value:Type=Text' }}>
        항목명
      </KeyValueItem>
      <KeyValueItem label="항목명" required keyProps={{ 'data-figma': 'key:Type=Required' }} valueProps={{ 'data-figma': 'value:Type=Badge' }}>
        <Badge size="md" dot={false}>
          라벨명
        </Badge>
      </KeyValueItem>
    </KeyValueTable>
  ),
};

/** Key-value semantics: a description list; the required dot is announced. */
export const KeyValueAccessibility: Story = {
  name: '키-값 표 접근성',
  render: () => (
    <KeyValueTable style={{ width: 480 }}>
      <KeyValueItem label="설비명" required>
        1호기 공조
      </KeyValueItem>
      <KeyValueItem label="상태">
        <Badge size="md" dot={false} status="success">
          운영
        </Badge>
      </KeyValueItem>
    </KeyValueTable>
  ),
  play: async ({ canvasElement }) => {
    const terms = canvasElement.querySelectorAll('dl > div > dt');
    await expect(terms).toHaveLength(2);
    await expect(within(canvasElement).getByRole('img', { name: '필수' })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('dl > div > dd')[0]).toHaveTextContent('1호기 공조');
  },
};

/** Rows with an action: click / Enter runs it; selection with the checkboxes; sorting from the header. */
export const Interaction: StoryObj<{ onRowAction: Mock<(key: unknown) => void> }> = {
  name: "Interaction",
  args: { onRowAction: fn() },
  render: (args) => (
    <Table id="equipment-table" aria-label="설비 목록" selectionMode="multiple" onRowAction={args.onRowAction}>
      <TableHeader>
        <TableSelectionColumn />
        <TableColumn isRowHeader>설비명</TableColumn>
        <TableColumn>위치</TableColumn>
      </TableHeader>
      <TableBody items={ROWS}>
        {(row) => (
          <TableRow id={row.id}>
            <TableSelectionCell />
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.site}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const grid = canvas.getByRole('grid', { name: '설비 목록' });
    // Rows appear after React Aria's collection pass (immediate in tests under act(), one render later in the browser).
    await waitFor(() => expect(within(grid).getAllByRole('row')).toHaveLength(1 + ROWS.length));
    const rows = within(grid).getAllByRole('row');
    await step('id reaches the <table> (aria-controls target)', async () => {
      await expect(grid.tagName).toBe('TABLE');
      await expect(grid).toHaveAttribute('id', 'equipment-table');
    });
    await step('clicking a row runs its action', async () => {
      await userEvent.click(within(rows[2]).getByText('2호기 공조'));
      await expect(args.onRowAction).toHaveBeenCalledWith('2');
    });
    await step('the row checkbox selects the row; the header box clears a partial selection, then selects all, then clears (Rules 04)', async () => {
      const boxes = within(grid).getAllByRole('checkbox') as HTMLInputElement[];
      const selected = () => within(grid).getAllByRole('row').slice(1).filter((r) => r.getAttribute('aria-selected') === 'true').length;
      await userEvent.click(boxes[1]);
      await expect(rows[1]).toHaveAttribute('aria-selected', 'true');
      await waitFor(() => expect(boxes[0].indeterminate).toBe(true));
      await userEvent.click(boxes[0]);
      await waitFor(() => expect(selected()).toBe(0));
      await expect(boxes[0].checked || boxes[0].indeterminate).toBe(false);
      await userEvent.click(boxes[0]);
      await waitFor(() => expect(selected()).toBe(ROWS.length));
      await expect(boxes[0].checked).toBe(true);
      await userEvent.click(boxes[0]);
      await waitFor(() => expect(selected()).toBe(0));
    });
  },
};
