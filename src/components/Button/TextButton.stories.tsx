import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextButton } from './TextButton';
import { TEXT_BUTTON_SIZES, TEXT_BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

const meta = {
  title: "Components/Button/TextButton",
  id: 'components-button-textbutton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "더보기 등 강조도가 낮은 보조 동작에 사용하는 텍스트 버튼입니다.",
      },
    },
  },
  args: {
    children: '저장',
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
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

export const Medium: Story = {
  name: "Medium",
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};

/**
 * 오른쪽 아이콘: 글자 뒤에 아이콘을 둡니다(예: 더보기 ›, 초기화 ↺). 아이콘이 있는 쪽의 안쪽 여백이 한 단계 좁아 글자와 아이콘이
 * 버튼 가운데에 자연스럽게 놓입니다 — sm 왼쪽 4 · 오른쪽 2px, md 왼쪽 6 · 오른쪽 4px(아이콘 없으면 sm 4 · 4, md 6 · 6).
 */
export const RightIcon: Story = {
  name: "오른쪽 아이콘",
  args: { children: '더보기', rightIcon: 'CaretRight' },
};
