import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';
import { SWITCH_SIZES } from './Switch.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Switch.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Switch/Switch",
  id: 'components-switch-switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "알림·자동 저장 등 두 상태를 갖는 설정을 켜거나 끕니다.",
      },
    },
  },
  args: {
    label: '자동 저장',
    size: 'sm',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SWITCH_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '스위치 옆 라벨 — 없으면 aria-label을 붙임' },
    defaultChecked: { control: 'boolean', description: '처음 켜짐 여부(비제어)' },
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Checked: Story = {
  name: "On",
  args: { defaultChecked: true },
};

export const Medium: Story = {
  name: "Medium",
  args: { size: 'md', defaultChecked: true },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};

export const WithoutLabel: Story = {
  name: "Without Label",
  args: { label: undefined, 'aria-label': '다크 모드' },
};
