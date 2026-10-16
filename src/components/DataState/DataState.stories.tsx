import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataState } from './DataState';
import { DATA_STATES } from './DataState.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/DataState.showcase.stories.tsx
const meta = {
  title: 'Components/DataState/DataState',
  component: DataState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **data-state** (698:4359, 6 variants): State → `state` (loading · empty · no-results · error · ' +
          'no-access · partial), "Empty Title" · "Empty Description" … (per state) → `title` / `description` (default: the Figma text), the ' +
          'button → `onAction` + `actionLabel` (or a custom `action`). Loading shows three skeleton bars and `loadingLabel`. ' +
          'A polite live region; fills its container (Figma 460px).',
      },
    },
  },
  args: { state: 'empty', onAction: fn() },
  argTypes: { state: { control: 'select', options: DATA_STATES, description: 'Figma "State"' } },
  render: (args) => (
    <div style={{ width: 460, maxWidth: '100%' }}>
      <DataState {...args} />
    </div>
  ),
} satisfies Meta<typeof DataState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Loading: Story = { args: { state: 'loading' } };

export const ErrorState: Story = { name: 'Error', args: { state: 'error' } };

/** Partial has no default description — give the counts. */
export const Partial: Story = {
  args: { state: 'partial', description: '130대 중 128대 수신 · 누락된 2대를 확인하세요.' },
};

/** Without `onAction` there is no button. */
export const WithoutAction: Story = {
  args: { state: 'no-results', onAction: undefined },
};
