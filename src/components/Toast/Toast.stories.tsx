import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Toast, ToastRegion } from './Toast';
import { closeToast, showToast } from './toastQueue';
import { ALERT_STATUSES } from '../Alert/Alert.options';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Toast.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: "Components/Toast/Toast",
  id: 'components-toast-toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "작업 결과를 화면 아래에 알립니다. 안내·성공은 자동으로 닫히고, 주의·오류는 사용자가 닫을 때까지 유지됩니다.",
      },
    },
  },
  args: { children: '저장했습니다', status: 'success', showClose: true, onClose: fn() },
  argTypes: { status: { control: 'inline-radio', options: ALERT_STATUSES, description: '종류 — 안내 · 성공 · 주의 · 오류', table: { defaultValue: { summary: 'information' } } } },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

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

/** 주의 토스트는 오류처럼 사용자가 닫을 때까지 남습니다(`showToast`의 기본 시간 없음). */
export const Warning: Story = {
  name: '주의',
  args: { status: 'warning', children: '일부 항목만 저장했습니다' },
};
