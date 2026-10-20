import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';
import { TEXTAREA_SIZES } from './Textarea.options';
import { FIELD_MESSAGE_TYPES } from '../Field';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Textarea.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Textarea/Textarea',
  id: 'components-textarea-textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 줄 글자를 입력받는 입력 칸입니다. 크기는 `size`로 고르고, `maxLength`를 정하면 입력한 글자 수가 함께 보입니다.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '내용 입력',
    size: 'sm',
    maxLength: 100,
    showCount: true,
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: TEXTAREA_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: '입력 칸 위 라벨' },
    message: { control: 'text', description: '입력 칸 아래 도움말 메시지' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES },
    maxLength: { control: 'number', description: '최대 글자 수' },
    showCount: { control: 'boolean', description: '글자 수 표시 — maxLength가 있을 때 보임' },
    invalid: { control: 'boolean', description: '오류 — 오류 테두리로 표시' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const WithMessage: Story = {
  name: '메시지 있음',
  args: { defaultValue: '배송 전 연락 부탁드립니다.', message: '최대 100자까지 입력할 수 있습니다.', messageType: 'info' },
};

export const Invalid: Story = {
  name: '오류',
  args: { defaultValue: '내용', invalid: true, message: '10자 이상 입력하세요.' },
};

export const Medium: Story = {
  name: '중간 크기',
  args: { size: 'md' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};

export const ReadOnly: Story = {
  name: '읽기 전용',
  args: { readOnly: true, defaultValue: '수정할 수 없는 내용' },
};
