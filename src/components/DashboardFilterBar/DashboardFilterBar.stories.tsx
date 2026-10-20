import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardFilterBar, DashboardFilterGroup, DashboardFilterRange } from './DashboardFilterBar';
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
        <DashboardFilterRange
          from={<DatePicker size="sm" aria-label="시작일" defaultValue="2026-10-07" style={{ width: 136 }} />}
          to={<DatePicker size="sm" aria-label="종료일" defaultValue="2026-10-13" style={{ width: 136 }} />}
        />
      </DashboardFilterGroup>
    </DashboardFilterBar>
  ),
} satisfies Meta<typeof DashboardFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 조회 대상과 조회 기간 조건이 있는 막대입니다. */
export const Playground: Story = { name: "Playground" };

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
        <DashboardFilterRange
          from={<DatePicker size="sm" aria-label="시작일" defaultValue="2026-10-07" style={{ width: 136 }} />}
          to={<DatePicker size="sm" aria-label="종료일" defaultValue="2026-10-13" style={{ width: 136 }} />}
        />
      </DashboardFilterGroup>
    </DashboardFilterBar>
  ),
};
