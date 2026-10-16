import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/DatePicker.showcase.stories.tsx
const meta = {
  title: 'Components/DatePicker/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **date-picker_trigger** (144:723, 21 variants) and **date-picker_message** (144:888), with the ' +
          '`Calendar` (date-picker_calendar) in a popover. Values are ISO dates (`"2026-07-30"`) shown as YYYY.MM.DD. ' +
          'Typed dates (YYYY.MM.DD, YYYY-MM-DD, YYYYMMDD) commit on Enter / blur; the calendar button or Alt + ↓ opens the calendar. ' +
          'Size → `size`, Label → `label`, Alert → `message` / `messageType`. State: Hover / Focus = :hover / :focus-within, Completed = ' +
          'has a date, Error = `invalid` (or an unusable typed date), Disabled = `disabled`, Read-only = `readOnly`.',
      },
    },
  },
  args: {
    label: '라벨명',
    size: 'sm',
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text"' },
    message: { control: 'text', description: 'Figma date-picker_message text' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: 'Figma date-picker_message "Type"' },
    invalid: { control: 'boolean', description: 'Figma State "Error"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    readOnly: { control: 'boolean', description: 'Figma State "Read-only"' },
    defaultValue: { control: 'text', description: "Initial date 'YYYY-MM-DD'" },
    minValue: { control: 'text' },
    maxValue: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320, paddingBottom: 300 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: { defaultValue: '2026-07-30' },
};

export const WithMessage: Story = {
  args: { defaultValue: '2026-07-30', message: '평일만 선택할 수 있습니다.', messageType: 'info' },
};

export const Range: Story = {
  args: { label: '방문일', minValue: '2026-07-06', maxValue: '2026-07-24', defaultValue: '2026-07-15' },
};

/** Weekends unavailable (`isDateUnavailable`). */
export const WeekdaysOnly: Story = {
  args: {
    label: '상담일',
    defaultValue: '2026-07-15',
    isDateUnavailable: (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00`).getDay()),
  },
};

export const Invalid: Story = {
  args: { defaultValue: '2026-07-01', invalid: true, message: '시작일 이후여야 합니다.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '2026-07-30' },
};
