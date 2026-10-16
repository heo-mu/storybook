import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardFilterBar, DashboardFilterGroup, DashboardFilterRange } from './DashboardFilterBar';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { SegmentedControl, SegmentedControlItem } from '../SegmentedControl';
import { Select, SelectOption } from '../Select';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/DashboardFilterBar.showcase.stories.tsx
const meta = {
  title: 'Components/DashboardFilterBar/DashboardFilterBar',
  component: DashboardFilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component **dashboard-filter-bar** (698:4163): the query conditions of a dashboard. `DashboardFilterBar` > ' +
          '`DashboardFilterGroup` (label + controls; "|" dividers are added between groups) and `DashboardFilterRange` (from ~ to); ' +
          'buttons at the right → `actions`. A `search` landmark (`aria-label`, default 조회 조건). The controls are the design ' +
          'system Select · FilterChip · SegmentedControl · DatePicker (sm) — give each an `aria-label`.',
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

export const Playground: Story = {};

/** Narrower than its content: the groups wrap onto further rows. */
export const Narrow: Story = {
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
