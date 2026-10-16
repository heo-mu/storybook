import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTrend } from './MetricTrend';
import { METRIC_TREND_DIRECTIONS, METRIC_TREND_TONES } from './MetricTrend.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/MetricTrend.showcase.stories.tsx
const meta = {
  title: 'Components/MetricTrend/MetricTrend',
  component: MetricTrend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **metric-trend** (697:4482, 12 variants): Direction → `direction` (up · down · flat · disabled), ' +
          'Tone → `tone` (positive · negative · neutral — whether the change is good or bad), Change Text → children. ' +
          'The direction is also given to screen readers (`directionLabel`).',
      },
    },
  },
  args: { children: '4.8%p', direction: 'up', tone: 'positive' },
  argTypes: {
    direction: { control: 'inline-radio', options: METRIC_TREND_DIRECTIONS, description: 'Figma "Direction"', table: { defaultValue: { summary: 'up' } } },
    tone: { control: 'inline-radio', options: METRIC_TREND_TONES, description: 'Figma "Tone"', table: { defaultValue: { summary: 'positive' } } },
  },
} satisfies Meta<typeof MetricTrend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Lower energy use is good: a decrease with the positive tone. */
export const DecreaseIsGood: Story = {
  args: { direction: 'down', tone: 'positive', children: '4.8%p' },
};

export const Increase: Story = {
  args: { direction: 'up', tone: 'negative', children: '12%' },
};

/** No comparison available. */
export const Disabled: Story = {
  args: { direction: 'disabled', children: '-' },
};
