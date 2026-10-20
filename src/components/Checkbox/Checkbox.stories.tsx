import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { CHOICE_SIZES } from '../Choice';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Checkbox.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Checkbox/Checkbox",
  id: 'components-checkbox-checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "독립적인 옵션을 선택하거나 여러 옵션을 함께 선택할 때 사용합니다. CheckboxGroup으로 선택값을 함께 관리할 수 있습니다.",
      },
    },
  },
  args: {
    label: '알림 수신',
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
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Checked: Story = {
  name: "Checked",
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  args: { indeterminate: true, label: '일부 선택' },
};

export const Sizes: Story = {
  name: "Sizes",
  args: { size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  name: "Without Label",
  args: { label: undefined, 'aria-label': '행 선택' },
};

/** `CheckboxGroup`이 선택한 값 목록을 관리합니다. */
export const Group: Story = {
  name: "Group",
  render: (args) => (
    <CheckboxGroup aria-label="관심 분야" defaultValue={['design']} name="interest" size={args.size}>
      <Checkbox value="design" label="디자인" />
      <Checkbox value="dev" label="개발" />
      <Checkbox value="data" label="데이터" disabled />
    </CheckboxGroup>
  ),
};

/** 필수 항목을 고르지 않았을 때 묶음 아래에 오류 메시지를 보여 줍니다. 상자 색은 바뀌지 않습니다. 동의 하나도 묶음으로 감쌉니다. */
export const GroupError: Story = {
  name: "그룹 오류",
  render: (args) => (
    <CheckboxGroup aria-label="약관 동의" name="terms" size={args.size} invalid message="개인정보 수집 · 이용에 동의해야 저장할 수 있습니다.">
      <Checkbox value="privacy" label="개인정보 수집 · 이용에 동의합니다" />
    </CheckboxGroup>
  ),
};
