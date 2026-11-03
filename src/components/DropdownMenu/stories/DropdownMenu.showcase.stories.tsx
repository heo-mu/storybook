import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from 'react-aria-components';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator, DropdownMenuSub } from '../DropdownMenu';
import { Button } from '../../Button';
import { FolderSimpleDashedIcon } from '../../../icons';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { motionSettled } from '../../../storybook/motion';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

type MenuFrame = { opacity: number; scale: number; x: number; y: number; left: number; top: number; entering: boolean; exiting: boolean };

/**
 * The open menu (`main`) or sub menu (`sub`) on every frame for `ms`: the positioned popover's opacity and box, the scale and
 * move of the menu inside it, react-aria's motion state. Frames before it exists or after it is removed are left out.
 */
async function recordMenu(doc: Document, which: 'main' | 'sub', ms: number, act?: () => Promise<void>) {
  const frames: MenuFrame[] = [];
  let running = true;
  const tick = () => {
    const menu = [...doc.querySelectorAll<HTMLElement>('.ds-dropdown__popover > .ds-dropdown')].find((m) => m.classList.contains('ds-dropdown--sub') === (which === 'sub'));
    if (menu) {
      const popover = menu.parentElement!;
      const t = getComputedStyle(menu).transform;
      const m = new DOMMatrix(t === 'none' ? undefined : t);
      const box = popover.getBoundingClientRect();
      frames.push({
        opacity: Number(getComputedStyle(popover).opacity),
        scale: m.a,
        x: m.e,
        y: m.f,
        left: box.left,
        top: box.top,
        entering: popover.hasAttribute('data-entering'),
        exiting: popover.hasAttribute('data-exiting'),
      });
    }
    if (running) requestAnimationFrame(tick);
  };
  tick();
  await act?.();
  await new Promise((resolve) => setTimeout(resolve, ms));
  running = false;
  return frames;
}

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs dropdown-menu` (sets dropdownmenu_item, dropdownmenu_line, dropdown-menu, dropdown-menu-sub).
const meta = {
  title: "Components/DropdownMenu/Gallery",
  id: 'components-dropdownmenu-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Open by default: in the docs page this story renders in its own frame — an open menu is modal (react-aria underlay + scroll
// lock), which inline would cover the whole docs page until the first click.
export const Overview: Story = {
  name: "Overview",
  parameters: { docs: { story: { inline: false, height: '380px' } } },
  render: () => (
    <div style={{ paddingBottom: 320 }}>
      <DropdownMenu
        trigger={
          <Button variant="secondary" appearance="outline">
            메뉴 열기
          </Button>
        }
        aria-label="작업"
        open
      >
        <DropdownMenuSection title="파일">
          <DropdownMenuItem id="new" icon={<FolderSimpleDashedIcon />}>
            새 폴더
          </DropdownMenuItem>
          <DropdownMenuItem id="move" icon={<FolderSimpleDashedIcon />} chevron description="다른 위치로">
            이동
          </DropdownMenuItem>
          <DropdownMenuItem id="lock" icon={<FolderSimpleDashedIcon />} disabled>
            잠금
          </DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="delete" icon={<FolderSimpleDashedIcon />} danger>
          삭제
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
};

const ITEM_STATES = ['Default', 'Hover', 'Disabled', 'Alert'] as const;

/** 항목의 크기와 상태별 표현을 비교합니다. */
export const ItemMatrix: Story = {
  name: "Items",
  render: () => (
    <FigmaMatrix
      cellWidth={216}
      columns={['dropdownmenu_item']}
      rows={[
        ...ITEM_STATES.map((state) => ({
          label: `Content · ${state}`,
          cells: [
            {
              figma: `Type=Content, State=${state}`,
              node: (
                <Menu aria-label={state}>
                  <DropdownMenuItem
                    id="item"
                    icon={<FolderSimpleDashedIcon />}
                    chevron
                    disabled={state === 'Disabled'}
                    danger={state === 'Alert'}
                    className={state === 'Hover' ? PSEUDO.hover : undefined}
                  >
                    아이템
                  </DropdownMenuItem>
                </Menu>
              ),
            },
          ],
        })),
        {
          label: 'Title',
          cells: [
            {
              figma: 'Type=Title, State=None',
              // Figma Type=Title alone: a menu holding only a title is not a valid menu (role=menu needs items), so the
              // cell draws the same section-title markup as static text — the look DropdownMenuSection gives it in a menu.
              node: (
                <div className="ds-dropdown__section">
                  <div className="ds-dropdown__title">
                    <span className="ds-dropdown__title-text">제목</span>
                  </div>
                </div>
              ),
            },
          ],
        },
      ]}
    />
  ),
};

/** 메뉴 그룹을 구분하는 선입니다. */
export const LineMatrix: Story = {
  name: "Separator",
  render: () => (
    <FigmaMatrix
      cellWidth={224}
      columns={['dropdownmenu_line']}
      rows={[
        {
          label: 'line',
          cells: [
            {
              figma: 'dropdownmenu_line',
              node: (
                <Menu aria-label="line">
                  <DropdownMenuSeparator />
                </Menu>
              ),
            },
          ],
        },
      ]}
    />
  ),
};

/**
 * Figma `dropdown-menu` (1440:8454) · `dropdown-menu-sub` (1440:8455), the menu panel components added on 2026-10-27:
 * the same items, dividers and widths (200px / 140px), checked by `node scripts/verify-figma.mjs dropdown-menu`
 * (one story holds both sets, so the cells carry the `menu:` / `sub:` figmaPrefix).
 */
export const MenuMatrix: Story = {
  name: "Menu",
  render: () => (
    <FigmaMatrix
      columns={['dropdown-menu']}
      rows={[
        {
          label: 'dropdown-menu',
          cells: [
            {
              figma: 'menu:dropdown-menu',
              node: (
                <Menu aria-label="메뉴" className="ds-dropdown" style={{ width: 200 }}>
                  <DropdownMenuSection title="제목">
                    {['a1', 'a2', 'a3'].map((id) => (
                      <DropdownMenuItem key={id} id={id} icon={<FolderSimpleDashedIcon />}>
                        아이템
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSection>
                  <DropdownMenuSeparator />
                  {['b1', 'b2'].map((id) => (
                    <DropdownMenuItem key={id} id={id} icon={<FolderSimpleDashedIcon />}>
                      아이템
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem id="b3" icon={<FolderSimpleDashedIcon />} chevron>
                    아이템
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {['c1', 'c2', 'c3'].map((id) => (
                    <DropdownMenuItem key={id} id={id} icon={<FolderSimpleDashedIcon />} chevron>
                      아이템
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem id="d1" icon={<FolderSimpleDashedIcon />} chevron>
                    아이템
                  </DropdownMenuItem>
                </Menu>
              ),
            },
          ],
        },
        {
          label: 'dropdown-menu-sub',
          cells: [
            {
              figma: 'sub:dropdown-menu-sub',
              node: (
                <Menu aria-label="보조 메뉴" className="ds-dropdown" style={{ width: 140 }}>
                  {['s1', 's2', 's3'].map((id) => (
                    <DropdownMenuItem key={id} id={id}>
                      아이템
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem id="more">더보기...</DropdownMenuItem>
                </Menu>
              ),
            },
          ],
        },
      ]}
    />
  ),
};

/** Keyboard: Enter / ArrowDown opens, arrows move (disabled skipped), Enter activates, Escape closes. */
export const Interaction: StoryObj<{ onAction: Mock<(key: unknown) => void> }> = {
  name: "Interaction",
  args: { onAction: fn() },
  render: (args) => (
    <div style={{ paddingBottom: 240 }}>
      <DropdownMenu trigger={<Button>정렬</Button>} aria-label="정렬" onAction={args.onAction}>
        <DropdownMenuItem id="new">최신순</DropdownMenuItem>
        <DropdownMenuItem id="old" disabled>
          오래된순
        </DropdownMenuItem>
        <DropdownMenuItem id="name">이름순</DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: '정렬' });
    await step('click opens the menu with fade + scale from the trigger side (design-system Button as trigger), Escape closes it with fade + shrink', async () => {
      const doc = canvasElement.ownerDocument;
      const show = await recordMenu(doc, 'main', 260, () => userEvent.click(trigger));
      await body.findByRole('menu');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const visible = show.filter((f) => f.opacity > 0);
      // starts small, transparent and 4px towards the trigger above it; ends at rest; the positioned box never moves
      await expect(show[0].entering).toBe(true);
      await expect(visible[0].opacity).toBeLessThan(1);
      await expect(visible[0].scale).toBeLessThan(1);
      await expect(visible[0].scale).toBeGreaterThanOrEqual(0.9499);
      await expect(visible[0].y).toBeLessThan(0);
      await expect(show.at(-1)).toMatchObject({ opacity: 1, scale: 1, x: 0, y: 0, entering: false });
      await expect(visible.filter((f) => f.top !== show.at(-1)!.top || f.left !== show.at(-1)!.left)).toEqual([]);
      const hide = await recordMenu(doc, 'main', 260, () => userEvent.keyboard('{Escape}'));
      const fading = hide.filter((f) => f.exiting);
      await expect(fading.filter((f) => f.opacity < 1 && f.scale < 1 && f.scale >= 0.9499).length).toBeGreaterThanOrEqual(2);
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
    await step('ArrowDown opens on the first item, arrows skip the disabled item, Enter activates', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '최신순' })).toHaveFocus());
      await userEvent.keyboard('{ArrowDown}');
      await expect(body.getByRole('menuitem', { name: '이름순' })).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      // react-aria passes the item key first (a second, undefined argument follows).
      await waitFor(() => expect(args.onAction).toHaveBeenCalledTimes(1));
      await expect(args.onAction.mock.calls[0][0]).toBe('name');
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
    await step('ArrowUp opens on the last item, typing jumps to a matching item, an outside click closes', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '이름순' })).toHaveFocus());
      await userEvent.keyboard('최');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '최신순' })).toHaveFocus());
      await userEvent.click(canvasElement.ownerDocument.body);
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    });
  },
};

/** menu / menuitem roles, group label from the section title, separators. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <Menu aria-label="작업" className="ds-dropdown">
      <DropdownMenuSection title="편집">
        <DropdownMenuItem id="copy">복사</DropdownMenuItem>
      </DropdownMenuSection>
      <DropdownMenuSeparator />
      <DropdownMenuItem id="del" danger>
        삭제
      </DropdownMenuItem>
    </Menu>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('menu', { name: '작업' })).toBeInTheDocument();
    // Items appear after React Aria's collection pass (immediate in tests under act(), one render later in the browser).
    await expect(await canvas.findByRole('group', { name: '편집' })).toBeInTheDocument();
    await expect(canvas.getByRole('menuitem', { name: '삭제' })).toBeInTheDocument();
    await expect(canvas.getByRole('separator')).toBeInTheDocument();
  },
};

/**
 * 2-depth menu laid out like the Figma "dropdown-menu 사용 예시" (217:6478): a 200px menu (title, three items, two items and
 * the sub menu item, three and one chevron items) whose 6th item opens the 140px sub menu. The sub panel starts at the item's
 * right edge — over the parent panel's 4px padding, no gap — with its top level with the item (Figma: 196px right of and
 * 222px below the menu's top-left corner). → · Enter open it, ← · Esc close it and return focus to the item, another sub
 * item opens its own sub menu, choosing a sub item calls onAction and closes both. Both menus show and hide with the
 * dropdown motion (Rules 09 "dropdown-menu"); positions are checked at rest. The play ends with the sub menu open.
 */
export const Submenu: StoryObj<{ onAction: Mock<(key: unknown) => void> }> = {
  name: '하위 메뉴',
  args: { onAction: fn() },
  render: (args) => (
    <div style={{ paddingBottom: 460 }}>
      {/* DROP-04: the panel width comes from the layout — 200px like the Figma example */}
      <style>{'.ds-dropdown.figma-217-6478 { width: 200px; }'}</style>
      <DropdownMenu
        trigger={
          <Button variant="tertiary" appearance="outline" size="sm">
            파일
          </Button>
        }
        aria-label="파일 작업"
        className="figma-217-6478"
      >
        <DropdownMenuSection title="파일">
          <DropdownMenuItem id="new" icon={<FolderSimpleDashedIcon />}>
            새 폴더
          </DropdownMenuItem>
          <DropdownMenuItem id="copy" icon={<FolderSimpleDashedIcon />}>
            복제
          </DropdownMenuItem>
          <DropdownMenuItem id="rename" icon={<FolderSimpleDashedIcon />}>
            이름 바꾸기
          </DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="share" icon={<FolderSimpleDashedIcon />}>
          공유
        </DropdownMenuItem>
        <DropdownMenuItem id="link" icon={<FolderSimpleDashedIcon />}>
          링크 복사
        </DropdownMenuItem>
        <DropdownMenuSub id="export" label="내보내기" icon={<FolderSimpleDashedIcon />} onAction={args.onAction}>
          <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
          <DropdownMenuItem id="xlsx">Excel</DropdownMenuItem>
          <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem id="more">더보기...</DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuSub id="move" label="이동" icon={<FolderSimpleDashedIcon />}>
          <DropdownMenuItem id="docs">문서</DropdownMenuItem>
          <DropdownMenuItem id="photos">사진</DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuItem id="sort" icon={<FolderSimpleDashedIcon />} chevron>
          정렬
        </DropdownMenuItem>
        <DropdownMenuItem id="view" icon={<FolderSimpleDashedIcon />} chevron>
          보기
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="info" icon={<FolderSimpleDashedIcon />} chevron>
          정보
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = canvas.getByRole('button', { name: '파일' });
    const rect = (el: Element) => el.getBoundingClientRect();
    await step('the menu opens with the dropdown motion and rests as the Figma panel (200 × 422)', async () => {
      trigger.focus();
      const show = await recordMenu(doc, 'main', 260, () => userEvent.keyboard('{Enter}'));
      await waitFor(() => expect(body.getByRole('menuitem', { name: '새 폴더' })).toHaveFocus());
      await expect(show.filter((f) => f.opacity > 0 && f.opacity < 1 && f.scale < 1).length).toBeGreaterThanOrEqual(2);
      await motionSettled();
      const parent = rect(body.getByRole('menu', { name: '파일' }));
      await expect([parent.width, parent.height]).toEqual([200, 422]);
    });
    await step('→ opens the sub menu beside its item (Figma 217:6478: left = item right = menu right − 4, top = item top)', async () => {
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
      const item = body.getByRole('menuitem', { name: '내보내기' });
      await expect(item).toHaveFocus();
      await expect(item).toHaveAttribute('aria-haspopup', 'menu');
      const show = await recordMenu(doc, 'sub', 260, () => userEvent.keyboard('{ArrowRight}'));
      const sub = await body.findByRole('menu', { name: '내보내기' });
      await waitFor(() => expect(within(sub).getByRole('menuitem', { name: 'PDF' })).toHaveFocus());
      await expect(item).toHaveAttribute('aria-expanded', 'true');
      // motion: fades and grows from the item's side (4px towards it); the positioned box stays where it rests
      const visible = show.filter((f) => f.opacity > 0);
      await expect(visible[0].scale).toBeLessThan(1);
      await expect(visible[0].x).toBeLessThan(0);
      await expect(visible.filter((f) => f.left !== show.at(-1)!.left || f.top !== show.at(-1)!.top)).toEqual([]);
      await expect(getComputedStyle(sub).transformOrigin).toBe('0px 0px');
      await motionSettled();
      const parent = rect(body.getByRole('menu', { name: '파일' }));
      const box = rect(sub);
      const itemBox = rect(item);
      // Figma: sub 196px right of and 222px below the menu's top-left corner, 140 × 160, its first item 4px below its top.
      // react-aria puts the panel on a whole pixel by flooring the item's right edge — after a whole-pixel menu that is exact.
      await expect([box.left - parent.left, box.top - parent.top, box.width, box.height]).toEqual([196, 222, 140, 160]);
      await expect(box.left).toBe(Math.floor(itemBox.right));
      await expect(box.top).toBe(itemBox.top);
      await expect(rect(within(sub).getByRole('menuitem', { name: 'PDF' })).top).toBe(itemBox.top + 4);
    });
    await step('← closes it with the motion and returns focus to its item', async () => {
      const hide = await recordMenu(doc, 'sub', 260, () => userEvent.keyboard('{ArrowLeft}'));
      await expect(hide.filter((f) => f.exiting && f.opacity < 1).length).toBeGreaterThanOrEqual(2);
      await waitFor(() => expect(body.queryByRole('menu', { name: '내보내기' })).not.toBeInTheDocument());
      await expect(body.getByRole('menuitem', { name: '내보내기' })).toHaveFocus();
    });
    await step('another sub menu item opens its own sub menu level with it', async () => {
      await userEvent.keyboard('{ArrowDown}{ArrowRight}');
      const sub = await body.findByRole('menu', { name: '이동' });
      await motionSettled();
      const item = body.getByRole('menuitem', { name: '이동' });
      await expect(rect(sub).top).toBe(rect(item).top);
      await expect(rect(sub).left).toBe(Math.floor(rect(item).right));
      await userEvent.keyboard('{ArrowLeft}{ArrowUp}');
      await waitFor(() => expect(body.queryByRole('menu', { name: '이동' })).not.toBeInTheDocument());
    });
    await step('choosing a sub item calls onAction and closes both menus', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await body.findByRole('menu', { name: '내보내기' });
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      await waitFor(() => expect(args.onAction).toHaveBeenCalled());
      await expect(args.onAction.mock.calls[0][0]).toBe('csv');
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
    await step('left open on the Figma layout: the menu and the 내보내기 sub menu', async () => {
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '새 폴더' })).toHaveFocus());
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}');
      await body.findByRole('menu', { name: '내보내기' });
      await motionSettled();
    });
  },
};
/**
 * The 2-depth menu at the bottom-right corner of the screen: with no room on the right the sub menu opens on the left —
 * still edge to edge with its item, over the parent panel's 4px padding — and moves up to stay inside the screen
 * (react-aria flip · containerPadding 12px). Where there is room it keeps the Figma position (see "하위 메뉴").
 */
export const SubmenuEdge: StoryObj = {
  name: '하위 메뉴 — 화면 가장자리',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: 'calc(100vh - 32px)' }}>
      <DropdownMenu trigger={<Button>파일</Button>} aria-label="파일 작업">
        <DropdownMenuItem id="new">새 폴더</DropdownMenuItem>
        <DropdownMenuItem id="copy">복제</DropdownMenuItem>
        <DropdownMenuSub id="export" label="내보내기">
          <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
          <DropdownMenuItem id="xlsx">Excel</DropdownMenuItem>
          <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem id="more">더보기...</DropdownMenuItem>
        </DropdownMenuSub>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const doc = canvasElement.ownerDocument;
    const win = doc.defaultView!;
    const body = within(doc.body);
    canvas.getByRole('button', { name: '파일' }).focus();
    await userEvent.keyboard('{Enter}');
    const item = await body.findByRole('menuitem', { name: '내보내기' });
    await waitFor(() => expect(body.getByRole('menuitem', { name: '새 폴더' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
    const sub = await body.findByRole('menu', { name: '내보내기' });
    await waitFor(() => expect(within(sub).getByRole('menuitem', { name: 'PDF' })).toHaveFocus());
    // measured at rest, after the show motion; it grew from its right edge — the side facing the item it opened beside
    await motionSettled();
    await expect(sub.parentElement).toHaveAttribute('data-placement', 'left');
    await expect(parseFloat(getComputedStyle(sub).transformOrigin)).toBe(sub.offsetWidth);
    const parent = body.getByRole('menu', { name: '파일' }).getBoundingClientRect();
    const box = sub.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    // flipped: sub panel right = item left = parent left + 4 — react-aria floors the distance from the container's right
    // edge, so the panel ends on the whole pixel at or less than 1px past the item's left edge (ceil) — never a gap
    await expect(box.right).toBeCloseTo(Math.ceil(itemBox.left), 1);
    await expect(itemBox.left).toBeCloseTo(parent.left + 4, 1);
    // shifted into the screen: no part below or right of the viewport
    await expect(box.bottom).toBeLessThanOrEqual(win.innerHeight);
    await expect(box.right).toBeLessThanOrEqual(win.innerWidth);
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu', { name: '내보내기' })).not.toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
  },
};

