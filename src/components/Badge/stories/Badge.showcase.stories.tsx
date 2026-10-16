import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge, BadgeCount, BadgeDot } from '../Badge';
import { BADGE_SHAPES, BADGE_SIZES, BADGE_STATUSES, type BadgeStatus } from '../Badge.options';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs badge` (sets badge_status, badge_dot, badge_count).
const meta = {
  title: 'Components/Badge/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const NAME: Record<BadgeStatus, string> = { basic: 'Basic', gray: 'Gray', point: 'Point', success: 'Success', warning: 'Warning', danger: 'Danger', information: 'Information' };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {BADGE_STATUSES.map((s) => (
          <Badge key={s} status={s}>
            {NAME[s]}
          </Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {BADGE_STATUSES.map((s) => (
          <Badge key={s} status={s} appearance="outline" shape="rounded" size="md">
            {NAME[s]}
          </Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <BadgeDot status="point" aria-label="새 알림" />
        <BadgeCount count={3} status="point" aria-label="알림 3개" />
        <BadgeCount count={120} status="danger" aria-label="오류 120개" />
      </div>
    </div>
  ),
};

/** Figma `badge_status` (84): Status × Appearance × Size × Shape. */
export const StatusMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={BADGE_STATUSES.map((s) => NAME[s])}
      rows={BADGE_SHAPES.flatMap((shape) =>
        (['filled', 'outline'] as const).flatMap((appearance) =>
          BADGE_SIZES.map((size) => ({
            label: `${shape} · ${appearance} · ${size}`,
            cells: BADGE_STATUSES.map((status) => ({
              figma: `Status=${NAME[status]}, Appearance=${cap(appearance)}, Size=${size}, Shape=${cap(shape)}`,
              node: (
                <Badge status={status} appearance={appearance} size={size} shape={shape}>
                  라벨명
                </Badge>
              ),
            })),
          })),
        ),
      )}
    />
  ),
};

/** Figma `badge_dot` (21): Status × Size. */
export const DotMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={BADGE_STATUSES.map((s) => NAME[s])}
      rows={BADGE_SIZES.map((size) => ({
        label: size,
        cells: BADGE_STATUSES.map((status) => ({ figma: `Status=${NAME[status]}, Size=${size}`, node: <BadgeDot status={status} size={size} /> })),
      }))}
    />
  ),
};

/** Figma `badge_count` (14): Status × Digits (Single "1", Multiple "99+"). */
export const CountMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={BADGE_STATUSES.map((s) => NAME[s])}
      rows={(['Single', 'Multiple'] as const).map((digits) => ({
        label: digits,
        cells: BADGE_STATUSES.map((status) => ({
          figma: `Status=${NAME[status]}, Digits=${digits}`,
          node: <BadgeCount status={status} count={digits === 'Single' ? 1 : 100} />,
        })),
      }))}
    />
  ),
};

/** Text is the accessible content; dots are decorative unless named; counts above `max` show "max+". */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge status="success">완료</Badge>
      <BadgeDot status="point" />
      <BadgeDot status="point" aria-label="새 항목" />
      <BadgeCount count={1000} max={999} aria-label="알림 1000개" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('완료')).toBeVisible();
    await expect(canvas.getByRole('img', { name: '새 항목' })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('.ds-badge-dot[aria-hidden="true"]')).toHaveLength(1);
    await expect(canvas.getByText('999+')).toBeVisible();
  },
};
