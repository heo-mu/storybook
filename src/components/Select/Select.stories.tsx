import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Select } from './Select';
import { SelectOption } from './SelectOption';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Select.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Select/Select',
  id: 'components-select-select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '목록을 펼쳐 옵션 하나를 고르는 선택 칸입니다. 옵션은 `SelectOption`으로 넣고, 값은 선택한 옵션의 `id`로 `value` · `defaultValue` · `onChange`에서 다룹니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '내용 선택',
    size: 'sm',
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
    onOpenChange: fn(),
    children: null,
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '선택 칸 위 라벨' },
    placeholder: { control: 'text', description: '아무것도 고르지 않았을 때 보이는 글자' },
    message: { control: 'text', description: '선택 칸 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: '도움말 메시지 종류' },
    invalid: { control: 'boolean', description: '오류 — 오류 테두리로 표시' },
    disabled: { control: 'boolean', description: '비활성 — 고를 수 없음' },
    readOnly: { control: 'boolean', description: '읽기 전용 — 값만 보이고 목록이 펼쳐지지 않음' },
    children: { control: false },
  },
  render: (args) => (
    <Select {...args}>
      <SelectOption id="apple">사과</SelectOption>
      <SelectOption id="banana">바나나</SelectOption>
      <SelectOption id="cherry" disabled>
        체리 (품절)
      </SelectOption>
      <SelectOption id="grape">포도</SelectOption>
    </Select>
  ),
  decorators: [(Story) => <div style={{ width: 320, paddingBottom: 200 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const WithValue: Story = {
  name: '값 있음',
  args: { defaultValue: 'banana' },
};

export const WithMessage: Story = {
  name: '메시지 있음',
  args: { defaultValue: 'apple', message: '하나를 선택하세요.', messageType: 'info' },
};

export const Invalid: Story = {
  name: '오류',
  args: { invalid: true, message: '필수 항목입니다.' },
};

export const Sizes: Story = {
  name: '크기',
  args: { size: 'lg' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};

export const ReadOnly: Story = {
  name: '읽기 전용',
  args: { readOnly: true, defaultValue: 'grape' },
};

/** 데이터 목록(`items`)과 렌더 함수로 옵션을 만듭니다. */
export const DynamicItems: Story = {
  name: '항목 목록으로',
  render: (args) => (
    <Select
      {...args}
      items={[
        { id: 'kr', name: '대한민국' },
        { id: 'jp', name: '일본' },
        { id: 'us', name: '미국' },
      ]}
    >
      {(item: { id: string; name: string }) => <SelectOption id={item.id}>{item.name}</SelectOption>}
    </Select>
  ),
};

/** 체크 아이콘을 끄면 선택된 옵션은 굵은 글자로만 표시됩니다. */
export const WithoutCheckIcon: Story = {
  name: '체크 아이콘 없음',
  args: { defaultValue: 'banana' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'));
    const selected = await within(document.body).findByRole('option', { name: '바나나' });
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    await expect(selected.querySelector('.ds-option__check')).toBeNull();
    await userEvent.keyboard('{Escape}');
  },
  render: (args) => (
    <div style={{ minHeight: 200 }}>
      <Select {...args}>
        <SelectOption id="apple" checkIcon={false}>
          사과
        </SelectOption>
        <SelectOption id="banana" checkIcon={false}>
          바나나
        </SelectOption>
        <SelectOption id="grape" checkIcon={false}>
          포도
        </SelectOption>
      </Select>
    </div>
  ),
};
