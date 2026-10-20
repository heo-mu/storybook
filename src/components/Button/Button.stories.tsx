import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리(개요 · 모든 변형 · 상태별 보기 · 동작 확인)는 ./stories에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/Button/Button',
  id: 'components-button-button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '사용자가 행동을 실행하는 버튼입니다. 중요도는 `variant`, 모양은 `appearance`, 크기는 `size`로 고릅니다.',
      },
    },
  },
  args: {
    children: '라벨명',
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
    size: { control: 'inline-radio', options: BUTTON_SIZES, description: '크기', table: { defaultValue: { summary: 'xs' } } },
    shape: { control: 'inline-radio', options: BUTTON_SHAPES, description: '모서리 모양', table: { defaultValue: { summary: 'square' } } },
    leftIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: '글자 왼쪽 아이콘' },
    rightIcon: { control: 'select', options: ICON_OPTIONS, mapping: ICON_MAPPING, description: '글자 오른쪽 아이콘' },
    children: { control: 'text', description: '버튼 글자' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. 아이콘은 leftIcon · rightIcon에서 고릅니다. */
export const Playground: Story = { name: '직접 체험' };

/** Secondary 테두리 모양 — `appearance`를 지정하지 않은 Secondary와 같습니다. */
export const Secondary: Story = {
  name: 'Secondary',
  args: { variant: 'secondary', appearance: 'outline', size: 'md' },
};

/** Secondary 채운 모양 */
export const SecondarySolid: Story = {
  name: 'Secondary Solid',
  args: { variant: 'secondary', appearance: 'solid', size: 'md' },
};

export const TertiaryOutline: Story = {
  name: 'Tertiary Outline',
  args: { variant: 'tertiary', appearance: 'outline', size: 'md' },
};

export const RoundedLarge: Story = {
  name: '둥근 모양 · 큰 크기',
  args: { size: 'lg', shape: 'rounded' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true, size: 'md' },
};
