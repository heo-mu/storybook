import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChip } from './FilterChip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Chip/FilterChip',
  id: 'components-chip-filterchip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '필터 메뉴나 패널을 여는 칩입니다. 값이 적용되면 `selected`, 메뉴가 열려 있으면 `expanded`를 켭니다. `MenuTrigger` · `DialogTrigger` 안에서는 펼침 상태가 자동으로 바뀝니다.',
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
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
    children: { control: 'text', description: '칩 글자 — 필터 이름이나 적용된 값' },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Selected: Story = {
  name: '선택됨',
  args: { selected: true, children: '담당자: 김민지' },
};

export const Expanded: Story = {
  name: '펼침',
  args: { expanded: true },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
