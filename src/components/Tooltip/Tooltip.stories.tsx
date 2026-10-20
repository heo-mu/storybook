import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { TOOLTIP_PLACEMENTS } from './Tooltip.options';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Tooltip.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: "Components/Tooltip/Tooltip",
  id: 'components-tooltip-tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "요소에 마우스를 올리거나 키보드 포커스를 두면 짧은 보충 설명을 표시합니다.",
      },
    },
  },
  args: { content: '변경 사항을 저장합니다', placement: 'top', showArrow: true, children: <Button>저장</Button> },
  argTypes: {
    placement: { control: 'inline-radio', options: TOOLTIP_PLACEMENTS, description: '나타날 쪽 — 공간이 없으면 반대쪽', table: { defaultValue: { summary: 'top' } } },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 64 }}>{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. 버튼에 마우스를 올리거나 Tab으로 선택해 보세요. */
export const Playground: Story = { name: "Playground" };

export const Open: Story = {
  name: "Open",
  args: { defaultOpen: true, placement: 'right' },
};

export const WithoutArrow: Story = {
  name: '화살표 없음',
  args: { defaultOpen: true, showArrow: false },
};
