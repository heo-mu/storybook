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
  title: '컴포넌트/Chip/FilterChipSelect',
  id: 'components-chip-filterchipselect',
  component: FilterChipSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '필터 칩과 옵션 목록이 함께 있는 필터입니다. 여러 값을 고르면 `selectionMode="multiple"`(기본, 목록을 닫을 때 적용), 하나만 고르면 `selectionMode="single"`(고르면 바로 적용)을 씁니다.',
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
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
    maxDisplayed: { control: { type: 'number', min: 1, max: 5 } },
    options: { control: 'object' },
  },
} satisfies Meta<typeof FilterChipSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 여러 개 고르기(기본)입니다. 목록을 닫을 때 고른 값이 적용됩니다. */
export const Playground: Story = { name: '직접 체험' };

/** 처음부터 값이 적용된 필터입니다. 선택됨 모양으로 "나이대: 20대, 30대"가 보입니다. */
export const WithValue: Story = {
  name: '값 있음',
  args: { defaultValue: ['20', '30'] },
};

/** 하나 고르기입니다. 첫 옵션 "전체"를 고르면 필터가 풀립니다. */
export const Single: Story = {
  name: '하나 선택',
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
  name: '비활성',
  args: { disabled: true, defaultValue: ['20'] },
};
