import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { CHOICE_SIZES } from '../Choice';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Checkbox.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Checkbox/Checkbox',
  id: 'components-checkbox-checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '항목을 켜고 끄거나 여러 개를 고르는 체크박스입니다. 선택은 `checked` · `defaultChecked`, 일부 선택은 `indeterminate`로 정하고, 여러 개는 `CheckboxGroup`으로 묶습니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    indeterminate: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: CHOICE_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '상자 옆 라벨 — 없으면 aria-label을 붙임' },
    indeterminate: { control: 'boolean', description: '일부 선택 표시' },
    defaultChecked: { control: 'boolean', description: '처음 선택 여부(비제어)' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Checked: Story = {
  name: '선택됨',
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  name: '일부 선택',
  args: { indeterminate: true, label: '일부 선택' },
};

export const Sizes: Story = {
  name: '크기',
  args: { size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  name: '라벨 없음',
  args: { label: undefined, 'aria-label': '행 선택' },
};

/** `CheckboxGroup`이 선택한 값 목록을 관리합니다. */
export const Group: Story = {
  name: '그룹',
  render: (args) => (
    <CheckboxGroup aria-label="관심 분야" defaultValue={['design']} name="interest" size={args.size}>
      <Checkbox value="design" label="디자인" />
      <Checkbox value="dev" label="개발" />
      <Checkbox value="data" label="데이터" disabled />
    </CheckboxGroup>
  ),
};
