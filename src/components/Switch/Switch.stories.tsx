import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';
import { SWITCH_SIZES } from './Switch.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Switch.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Switch/Switch',
  id: 'components-switch-switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '설정을 켜고 끄는 스위치입니다. 켜짐은 `checked` · `defaultChecked`, 크기는 `size`로 정합니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SWITCH_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '스위치 옆 라벨 — 없으면 aria-label을 붙임' },
    defaultChecked: { control: 'boolean', description: '처음 켜짐 여부(비제어)' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Checked: Story = {
  name: '켜짐',
  args: { defaultChecked: true },
};

export const Medium: Story = {
  name: '중간 크기',
  args: { size: 'md', defaultChecked: true },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};

export const WithoutLabel: Story = {
  name: '라벨 없음',
  args: { label: undefined, 'aria-label': '다크 모드' },
};
