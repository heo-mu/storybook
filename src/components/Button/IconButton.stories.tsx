import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_VARIANTS, ICON_BUTTON_SIZES } from './Button.options';
import { ICON_MAPPING } from './stories/icon-controls';

const meta = {
  title: "Components/Button/IconButton",
  id: 'components-button-iconbutton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "아이콘으로 동작을 표현하는 버튼입니다. `aria-label`로 동작의 이름을 제공합니다.",
      },
    },
  },
  args: {
    'aria-label': '추가',
    icon: 'Plus',
    variant: 'primary',
    appearance: 'solid',
    size: 'xs',
    shape: 'square',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: BUTTON_VARIANTS, description: '종류 — 행동의 중요도', table: { defaultValue: { summary: 'primary' } } },
    appearance: {
      control: 'inline-radio',
      options: BUTTON_APPEARANCES,
      description: '모양 — 채움(solid) · 테두리(outline). 지정하지 않으면 Secondary는 outline, 나머지는 solid',
      table: { defaultValue: { summary: "'solid' (secondary는 'outline')" } },
    },
    size: { control: 'inline-radio', options: ICON_BUTTON_SIZES, description: '크기', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: '모서리 모양', table: { defaultValue: { summary: 'square' } } },
    icon: { control: 'select', options: ['Plus', 'CaretLeft', 'CaretRight'], mapping: ICON_MAPPING, description: '표시할 아이콘' },
    'aria-label': { control: 'text', description: '화면 낭독기가 읽는 버튼 이름(필수)' },
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const TertiaryOutlineRounded: Story = {
  name: "Tertiary Outline Rounded",
  args: { variant: 'tertiary', appearance: 'outline', shape: 'rounded', size: 'md' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, size: 'md' },
};
