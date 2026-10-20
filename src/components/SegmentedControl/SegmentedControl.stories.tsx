import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { SEGMENTED_CONTROL_SIZES } from './SegmentedControl.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/SegmentedControl.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/SegmentedControl/SegmentedControl',
  id: 'components-segmentedcontrol-segmentedcontrol',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '몇 개의 옵션을 나란히 보여 주고 그중 하나를 고르는 컨트롤입니다. 옵션은 `SegmentedControlItem`으로 넣고, 크기는 `size`, 선택은 `value` · `onChange`로 다룹니다.',
      },
    },
  },
  args: {
    'aria-label': '기간',
    size: 'md',
    defaultValue: 'week',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SEGMENTED_CONTROL_SIZES, description: '크기', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: '비활성 — 모든 옵션을 고를 수 없음' },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="day">일간</SegmentedControlItem>
      <SegmentedControlItem value="week">주간</SegmentedControlItem>
      <SegmentedControlItem value="month">월간</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Small: Story = {
  name: '작은 크기',
  args: { size: 'sm' },
};

export const ExtraSmall: Story = {
  name: '가장 작은 크기',
  args: { size: 'xs' },
};

export const FullWidth: Story = {
  name: '전체 너비',
  args: { style: { width: 316 } },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
