import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Calendar.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Calendar/Calendar",
  id: 'components-calendar-calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "달력에서 날짜를 선택합니다. 입력 필드와 함께 사용하려면 DatePicker를 사용합니다.",
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

export const Playground: Story = { name: "Playground" };

export const WithValue: Story = {
  name: "Selected Date",
  args: { defaultValue: '2026-07-30' },
};

export const Range: Story = {
  name: "선택 가능 기간",
  args: { defaultFocusedValue: '2026-07-15', minValue: '2026-07-06', maxValue: '2026-07-24' },
};
