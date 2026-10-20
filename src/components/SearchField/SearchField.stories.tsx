import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchField } from './SearchField';
import { SEARCH_FIELD_APPEARANCES } from './SearchField.options';
import { FIELD_SIZES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/SearchField.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/SearchField/SearchField',
  id: 'components-searchfield-searchfield',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '검색어를 입력받는 입력 칸입니다. 모양은 `appearance`, 크기는 `size`로 고르고, Enter 키를 누르면 `onSearch`가 호출됩니다.',
      },
    },
  },
  args: {
    label: '라벨명',
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
    label: { control: 'text', description: '입력 칸 위 라벨 — 없으면 aria-label을 붙임' },
    invalid: { control: 'boolean', description: '오류 — 오류 테두리로 표시' },
    disabled: { control: 'boolean', description: '비활성 — 입력할 수 없음' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Solid: Story = {
  name: 'Solid',
  args: { appearance: 'solid' },
};

export const WithoutLabel: Story = {
  name: '라벨 없음',
  args: { label: undefined, 'aria-label': '검색' },
};

export const Large: Story = {
  name: '큰 크기',
  args: { size: 'lg', defaultValue: '검색어' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
