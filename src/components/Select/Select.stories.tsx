import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Select } from './Select';
import { SelectOption } from './SelectOption';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Select.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Select/Select",
  id: 'components-select-select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "옵션 목록에서 항목 하나를 선택합니다. SelectOption으로 목록을 구성합니다.",
      },
    },
  },
  args: {
    label: '과일',
    placeholder: '내용 선택',
    size: 'sm',
    required: false,
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
    onOpenChange: fn(),
    children: null,
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '선택 필드 위 라벨' },
    placeholder: { control: 'text', description: '아무것도 고르지 않았을 때 보이는 글자' },
    message: { control: 'text', description: '선택 필드 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: '도움말 메시지 종류 — 지정하지 않으면 오류일 때 error, 아니면 회색 도움말(helper)' },
    required: { control: 'boolean', description: '필수 — 라벨 뒤 점 표시, 화면 낭독기가 "필수"로 알림' },
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

export const Playground: Story = { name: "Playground" };

export const Required: Story = {
  name: "Required",
  args: { label: '과일', required: true },
};

export const WithValue: Story = {
  name: "Selected",
  args: { defaultValue: 'banana' },
};

export const Helper: Story = {
  name: "Helper Text",
  args: { message: '인사 정보에 등록된 항목만 고를 수 있습니다.' },
};

export const WithMessage: Story = {
  name: "상태 메시지",
  args: { defaultValue: 'apple', message: '하나를 선택하세요.', messageType: 'info' },
};

export const Invalid: Story = {
  name: "Error",
  args: { invalid: true, message: '필수 항목입니다.' },
};

export const Sizes: Story = {
  name: "Sizes",
  args: { size: 'lg' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};

export const ReadOnly: Story = {
  name: "Read Only",
  args: { readOnly: true, defaultValue: 'grape' },
};

/** 데이터 목록(`items`)과 렌더 함수로 옵션을 만듭니다. */
export const DynamicItems: Story = {
  name: "Dynamic Items",
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
  name: "Without Check Icon",
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
