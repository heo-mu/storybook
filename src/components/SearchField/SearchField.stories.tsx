import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchField } from './SearchField';
import { SEARCH_FIELD_APPEARANCES } from './SearchField.options';
import { FIELD_SIZES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/SearchField.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/SearchField/SearchField",
  id: 'components-searchfield-searchfield',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "검색어를 입력하고 Enter 키로 검색을 요청합니다. 일반 텍스트 입력에는 Input을 사용합니다.",
      },
    },
  },
  args: {
    label: '검색어',
    placeholder: '검색어 입력',
    size: 'sm',
    appearance: 'outline',
    invalid: false,
    disabled: false,
    onSearch: fn(),
    onClear: fn(),
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    appearance: { control: 'inline-radio', options: SEARCH_FIELD_APPEARANCES, description: '모양 — 테두리(outline) · 채움(solid)', table: { defaultValue: { summary: 'outline' } } },
    label: { control: 'text', description: '입력 필드 위 라벨 — 없으면 aria-label을 붙임' },
    invalid: { control: 'boolean', description: '오류 — 오류 테두리로 표시' },
    disabled: { control: 'boolean', description: '비활성 — 입력할 수 없음' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Solid: Story = {
  name: 'Solid',
  args: { appearance: 'solid' },
};

export const WithoutLabel: Story = {
  name: "Without Label",
  args: { label: undefined, 'aria-label': '검색' },
};

export const Large: Story = {
  name: "Large",
  args: { size: 'lg', defaultValue: '검색어' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
