import type { Meta, StoryObj } from '@storybook/react-vite';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import { expect, waitFor, within } from 'storybook/test';
import { Toast, ToastRegion } from '../Toast';
import { closeToast, showToast, toastQueue, type ToastContent } from '../toastQueue';
import { ALERT_STATUSES, type AlertStatus } from '../../Alert/Alert.options';
import { Button } from '../../Button';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs toast` (set toast).
const meta = {
  title: 'Components/Toast/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const NAME: Record<AlertStatus, string> = { information: 'Information', success: 'Success', error: 'Error' };

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toast status="information">새 버전이 있습니다</Toast>
      <Toast status="success">저장했습니다</Toast>
      <Toast status="error">저장하지 못했습니다</Toast>
    </div>
  ),
};

/** Figma `toast` (3): Status, Close Icon on. */
export const Matrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={['toast']}
      rows={ALERT_STATUSES.map((status) => ({
        label: NAME[status],
        cells: [{ figma: `Status=${NAME[status]}`, node: <Toast status={status}>Alert 내용</Toast> }],
      }))}
    />
  ),
};

/** A queue of its own so the story does not share the global one. */
const storyQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

/** `ToastRegion`: toasts appear in a landmark region, the close button removes them, focus is managed by react-aria. */
export const Interaction: Story = {
  render: () => (
    <div>
      <Button onClick={() => storyQueue.add({ status: 'success', message: '저장했습니다' })}>저장</Button>
      <ToastRegion queue={storyQueue} />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    await step('a toast appears in the region, same box as the Figma toast', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '저장' }));
      const region = await body.findByRole('region', { name: '알림' });
      const toast = await within(region).findByText('저장했습니다');
      const box = toast.closest('.ds-toast')!.getBoundingClientRect();
      await expect([box.width, box.height]).toEqual([320, 36]);
    });
    await step('Tab reaches the toast and its close button', async () => {
      const region = body.getByRole('region', { name: '알림' });
      for (let i = 0; i < 3 && !region.contains(canvasElement.ownerDocument.activeElement); i++) await userEvent.tab();
      await expect(region.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await step('the close button removes it', async () => {
      await userEvent.click(body.getByRole('button', { name: '알림 닫기' }));
      await waitFor(() => expect(body.queryByText('저장했습니다')).not.toBeInTheDocument());
    });
  },
};

/** Design System Rules 06: at most 3 on screen, the same message is not stacked, errors stay until closed. */
export const Policy: Story = {
  render: () => <ToastRegion />,
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const visible = () => toastQueue.visibleToasts;
    try {
      await step('showing the same text again replaces the visible toast (no duplicate)', async () => {
        showToast('저장했습니다', { status: 'success' });
        showToast('저장했습니다', { status: 'success' });
        await waitFor(() => expect(body.getAllByText('저장했습니다')).toHaveLength(1));
        await expect(visible()).toHaveLength(1);
      });
      await step('at most 3 toasts on screen; the rest wait', async () => {
        ['1번', '2번', '3번', '4번'].forEach((m) => showToast(m));
        await waitFor(() => expect(visible()).toHaveLength(3));
      });
      await step('an error stays until closed (no timeout); information closes after 5 s', async () => {
        toastQueue.visibleToasts.forEach((t) => toastQueue.close(t.key));
        const err = showToast('저장하지 못했습니다', { status: 'error' });
        const info = showToast('새 버전이 있습니다');
        await waitFor(() => expect(visible().length).toBeGreaterThanOrEqual(2));
        await expect(visible().find((t) => t.key === err)?.timeout).toBeUndefined();
        await expect(visible().find((t) => t.key === info)?.timeout).toBe(5000);
      });
    } finally {
      for (let i = 0; i < 10 && toastQueue.visibleToasts.length; i++) toastQueue.visibleToasts.forEach((t) => closeToast(t.key));
    }
  },
};

export const Accessibility: Story = {
  render: () => <Toast status="error">업로드에 실패했습니다</Toast>,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('업로드에 실패했습니다');
    await expect(canvas.getByRole('button', { name: '알림 닫기' })).toBeInTheDocument();
  },
};
