import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { KeyValueItem, KeyValueTable, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TableSelectionCell, TableSelectionColumn } from './Table';
import { Badge } from '../Badge';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Table.showcase.stories.tsx
const meta = {
  title: 'Components/Table/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Data table from the Figma cells **table_header** (351:3452) and **table_body** (355:3739) on react-aria-components ' +
          'Table: `Table` > `TableHeader` (`TableColumn` — Info → `info`, Filter → `allowsSorting`; `TableSelectionColumn`; ' +
          '`TableEmptyColumn`) + `TableBody` > `TableRow` > `TableCell` (`variant` text / strong; Badge, Button, Switch, icons ' +
          'inside; `TableSelectionCell`; `TableDragHandle`). Rows with `onRowAction` show the Figma Hover / Pressed rows. ' +
          'Key-value: `KeyValueTable` > `KeyValueItem` (table_key + table_value).',
      },
    },
  },
  args: { 'aria-label': '설비 목록', selectionMode: 'multiple', onRowAction: fn(), onSelectionChange: fn(), children: null },
  argTypes: { children: { control: false }, selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] } },
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

export const Playground: Story = {};

export const WithoutSelection: Story = {
  args: { selectionMode: 'none' },
};

/** `KeyValueTable` for the properties of one item. */
export const KeyValue: Story = {
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
