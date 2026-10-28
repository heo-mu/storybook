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
          "작업 결과를 화면 아래 오른쪽에 잠깐 알립니다. 5초 뒤 자동으로 닫히고, \"닫기\"로 바로 닫을 수 있습니다.",
      },
    },
  },
  args: { children: '저장했습니다', description: '변경 내용이 서버에 저장되었습니다', status: 'success', showIcon: true, showClose: true, onClose: fn() },
  argTypes: {
    status: { control: 'inline-radio', options: ALERT_STATUSES, description: '종류 — 안내 · 성공 · 주의 · 오류', table: { defaultValue: { summary: 'information' } } },
    description: { control: 'text', description: '제목 아래 설명' },
    showIcon: { control: 'boolean', description: '종류 아이콘 표시 여부' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

/** `ToastRegion`을 두고 `showToast()`로 토스트를 띄웁니다. 모든 종류가 5초 뒤 닫히고, `timeout: null`이면 닫을 때까지 남습니다. */
export const WithRegion: Story = {
  name: '토스트 영역',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => showToast('새 버전이 있습니다', { description: '새로 고치면 적용됩니다' })}>안내</Button>
      <Button onClick={() => showToast('저장했습니다', { status: 'success' })}>성공</Button>
      <Button onClick={() => showToast('저장하지 못했습니다', { status: 'error', description: '네트워크 연결을 확인하세요' })}>오류</Button>
      <Button onClick={() => showToast('업로드 중입니다', { timeout: null })}>닫을 때까지 유지</Button>
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

/** 제목만 있는 토스트는 40px, 설명이 있으면 54px 높이입니다. */
export const TitleOnly: Story = {
  name: '제목만',
  args: { description: undefined, children: '저장했습니다' },
};

/** 주의 토스트. 다른 종류처럼 5초 뒤 닫힙니다. */
export const Warning: Story = {
  name: '주의',
  args: { status: 'warning', children: '일부 항목만 저장했습니다', description: '2개 항목은 다시 확인하세요' },
};
