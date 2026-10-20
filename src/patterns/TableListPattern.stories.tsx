import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../components/Button';
import { FilterChip } from '../components/Chip';
import { DataState } from '../components/DataState';
import { Pagination } from '../components/Pagination';
import { SearchField } from '../components/SearchField';
import { Switch } from '../components/Switch';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TableSelectionCell, TableSelectionColumn } from '../components/Table';

// Mirrors the Figma usage example "Table 목록 화면 예시" (section 사용 예시 화면) with the library components,
// including its sample texts (항목명 · 데이터 · 라벨명).
const meta = {
  title: '사용 예시/목록 화면',
  id: 'patterns-table-list',
  tags: ['autodocs', '!manifest'],
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: {
        component:
          '목록 화면을 만드는 방법입니다. 표 위에 검색(`SearchField`) · 필터(`FilterChip`) · 등록 버튼을 두고, 표 아래에서 페이지를 이동합니다(`Pagination`). ' +
          '검색 결과가 없으면 표 본문의 `renderEmptyState`로 `DataState`(결과 없음)를 보여 줍니다.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ROWS = [
  { id: '1', strong: '데이터', text: '데이터' },
  { id: '2', strong: '데이터', text: '데이터' },
  { id: '3', strong: '데이터', text: '데이터' },
];

const WIDTH = 688;

/** Figma columns: checkbox 48px, then 160px each (table_header / table_body cells). */
const COLUMN = { width: 160 } as const;

function ListTable({ rows, onReset, label, defaultSelectedKeys }: { rows: typeof ROWS; onReset: () => void; label: string; defaultSelectedKeys?: string[] }) {
  return (
    <Table aria-label={label} selectionMode="multiple" defaultSelectedKeys={defaultSelectedKeys} style={{ width: WIDTH, maxWidth: '100%' }}>
      <TableHeader>
        <TableSelectionColumn />
        <TableColumn isRowHeader style={COLUMN}>
          항목명
        </TableColumn>
        <TableColumn style={COLUMN}>항목명</TableColumn>
        <TableColumn style={COLUMN}>항목명</TableColumn>
        <TableColumn style={COLUMN}>항목명</TableColumn>
      </TableHeader>
      <TableBody items={rows} renderEmptyState={() => <DataState state="no-results" onAction={onReset} />}>
        {(row) => (
          <TableRow id={row.id}>
            <TableSelectionCell />
            <TableCell variant="strong">{row.strong}</TableCell>
            <TableCell>{row.text}</TableCell>
            <TableCell>
              <Switch size="sm" aria-label="사용" />
            </TableCell>
            <TableCell>
              <Button variant="tertiary" appearance="outline" size="xs">
                라벨명
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function ListExample() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const rows = ROWS.filter((r) => search === '' || r.strong.includes(search) || r.text.includes(search));
  const reset = () => {
    setQuery('');
    setSearch('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-8)', width: WIDTH, maxWidth: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-margin-m-2)', flexWrap: 'wrap' }}>
        <SearchField
          size="sm"
          aria-label="검색어"
          placeholder="검색어 입력"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onSearch={(value) => setSearch(value.trim())}
          onClear={reset}
          style={{ width: 320 }}
        />
        <FilterChip size="sm" expanded={false}>
          상태
        </FilterChip>
        <Button variant="primary" appearance="solid" size="sm" style={{ marginInlineStart: 'auto' }}>
          등록
        </Button>
      </div>
      <ListTable rows={rows} onReset={reset} label="목록" defaultSelectedKeys={['2']} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination totalPages={5} size="md" aria-label="목록 페이지" />
      </div>
    </div>
  );
}

/** 검색 · 필터 · 등록 · 표 · 페이지 이동과, 결과가 없을 때의 표를 한 화면에 모은 예시입니다. */
export const TableList: Story = {
  name: '목록 화면',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-8)' }}>
      <ListExample />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-2)' }}>
        <span className="ds-typography-sm-leading-normal-normal" style={{ color: 'var(--colors-text-tertiary)' }}>
          결과가 없을 때
        </span>
        <ListTable rows={[]} onReset={() => {}} label="결과 없는 목록" />
      </div>
    </div>
  ),
  play: async ({ canvas, userEvent, step }) => {
    const table = canvas.getByRole('grid', { name: '목록' });
    await step('표 · 페이지 이동', async () => {
      await expect(canvas.getAllByRole('row')).toHaveLength(1 + ROWS.length + 2);
      await expect(canvas.getByRole('button', { name: '1 페이지' })).toHaveAttribute('aria-current', 'page');
      await userEvent.click(canvas.getByRole('button', { name: '다음 페이지' }));
      await expect(canvas.getByRole('button', { name: '2 페이지' })).toHaveAttribute('aria-current', 'page');
    });
    await step('검색 결과 없음 → 조건 초기화', async () => {
      await userEvent.type(canvas.getByRole('searchbox', { name: '검색어' }), '없는 값{Enter}');
      await expect(table).toHaveTextContent('조회 결과가 없습니다');
      await userEvent.click(canvas.getAllByRole('button', { name: '조건 초기화' })[0]);
      await expect(table).not.toHaveTextContent('조회 결과가 없습니다');
      await expect(canvas.getByRole('searchbox', { name: '검색어' })).toHaveValue('');
    });
  },
};
