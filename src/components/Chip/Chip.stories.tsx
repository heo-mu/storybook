import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from './Chip';
import { CHIP_SIZES } from './Chip.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Chip.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Chip/Chip',
  id: 'components-chip-chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 개를 켜고 끄는 필터 칩입니다. 크기는 `size`로 고르고, 선택 상태는 `selected` 또는 `defaultSelected`로 정합니다.',
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
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
    children: { control: 'text', description: '칩 글자' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Selected: Story = {
  name: '선택됨',
  args: { defaultSelected: true },
};

export const Medium: Story = {
  name: '중간 크기',
  args: { size: 'md', defaultSelected: true },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};

/** 칩 여러 개로 만든 다중 선택 필터입니다. 이름을 붙인 그룹으로 묶습니다. */
export const Group: Story = {
  name: '그룹',
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
