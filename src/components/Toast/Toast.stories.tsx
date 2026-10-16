import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Toast, ToastRegion } from './Toast';
import { showToast } from './toastQueue';
import { ALERT_STATUSES } from '../Alert/Alert.options';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Toast.showcase.stories.tsx
const meta = {
  title: 'Components/Toast/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **toast** (91:5927). Place `<ToastRegion />` once (e.g. in the app root) and call ' +
          '`showToast(message, { status, timeout })`; Status → `status`, Alert Text → message, Close Icon → close button. ' +
          '`Toast` renders the same toast statically. The region uses react-aria-components Toast (labelled region, announcements, ' +
          'timers paused on hover / focus).',
      },
    },
  },
  args: { children: '저장했습니다', status: 'success', showClose: true, onClose: fn() },
  argTypes: { status: { control: 'inline-radio', options: ALERT_STATUSES, description: 'Figma "Status"', table: { defaultValue: { summary: 'information' } } } },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** `showToast()` with the default region. */
export const WithRegion: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => showToast('새 버전이 있습니다')}>안내</Button>
      <Button onClick={() => showToast('저장했습니다', { status: 'success' })}>성공</Button>
      <Button onClick={() => showToast('저장하지 못했습니다', { status: 'error', timeout: null })}>오류 (닫을 때까지)</Button>
      <ToastRegion />
    </div>
  ),
};
