import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Calendar.showcase.stories.tsx
const meta = {
  title: 'Components/Calendar/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `date-picker_calendar` (144:1644) with header, navigation and day cells — a month grid used by `DatePicker`, ' +
          'also usable on its own. Values are ISO dates (`"2026-07-30"`). Day states: Today (current date), Selected (`value`), ' +
          'Outside (other month), Disabled (`minValue` / `maxValue` / `isDateUnavailable`), Hover / Pressed. Keyboard: arrows, ' +
          'Page Up / Down (month), Home / End (week), Enter / Space selects. Month and weekday names follow the react-aria locale.',
      },
    },
  },
  args: {
    'aria-label': '일정',
    onChange: fn(),
  },
  argTypes: {
    defaultValue: { control: 'text', description: "Initial date 'YYYY-MM-DD'" },
    minValue: { control: 'text' },
    maxValue: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: { defaultValue: '2026-07-30' },
};

export const Range: Story = {
  args: { defaultFocusedValue: '2026-07-15', minValue: '2026-07-06', maxValue: '2026-07-24' },
};
