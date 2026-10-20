import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputChip } from './InputChip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Chip/InputChip",
  id: 'components-chip-inputchip',
  component: InputChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "입력된 태그를 표시하고 삭제할 수 있는 칩입니다.",
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
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
    children: { control: 'text', description: '칩 글자 — 입력한 값' },
  },
} satisfies Meta<typeof InputChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Small: Story = {
  name: "Small",
  args: { size: 'sm' },
};

export const Medium: Story = {
  name: "Medium",
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
