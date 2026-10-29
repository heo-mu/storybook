import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Tooltip } from '../Tooltip';
import { TOOLTIP_PLACEMENTS } from '../Tooltip.options';
import { Button, IconButton } from '../../Button';
import { NotePencilIcon, PlusIcon, XIcon } from '../../../icons';

// Visual verification (not in the MCP manifest). Open tooltips carry data-figma names checked by
// `node scripts/verify-figma.mjs tooltip` (set tooltip).
const meta = {
  title: "Components/Tooltip/Gallery",
  id: 'components-tooltip-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div style={{ padding: 64 }}>
      <Tooltip content="툴팁 내용" defaultOpen>
        <Button variant="secondary" appearance="outline">
          도움말
        </Button>
      </Tooltip>
    </div>
  ),
};

/** 지원하는 종류와 상태를 비교합니다. */
export const Matrix: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 24, padding: 80 }}>
      {TOOLTIP_PLACEMENTS.map((placement) => (
        <div key={placement} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <Tooltip content="툴팁 내용" placement={placement} open data-figma={`Placement=${cap(placement)}`}>
            {/* Fixed width keeps the centred trigger on whole pixels, so the 2px gap is measured without sub-pixel snapping (the parity harness uses the same 80px). */}
            <Button size="sm" style={{ width: 80 }}>
              {placement}
            </Button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
  // Rules 05 (2026-10-29): the arrow tip sits 2px from the trigger (arrow 8px + 2px = 10px offset) on every side.
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    await waitFor(() => expect(body.querySelectorAll('[role=tooltip]')).toHaveLength(4));
    for (const placement of TOOLTIP_PLACEMENTS) {
      const tip = body.querySelector<HTMLElement>(`[role=tooltip][data-figma="Placement=${cap(placement)}"]`)!;
      const trigger = within(canvasElement).getByRole('button', { name: placement }).getBoundingClientRect();
      const arrow = tip.querySelector('.ds-tooltip__arrow > svg')!.getBoundingClientRect();
      const gap = { top: trigger.top - arrow.bottom, bottom: arrow.top - trigger.bottom, left: trigger.left - arrow.right, right: arrow.left - trigger.right }[placement];
      await expect(Math.round(gap * 100) / 100).toBe(2);
    }
  },
};

/** Keyboard focus shows the tooltip immediately, Escape hides it; hover shows it after the delay. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ padding: 64 }}>
      <Tooltip content="변경 사항을 저장합니다" delay={0}>
        <Button>저장</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: '저장' });
    await step('Tab focuses the trigger and shows the tooltip', async () => {
      await userEvent.tab();
      await expect(trigger).toHaveFocus();
      const tip = await body.findByRole('tooltip');
      await expect(tip).toHaveTextContent('변경 사항을 저장합니다');
      await expect(trigger).toHaveAttribute('aria-describedby', tip.id);
    });
    await step('Escape hides it', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    });
  },
};

/** 화면 위쪽 가장자리: `placement="top"`이어도 공간이 없으면 아래쪽에 열립니다(화살표는 계속 트리거를 가리킴). */
export const Edge: Story = {
  name: '화면 가장자리',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 4px 120px' }}>
      <Tooltip content="변경 사항을 저장합니다" placement="top" open data-testid="edge-top">
        <Button size="sm">저장</Button>
      </Tooltip>
      <Tooltip content="변경 사항을 저장합니다" placement="right" open data-testid="edge-right">
        <Button size="sm">저장</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    await waitFor(() => expect(body.querySelectorAll('[role=tooltip]')).toHaveLength(2));
    const buttons = within(canvasElement).getAllByRole('button', { name: '저장' });
    const top = body.querySelector<HTMLElement>('[data-testid="edge-top"]')!;
    await expect(top).toHaveAttribute('data-placement', 'bottom');
    await expect(top.getBoundingClientRect().top).toBeGreaterThan(buttons[0].getBoundingClientRect().bottom);
    const right = body.querySelector<HTMLElement>('[data-testid="edge-right"]')!;
    await expect(right).toHaveAttribute('data-placement', 'left');
    await expect(right.getBoundingClientRect().right).toBeLessThan(buttons[1].getBoundingClientRect().left);
    for (const tip of [top, right]) {
      const r = tip.getBoundingClientRect();
      await expect(r.left).toBeGreaterThanOrEqual(0);
      await expect(r.right).toBeLessThanOrEqual(window.innerWidth);
    }
  },
};

/** 툴팁이 여러 개인 화면: 포커스(또는 포인터)가 머무는 하나만 보입니다. 빠른 포인터 이동은 `verify:interaction`이 실제 마우스로 검사합니다. */
export const Multiple: Story = {
  name: '여러 툴팁',
  render: () => (
    <div style={{ display: 'flex', gap: 8, padding: 64 }}>
      <Tooltip content="추가" delay={0} closeDelay={0}>
        <IconButton variant="tertiary" appearance="outline" size="sm" icon={<PlusIcon />} aria-label="추가" />
      </Tooltip>
      <Tooltip content="수정" delay={0} closeDelay={0}>
        <IconButton variant="tertiary" appearance="outline" size="sm" icon={<NotePencilIcon />} aria-label="수정" />
      </Tooltip>
      <Tooltip content="삭제" delay={0} closeDelay={0}>
        <IconButton variant="tertiary" appearance="outline" size="sm" icon={<XIcon />} aria-label="삭제" />
      </Tooltip>
    </div>
  ),
  // react-aria only reacts to real pointer events, so the play walks the buttons with the keyboard: each focus shows
  // exactly one tooltip (the previous one closes), and leaving the last button closes it.
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    for (const name of ['추가', '수정', '삭제']) {
      await userEvent.tab();
      await expect(canvas.getByRole('button', { name })).toHaveFocus();
      await waitFor(() => expect(body.getAllByRole('tooltip')).toHaveLength(1));
      await expect(body.getByRole('tooltip')).toHaveTextContent(name);
    }
    await userEvent.tab();
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};
