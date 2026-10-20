import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';
import { TEXTAREA_SIZES } from './Textarea.options';
import { FIELD_MESSAGE_TYPES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Textarea.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Textarea/Textarea",
  id: 'components-textarea-textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "요청 사항·사유 등 여러 줄의 텍스트를 입력받습니다. 글자 수 제한과 현재 입력량을 표시할 수 있습니다.",
      },
    },
  },
  args: {
    label: '요청 사항',
    placeholder: '내용 입력',
    size: 'sm',
    maxLength: 100,
    showCount: true,
    required: false,
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: TEXTAREA_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '입력 필드 위 라벨' },
    message: { control: 'text', description: '입력 필드 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: '도움말 메시지 종류 — 지정하지 않으면 오류일 때 error, 아니면 회색 도움말(helper)' },
    maxLength: { control: 'number', description: '최대 글자 수' },
    showCount: { control: 'boolean', description: '글자 수 표시 — maxLength가 있을 때 보임' },
    required: { control: 'boolean', description: '필수 — 라벨 뒤 점 표시, 화면 낭독기가 "필수"로 읽음' },
    invalid: { control: 'boolean', description: '오류 — 오류 테두리로 표시' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Required: Story = {
  name: "Required",
  args: { label: '신청 사유', placeholder: '신청 사유 입력', required: true },
};

export const Helper: Story = {
  name: "Helper Text",
  args: { message: '받는 분께 전할 내용을 적어 주세요.' },
};

export const WithMessage: Story = {
  name: "상태 메시지",
  args: { defaultValue: '배송 전 연락 부탁드립니다.', message: '최대 100자까지 입력할 수 있습니다.', messageType: 'info' },
};

export const Invalid: Story = {
  name: "Error",
  args: { defaultValue: '내용', invalid: true, message: '10자 이상 입력하세요.' },
};

export const Medium: Story = {
  name: "Medium",
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};

export const ReadOnly: Story = {
  name: "Read Only",
  args: { readOnly: true, defaultValue: '수정할 수 없는 내용' },
};
