import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key } from 'react-aria-components';
import { expect, fn, waitFor, within } from 'storybook/test';
import { FilterChipSelect } from '../FilterChipSelect';
import { TextButton } from '../../Button';
import { Badge } from '../../Badge';

// Interaction and application examples of FilterChipSelect (not in the MCP manifest) — Figma "chip-filter 선택 예시"
// (1011:12956, multiple) and "단일 선택 예시" (Design System Rules 07).
const meta = {
  title: "Components/Chip/FilterChipSelect/Gallery",
  id: 'components-chip-filterchipselect-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const OPTIONS = ['옵션 1', '옵션 2', '옵션 3', '옵션 4', '옵션 5'].map((label, i) => ({ id: String(i + 1), label }));
const FIGMA_FILTERS = ['나이대', '색상', '성별', '스타일'];
const chipOf = (root: HTMLElement, name: RegExp | string) => within(root).getByRole('button', { name });
const listbox = () => within(document.body).findByRole('listbox');

/** 조건이 적용되지 않은 필터의 기본 구성입니다. */
export const Basic: Story = {
  name: '기본',
  render: () => (
    <div style={{ display: 'flex', gap: 4 }}>
      {FIGMA_FILTERS.map((f) => (
        <FilterChipSelect key={f} label={f} options={OPTIONS} />
      ))}
    </div>
  ),
};

/** 여러 옵션을 선택하고 목록을 닫아 필터를 적용합니다. 전체 해제 동작도 확인합니다. */
export const MultipleSelection: StoryObj<{ onChange: ReturnType<typeof fn> }> = {
  name: "Multiple Selection",
  args: { onChange: fn() },
  render: (args) => (
    <div style={{ display: 'flex', gap: 4, minHeight: 260 }}>
      <FilterChipSelect label="나이대" options={OPTIONS} onChange={args.onChange} />
      {FIGMA_FILTERS.slice(1).map((f) => (
        <FilterChipSelect key={f} label={f} options={OPTIONS} />
      ))}
    </div>
  ),
  play: async ({ args, canvasElement, userEvent, step }) => {
    const chip = () => chipOf(canvasElement, /^나이대/);
    await step('기본 열림: the panel opens below the chip, caret up', async () => {
      await userEvent.click(chip());
      const lb = await listbox();
      await expect(lb).toHaveAttribute('aria-multiselectable', 'true');
      await expect(chip()).toHaveAttribute('aria-expanded', 'true');
      const c = chip().getBoundingClientRect();
      const p = lb.getBoundingClientRect();
      await expect(Math.round(p.top - c.bottom)).toBe(4);
      // Aligned to the chip's start, kept 12px inside the viewport (react-aria overlays, Design System Rules 05).
      await expect(Math.round(p.left)).toBe(Math.round(Math.max(c.left, 12)));
      await expect(p.width).toBeGreaterThanOrEqual(160);
    });
    await step('선택 중: options toggle, the panel stays open, the chip text follows, not applied yet', async () => {
      await userEvent.click(within(await listbox()).getByRole('option', { name: '옵션 2' }));
      await userEvent.click(within(await listbox()).getByRole('option', { name: '옵션 3' }));
      await expect(await listbox()).toBeInTheDocument();
      await expect(chip()).toHaveTextContent('나이대: 옵션 2 외 1개');
      await expect(chip()).not.toHaveAttribute('data-selected');
      await expect(args.onChange).not.toHaveBeenCalled();
    });
    await step('선택 완료: closing applies the choice (Selected look)', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull());
      await expect(args.onChange).toHaveBeenLastCalledWith(['2', '3']);
      await expect(chip()).toHaveAttribute('data-selected');
      await expect(chip()).toHaveTextContent('나이대: 옵션 2 외 1개');
      await expect(chip()).toHaveFocus();
    });
    await step('다시 열림 → 다시 선택 중 → 다시 선택 완료', async () => {
      await userEvent.click(chip());
      const lb = await listbox();
      await expect(within(lb).getByRole('option', { name: '옵션 2' })).toHaveAttribute('aria-selected', 'true');
      await expect(chip()).toHaveAttribute('data-selected'); // still applied while reopened
      await userEvent.click(within(lb).getByRole('option', { name: '옵션 5' }));
      await expect(chip()).toHaveTextContent('나이대: 옵션 2 외 2개');
      await userEvent.click(canvasElement.ownerDocument.body);
      await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull());
      await expect(args.onChange).toHaveBeenLastCalledWith(['2', '3', '5']);
    });
    await step('선택 해제: turning every option off and closing removes the filter', async () => {
      await userEvent.click(chip());
      for (const name of ['옵션 2', '옵션 3', '옵션 5']) await userEvent.click(within(await listbox()).getByRole('option', { name }));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith([]));
      await expect(chip()).not.toHaveAttribute('data-selected');
      await expect(chip()).toHaveTextContent(/^나이대$/);
    });
  },
};

/** Single selection: choosing applies and closes; "전체" removes the filter. */
export const SingleSelection: StoryObj<{ onChange: ReturnType<typeof fn> }> = {
  name: "Single Selection",
  args: { onChange: fn() },
  render: (args) => (
    <div style={{ minHeight: 220 }}>
      <FilterChipSelect
        label="기간"
        selectionMode="single"
        options={[
          { id: '7d', label: '최근 7일' },
          { id: '30d', label: '최근 30일' },
          { id: '90d', label: '최근 90일' },
          { id: 'year', label: '올해', disabled: true },
        ]}
        onChange={args.onChange}
      />
    </div>
  ),
  play: async ({ args, canvasElement, userEvent, step }) => {
    const chip = () => chipOf(canvasElement, /^기간/);
    await step('the first option "전체" is chosen while no filter is applied', async () => {
      await userEvent.click(chip());
      const lb = await listbox();
      await expect(lb).not.toHaveAttribute('aria-multiselectable', 'true');
      await expect(within(lb).getByRole('option', { name: '전체' })).toHaveAttribute('aria-selected', 'true');
      await expect(within(lb).getByRole('option', { name: '올해' })).toHaveAttribute('aria-disabled', 'true');
    });
    await step('choosing applies and closes', async () => {
      await userEvent.click(within(await listbox()).getByRole('option', { name: '최근 30일' }));
      await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull());
      await expect(args.onChange).toHaveBeenLastCalledWith('30d');
      await expect(chip()).toHaveAttribute('data-selected');
      await expect(chip()).toHaveTextContent('기간: 최근 30일');
    });
    await step('"전체" removes the filter', async () => {
      await userEvent.click(chip());
      await userEvent.click(within(await listbox()).getByRole('option', { name: '전체' }));
      await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(null));
      await expect(chip()).not.toHaveAttribute('data-selected');
      await expect(chip()).toHaveTextContent(/^기간$/);
    });
  },
};

/** 표시 규칙(2026-10-28): 0개 → 필터명, 1개 → "필터명: 값", 2개 이상 → "필터명: 첫 값 외 n개" — 첫 값은 옵션 목록 순서 기준, 해제 · 초기화 시 즉시 갱신. */
export const LabelRule: Story = {
  name: '표시 규칙(0 · 1 · 2 · 3개)',
  render: () => (
    <div style={{ display: 'flex', gap: 4, minHeight: 260 }}>
      <FilterChipSelect label="지역" options={['서울', '경기', '인천', '부산'].map((v) => ({ id: v, label: v }))} />
    </div>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const chip = () => chipOf(canvasElement, /^지역/);
    const pick = async (name: string) => userEvent.click(within(await listbox()).getByRole('option', { name }));
    await step('0개 → 지역', async () => {
      await expect(chip()).toHaveTextContent(/^지역$/);
    });
    await step('1개 → 지역: 서울', async () => {
      await userEvent.click(chip());
      await pick('서울');
      await expect(chip()).toHaveTextContent(/^지역: 서울$/);
    });
    await step('2개 → 지역: 서울 외 1개', async () => {
      await pick('경기');
      await expect(chip()).toHaveTextContent(/^지역: 서울 외 1개$/);
    });
    await step('3개 → 지역: 서울 외 2개', async () => {
      await pick('인천');
      await expect(chip()).toHaveTextContent(/^지역: 서울 외 2개$/);
    });
    await step('첫 값은 선택 순서가 아니라 옵션 목록 순서: 서울을 빼면 경기 외 1개', async () => {
      await pick('서울');
      await expect(chip()).toHaveTextContent(/^지역: 경기 외 1개$/);
      await pick('서울');
      await expect(chip()).toHaveTextContent(/^지역: 서울 외 2개$/);
    });
    await step('해제하면 즉시 갱신, 전부 해제하면 필터명만', async () => {
      await pick('인천');
      await pick('경기');
      await expect(chip()).toHaveTextContent(/^지역: 서울$/);
      await pick('서울');
      await expect(chip()).toHaveTextContent(/^지역$/);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull());
      await expect(chip()).not.toHaveAttribute('data-selected');
    });
  },
};

/** Keyboard only: Tab to the chip, ↓ opens, arrows move, Space toggles, Esc applies and returns focus to the chip. */
export const Keyboard: Story = {
  name: "Keyboard",
  render: () => (
    <div style={{ minHeight: 240 }}>
      <FilterChipSelect label="색상" options={OPTIONS} />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const chip = chipOf(canvasElement, /^색상/);
    await userEvent.tab();
    await expect(chip).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const lb = await listbox();
    await waitFor(() => expect(lb.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard(' ');
    await expect(chip).toHaveTextContent('색상: 옵션 2');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull());
    await expect(chip).toHaveFocus();
    await expect(chip).toHaveAttribute('data-selected');
  },
};

/** Disabled: no panel, not focusable by Tab. */
export const Disabled: Story = {
  name: "Disabled",
  render: () => <FilterChipSelect label="스타일" options={OPTIONS} disabled defaultValue={['1']} />,
  play: async ({ canvasElement, userEvent }) => {
    const chip = chipOf(canvasElement, /^스타일/);
    await expect(chip).toBeDisabled();
    await userEvent.click(chip);
    await expect(within(document.body).queryByRole('listbox')).toBeNull();
  },
};

// ── 실제 필터 영역 적용 예시 ─────────────────────────────────────────────────────────────────────────────────
type Equipment = { id: number; name: string; building: string; kind: string; status: '정상' | '주의' | '점검' };
const EQUIPMENT: Equipment[] = [
  { id: 1, name: '냉동기 1호', building: '101동', kind: '냉동기', status: '정상' },
  { id: 2, name: '냉동기 2호', building: '102동', kind: '냉동기', status: '주의' },
  { id: 3, name: '보일러 A', building: '101동', kind: '보일러', status: '정상' },
  { id: 4, name: '보일러 B', building: '103동', kind: '보일러', status: '점검' },
  { id: 5, name: '공조기 1', building: '102동', kind: '공조기', status: '정상' },
  { id: 6, name: '공조기 2', building: '103동', kind: '공조기', status: '주의' },
  { id: 7, name: '펌프 P-01', building: '101동', kind: '펌프', status: '정상' },
];
const opts = (values: string[]) => values.map((v) => ({ id: v, label: v }));
const STATUS_BADGE = { 정상: 'success', 주의: 'warning', 점검: 'danger' } as const;

/**
 * 실제 필터 영역: 동(다중) · 설비 종류(다중) · 상태(단일, "전체") 필터가 목록을 거르고, 결과 수와 "필터 초기화"를 함께 둡니다.
 * The filters are controlled by the screen, so "필터 초기화" clears all of them.
 */
export const FilterArea: Story = {
  name: '필터 영역',
  render: function Render() {
    const [buildings, setBuildings] = useState<Key[]>([]);
    const [kinds, setKinds] = useState<Key[]>([]);
    const [status, setStatus] = useState<Key | null>(null);
    const rows = useMemo(
      () =>
        EQUIPMENT.filter(
          (e) => (!buildings.length || buildings.includes(e.building)) && (!kinds.length || kinds.includes(e.kind)) && (status == null || e.status === status),
        ),
      [buildings, kinds, status],
    );
    const active = buildings.length + kinds.length + (status == null ? 0 : 1);
    return (
      <section aria-label="설비 목록" style={{ display: 'grid', gap: 12, maxWidth: 560, minHeight: 360 }}>
        <div role="group" aria-label="필터" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
          <FilterChipSelect label="동" options={opts(['101동', '102동', '103동'])} value={buildings} onChange={setBuildings} />
          <FilterChipSelect label="설비 종류" options={opts(['냉동기', '보일러', '공조기', '펌프'])} value={kinds} onChange={setKinds} />
          <FilterChipSelect label="상태" selectionMode="single" options={opts(['정상', '주의', '점검'])} value={status} onChange={setStatus} />
          {active > 0 && (
            <TextButton
              size="sm"
              onClick={() => {
                setBuildings([]);
                setKinds([]);
                setStatus(null);
              }}
            >
              필터 초기화
            </TextButton>
          )}
        </div>
        <p role="status" style={{ margin: 0, font: 'inherit', color: 'var(--colors-text-tertiary)' }}>
          {rows.length}개 설비
        </p>
        <ul data-results="" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
          {rows.map((e) => (
            <li key={e.id} style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--colors-text-primary)' }}>
              {e.name} · {e.building}
              <Badge status={STATUS_BADGE[e.status]} size="sm">
                {e.status}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    );
  },
  play: async ({ canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement);
    const count = () => canvas.getByRole('status');
    await expect(count()).toHaveTextContent('7개 설비');
    await step('다중: 동 101동 · 103동', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^동/ }));
      for (const name of ['101동', '103동']) await userEvent.click(within(await listbox()).getByRole('option', { name }));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(count()).toHaveTextContent('5개 설비'));
      await expect(canvas.getByRole('button', { name: /^동/ })).toHaveTextContent('동: 101동 외 1개');
    });
    await step('단일: 상태 정상', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^상태/ }));
      await userEvent.click(within(await listbox()).getByRole('option', { name: '정상' }));
      await waitFor(() => expect(count()).toHaveTextContent('3개 설비'));
    });
    await step('필터 초기화 clears every filter', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '필터 초기화' }));
      await expect(count()).toHaveTextContent('7개 설비');
      for (const name of [/^동/, /^설비 종류/, /^상태/]) await expect(canvas.getByRole('button', { name })).not.toHaveAttribute('data-selected');
    });
  },
};

/** The chip's accessible name is its visible text — the filter name alone, then "필터명: 값" — never the label twice (WCAG 2.5.3). */
export const AccessibleName: Story = {
  name: "Accessible Name",
  render: () => (
    <div style={{ display: 'flex', gap: 4, minHeight: 260 }}>
      <FilterChipSelect label="상태" options={OPTIONS} />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const chip = () => within(canvasElement).getByRole('button');
    await expect(chip()).toHaveAccessibleName('상태');
    await userEvent.click(chip());
    await userEvent.click(within(await listbox()).getByRole('option', { name: '옵션 2' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(chip()).toHaveTextContent('상태: 옵션 2'));
    await expect(chip()).toHaveAccessibleName(chip().textContent!.trim());
  },
};
