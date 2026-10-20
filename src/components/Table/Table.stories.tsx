import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { KeyValueItem, KeyValueTable, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TableSelectionCell, TableSelectionColumn } from './Table';
import { Badge } from '../Badge';
import { Button } from '../Button';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Table.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Table/Table',
  id: 'components-table-table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 항목의 데이터를 행과 열로 보여 주는 표입니다. 행 선택은 `selectionMode`, 행을 눌렀을 때의 동작은 `onRowAction`으로 정하고, ' +
          '한 항목의 속성은 `KeyValueTable`로 보여 줍니다.',
      },
    },
  },
  args: { 'aria-label': '설비 목록', selectionMode: 'multiple', onRowAction: fn(), onSelectionChange: fn(), children: null },
  argTypes: {
    children: { control: false, description: '머리글(`TableHeader`)과 본문(`TableBody`)' },
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
export const Playground: Story = { name: '직접 체험' };

/** 행 선택 체크박스 없이 쓰는 표입니다. */
export const WithoutSelection: Story = {
  name: '선택 없음',
  args: { selectionMode: 'none' },
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
