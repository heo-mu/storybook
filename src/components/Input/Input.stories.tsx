import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from './Input';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Input.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Input/Input',
  id: 'components-input-input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '한 줄짜리 글자를 입력받는 입력 칸입니다. 크기는 `size`, 라벨은 `label`, 도움말 메시지는 `message`로 정하고 오류는 `invalid`로 표시합니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '내용 입력',
    size: 'sm',
    required: false,
    invalid: false,
    disabled: false,
    readOnly: false,
    clearable: true,
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '입력 칸 위 라벨 — 없으면 aria-label을 붙임' },
    message: { control: 'text', description: '입력 칸 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: '도움말 메시지 종류 — 지정하지 않으면 오류일 때 error, 아니면 info' },
    required: { control: 'boolean', description: '필수 — 라벨 뒤 점 표시, 화면 낭독기가 "필수"로 읽음' },
    invalid: { control: 'boolean', description: '오류 — 빨간 테두리로 표시' },
    disabled: { control: 'boolean', description: '비활성 — 입력할 수 없음' },
    readOnly: { control: 'boolean', description: '읽기 전용 — 값을 볼 수만 있음' },
    clearable: { control: 'boolean', description: '마우스를 올리거나 키보드로 선택하면 지우기 버튼(X) 표시' },
    type: { control: 'select', options: ['text', 'password', 'email', 'tel', 'number', 'url'] },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Required: Story = {
  name: '필수 입력',
  args: { label: '이름', placeholder: '이름 입력', required: true },
};

export const WithMessage: Story = {
  name: '메시지 있음',
  args: { defaultValue: '내용 입력', message: '안내 문구', messageType: 'info' },
};

export const Invalid: Story = {
  name: '오류',
  args: { defaultValue: '내용 입력', invalid: true, message: '올바른 형식이 아닙니다.' },
};

export const Password: Story = {
  name: '비밀번호',
  args: { type: 'password', label: '비밀번호', placeholder: '비밀번호 입력', defaultValue: 'secret123' },
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
  args: { readOnly: true, defaultValue: '읽기 전용 값' },
};
