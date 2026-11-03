import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DashboardFilterBar, DashboardFilterGroup } from './DashboardFilterBar';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { SegmentedControl, SegmentedControlItem } from '../SegmentedControl';
import { Select, SelectOption } from '../Select';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/DashboardFilterBar.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/DashboardFilterBar/DashboardFilterBar",
  id: 'components-dashboardfilterbar-dashboardfilterbar',
  component: DashboardFilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "대시보드의 조회 조건과 실행 버튼을 한곳에 배치합니다. 조건을 그룹으로 구성할 수 있습니다.",
      },
    },
  },
  args: { children: null },
  argTypes: { children: { control: false }, actions: { control: false } },
  render: () => (
    <DashboardFilterBar
      actions={
        <Button variant="primary" appearance="solid" size="md">
          조회
        </Button>
      }
    >
      <DashboardFilterGroup label="조회 대상">
        <Select size="sm" aria-label="조회 대상" defaultValue="all" style={{ width: 156 }}>
          <SelectOption id="all">전체 단지</SelectOption>
          <SelectOption id="a">A 단지</SelectOption>
        </Select>
      </DashboardFilterGroup>
      <DashboardFilterGroup label="조회 기간">
        <SegmentedControl size="sm" aria-label="조회 기간" defaultValue="7d" style={{ width: 220 }}>
          <SegmentedControlItem value="today">오늘</SegmentedControlItem>
          <SegmentedControlItem value="7d">최근 7일</SegmentedControlItem>
          <SegmentedControlItem value="30d">최근 30일</SegmentedControlItem>
        </SegmentedControl>
        <DatePicker aria-label="조회 기간" selectionMode="range" defaultRangeValue={{ start: '2026-10-07', end: '2026-10-13' }} />
      </DashboardFilterGroup>
    </DashboardFilterBar>
  ),
} satisfies Meta<typeof DashboardFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each control keeps its own width, no segment label is cut and nothing leaves the bar (DFBR-08). */
async function expectContained(canvasElement: HTMLElement) {
  const bar = canvasElement.querySelector<HTMLElement>('.ds-filter-bar')!.getBoundingClientRect();
  const outside = [...canvasElement.querySelectorAll<HTMLElement>('.ds-filter-bar *')].filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1 || !(r.right > bar.right + 0.5 || r.left < bar.left - 0.5)) return false;
    // react-aria keeps a visually hidden native <select> for forms (1px clipped wrapper): not visible content
    for (let p = el.parentElement; p && !p.classList.contains('ds-filter-bar'); p = p.parentElement) {
      const cs = getComputedStyle(p);
      const b = p.getBoundingClientRect();
      if (cs.clip !== 'auto' || (cs.clipPath && cs.clipPath !== 'none') || (b.width <= 1 && b.height <= 1)) return false;
    }
    return true;
  });
  await expect(outside.map((el) => el.className)).toEqual([]);
  const segmented = canvasElement.querySelector<HTMLElement>('.ds-segmented');
  if (segmented) {
    await expect(segmented.getBoundingClientRect().width).toBeCloseTo(220, 0);
    // a label may run into the item padding (F71) and is cut only when it is wider than the whole item: compare the text
    // itself with the item box (scrollWidth also counts the padding overflow, Firefox by a whole pixel)
    const cut = [...segmented.querySelectorAll<HTMLElement>('.ds-segmented__segment')].filter((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().width > el.getBoundingClientRect().width + 0.5;
    });
    await expect(cut.map((el) => el.textContent)).toEqual([]);
  }
}

/** 조회 대상과 조회 기간 조건이 있는 막대입니다. */
export const Playground: Story = {
  name: "Playground",
  // 2026-11-03: the segmented control was squeezed to 132px ("최근 …") by the date field's 100% width
  play: async ({ canvasElement }) => {
    await expectContained(canvasElement);
    // wide bar: each group stays on one line (Figma 698:4163)
    for (const group of canvasElement.querySelectorAll<HTMLElement>('.ds-filter-bar__group')) await expect(group.getBoundingClientRect().height).toBe(36);
  },
};

/** 내용보다 좁으면 묶음 단위로 다음 줄로 넘어갑니다. */
export const Narrow: Story = {
  name: "좁은 컨테이너",
  render: () => (
    <DashboardFilterBar
      style={{ width: 640 }}
      actions={
        <Button variant="primary" appearance="solid" size="md">
          조회
        </Button>
      }
    >
      <DashboardFilterGroup label="조회 대상">
        <Select size="sm" aria-label="조회 대상" defaultValue="all" style={{ width: 156 }}>
          <SelectOption id="all">전체 단지</SelectOption>
          <SelectOption id="a">A 단지</SelectOption>
        </Select>
      </DashboardFilterGroup>
      <DashboardFilterGroup label="조회 기간">
        <DatePicker aria-label="조회 기간" selectionMode="range" defaultRangeValue={{ start: '2026-10-07', end: '2026-10-13' }} />
      </DashboardFilterGroup>
    </DashboardFilterBar>
  ),
};

/** 휴대폰처럼 묶음 하나보다 좁으면 그 묶음 안의 조건도 다음 줄로 넘어가 카드 밖으로 나가지 않습니다. */
export const PhoneWidth: Story = {
  name: "휴대폰 너비",
  render: () => (
    <DashboardFilterBar
      style={{ width: 320 }}
      actions={
        <Button variant="primary" appearance="solid" size="md">
          조회
        </Button>
      }
    >
      <DashboardFilterGroup label="조회 대상">
        <Select size="sm" aria-label="조회 대상" defaultValue="all" style={{ width: 156 }}>
          <SelectOption id="all">전체 단지</SelectOption>
          <SelectOption id="a">A 단지</SelectOption>
        </Select>
      </DashboardFilterGroup>
      <DashboardFilterGroup label="조회 기간">
        <SegmentedControl size="sm" aria-label="조회 기간" defaultValue="7d" style={{ width: 220 }}>
          <SegmentedControlItem value="today">오늘</SegmentedControlItem>
          <SegmentedControlItem value="7d">최근 7일</SegmentedControlItem>
          <SegmentedControlItem value="30d">최근 30일</SegmentedControlItem>
        </SegmentedControl>
        <DatePicker aria-label="조회 기간" selectionMode="range" defaultRangeValue={{ start: '2026-10-07', end: '2026-10-13' }} />
      </DashboardFilterGroup>
    </DashboardFilterBar>
  ),
  play: async ({ canvasElement }) => {
    await expectContained(canvasElement);
  },
};
