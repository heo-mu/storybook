import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Calendar.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Calendar/Calendar',
  id: 'components-calendar-calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '한 달 단위로 날짜를 보여 주고 고르는 달력입니다. 값은 `YYYY-MM-DD` 문자열이고, 고를 수 있는 날짜는 `minValue` · `maxValue` · `isDateUnavailable`로 정합니다.',
      },
    },
  },
  args: {
    'aria-label': '일정',
    onChange: fn(),
  },
  argTypes: {
    defaultValue: { control: 'text', description: "처음 선택된 날짜 'YYYY-MM-DD'" },
    minValue: { control: 'text' },
    maxValue: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const WithValue: Story = {
  name: '값 있음',
  args: { defaultValue: '2026-07-30' },
};

export const Range: Story = {
  name: '기간 선택',
  args: { defaultFocusedValue: '2026-07-15', minValue: '2026-07-06', maxValue: '2026-07-24' },
};
