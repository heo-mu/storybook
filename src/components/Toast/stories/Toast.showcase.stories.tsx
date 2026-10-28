import type { Meta, StoryObj } from '@storybook/react-vite';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import { expect, waitFor, within } from 'storybook/test';
import { Toast, ToastRegion } from '../Toast';
import { closeToast, showToast, toastQueue, type ToastContent } from '../toastQueue';
import { ALERT_STATUSES, type AlertStatus } from '../../Alert/Alert.options';
import { Button } from '../../Button';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs toast` (set toast).
const meta = {
  title: "Components/Toast/Gallery",
  id: 'components-toast-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const NAME: Record<AlertStatus, string> = { information: 'Information', success: 'Success', warning: 'Warning', error: 'Error' };

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      <StorySection title="Status (title + description)">
        <Toast status="information" description="잠시 후 다시 시도할 수 있습니다">새 버전이 있습니다</Toast>
        <Toast status="success" description="변경 내용이 서버에 저장되었습니다">저장했습니다</Toast>
        <Toast status="warning" description="2개 항목은 다시 확인하세요">일부 항목만 저장했습니다</Toast>
        <Toast status="error" description="네트워크 연결을 확인하세요">저장하지 못했습니다</Toast>
      </StorySection>
      <StorySection title="Title only · without icon">
        <Toast status="success">저장했습니다</Toast>
        <Toast status="information" showIcon={false}>새 버전이 있습니다</Toast>
      </StorySection>
    </div>
  ),
};

/** Figma `toast` (4): Status × title "Alert 내용" + Sub Text "설명 텍스트", Show Icon on, "닫기" button. */
export const Matrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      columns={['toast']}
      rows={ALERT_STATUSES.map((status) => ({
        label: NAME[status],
        cells: [{ figma: `Status=${NAME[status]}`, node: <Toast status={status} description="설명 텍스트">Alert 내용</Toast> }],
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(4);
    for (const cell of canvasElement.querySelectorAll<HTMLElement>('[data-figma]')) {
      const box = cell.querySelector('.ds-toast')!.getBoundingClientRect();
      await expect([box.width, box.height]).toEqual([320, 54]);
      await expect(cell.querySelector('.ds-toast__close')!.textContent).toBe('닫기');
    }
  },
};

/** A queue of its own so the story does not share the global one. */
const storyQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

/** `ToastRegion`: toasts appear bottom right, the newest at the bottom; "닫기" removes one; focus is managed by react-aria. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => storyQueue.add({ status: 'success', message: '저장했습니다' })}>저장</Button>
      <Button onClick={() => storyQueue.add({ status: 'error', message: '저장하지 못했습니다', description: '네트워크 연결을 확인하세요' })}>오류</Button>
      <ToastRegion queue={storyQueue} />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const win = doc.defaultView!;
    await step('a toast appears bottom right, 320 × 40 with a title only', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '저장' }));
      const region = await body.findByRole('region', { name: '알림' });
      const toast = (await within(region).findByText('저장했습니다')).closest('.ds-toast')!;
      const box = toast.getBoundingClientRect();
      await expect([box.width, box.height]).toEqual([320, 40]);
      await expect(Math.round(win.innerWidth - box.right)).toBe(20);
      await expect(Math.round(win.innerHeight - box.bottom)).toBe(20);
    });
    await step('a toast with a description is 54px high and the newest sits at the bottom', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '오류' }));
      const region = body.getByRole('region', { name: '알림' });
      const error = (await within(region).findByText('저장하지 못했습니다')).closest('.ds-toast')!;
      const success = within(region).getByText('저장했습니다').closest('.ds-toast')!;
      await expect(error.getBoundingClientRect().height).toBe(54);
      await expect(error.getBoundingClientRect().top).toBeGreaterThan(success.getBoundingClientRect().bottom);
      await expect(Math.round(success.getBoundingClientRect().bottom - error.getBoundingClientRect().top)).toBe(-8);
    });
    await step('Tab reaches the toast and its close button', async () => {
      const region = body.getByRole('region', { name: '알림' });
      for (let i = 0; i < 3 && !region.contains(doc.activeElement); i++) await userEvent.tab();
      await expect(region.contains(doc.activeElement)).toBe(true);
    });
    await step('the "닫기" button removes its toast only', async () => {
      const buttons = body.getAllByRole('button', { name: '알림 닫기' });
      await expect(buttons[0].textContent).toBe('닫기');
      const errorClose = within(body.getByText('저장하지 못했습니다').closest('.ds-toast') as HTMLElement).getByRole('button', { name: '알림 닫기' });
      await userEvent.click(errorClose);
      await waitFor(() => expect(body.queryByText('저장하지 못했습니다')).not.toBeInTheDocument());
      await expect(body.getByText('저장했습니다')).toBeVisible();
      await userEvent.click(body.getByRole('button', { name: '알림 닫기' }));
      await waitFor(() => expect(body.queryByText('저장했습니다')).not.toBeInTheDocument());
      // react-aria unmounts the region once the last toast is gone — nothing is left behind.
      await waitFor(() => expect(doc.querySelectorAll('.ds-toast, .ds-toast-region')).toHaveLength(0));
    });
  },
};

/** Design System Rules 06 (2026-10-28): every toast closes after 5 s, at most 3 on screen — a 4th pushes the oldest out, duplicates replace. */
export const Policy: Story = {
  name: '표시 규칙(개수 · 시간 · 중복)',
  render: () => <ToastRegion />,
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const visible = () => toastQueue.visibleToasts;
    const clear = () => { for (let i = 0; i < 10 && toastQueue.visibleToasts.length; i++) toastQueue.visibleToasts.forEach((t) => closeToast(t.key)); };
    try {
      await step('showing the same text again replaces the visible toast (no duplicate)', async () => {
        showToast('저장했습니다', { status: 'success' });
        showToast('저장했습니다', { status: 'success' });
        await waitFor(() => expect(body.getAllByText('저장했습니다')).toHaveLength(1));
        await expect(visible()).toHaveLength(1);
      });
      await step('at most 3 toasts on screen; a 4th pushes the oldest out', async () => {
        clear();
        ['1번', '2번', '3번'].forEach((m) => showToast(m));
        await waitFor(() => expect(visible()).toHaveLength(3));
        showToast('4번');
        await waitFor(() => expect(body.queryByText('1번')).not.toBeInTheDocument());
        await expect(visible().map((t) => t.content.message)).toEqual(['4번', '3번', '2번']);
        await expect(body.getByText('4번')).toBeVisible();
      });
      await step('every status closes after 5 s; timeout: null keeps a toast until closed', async () => {
        clear();
        const err = showToast('저장하지 못했습니다', { status: 'error' });
        const warn = showToast('일부 항목만 저장했습니다', { status: 'warning' });
        const sticky = showToast('업로드 중입니다', { timeout: null });
        await waitFor(() => expect(visible().length).toBe(3));
        await expect(visible().find((t) => t.key === err)?.timeout).toBe(5000);
        await expect(visible().find((t) => t.key === warn)?.timeout).toBe(5000);
        await expect(visible().find((t) => t.key === sticky)?.timeout).toBeUndefined();
        await expect(showToast('짧게', { timeout: 1000 })).toBeTruthy();
        await expect(visible()[0].timeout).toBe(5000);
      });
    } finally {
      clear();
    }
  },
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <Toast status="error" description="네트워크 연결을 확인하세요">
      업로드에 실패했습니다
    </Toast>
  ),
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('업로드에 실패했습니다');
    await expect(status).toHaveTextContent('네트워크 연결을 확인하세요');
    const close = canvas.getByRole('button', { name: '알림 닫기' });
    await expect(close).toHaveTextContent('닫기');
  },
};
