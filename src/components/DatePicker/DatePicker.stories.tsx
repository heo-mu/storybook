import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/DatePicker.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/DatePicker/DatePicker',
  id: 'components-datepicker-datepicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '날짜를 직접 입력하거나 달력에서 고르는 입력 칸입니다. 값은 `YYYY-MM-DD` 문자열이고, 고를 수 있는 날짜는 `minValue` · `maxValue` · `isDateUnavailable`로 정합니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    required: false,
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '라벨' },
    message: { control: 'text', description: '입력 칸 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: '도움말 메시지 종류 — 지정하지 않으면 오류일 때 error, 아니면 회색 도움말(helper)' },
    required: { control: 'boolean', description: '필수 — 라벨 뒤 점 표시, 화면 낭독기가 "필수"로 읽음' },
    invalid: { control: 'boolean', description: '오류 상태' },
    disabled: { control: 'boolean', description: '비활성 — 입력할 수 없음' },
    readOnly: { control: 'boolean', description: '읽기 전용 — 날짜만 보여 주고 달력 버튼이 없음' },
    defaultValue: { control: 'text', description: "처음 날짜 'YYYY-MM-DD'" },
    minValue: { control: 'text' },
    maxValue: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320, paddingBottom: 300 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Required: Story = {
  name: '필수 입력',
  args: { label: '방문일', required: true },
};

export const WithValue: Story = {
  name: '값 있음',
  args: { defaultValue: '2026-07-30' },
};

export const Helper: Story = {
  name: '도움말',
  args: { message: '평일만 고를 수 있습니다.' },
};

export const WithMessage: Story = {
  name: '메시지 있음',
  args: { defaultValue: '2026-07-30', message: '평일만 선택할 수 있습니다.', messageType: 'info' },
};

export const Range: Story = {
  name: '기간 선택',
  args: { label: '방문일', minValue: '2026-07-06', maxValue: '2026-07-24', defaultValue: '2026-07-15' },
};

/** `isDateUnavailable`로 주말을 고를 수 없게 막습니다. */
export const WeekdaysOnly: Story = {
  name: '평일만 선택',
  args: {
    label: '상담일',
    defaultValue: '2026-07-15',
    isDateUnavailable: (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00`).getDay()),
  },
};

export const Invalid: Story = {
  name: '오류',
  args: { defaultValue: '2026-07-01', invalid: true, message: '시작일 이후여야 합니다.' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};

export const ReadOnly: Story = {
  name: '읽기 전용',
  args: { readOnly: true, defaultValue: '2026-07-30' },
};
