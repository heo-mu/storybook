import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { Breadcrumb, BreadcrumbItem, type BreadcrumbEntry } from '../Breadcrumb';
import { BREADCRUMB_SIZES, type BreadcrumbSize } from '../Breadcrumb.options';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs breadcrumb` (sets breadcrumb-item, breadcrumb).
const meta = {
  title: '컴포넌트/Breadcrumb/전체 보기',
  id: 'components-breadcrumb-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The Figma example trail: two ancestors, the parent and the current page. */
const ITEMS: BreadcrumbEntry[] = [
  { label: '에너지 관리', href: '#energy' },
  { label: '에너지 절약', href: '#saving' },
  { label: '프로그램 목록', href: '#programs' },
];
const CURRENT = '프로그램 등록';

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Breadcrumb items={ITEMS} current={CURRENT} aria-label="이동 경로 — Full" />
      <Breadcrumb items={ITEMS} current={CURRENT} layout="collapsed" aria-label="이동 경로 — Collapsed" />
      <Breadcrumb items={ITEMS} current={CURRENT} size="sm" aria-label="이동 경로 — sm" />
    </div>
  ),
};

const ITEM_CELLS = [
  { role: 'Link', state: 'Default' },
  { role: 'Link', state: 'Hover' },
  { role: 'Link', state: 'Pressed' },
  { role: 'Current', state: 'Default' },
  { role: 'Open', state: 'Hover' },
  { role: 'Open', state: 'Pressed' },
] as const;

/** Figma `breadcrumb-item` (12): Role Link / Current / Open × State × Size ("Show Icon" off as in the set). */
export const ItemMatrix: Story = {
  name: '항목 모든 변형',
  render: () => (
    <FigmaMatrix
      columns={ITEM_CELLS.map((c) => `${c.role} · ${c.state}`)}
      rows={BREADCRUMB_SIZES.map((size) => ({
        label: size,
        cells: ITEM_CELLS.map(({ role, state }) => {
          const pseudo = state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined;
          return {
            figma: `Role=${role}, Size=${size}, State=${state}`,
            node: (
              <BreadcrumbItem size={size} current={role === 'Current'} open={role === 'Open'} href={role === 'Link' ? '#' : undefined} className={pseudo}>
                에너지 관리
              </BreadcrumbItem>
            ),
          };
        }),
      }))}
    />
  ),
};

/** Figma `breadcrumb` Layout Full / Collapsed (Expanded False). Expanded True: `BreadcrumbExpanded`. */
export const BreadcrumbMatrix: Story = {
  name: '경로 모든 변형',
  render: () => (
    <FigmaMatrix
      columns={['Full', 'Collapsed']}
      rows={BREADCRUMB_SIZES.map((size) => ({
        label: size,
        cells: (['full', 'collapsed'] as const).map((layout) => ({
          figma: `Size=${size}, Layout=${layout === 'full' ? 'Full' : 'Collapsed'}, Expanded=False`,
          node: <Breadcrumb items={ITEMS} current={CURRENT} size={size} layout={layout} aria-label={`이동 경로 — ${size} ${layout}`} />,
        })),
      }))}
    />
  ),
};

/**
 * Figma `breadcrumb` Layout Collapsed, Expanded True (one size per story so the open menus do not overlap).
 * The menu panel is 200 × 110 like the Figma `dropdownmenu` frame.
 */
export const BreadcrumbExpanded: StoryObj<{ size: BreadcrumbSize }> = {
  name: '경로 펼침',
  args: { size: 'md' },
  render: ({ size }) => (
    <div style={{ paddingBottom: 160 }}>
      <FigmaMatrix
        columns={['Collapsed · Expanded']}
        rows={[
          {
            label: size,
            cells: [
              {
                figma: `Size=${size}, Layout=Collapsed, Expanded=True`,
                node: <Breadcrumb items={ITEMS} current={CURRENT} size={size} layout="collapsed" expanded />,
              },
            ],
          },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const menu = await body.findByRole('menu', { name: '중간 경로 보기' });
    await expect(within(menu).getByRole('group', { name: '상위 경로' })).toBeInTheDocument();
    const box = menu.getBoundingClientRect();
    await expect([box.width, box.height]).toEqual([200, 110]);
    await expect(within(menu).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['에너지 관리', '에너지 절약']);
  },
};

/** Overflow menu: click / Enter opens, arrows move, Enter chooses, Escape closes and focus returns to the trigger. */
export const Interaction: StoryObj<{ onAction: Mock<(id: unknown) => void> }> = {
  name: '동작',
  args: { onAction: fn() },
  render: (args) => (
    <div style={{ paddingBottom: 160 }}>
      <Breadcrumb
        layout="collapsed"
        items={[{ id: 'energy', label: '에너지 관리' }, { id: 'saving', label: '에너지 절약' }, { id: 'programs', label: '프로그램 목록' }]}
        current={CURRENT}
        onAction={args.onAction}
      />
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const more = canvas.getByRole('button', { name: '중간 경로 보기' });
    await step('click opens the ancestor menu, Escape closes', async () => {
      await userEvent.click(more);
      await body.findByRole('menu', { name: '중간 경로 보기' });
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(more).toHaveFocus());
    });
    await step('Enter opens on the first ancestor, ArrowDown + Enter chooses the second', async () => {
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '에너지 관리' })).toHaveFocus());
      await userEvent.keyboard('{ArrowDown}{Enter}');
      await waitFor(() => expect(args.onAction).toHaveBeenCalledTimes(1));
      await expect(args.onAction.mock.calls[0][0]).toBe('saving');
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    });
    await step('a trail entry without href is a button that calls onAction', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '프로그램 목록' }));
      await expect(args.onAction.mock.calls[1][0]).toBe('programs');
    });
  },
};

/** nav landmark, ordered list, current page, home and overflow names. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => <Breadcrumb items={ITEMS} current={CURRENT} layout="collapsed" />,
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: '이동 경로' });
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('button', { name: '중간 경로 보기' })).toHaveAttribute('aria-haspopup', 'true');
    await expect(canvas.getByText(CURRENT).parentElement).toHaveAttribute('aria-current', 'page');
  },
};
