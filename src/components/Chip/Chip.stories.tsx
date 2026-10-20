import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from './Chip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Chip/Chip",
  id: 'components-chip-chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "필터 선택, 입력된 태그 삭제, 옵션 목록 열기에 사용하는 컴포넌트입니다. 목적에 따라 Chip·InputChip·FilterChip·FilterChipSelect를 선택합니다.",
      },
    },
  },
  args: {
    children: '라벨명',
    size: 'xs',
    disabled: false,
    onSelectedChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHIP_SIZES, description: '크기', table: { defaultValue: { summary: 'xs' } } },
    defaultSelected: { control: 'boolean', description: '처음에 선택됨으로 시작할지 여부' },
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
    children: { control: 'text', description: '칩 글자' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Selected: Story = {
  name: "Selected",
  args: { defaultSelected: true },
};

export const Medium: Story = {
  name: "Medium",
  args: { size: 'md', defaultSelected: true },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};

/** 칩 여러 개로 만든 다중 선택 필터입니다. 이름을 붙인 그룹으로 묶습니다. */
export const Group: Story = {
  name: "Group",
  render: (args) => (
    <div role="group" aria-label="상태" style={{ display: 'flex', gap: 'var(--spacing-margin-m-1)' }}>
      <Chip {...args} defaultSelected>
        진행 중
      </Chip>
      <Chip {...args}>완료</Chip>
      <Chip {...args}>보류</Chip>
    </div>
  ),
};
