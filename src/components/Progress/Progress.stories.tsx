import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Progress.showcase.stories.tsx
const meta = {
  title: 'Components/Progress/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component **progress** (185:6518): a 6px rounded track with the bar clipped by it. `value` between ' +
          '`minValue` and `maxValue` (0 – 100). Built on react-aria-components `ProgressBar` (role="progressbar", ' +
          'aria-valuenow / aria-valuetext); name it with `aria-label` or `aria-labelledby`. The width follows the layout.',
      },
    },
  },
  args: { 'aria-label': '진행률', value: 44, minValue: 0, maxValue: 100 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  decorators: [(Story) => <div style={{ width: 430 }}>{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Complete: Story = {
  args: { value: 100 },
};

/** Custom range with a value text for screen readers. */
export const CustomRange: Story = {
  args: { value: 3, maxValue: 10, valueLabel: '10단계 중 3단계' },
};
