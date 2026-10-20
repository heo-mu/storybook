import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChip } from './FilterChip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Chip/FilterChip",
  id: 'components-chip-filterchip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "필터 메뉴나 패널을 여는 칩입니다. 적용된 조건과 펼침 상태를 표시하며 메뉴는 별도로 연결합니다.",
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    selected: false,
    expanded: false,
    disabled: false,
    onPress: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: '크기', table: { defaultValue: { summary: 'xs' } } },
    selected: { control: 'boolean', description: '선택됨 — 필터 값이 적용된 상태' },
    expanded: { control: 'boolean', description: '펼침 — 메뉴나 패널이 열린 상태(위쪽 화살표)' },
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
    children: { control: 'text', description: '칩 글자 — 필터 이름이나 적용된 값' },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Selected: Story = {
  name: "Selected",
  args: { selected: true, children: '담당자: 김민지' },
};

export const Expanded: Story = {
  name: "Expanded",
  args: { expanded: true },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
