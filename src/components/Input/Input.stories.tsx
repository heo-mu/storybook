import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from './Input';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Input.showcase.stories.tsx
const meta = {
  title: 'Components/Input/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **input** (76:2945, 21 variants) with **input_message** (83:3009). ' +
          'Size → `size`, Label → `label`, Alert → `message` / `messageType`, Icon-eye → password reveal toggle (`type="password"`). ' +
          'State: Hover / Focus are the native :hover / :focus-within, Completed = has a value, Error = `invalid`, ' +
          'Disabled = `disabled`, Read-only = `readOnly`. Native input props and the ref go to the `<input>`; `className` / `style` go to the root.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '내용 입력',
    size: 'sm',
    invalid: false,
    disabled: false,
    readOnly: false,
    clearable: true,
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text" (omit to hide the label)' },
    message: { control: 'text', description: 'Figma "Alert Text"' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: 'Figma input_message "Type"' },
    invalid: { control: 'boolean', description: 'Figma State "Error"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    readOnly: { control: 'boolean', description: 'Figma State "Read-only"' },
    clearable: { control: 'boolean', description: 'Clear (X) button on hover / focus' },
    type: { control: 'select', options: ['text', 'password', 'email', 'tel', 'number', 'url'] },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithMessage: Story = {
  args: { defaultValue: '내용 입력', message: '안내 문구', messageType: 'info' },
};

export const Invalid: Story = {
  args: { defaultValue: '내용 입력', invalid: true, message: '올바른 형식이 아닙니다.' },
};

export const Password: Story = {
  args: { type: 'password', label: '비밀번호', placeholder: '비밀번호 입력', defaultValue: 'secret123' },
};

export const Sizes: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '읽기 전용 값' },
};
