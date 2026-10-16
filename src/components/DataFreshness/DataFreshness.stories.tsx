import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataFreshness } from './DataFreshness';
import { DATA_FRESHNESS_STATES } from './DataFreshness.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/DataFreshness.showcase.stories.tsx
const meta = {
  title: 'Components/DataFreshness/DataFreshness',
  component: DataFreshness,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **data-freshness** (697:4543, 3 variants): State → `state` (fresh · stale · offline — Badge ' +
          'Success · Warning · Gray), Timestamp Text → `timestamp` (`dateTime` for a `<time>`), Interval Text → `interval`, ' +
          'badge text → `label` (default 최근 수신 · 수신 지연 · 연결 끊김).',
      },
    },
  },
  args: { state: 'fresh', timestamp: '2026.10.14 09:30', dateTime: '2026-10-14T09:30', interval: '자동 갱신 1분' },
  argTypes: { state: { control: 'inline-radio', options: DATA_FRESHNESS_STATES, description: 'Figma "State"', table: { defaultValue: { summary: 'fresh' } } } },
} satisfies Meta<typeof DataFreshness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Stale: Story = { args: { state: 'stale' } };

export const Offline: Story = { args: { state: 'offline', interval: undefined } };
