import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChipSelect } from './FilterChipSelect';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 동작 확인과 실제 필터 예시는 ./stories/FilterChipSelect.showcase.stories.tsx에 있습니다.
const AGES = [
  { id: '10', label: '10대' },
  { id: '20', label: '20대' },
  { id: '30', label: '30대' },
  { id: '40', label: '40대' },
  { id: '50', label: '50대 이상' },
];

const meta = {
  title: "Components/Chip/FilterChipSelect",
  id: 'components-chip-filterchipselect',
  component: FilterChipSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "필터 칩과 옵션 목록을 함께 제공합니다. 다중 선택은 목록을 닫을 때, 단일 선택은 항목을 선택하는 즉시 적용됩니다.",
      },
    },
  },
  args: {
    label: '나이대',
    options: AGES,
    size: 'md',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: '필터 이름' },
    size: { control: 'inline-radio', options: CHIP_SIZES, description: '크기', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
    maxDisplayed: { control: { type: 'number', min: 1, max: 5 } },
    options: { control: 'object' },
  },
} satisfies Meta<typeof FilterChipSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 다중 선택 예시입니다. 목록을 닫으면 선택한 값이 필터에 적용됩니다. */
export const Playground: Story = { name: "Playground" };

/** 처음부터 값이 적용된 필터입니다. 선택 상태로 "나이대: 20대, 30대"가 보입니다. */
export const WithValue: Story = {
  name: '필터 적용',
  args: { defaultValue: ['20', '30'] },
};

/** 단일 선택 예시입니다. 첫 옵션 "전체"를 선택하면 필터가 초기화됩니다. */
export const Single: Story = {
  name: "Single Selection",
  args: {
    label: '기간',
    selectionMode: 'single',
    options: [
      { id: '7d', label: '최근 7일' },
      { id: '30d', label: '최근 30일' },
      { id: '90d', label: '최근 90일' },
    ],
    defaultValue: '30d',
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, defaultValue: ['20'] },
};
