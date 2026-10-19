import { type ComponentPropsWithoutRef } from 'react';
import { DashboardFilterBar, DashboardFilterGroup, DashboardFilterRange } from '../DashboardFilterBar';
import { Button, IconButton } from '../../Button';
import { FilterChip } from '../../Chip';
import { DatePicker } from '../../DatePicker';
import { SegmentedControl, SegmentedControlItem } from '../../SegmentedControl';
import { Select, SelectOption } from '../../Select';
import { ArrowCounterClockwiseIcon } from '../../../icons';

/**
 * Story-only: the Figma dashboard-filter-bar sample (not part of the package API).
 * The reset button is button_icon Secondary · Solid as in Figma (available since the F31 sync of 2026-10-19).
 */
export function FilterBarSample(props: Omit<ComponentPropsWithoutRef<typeof DashboardFilterBar>, 'children'>) {
  return (
    <DashboardFilterBar
      actions={
        <>
          <IconButton variant="secondary" appearance="solid" size="md" icon={<ArrowCounterClockwiseIcon />} aria-label="조건 초기화" />
          <Button variant="primary" appearance="solid" size="md">
            조회
          </Button>
        </>
      }
      {...props}
    >
      <DashboardFilterGroup label="조회 대상">
        <Select size="sm" aria-label="조회 대상" defaultValue="all" style={{ width: 156 }}>
          <SelectOption id="all">전체 단지</SelectOption>
          <SelectOption id="a">A 단지</SelectOption>
        </Select>
      </DashboardFilterGroup>
      <DashboardFilterGroup label="적용 조건">
        <FilterChip size="md" expanded={false}>
          입주 상태
        </FilterChip>
        <FilterChip size="md" selected expanded={false}>
          비교: 이전 7일
        </FilterChip>
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
      <DashboardFilterGroup label="집계">
        <Select size="sm" aria-label="집계" defaultValue="day" style={{ width: 84 }}>
          <SelectOption id="day">일별</SelectOption>
          <SelectOption id="week">주별</SelectOption>
        </Select>
      </DashboardFilterGroup>
    </DashboardFilterBar>
  );
}
