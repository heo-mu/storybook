import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { BUTTON_APPEARANCES, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS } from './Button.options';
import { ICON_MAPPING, ICON_OPTIONS } from './stories/icon-controls';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리(개요 · 모든 변형 · 상태별 보기 · 동작 확인)는 ./stories에 있고 !manifest 태그.
const meta = {
  title: "Components/Button/Button",
  id: 'components-button-button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "저장·조회·다음 단계 이동 등 사용자 동작을 실행합니다. 동작의 중요도에 맞춰 종류를 선택합니다.",
      },
    },
  },
  args: {
    children: '저장',
    variant: 'primary',
    appearance: 'solid',
    size: 'xs',
    shape: 'square',
    disabled: false,
    loading: false,
    onClick: fn(),
  },
  argTypes: {
    loading: { control: 'boolean', description: '처리 중 — 글자 자리에 회전 표시, 다시 누를 수 없음(Figma Form 사용 예시 "저장 중")' },
    loadingLabel: { control: 'text', description: '처리 중일 때 화면 낭독기가 읽는 글자', table: { defaultValue: { summary: '처리 중' } } },
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
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. 아이콘은 leftIcon · rightIcon에서 고릅니다. */
export const Playground: Story = { name: "Playground" };

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
  name: "Large Rounded",
  args: { size: 'lg', shape: 'rounded' },
};

/** 처리 중(저장 중) — Figma Form 사용 예시의 "저장 중" 버튼: Primary · Solid · md, 16px 흰 회전 표시, 크기 · 색 유지. */
export const Loading: Story = {
  name: '처리 중',
  args: { variant: 'primary', appearance: 'solid', size: 'md', loading: true, loadingLabel: '저장 중' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, size: 'md' },
};
