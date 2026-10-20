import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import { CHOICE_SIZES } from '../Choice';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Radio.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Radio/Radio',
  id: 'components-radio-radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 옵션 중 하나만 고르는 라디오 버튼입니다. 보통 `RadioGroup`으로 묶어 그룹의 `value` · `onChange`로 선택을 관리하고, 크기는 `size`로 고릅니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    value: 'option',
    name: 'playground',
    size: 'sm',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHOICE_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '원 옆 라벨 — 없으면 aria-label을 붙임' },
    defaultChecked: { control: 'boolean', description: '처음 선택 여부(그룹 없이 쓸 때, 비제어)' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없음' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Selected: Story = {
  name: '선택됨',
  args: { defaultChecked: true },
};

export const Sizes: Story = {
  name: '크기',
  args: { size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true, defaultChecked: true },
};

/** `RadioGroup`이 선택한 값을 관리합니다. */
export const Group: Story = {
  name: '그룹',
  render: (args) => (
    <RadioGroup aria-label="정렬" defaultValue="recent" size={args.size}>
      <Radio value="recent" label="최신순" />
      <Radio value="popular" label="인기순" />
      <Radio value="name" label="이름순" />
    </RadioGroup>
  ),
};

export const HorizontalGroup: Story = {
  name: '가로 그룹',
  render: (args) => (
    <RadioGroup aria-label="기간" defaultValue="7d" orientation="horizontal" size={args.size}>
      <Radio value="7d" label="7일" />
      <Radio value="30d" label="30일" />
      <Radio value="90d" label="90일" />
    </RadioGroup>
  ),
};

/** 꼭 골라야 하는 항목을 고르지 않았을 때 묶음 아래에 오류 메시지를 보여 줍니다. */
export const GroupError: Story = {
  name: '묶음 오류',
  render: (args) => (
    <RadioGroup aria-label="구분" required invalid message="구분을 고르세요." orientation="horizontal" size={args.size}>
      <Radio value="normal" label="일반" />
      <Radio value="urgent" label="긴급" />
    </RadioGroup>
  ),
};
