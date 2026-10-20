import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputChip } from './InputChip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Chip/InputChip',
  id: 'components-chip-inputchip',
  component: InputChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '입력한 값을 보여 주고 지울 수 있는 칩입니다. 칩 전체가 지우기 버튼이며, 누르거나 Delete · Backspace를 누르면 `onRemove`가 호출됩니다.',
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    disabled: false,
    onRemove: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: '크기', table: { defaultValue: { summary: 'xs' } } },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
    children: { control: 'text', description: '칩 글자 — 입력한 값' },
  },
} satisfies Meta<typeof InputChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Small: Story = {
  name: '작은 크기',
  args: { size: 'sm' },
};

export const Medium: Story = {
  name: '중간 크기',
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
