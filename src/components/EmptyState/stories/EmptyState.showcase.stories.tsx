import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, type Mock } from 'storybook/test';
import { EmptyState } from '../EmptyState';
import { TextButton } from '../../Button';
import { CaretRightIcon, DatabaseIcon } from '../../../icons';

// Visual verification (not in the MCP manifest). The cell carries the data-figma name checked by
// `node scripts/verify-figma.mjs empty-state` (single component `empty-state`).
const meta = {
  title: '컴포넌트/EmptyState/전체 보기',
  id: 'components-emptystate-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const figmaAction = <TextButton rightIcon={<CaretRightIcon />}>수집 설정 확인</TextButton>;

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div style={{ display: 'grid', gap: 40, justifyItems: 'center' }}>
      <EmptyState icon={<DatabaseIcon />} title="아직 수집된 데이터가 없습니다" description="수집 설정과 데이터 연결을 확인하세요." action={figmaAction} />
      <EmptyState title="검색 결과가 없습니다" description="다른 검색어를 입력해 보세요." />
    </div>
  ),
};

/** Figma `empty-state` with its default content (Icon and Description on). */
export const Figma: Story = {
  name: '모든 변형',
  render: () => (
    <div data-figma="empty-state" style={{ display: 'flex', width: 'fit-content' }}>
      <EmptyState icon={<DatabaseIcon />} title="아직 수집된 데이터가 없습니다" description="수집 설정과 데이터 연결을 확인하세요." action={figmaAction} />
    </div>
  ),
};

/** The action is an ordinary button. */
export const Interaction: StoryObj<{ onAction: Mock<() => void> }> = {
  name: '동작',
  args: { onAction: fn() },
  render: (args) => (
    <EmptyState
      icon={<DatabaseIcon />}
      title="아직 수집된 데이터가 없습니다"
      action={
        <TextButton rightIcon={<CaretRightIcon />} onClick={args.onAction}>
          수집 설정 확인
        </TextButton>
      }
    />
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '수집 설정 확인' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};

/** Title and description are text; the icon is decorative. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => <EmptyState icon={<DatabaseIcon />} title="아직 수집된 데이터가 없습니다" description="수집 설정과 데이터 연결을 확인하세요." />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('아직 수집된 데이터가 없습니다')).toBeVisible();
    await expect(canvasElement.querySelector('.ds-empty-state__icon')).toHaveAttribute('aria-hidden', 'true');
  },
};
