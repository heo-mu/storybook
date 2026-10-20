import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { SEGMENTED_CONTROL_SIZES } from './SegmentedControl.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/SegmentedControl.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/SegmentedControl/SegmentedControl",
  id: 'components-segmentedcontrol-segmentedcontrol',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "관련 옵션을 나란히 표시하고 하나를 선택합니다. 일간·주간·월간처럼 소수의 옵션을 전환할 때 사용합니다.",
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

export const Playground: Story = { name: "Playground" };

export const Small: Story = {
  name: "Small",
  args: { size: 'sm' },
};

export const ExtraSmall: Story = {
  name: "Extra Small",
  args: { size: 'xs' },
};

export const FullWidth: Story = {
  name: "Full Width",
  args: { style: { width: 316 } },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
