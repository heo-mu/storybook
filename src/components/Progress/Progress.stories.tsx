import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Progress.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/Progress/Progress',
  id: 'components-progress-progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '작업이 얼마나 진행되었는지 보여 주는 진행 막대입니다. 진행률은 `value`(기본 범위 0 – 100)로 정하고, 이름은 `aria-label` 또는 `aria-labelledby`로 꼭 붙입니다.',
      },
    },
  },
  args: { 'aria-label': '진행률', value: 44, minValue: 0, maxValue: 100 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 }, description: '진행 값 — `minValue`와 `maxValue` 사이' },
    minValue: { description: '최솟값' },
    maxValue: { description: '최댓값' },
    valueLabel: { description: '화면 낭독기가 읽는 수치 설명(예: 10단계 중 3단계)' },
    'aria-label': { description: '화면 낭독기가 읽는 이름. `aria-label` 또는 `aria-labelledby` 중 하나는 꼭 붙입니다.' },
  },
  decorators: [(Story) => <div style={{ width: 430 }}>{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

export const Complete: Story = {
  name: '완료',
  args: { value: 100 },
};

/** 범위를 직접 정하고, 화면 낭독기가 읽을 수치 설명을 붙인 예입니다. */
export const CustomRange: Story = {
  name: '범위 지정',
  args: { value: 3, maxValue: 10, valueLabel: '10단계 중 3단계' },
};
