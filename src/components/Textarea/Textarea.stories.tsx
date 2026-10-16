import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';
import { TEXTAREA_SIZES } from './Textarea.options';
import { FIELD_MESSAGE_TYPES } from '../Field';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Textarea.showcase.stories.tsx
const meta = {
  title: 'Components/Textarea/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **textarea** (86:2597, 14 variants) with **textarea_message** (86:2733). ' +
          'Size → `size` (sm · md), Label → `label`, Alert → `message` / `messageType`, Counter → `showCount` with `maxLength`. ' +
          'State: Hover / Focus native, Completed = has a value, Error = `invalid`, Disabled, Read-only. The container is 100px high.',
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
    size: { control: 'inline-radio', options: TEXTAREA_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text"' },
    message: { control: 'text', description: 'Figma "Alert Text"' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES },
    maxLength: { control: 'number', description: 'Counter maximum' },
    showCount: { control: 'boolean', description: 'Figma "Counter"' },
    invalid: { control: 'boolean', description: 'Figma State "Error"' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithMessage: Story = {
  args: { defaultValue: '배송 전 연락 부탁드립니다.', message: '최대 100자까지 입력할 수 있습니다.', messageType: 'info' },
};

export const Invalid: Story = {
  args: { defaultValue: '내용', invalid: true, message: '10자 이상 입력하세요.' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '수정할 수 없는 내용' },
};
