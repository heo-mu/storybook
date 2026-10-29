import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from 'react-aria-components';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator, DropdownMenuSub } from '../DropdownMenu';
import { Button } from '../../Button';
import { FolderSimpleDashedIcon } from '../../../icons';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

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

export const Overview: Story = {
  name: "Overview",
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
    await step('click opens the menu (design-system Button as trigger), Escape closes', async () => {
      await userEvent.click(trigger);
      await body.findByRole('menu');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{Escape}');
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
 * 2-depth menu (Rules 09 "dropdown-menu": dropdown-menu-sub is the 2nd depth): → · Enter open the sub menu beside its
 * item (4px from the parent panel, first item level with the trigger item), ← · Esc close it and return focus to the
 * item, choosing a sub item calls onAction and closes both menus. It opens and closes at once (no animation).
 */
export const Submenu: StoryObj<{ onAction: Mock<(key: unknown) => void> }> = {
  name: '하위 메뉴',
  args: { onAction: fn() },
  render: (args) => (
    <div style={{ paddingBottom: 240 }}>
      <DropdownMenu trigger={<Button>파일</Button>} aria-label="파일 작업">
        <DropdownMenuItem id="new">새 폴더</DropdownMenuItem>
        <DropdownMenuSub id="export" label="내보내기" onAction={args.onAction}>
          <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
          <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuItem id="delete" danger>
          삭제
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: '파일' });
    await step('→ opens the sub menu beside its item, focus on its first item', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(body.getByRole('menuitem', { name: '새 폴더' })).toHaveFocus());
      await userEvent.keyboard('{ArrowDown}');
      const item = body.getByRole('menuitem', { name: '내보내기' });
      await expect(item).toHaveAttribute('aria-haspopup', 'menu');
      await userEvent.keyboard('{ArrowRight}');
      const sub = await body.findByRole('menu', { name: '내보내기' });
      await waitFor(() => expect(within(sub).getByRole('menuitem', { name: 'PDF' })).toHaveFocus());
      await expect(item).toHaveAttribute('aria-expanded', 'true');
      // react-aria names the parent menu by its trigger
      const parent = body.getByRole('menu', { name: '파일' }).getBoundingClientRect();
      const box = sub.getBoundingClientRect();
      // react-aria places overlays on whole pixels, so after a content-width parent (fractional right edge) the gap is 4px ± 0.5
      await expect(Math.abs(box.left - parent.right - 4)).toBeLessThanOrEqual(0.5);
      await expect(Math.abs(within(sub).getByRole('menuitem', { name: 'PDF' }).getBoundingClientRect().top - item.getBoundingClientRect().top)).toBeLessThanOrEqual(0.5);
      await expect(box.width).toBeGreaterThanOrEqual(140);
    });
    await step('← closes it and returns focus to its item', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(() => expect(body.queryByRole('menu', { name: '내보내기' })).not.toBeInTheDocument());
      await expect(body.getByRole('menuitem', { name: '내보내기' })).toHaveFocus();
    });
    await step('choosing a sub item calls onAction and closes both menus', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await body.findByRole('menu', { name: '내보내기' });
      await userEvent.keyboard('{ArrowDown}{Enter}');
      await waitFor(() => expect(args.onAction).toHaveBeenCalled());
      await expect(args.onAction.mock.calls[0][0]).toBe('csv');
      await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  },
};
