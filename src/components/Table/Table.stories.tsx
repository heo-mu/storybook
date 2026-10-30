import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Selection as SelectionKeys } from 'react-aria-components';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { KeyValueItem, KeyValueTable, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TableSelectionCell, TableSelectionColumn } from './Table';
import { Badge } from '../Badge';
import { Button } from '../Button';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Table.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Table/Table",
  id: 'components-table-table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "여러 항목의 데이터를 비교하고 선택·정렬할 수 있는 표입니다. 단일 항목의 상세 정보는 KeyValueTable을 사용합니다." +
          '한 항목의 속성은 `KeyValueTable`로 보여 줍니다.',
      },
    },
  },
  args: { 'aria-label': '설비 목록', selectionMode: 'multiple', onRowAction: fn(), onSelectionChange: fn(), children: null },
  argTypes: {
    children: { control: false, description: '헤더(`TableHeader`)과 본문(`TableBody`)' },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'], description: '행 선택 방식 — 없음(none) · 하나(single) · 여러 개(multiple)' },
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        {args.selectionMode === 'multiple' ? <TableSelectionColumn /> : null}
        <TableColumn isRowHeader>설비명</TableColumn>
        <TableColumn info="설비가 설치된 건물">위치</TableColumn>
        <TableColumn>상태</TableColumn>
        <TableColumn>작업</TableColumn>
      </TableHeader>
      <TableBody>
        {[
          ['1', '1호기 공조', '본관', '운영'],
          ['2', '2호기 공조', '별관', '점검'],
        ].map(([id, name, site, status]) => (
          <TableRow key={id} id={id}>
            {args.selectionMode === 'multiple' ? <TableSelectionCell /> : null}
            <TableCell variant="strong">{name}</TableCell>
            <TableCell>{site}</TableCell>
            <TableCell>
              <Badge dot={false} status={status === '운영' ? 'success' : 'warning'}>
                {status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="tertiary" appearance="outline" size="xs">
                상세
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 행 선택 방식을 바꿔 볼 수 있습니다. 행을 누르면 `onRowAction`이 호출됩니다. */
export const Playground: Story = { name: "Playground" };

/** 행 선택 체크박스 없이 쓰는 표입니다. */
export const WithoutSelection: Story = {
  name: "Without Selection",
  args: { selectionMode: 'none' },
};

const SELECTION_ROWS = [
  { id: '1', name: '1호기 공조', site: '본관', status: '운영' },
  { id: '2', name: '2호기 공조', site: '별관', status: '점검' },
  { id: '3', name: '3호기 냉동기', site: '본관', status: '운영' },
  { id: '4', name: '4호기 보일러', site: '별관', status: '점검' },
];
const DISABLED_ROWS = ['4'];

/**
 * 머리글의 전체 선택 체크박스는 아무 행도 선택되지 않았을 때 누르면 모두 선택하고, 모두 또는 일부만 선택되었을 때(일부 선택 표시) 누르면
 * 모두 해제합니다. 행을 선택하거나 해제하면 머리글 체크박스가 따라 바뀝니다. 비활성 행(4호기)은 선택되지 않습니다.
 * 선택 상태를 앱에서 관리할 때는 `selectedKeys`와 `onSelectionChange`를 함께 넘깁니다.
 */
export const Selection: Story = {
  name: "Selection",
  render: function SelectionTable(args) {
    const [selected, setSelected] = useState<SelectionKeys>(new Set(['2']));
    const count = selected === 'all' ? SELECTION_ROWS.length - DISABLED_ROWS.length : selected.size;
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <Table
          {...args}
          selectionMode="multiple"
          selectedKeys={selected}
          disabledKeys={DISABLED_ROWS}
          onSelectionChange={(keys) => {
            setSelected(keys);
            args.onSelectionChange?.(keys);
          }}
        >
          <TableHeader>
            <TableSelectionColumn />
            <TableColumn isRowHeader>설비명</TableColumn>
            <TableColumn>위치</TableColumn>
            <TableColumn>상태</TableColumn>
          </TableHeader>
          <TableBody items={SELECTION_ROWS}>
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
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p role="status" style={{ margin: 0, font: 'var(--typography-sm-leading-normal-normal-font-weight) var(--typography-sm-leading-normal-normal-font-size) / var(--typography-sm-leading-normal-normal-line-height) var(--typography-sm-leading-normal-normal-font-family), sans-serif', color: 'var(--colors-text-secondary)' }}>
          {count}개 선택됨
        </p>
      </div>
    );
  },
  play: async ({ args, canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid');
    await waitFor(() => expect(within(grid).getAllByRole('row')).toHaveLength(1 + SELECTION_ROWS.length));
    const all = () => within(grid).getByRole('checkbox', { name: '모두 선택' }) as HTMLInputElement;
    const rowBox = (i: number) => within(within(grid).getAllByRole('row')[i + 1]).getByRole('checkbox') as HTMLInputElement;
    const selectedRows = () => within(grid).getAllByRole('row').slice(1).filter((r) => r.getAttribute('aria-selected') === 'true').length;
    const header = async (state: 'checked' | 'unchecked' | 'indeterminate') => {
      await waitFor(() => expect({ checked: all().checked, indeterminate: all().indeterminate }).toEqual({ checked: state === 'checked', indeterminate: state === 'indeterminate' }));
    };
    const status = () => canvas.getByRole('status');

    await step('one row selected → header shows indeterminate', async () => {
      await header('indeterminate');
      await expect(selectedRows()).toBe(1);
      await expect(rowBox(3)).toBeDisabled();
    });
    await step('indeterminate header click → every row cleared', async () => {
      await userEvent.click(all());
      await header('unchecked');
      await expect(selectedRows()).toBe(0);
      await expect(status()).toHaveTextContent('0개 선택됨');
      // controlled: onSelectionChange receives an empty selection (react-aria passes its Set subclass)
      const last = (args.onSelectionChange as Mock<(keys: SelectionKeys) => void>).mock.lastCall?.[0];
      await expect(last instanceof Set && last.size === 0).toBe(true);
    });
    await step('unchecked header click → every selectable row selected (disabled row stays unselected)', async () => {
      await userEvent.click(all());
      await header('checked');
      await expect(selectedRows()).toBe(3);
      await expect(rowBox(3).checked).toBe(false);
      await expect(status()).toHaveTextContent('3개 선택됨');
    });
    await step('checked header click → every row cleared', async () => {
      await userEvent.click(all());
      await header('unchecked');
      await expect(selectedRows()).toBe(0);
    });
    await step('row checkboxes update the header: some → indeterminate, all selectable → checked', async () => {
      await userEvent.click(rowBox(0));
      await header('indeterminate');
      await userEvent.click(rowBox(1));
      await userEvent.click(rowBox(2));
      await header('checked');
      await userEvent.click(rowBox(2));
      await header('indeterminate');
      await expect(status()).toHaveTextContent('2개 선택됨');
    });
    await step('Space on the header checkbox does the same: indeterminate → cleared → all → cleared', async () => {
      all().focus();
      await userEvent.keyboard(' ');
      await header('unchecked');
      await expect(selectedRows()).toBe(0);
      await userEvent.keyboard(' ');
      await header('checked');
      await expect(selectedRows()).toBe(3);
      await userEvent.keyboard(' ');
      await header('unchecked');
      await expect(selectedRows()).toBe(0);
    });
  },
};

/** 한 항목의 속성을 이름과 값으로 보여 주는 키-값 표입니다. */
export const KeyValue: Story = {
  name: '키-값 표',
  render: () => (
    <KeyValueTable style={{ width: 480 }}>
      <KeyValueItem label="설비명" required>
        1호기 공조
      </KeyValueItem>
      <KeyValueItem label="위치">본관 3층</KeyValueItem>
      <KeyValueItem label="상태">
        <Badge size="md" dot={false} status="success">
          운영
        </Badge>
      </KeyValueItem>
    </KeyValueTable>
  ),
};
