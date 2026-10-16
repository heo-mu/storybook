import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, type Mock } from 'storybook/test';
import { Accordion, AccordionItem } from '../Accordion';
import { ACCORDION_SIZES } from '../Accordion.options';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs accordion` (set accordion-item).
const meta = {
  title: 'Components/Accordion/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const BODY = '조건을 변경하면 다음 수집 주기부터 적용됩니다. 현재 화면의 조회 결과는 변경되지 않습니다.';

export const Overview: Story = {
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

/** Figma `accordion-item` (10): Size × State × Expanded, 320px wide. */
export const Matrix: Story = {
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
};

/** Enter / Space toggle; one item open at a time unless `allowsMultipleExpanded`; disabled items are skipped. */
export const Interaction: StoryObj<{ onExpandedChange: Mock<(keys: Set<unknown>) => void> }> = {
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
