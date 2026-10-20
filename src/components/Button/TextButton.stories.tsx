import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextButton } from './TextButton';
import { TEXT_BUTTON_SIZES, TEXT_BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

const meta = {
  title: '컴포넌트/Button/TextButton',
  id: 'components-button-textbutton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '배경 없이 글자로만 보이는 가벼운 버튼입니다. 더보기처럼 덜 강조할 행동에 씁니다.',
      },
    },
  },
  args: {
    children: '라벨명',
    variant: 'primary',
    size: 'sm',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: TEXT_BUTTON_VARIANTS, description: '종류', table: { defaultValue: { summary: 'primary' } } },
    size: { control: 'inline-radio', options: TEXT_BUTTON_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: '글자 왼쪽 아이콘' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: '글자 오른쪽 아이콘' },
    children: { control: 'text', description: '버튼 글자' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

export const Medium: Story = {
  name: '중간 크기',
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
