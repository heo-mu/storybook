import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Tooltip } from '../Tooltip';
import { TOOLTIP_PLACEMENTS, type TooltipPlacement } from '../Tooltip.options';
import { Button, IconButton } from '../../Button';
import { NotePencilIcon, PlusIcon, XIcon } from '../../../icons';
import { motionSettled } from '../../../storybook/motion';

type TipFrame = { opacity: number; scale: number; entering: boolean; exiting: boolean; inDom: boolean };

/** Opacity, scale and motion state of a tooltip on every frame for `ms` — the show / hide motion itself. */
async function recordTip(tip: HTMLElement, ms: number) {
  const frames: TipFrame[] = [];
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      const cs = getComputedStyle(tip);
      frames.push({
        opacity: Number(cs.opacity),
        scale: cs.transform === 'none' ? 1 : new DOMMatrix(cs.transform).a,
        entering: tip.hasAttribute('data-entering'),
        exiting: tip.hasAttribute('data-exiting'),
        inDom: tip.isConnected,
      });
      if (performance.now() - start < ms) requestAnimationFrame(tick);
      else resolve();
    };
    tick();
  });
  return frames;
}

/** react-aria warms tooltips up for the whole page and cools down 0.5s after the last one closed: wait it out so the next tooltip is the first of a sequence. */
const coolDown = () => new Promise((resolve) => setTimeout(resolve, 600));

/** Where the motion scales from: the edge facing the trigger (actual placement), at the arrow. */
function motionOrigin(tip: HTMLElement) {
  const [x, y] = getComputedStyle(tip).transformOrigin.split(' ').map(parseFloat);
  const box = tip.getBoundingClientRect();
  const arrow = tip.querySelector('.ds-tooltip__arrow > svg')!.getBoundingClientRect();
  const side = tip.getAttribute('data-placement') as TooltipPlacement;
  const vertical = side === 'top' || side === 'bottom';
  const edge = { top: [null, tip.offsetHeight], bottom: [null, 0], left: [tip.offsetWidth, null], right: [0, null] }[side];
  const atArrow = vertical ? arrow.left + arrow.width / 2 - box.left : arrow.top + arrow.height / 2 - box.top;
  return { side, onEdge: vertical ? y === edge[1] : x === edge[0], atArrow: Math.abs((vertical ? x : y) - atArrow) < 0.6 };
}

/** Arrow tip to trigger distance on the side the tooltip opened (Rules 05: 2px). */
function arrowGap(tip: HTMLElement, trigger: HTMLElement) {
  const t = trigger.getBoundingClientRect();
  const a = tip.querySelector('.ds-tooltip__arrow > svg')!.getBoundingClientRect();
  const gap = { top: t.top - a.bottom, bottom: a.top - t.bottom, left: t.left - a.right, right: a.left - t.right }[tip.getAttribute('data-placement') as TooltipPlacement];
  return Math.round(gap * 100) / 100;
}

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
  // Rules 05 (2026-10-29): the arrow tip sits 2px from the trigger (arrow 8px + 2px = 10px offset) on every side —
  // measured at rest, after the show motion (tooltips open on mount here).
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    await waitFor(() => expect(body.querySelectorAll('[role=tooltip]')).toHaveLength(4));
    await motionSettled();
    for (const placement of TOOLTIP_PLACEMENTS) {
      const tip = body.querySelector<HTMLElement>(`[role=tooltip][data-figma="Placement=${cap(placement)}"]`)!;
      await expect(getComputedStyle(tip).transform).toBe('none');
      await expect(arrowGap(tip, within(canvasElement).getByRole('button', { name: placement }))).toBe(2);
    }
  },
};

const SIDES: [string, TooltipPlacement][] = [
  ['위쪽', 'top'],
  ['아래쪽', 'bottom'],
  ['오른쪽', 'right'],
  ['왼쪽', 'left'],
];

/**
 * 나타날 때는 화살표 쪽에서 커지며 서서히 나타나고(0.15초), 사라질 때는 줄어들며 흐려집니다(0.1초) — shadcn/ui Base Tooltip 참고.
 * Hover after the delay or keyboard focus at once; Escape hides it; the motion starts from the edge facing the trigger on every side.
 */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', justifyItems: 'center', rowGap: 96, padding: '64px 40px' }}>
      {SIDES.map(([name, placement]) => (
        <Tooltip key={placement} content={`${name}에 나타납니다`} placement={placement}>
          {/* Fixed width keeps the centred trigger on whole pixels (react-aria floors the tooltip position), as in Variants. */}
          <Button size="sm" style={{ width: 80 }}>
            {name}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    await coolDown();
    for (const [name, placement] of SIDES) {
      await step(`${placement}: focus shows it with fade + scale from the edge facing the trigger; Escape hides it the same way`, async () => {
        await userEvent.tab();
        const trigger = canvas.getByRole('button', { name });
        await expect(trigger).toHaveFocus();
        const tip = await body.findByRole('tooltip');
        await expect(tip).toHaveTextContent(`${name}에 나타납니다`);
        await expect(trigger).toHaveAttribute('aria-describedby', tip.id);
        const show = await recordTip(tip, 260);
        // starts small and transparent, grows and fades in without overshoot, ends exactly at rest
        await expect(show[0].entering).toBe(true);
        await expect(show[0].opacity).toBeLessThan(1);
        await expect(show[0].scale).toBeLessThan(1);
        await expect(show[0].scale).toBeGreaterThanOrEqual(0.9499);
        await expect(show.filter((f, i) => i && (f.opacity < show[i - 1].opacity - 1e-3 || f.scale < show[i - 1].scale - 1e-4 || f.scale > 1))).toEqual([]);
        await expect(show.at(-1)).toMatchObject({ opacity: 1, scale: 1, entering: false });
        await expect(motionOrigin(tip)).toEqual({ side: placement, onEdge: true, atArrow: true });
        await motionSettled();
        await expect(arrowGap(tip, trigger)).toBe(2);
        const hiding = recordTip(tip, 300);
        await userEvent.keyboard('{Escape}');
        const hide = await hiding;
        await expect(trigger).not.toHaveAttribute('aria-describedby');
        await expect(trigger).toHaveFocus();
        const fading = hide.filter((f) => f.exiting && f.inDom);
        await expect(fading.length).toBeGreaterThanOrEqual(2);
        await expect(fading.filter((f, i) => f.scale < 0.9499 || f.scale > 1 || (i && f.opacity > fading[i - 1].opacity + 1e-3))).toEqual([]);
        await expect(hide.at(-1)!.inDom).toBe(false);
        await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
        await coolDown();
      });
    }
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
    // the show motion follows the side it actually opened on: flipped to bottom it grows from its top edge, flipped to left from its right edge
    await motionSettled();
    await expect(motionOrigin(top)).toEqual({ side: 'bottom', onEdge: true, atArrow: true });
    await expect(motionOrigin(right)).toEqual({ side: 'left', onEdge: true, atArrow: true });
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
  // exactly one tooltip (the previous one closes), and leaving the last button closes it. Only the first tooltip of the
  // walk animates in; while tooltips are warmed up the next one replaces the previous at once (no fade, never two).
  play: async ({ canvas, canvasElement, userEvent }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await coolDown();
    let most = 0;
    const count = new MutationObserver(() => {
      most = Math.max(most, doc.querySelectorAll('[role=tooltip]').length);
    });
    count.observe(doc.body, { childList: true, subtree: true });
    for (const [i, name] of ['추가', '수정', '삭제'].entries()) {
      await userEvent.tab();
      await expect(canvas.getByRole('button', { name })).toHaveFocus();
      await waitFor(() => expect(body.getAllByRole('tooltip')).toHaveLength(1));
      const tip = body.getByRole('tooltip');
      await expect(tip).toHaveTextContent(name);
      const [first] = await recordTip(tip, 0);
      if (i === 0) await expect({ entering: first.entering, fadingIn: first.opacity < 1 }).toEqual({ entering: true, fadingIn: true });
      else await expect(first).toMatchObject({ entering: false, opacity: 1, scale: 1 });
      await motionSettled();
    }
    const tip = body.getByRole('tooltip');
    const hiding = recordTip(tip, 300);
    await userEvent.tab();
    const hide = await hiding;
    await expect(hide.filter((f) => f.exiting && f.inDom && f.opacity < 1).length).toBeGreaterThanOrEqual(2);
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    count.disconnect();
    await expect(most).toBe(1);
  },
};
