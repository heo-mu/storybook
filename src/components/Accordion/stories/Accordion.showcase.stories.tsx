import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, type Mock } from 'storybook/test';
import { TextButton } from '../../Button';
import { motionSettled } from '../../../storybook/motion';
import { Accordion, AccordionItem } from '../Accordion';
import { ACCORDION_SIZES } from '../Accordion.options';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs accordion` (set accordion-item).
const meta = {
  title: "Components/Accordion/Gallery",
  id: 'components-accordion-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const BODY = '조건을 변경하면 다음 수집 주기부터 적용됩니다. 현재 화면의 조회 결과는 변경되지 않습니다.';

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div style={{ width: 360 }}>
      <Accordion defaultExpandedKeys={['advanced']}>
        <AccordionItem id="basic" title="기본 설정">
          수집 주기와 대상 설비를 고릅니다.
        </AccordionItem>
        <AccordionItem id="advanced" title="고급 설정" description="알림과 수집 조건을 설정합니다.">
          {BODY}
        </AccordionItem>
        <AccordionItem id="lab" title="실험 기능" disabled>
          준비 중입니다.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

const CELLS = [
  { state: 'Default', expanded: false },
  { state: 'Hover', expanded: false },
  { state: 'Disabled', expanded: false },
  { state: 'Default', expanded: true },
  { state: 'Hover', expanded: true },
] as const;

/** 지원하는 종류와 상태를 비교합니다. */
export const Matrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={CELLS.map((c) => `${c.state}${c.expanded ? ' · open' : ''}`)}
      rows={ACCORDION_SIZES.map((size) => ({
        label: size,
        cells: CELLS.map(({ state, expanded }) => ({
          figma: `Size=${size}, State=${state}, Expanded=${expanded ? 'True' : 'False'}`,
          node: (
            <Accordion size={size} defaultExpandedKeys={expanded ? ['item'] : []}>
              <AccordionItem id="item" title="고급 설정" disabled={state === 'Disabled'} className={state === 'Hover' ? PSEUDO.hoverAll : undefined}>
                {BODY}
              </AccordionItem>
            </Accordion>
          ),
        })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    for (const item of canvasElement.querySelectorAll<HTMLElement>('.ds-accordion__item')) {
      const trigger = item.querySelector<HTMLElement>('.ds-accordion__trigger')!;
      const disabled = item.hasAttribute('data-disabled');
      const small = item.dataset.size === 'sm';
      const divider = getComputedStyle(trigger, '::after');
      await expect(divider.opacity).toBe(disabled ? '0' : '1');
      await expect(divider.height).toBe('1px');
      // Figma Trigger corners: border-radius/accordion/default → rounded-none — square in every state, Disabled and Hover included (2026-11-02).
      await expect(getComputedStyle(trigger).borderRadius).toBe('0px');
      await expect(trigger.getBoundingClientRect().height).toBe(small ? 36 : 44);
      await expect(item.getBoundingClientRect().height).toBe((small ? 36 : 44) + (item.hasAttribute('data-expanded') ? 64 : 0));
      // Figma 2026-10-28: an expanded item ends with a second divider (border/default) under the body; collapsed items have none.
      const panel = item.querySelector<HTMLElement>('.ds-accordion__panel');
      const bottom = panel ? getComputedStyle(panel, '::after') : null;
      if (item.hasAttribute('data-expanded')) {
        await expect(bottom?.height).toBe('1px');
        await expect(bottom?.backgroundColor).toBe('rgb(214, 218, 224)');
        await expect(Math.round(panel!.getBoundingClientRect().bottom)).toBe(Math.round(item.getBoundingClientRect().bottom));
      } else {
        await expect(bottom?.content ?? 'none').toBe('none');
      }
    }
  },
};

/** Enter / Space toggle; one item open at a time unless `allowsMultipleExpanded`; disabled items are skipped. */
export const Interaction: StoryObj<{ onExpandedChange: Mock<(keys: Set<unknown>) => void> }> = {
  name: "Interaction",
  args: { onExpandedChange: fn() },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Accordion onExpandedChange={args.onExpandedChange}>
        <AccordionItem id="a" title="첫째">
          첫째 내용
        </AccordionItem>
        <AccordionItem id="b" title="둘째">
          둘째 내용
        </AccordionItem>
        <AccordionItem id="c" title="셋째" disabled>
          셋째 내용
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const first = canvas.getByRole('button', { name: '첫째' });
    const second = canvas.getByRole('button', { name: '둘째' });
    await step('Enter opens the first item', async () => {
      await userEvent.tab();
      await expect(first).toHaveFocus();
      await expect(getComputedStyle(first, '::before').borderRadius).toBe('4px');
      await userEvent.keyboard('{Enter}');
      await expect(first).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByText('첫째 내용')).toBeVisible();
    });
    await step('Space on the second item opens it and closes the first', async () => {
      await userEvent.tab();
      await expect(second).toHaveFocus();
      await userEvent.keyboard(' ');
      await expect(second).toHaveAttribute('aria-expanded', 'true');
      await expect(first).toHaveAttribute('aria-expanded', 'false');
      await expect(args.onExpandedChange).toHaveBeenLastCalledWith(new Set(['b']));
    });
    await step('the disabled item is not focusable', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('button', { name: '셋째' })).not.toHaveFocus();
    });
  },
};

/** Heading + button with aria-expanded / aria-controls; the panel is a region named by the button. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div style={{ width: 360 }}>
      <AccordionItem title="고급 설정" defaultExpanded>
        {BODY}
      </AccordionItem>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: '고급 설정' });
    await expect(canvas.getByRole('heading', { level: 3, name: '고급 설정' })).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(document.getElementById(trigger.getAttribute('aria-controls') ?? '')).toHaveTextContent(BODY);
  },
};

const LONG = [
  '수집 주기를 바꾸면 다음 주기부터 새 값으로 수집합니다. 이미 수집한 값은 그대로 남습니다.',
  '알림 조건은 설비마다 다르게 정할 수 있습니다. 같은 조건을 여러 설비에 적용하려면 설비 목록에서 함께 고릅니다.',
  '임계값을 넘은 상태가 정해진 시간 동안 이어질 때만 알림을 보냅니다. 짧은 순간의 변화로는 알림이 가지 않습니다.',
];

/** Every animation frame for `ms` after it starts: the height of the panel and the top of the next item, the caret angle. */
function recordFrames(item: Element, next: Element | null, ms: number) {
  return new Promise<Array<{ h: number; next: number; angle: number; hidden: boolean }>>((resolve) => {
    const frames: Array<{ h: number; next: number; angle: number; hidden: boolean }> = [];
    const start = performance.now();
    const panel = item.querySelector('.ds-accordion__panel')!;
    const icon = item.querySelector('.ds-accordion__icon')!;
    const tick = () => {
      const t = getComputedStyle(icon).transform;
      const m = new DOMMatrix(t === 'none' ? undefined : t);
      frames.push({ h: panel.getBoundingClientRect().height, next: next?.getBoundingClientRect().top ?? 0, angle: Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI + 360) % 360, hidden: panel.hasAttribute('hidden') });
      if (performance.now() - start < ms) requestAnimationFrame(tick);
      else resolve(frames);
    };
    requestAnimationFrame(tick);
  });
}

/**
 * 제목을 누르면 내용 영역이 실제 내용 높이만큼 펼쳐지고 접히며, 아래 항목이 함께 움직이고 화살표가 돌아갑니다.
 * 긴 내용 · 안에 든 아코디언 · 펼친 뒤 내용이 바뀌는 항목 · 비활성 항목, 그리고 서로 독립인 두 아코디언입니다.
 */
export const Motion: Story = {
  name: '펼침 · 접힘 움직임',
  render: function Render() {
    const [lines, setLines] = useState(1);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: 32, alignItems: 'start' }}>
        <Accordion allowsMultipleExpanded>
          <AccordionItem id="short" title="짧은 내용">
            수집 주기와 대상 설비를 고릅니다.
          </AccordionItem>
          <AccordionItem id="long" title="긴 내용" description="여러 줄로 된 설명">
            {LONG.map((p) => (
              <p key={p} style={{ margin: '0 0 8px' }}>
                {p}
              </p>
            ))}
          </AccordionItem>
          <AccordionItem id="nested" title="안에 든 아코디언">
            <Accordion size="sm">
              <AccordionItem id="inner-a" title="알림 대상">
                운영 담당자와 설비 관리자에게 보냅니다.
              </AccordionItem>
              <AccordionItem id="inner-b" title="알림 시간">
                평일 오전 9시부터 오후 6시까지 보냅니다.
              </AccordionItem>
            </Accordion>
          </AccordionItem>
          <AccordionItem id="grow" title="내용이 바뀌는 항목">
            {Array.from({ length: lines }, (_, i) => (
              <p key={i} style={{ margin: '0 0 8px' }}>
                {i + 1}번째 줄
              </p>
            ))}
            <TextButton onClick={() => setLines((n) => n + 1)}>줄 추가</TextButton>
          </AccordionItem>
          <AccordionItem id="off" title="비활성 항목" disabled>
            준비 중입니다.
          </AccordionItem>
        </Accordion>
        <Accordion>
          <AccordionItem id="x" title="다른 아코디언 — 첫째">
            이 아코디언은 왼쪽 아코디언과 따로 열고 닫힙니다.
          </AccordionItem>
          <AccordionItem id="y" title="다른 아코디언 — 둘째">
            한 번에 한 항목만 펼칩니다.
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const item = (title: string) => canvas.getByRole('button', { name: new RegExp(`^${title}`) }).closest('.ds-accordion__item')!;
    const panelOf = (title: string) => item(title).querySelector('.ds-accordion__panel')!;
    const contentOf = (title: string) => item(title).querySelector('.ds-accordion__body')!.getBoundingClientRect().height;
    await step('opening: the height grows from 0 to the content, the caret turns, the item below follows', async () => {
      const recording = recordFrames(item('긴 내용'), item('안에 든 아코디언'), 450);
      await userEvent.click(canvas.getByRole('button', { name: /^긴 내용/ }));
      const frames = await recording;
      const content = contentOf('긴 내용');
      const between = frames.filter((f) => f.h > 0.5 && f.h < content - 0.5);
      await expect(between.length).toBeGreaterThanOrEqual(3);
      await expect(frames.every((f, i) => !i || f.h >= frames[i - 1].h - 0.01)).toBe(true);
      await expect(frames.filter((f) => f.angle > 0 && f.angle < 180).length).toBeGreaterThanOrEqual(2);
      await expect(frames.every((f, i) => !i || f.next >= frames[i - 1].next - 0.01)).toBe(true);
      await expect(frames.at(-1)!.h).toBeCloseTo(content, 0);
      await expect(frames.at(-1)!.angle).toBe(180);
      await expect(canvas.getByRole('button', { name: /^긴 내용/ })).toHaveAttribute('aria-expanded', 'true');
    });
    await step('closing: the height shrinks to 0 and the panel is hidden only at the end', async () => {
      const recording = recordFrames(item('긴 내용'), item('안에 든 아코디언'), 450);
      await userEvent.click(canvas.getByRole('button', { name: /^긴 내용/ }));
      const frames = await recording;
      const between = frames.filter((f) => f.h > 0.5);
      await expect(between.length).toBeGreaterThanOrEqual(3);
      await expect(between.every((f) => !f.hidden)).toBe(true);
      await expect(frames.every((f, i) => !i || f.h <= frames[i - 1].h + 0.01)).toBe(true);
      await expect(frames.at(-1)).toMatchObject({ h: 0, hidden: true, angle: 0 });
    });
    await step('nested: opening an inner item grows the outer panel', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '안에 든 아코디언' }));
      await motionSettled();
      const outer = panelOf('안에 든 아코디언').getBoundingClientRect().height;
      await userEvent.click(canvas.getByRole('button', { name: '알림 대상' }));
      await motionSettled();
      await expect(panelOf('안에 든 아코디언').getBoundingClientRect().height).toBeGreaterThan(outer);
      await expect(panelOf('안에 든 아코디언').getBoundingClientRect().height).toBeCloseTo(contentOf('안에 든 아코디언'), 0);
    });
    await step('content that changes while open: the panel follows at once', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '내용이 바뀌는 항목' }));
      await motionSettled();
      const before = panelOf('내용이 바뀌는 항목').getBoundingClientRect().height;
      await userEvent.click(canvas.getByRole('button', { name: '줄 추가' }));
      await expect(panelOf('내용이 바뀌는 항목').getBoundingClientRect().height).toBeGreaterThan(before);
      await expect(panelOf('내용이 바뀌는 항목').getBoundingClientRect().height).toBeCloseTo(contentOf('내용이 바뀌는 항목'), 0);
    });
    await step('rapid clicks end in the state of the last click', async () => {
      const trigger = canvas.getByRole('button', { name: '짧은 내용' });
      for (let i = 0; i < 3; i++) await userEvent.click(trigger);
      await motionSettled();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(panelOf('짧은 내용').getBoundingClientRect().height).toBeCloseTo(contentOf('짧은 내용'), 0);
      await userEvent.click(trigger);
      await motionSettled();
      await expect(panelOf('짧은 내용')).toHaveAttribute('hidden');
    });
    await step('disabled: no motion, not opened, square corners', async () => {
      const off = canvas.getByRole('button', { name: '비활성 항목' });
      await userEvent.click(off);
      await expect(off).toHaveAttribute('aria-expanded', 'false');
      await expect(item('비활성 항목').getAnimations({ subtree: true })).toHaveLength(0);
      await expect(getComputedStyle(off).borderRadius).toBe('0px');
    });
    await step('the other accordion is independent', async () => {
      const left = canvas.getByRole('button', { name: '안에 든 아코디언' });
      await userEvent.click(canvas.getByRole('button', { name: '다른 아코디언 — 첫째' }));
      await motionSettled();
      await expect(left).toHaveAttribute('aria-expanded', 'true');
      await expect(canvasElement.querySelectorAll('.ds-accordion__item[data-expanded]').length).toBeGreaterThanOrEqual(3);
    });
  },
};
