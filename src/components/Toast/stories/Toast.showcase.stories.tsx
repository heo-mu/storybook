import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
import { expect, waitFor, within } from 'storybook/test';
import { Toast, ToastRegion } from '../Toast';
import { closeToast, showToast, toastQueue, type ShowToastOptions, type ToastContent } from '../toastQueue';
import { ALERT_STATUSES, type AlertStatus } from '../../Alert/Alert.options';
import { Button } from '../../Button';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { motionSettled } from '../../../storybook/motion';

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
      // measure the resting place, after the toast has slid in (Rules 09 stack motion)
      await motionSettled();
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
      await motionSettled();
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

/** Rules 06 demo: buttons for each rule and a live count of the toasts on screen (the global queue, as in an app). */
function PolicyDemo() {
  const [visible, setVisible] = useState(() => toastQueue.visibleToasts.length);
  const counter = useRef(0);
  useEffect(() => toastQueue.subscribe(() => setVisible(toastQueue.visibleToasts.length)), []);
  return (
    <div style={{ display: 'grid', gap: 24, paddingBottom: 200 }}>
      <StorySection title="중복 — 같은 문구 · 종류는 겹치지 않고 다시 표시됩니다">
        <Button onClick={() => showToast('저장했습니다', { status: 'success' })}>같은 알림 보내기</Button>
      </StorySection>
      <StorySection title="개수 — 한 번에 3개까지, 4번째가 오면 가장 오래된 알림이 사라집니다">
        <Button onClick={() => showToast(`${++counter.current}번 알림`)}>새 알림 보내기</Button>
      </StorySection>
      <StorySection title="시간 — 모든 종류가 5초 뒤 닫히고, 닫을 때까지 남길 수도 있습니다">
        <Button onClick={() => showToast('저장하지 못했습니다', { status: 'error' })}>오류 알림(5초)</Button>
        <Button onClick={() => showToast('일부 항목만 저장했습니다', { status: 'warning' })}>주의 알림(5초)</Button>
        <Button variant="secondary" appearance="outline" onClick={() => showToast('업로드 중입니다', { timeout: null })}>
          닫을 때까지 남는 알림
        </Button>
      </StorySection>
      <p data-testid="visible-count" style={{ margin: 0 }}>
        지금 보이는 알림: {visible}개
      </p>
      <ToastRegion />
    </div>
  );
}

/**
 * Design System Rules 06 (2026-10-28): every toast closes after 5 s, at most 3 on screen — a 4th pushes the oldest out,
 * duplicates replace. The buttons let you try each rule; the play below checks them.
 */
export const Policy: Story = {
  name: '표시 규칙(개수 · 시간 · 중복)',
  render: () => <PolicyDemo />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const visible = () => toastQueue.visibleToasts;
    const clear = () => { for (let i = 0; i < 10 && toastQueue.visibleToasts.length; i++) toastQueue.visibleToasts.forEach((t) => closeToast(t.key)); };
    clear();
    await step('showing the same text again replaces the visible toast (no duplicate)', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '같은 알림 보내기' }));
      await userEvent.click(canvas.getByRole('button', { name: '같은 알림 보내기' }));
      await waitFor(() => expect(body.getAllByText('저장했습니다')).toHaveLength(1));
      await expect(visible()).toHaveLength(1);
      await expect(canvas.getByTestId('visible-count')).toHaveTextContent('1개');
    });
    await step('at most 3 toasts on screen; a 4th pushes the oldest out', async () => {
      clear();
      for (let i = 0; i < 3; i++) await userEvent.click(canvas.getByRole('button', { name: '새 알림 보내기' }));
      await waitFor(() => expect(visible()).toHaveLength(3));
      await expect(canvas.getByTestId('visible-count')).toHaveTextContent('3개');
      await userEvent.click(canvas.getByRole('button', { name: '새 알림 보내기' }));
      await waitFor(() => expect(body.queryByText('1번 알림')).not.toBeInTheDocument());
      await expect(visible().map((t) => t.content.message)).toEqual(['4번 알림', '3번 알림', '2번 알림']);
      await expect(body.getByText('4번 알림')).toBeVisible();
    });
    await step('every status closes after 5 s; timeout: null keeps a toast until closed', async () => {
      clear();
      await userEvent.click(canvas.getByRole('button', { name: '오류 알림(5초)' }));
      await userEvent.click(canvas.getByRole('button', { name: '주의 알림(5초)' }));
      await userEvent.click(canvas.getByRole('button', { name: '닫을 때까지 남는 알림' }));
      await waitFor(() => expect(visible().length).toBe(3));
      await expect(visible().find((t) => t.content.message === '저장하지 못했습니다')?.timeout).toBe(5000);
      await expect(visible().find((t) => t.content.message === '일부 항목만 저장했습니다')?.timeout).toBe(5000);
      await expect(visible().find((t) => t.content.message === '업로드 중입니다')?.timeout).toBeUndefined();
      // a timeout shorter than the rule is raised to 5 s
      await expect(showToast('짧게', { timeout: 1000 })).toBeTruthy();
      await expect(visible()[0].timeout).toBe(5000);
    });
    // The sticky toast and the buttons stay on screen so the rules can be tried by hand.
  },
};

const STACK_STATUSES: AlertStatus[] = ['information', 'success', 'warning', 'error'];
const STACK_LABEL: Record<AlertStatus, string> = { information: '안내', success: '성공', warning: '주의', error: '오류' };

/** Stacking demo: real `showToast` calls on the app's global queue (5 s, at most 3) and a live readout of the stack. */
function StackingDemo() {
  const counter = useRef(0);
  const [toasts, setToasts] = useState(() => toastQueue.visibleToasts);
  useEffect(() => toastQueue.subscribe(() => setToasts(toastQueue.visibleToasts)), []);
  const add = (status?: AlertStatus, options?: ShowToastOptions) => {
    const n = ++counter.current;
    const kind = status ?? STACK_STATUSES[(n - 1) % STACK_STATUSES.length];
    // every second toast has a description, so toasts of 40 and 54 px are mixed in the stack
    showToast(`${n}번 알림`, { status: kind, description: n % 2 === 0 ? `${STACK_LABEL[kind]} 알림입니다` : undefined, ...options });
  };
  // visibleToasts is newest first; on screen the oldest is at the top
  const order = [...toasts].reverse().map((t) => t.content.message);
  return (
    <div style={{ display: 'grid', gap: 8, paddingBottom: 220 }}>
      <StorySection title="추가 — 최신 알림은 아래에 붙고, 먼저 온 알림은 위로 올라갑니다(최대 3개)">
        <Button onClick={() => add()}>알림 1개 추가</Button>
        <Button
          onClick={() => {
            for (let i = 0; i < 3; i++) add();
          }}
        >
          3개 연속 추가
        </Button>
        <Button
          onClick={() => {
            for (let i = 0; i < 5; i++) add();
          }}
        >
          5개 빠르게 추가
        </Button>
      </StorySection>
      <StorySection title="종류 섞기 · 닫기">
        {STACK_STATUSES.map((status) => (
          <Button key={status} variant="secondary" appearance="outline" onClick={() => add(status)}>
            {STACK_LABEL[status]}
          </Button>
        ))}
        <Button variant="tertiary" appearance="outline" onClick={() => add('information', { timeout: null })}>
          닫을 때까지 남는 알림
        </Button>
        <Button variant="tertiary" appearance="outline" onClick={() => toastQueue.visibleToasts.forEach((t) => closeToast(t.key))}>
          모두 닫기
        </Button>
      </StorySection>
      <p data-testid="stack-order" style={{ margin: 0 }}>
        화면의 알림(위 → 아래): {order.length ? order.join(' · ') : '없음'}
      </p>
      <ToastRegion />
    </div>
  );
}

/**
 * Rules 06 · 09 stacking: the newest toast rises from below and pushes the others up; at most 3 stay — a 4th pushes the
 * oldest up and out. Closing one lets the rest close the gap; each toast closes on its own 5 s timer.
 */
export const Stacking: Story = {
  name: "Stacking",
  render: () => <StackingDemo />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const doc = canvasElement.ownerDocument;
    const win = doc.defaultView!;
    const live = () => [...doc.querySelectorAll<HTMLElement>('.ds-toast-region [data-toast-key]')].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const stack = () => live().map((el) => el.querySelector('.ds-toast__message')!.textContent);
    const exiting = () => doc.querySelectorAll('[data-toast-exit]').length;
    const add = () => userEvent.click(canvas.getByRole('button', { name: '알림 1개 추가' }));
    // the stack hangs from 20 px above the bottom edge, toasts 8 px apart, the newest at the bottom
    const restsInPlace = async () => {
      await motionSettled();
      const boxes = live().map((el) => el.getBoundingClientRect());
      for (let i = 1; i < boxes.length; i++) await expect(Math.round(boxes[i].top - boxes[i - 1].bottom)).toBe(8);
      if (boxes.length) {
        await expect(Math.round(win.innerHeight - boxes[boxes.length - 1].bottom)).toBe(20);
        await expect(Math.round(win.innerWidth - boxes[boxes.length - 1].right)).toBe(20);
      }
      await expect(exiting()).toBe(0);
    };
    toastQueue.visibleToasts.forEach((t) => closeToast(t.key));
    await motionSettled();

    await step('1 → 2 → 3 toasts: each new one is added at the bottom', async () => {
      await add();
      await restsInPlace();
      await expect(stack()).toEqual(['1번 알림']);
      await add();
      await add();
      await restsInPlace();
      await expect(stack()).toEqual(['1번 알림', '2번 알림', '3번 알림']);
      await expect(canvas.getByTestId('stack-order')).toHaveTextContent('1번 알림 · 2번 알림 · 3번 알림');
    });
    await step('a 4th toast pushes the oldest out: it leaves the queue and the DOM at once and only its exit copy rises away', async () => {
      await add();
      await expect(stack()).toEqual(['2번 알림', '3번 알림', '4번 알림']);
      await expect(toastQueue.visibleToasts).toHaveLength(3);
      const copy = doc.querySelector<HTMLElement>('[data-toast-exit]');
      await expect(copy).not.toBeNull();
      await expect(copy).toHaveAttribute('aria-hidden', 'true');
      await expect(copy!.hasAttribute('inert')).toBe(true);
      await expect(copy!.querySelector('[id]')).toBeNull();
      await restsInPlace();
      await expect(stack()).toEqual(['2번 알림', '3번 알림', '4번 알림']);
    });
    await step('rapid clicks: the latest 3 stay, in order, with no duplicates or leftovers', async () => {
      for (let i = 0; i < 5; i++) await add();
      await restsInPlace();
      await expect(stack()).toEqual(['7번 알림', '8번 알림', '9번 알림']);
      await expect(new Set(live().map((el) => el.dataset.toastKey)).size).toBe(3);
      await expect(doc.querySelectorAll('.ds-toast')).toHaveLength(3);
    });
    await step('closing one toast removes only it; the others keep their place in line and their timers', async () => {
      const timers = new Map(toastQueue.visibleToasts.map((t) => [t.key, t.timer]));
      const started = new Map([...timers].map(([key, timer]) => [key, (timer as unknown as { startTime: number }).startTime]));
      const middle = live()[1];
      await userEvent.click(within(middle).getByRole('button', { name: '알림 닫기' }));
      await restsInPlace();
      await expect(stack()).toEqual(['7번 알림', '9번 알림']);
      for (const t of toastQueue.visibleToasts) {
        await expect(t.timer).toBe(timers.get(t.key));
        await expect((t.timer as unknown as { startTime: number }).startTime).toBe(started.get(t.key));
      }
    });
    await step('mixed statuses stack the same way', async () => {
      for (const label of ['안내', '성공', '주의', '오류']) await userEvent.click(canvas.getByRole('button', { name: label }));
      await restsInPlace();
      await expect(live().map((el) => el.dataset.status)).toEqual(['success', 'warning', 'error']);
    });
    await step('each toast closes on its own 5 s timer (the deployed policy) and the stack empties', async () => {
      toastQueue.visibleToasts.forEach((t) => closeToast(t.key));
      await motionSettled();
      await add();
      await waitFor(() => expect(live()).toHaveLength(1));
      await waitFor(() => expect(live()).toHaveLength(0), { timeout: 7000, interval: 100 });
      await motionSettled();
      await expect(exiting()).toBe(0);
      await expect(doc.querySelector('.ds-toast-region')).toBeNull();
      await expect(canvas.getByTestId('stack-order')).toHaveTextContent('없음');
    });
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
