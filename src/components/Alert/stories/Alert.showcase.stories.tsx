import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, type Mock } from 'storybook/test';
import { Alert } from '../Alert';
import { ALERT_STATUSES, type AlertStatus } from '../Alert.options';
import { Button } from '../../Button';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs alert` (set alert).
const meta = {
  title: '컴포넌트/Alert/전체 보기',
  id: 'components-alert-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const NAME: Record<AlertStatus, string> = { information: 'Information', success: 'Success', warning: 'Warning', error: 'Error' };
const figmaButton = (
  <Button variant="tertiary" appearance="outline" size="xs">
    버튼
  </Button>
);

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 360 }}>
      <Alert status="information" title="점검 예정" description="7월 30일 02:00 – 04:00에 서비스를 점검합니다." />
      <Alert status="success" title="저장했습니다" action={figmaButton} />
      <Alert
        status="error"
        title="연결이 끊겼습니다"
        description="네트워크를 확인한 뒤 다시 시도하세요."
        action={
          <Button variant="tertiary" appearance="outline" size="xs">
            재시도
          </Button>
        }
      />
    </div>
  ),
};

/** Figma `alert` (3): Status, with Icon · Sub · Button on (Figma defaults), 320px wide. */
export const Matrix: Story = {
  name: '모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={['alert']}
      rows={ALERT_STATUSES.map((status) => ({
        label: NAME[status],
        cells: [{ figma: `Status=${NAME[status]}`, node: <Alert status={status} title="알람 제목" description="서브 내용 최대 2줄" action={figmaButton} /> }],
      }))}
    />
  ),
};

/** The action is an ordinary button in the Tab order. */
export const Interaction: StoryObj<{ onRetry: Mock<() => void> }> = {
  name: '동작',
  args: { onRetry: fn() },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Alert
        status="error"
        title="업로드 실패"
        description="파일 크기를 확인하세요."
        action={
          <Button variant="tertiary" appearance="outline" size="xs" onClick={() => args.onRetry()}>
            재시도
          </Button>
        }
      />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: '재시도' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

/** Error → role="alert"; information / success → role="status". */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 360 }}>
      <Alert status="error" title="결제 실패" />
      <Alert status="success" title="결제 완료" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('결제 실패');
    await expect(canvas.getByRole('status')).toHaveTextContent('결제 완료');
  },
};
