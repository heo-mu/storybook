import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Toast, ToastRegion } from './Toast';
import { closeToast, showToast } from './toastQueue';
import { ALERT_STATUSES } from '../Alert/Alert.options';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Toast.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/Toast/Toast',
  id: 'components-toast-toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '잠시 나타났다 사라지는 토스트입니다. 앱에 `<ToastRegion />`을 한 번 두고 `showToast(메시지, { status })`로 띄우며, `Toast`는 같은 모양을 페이지 안에 고정으로 그릴 때 씁니다.',
      },
    },
  },
  args: { children: '저장했습니다', status: 'success', showClose: true, onClose: fn() },
  argTypes: { status: { control: 'inline-radio', options: ALERT_STATUSES, description: '종류 — 안내 · 성공 · 오류', table: { defaultValue: { summary: 'information' } } } },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

/** `ToastRegion`을 두고 `showToast()`로 토스트를 띄웁니다. 오류는 닫을 때까지 남습니다. */
export const WithRegion: Story = {
  name: '토스트 영역',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => showToast('새 버전이 있습니다')}>안내</Button>
      <Button onClick={() => showToast('저장했습니다', { status: 'success' })}>성공</Button>
      <Button onClick={() => showToast('저장하지 못했습니다', { status: 'error', timeout: null })}>오류 (닫을 때까지)</Button>
      <ToastRegion />
    </div>
  ),
};

function CloseFromCodeDemo() {
  const key = useRef<string | null>(null);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => (key.current = showToast('업로드 중입니다', { timeout: null }))}>업로드 시작</Button>
      <Button variant="tertiary" appearance="outline" onClick={() => key.current && closeToast(key.current)}>
        업로드 완료
      </Button>
      <ToastRegion />
    </div>
  );
}

/** `showToast()`가 돌려준 key를 `closeToast(key)`에 넘기면 코드에서 토스트를 닫습니다. 예: 업로드가 끝났을 때. */
export const CloseFromCode: Story = {
  name: '코드로 닫기',
  render: () => <CloseFromCodeDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '업로드 시작' }));
    await expect(await body.findByText('업로드 중입니다')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: '업로드 완료' }));
    await waitFor(() => expect(body.queryByText('업로드 중입니다')).toBeNull());
  },
};
