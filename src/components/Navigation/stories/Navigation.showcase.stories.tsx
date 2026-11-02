import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, type Mock } from 'storybook/test';
import { NavChild, NavGroup, NavLink, NavParentItem, Navigation } from '../Navigation';
import { ListIcon } from '../../../icons';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { motionSettled } from '../../../storybook/motion';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

type GroupFrame = { height: number; below: number; angle: number; visibility: string; inert: boolean };

/** Height of a group's list, top of the entry below it, caret angle and visibility on every frame while `act` runs. */
async function recordGroup(button: HTMLElement, act: () => Promise<void>, ms = 450) {
  const group = button.closest<HTMLElement>('.ds-nav__group')!;
  const panel = group.querySelector<HTMLElement>('.ds-nav__panel')!;
  const caret = group.querySelector<SVGElement>('.ds-nav-item__caret')!;
  const below = group.closest('.ds-nav__entry')!.nextElementSibling!.firstElementChild!;
  const frames: GroupFrame[] = [];
  let running = true;
  const tick = () => {
    const t = getComputedStyle(caret).transform;
    const m = new DOMMatrix(t === 'none' ? undefined : t);
    frames.push({
      height: panel.getBoundingClientRect().height,
      below: below.getBoundingClientRect().top,
      angle: Math.round(((Math.atan2(m.b, m.a) * 180) / Math.PI + 360) % 360),
      visibility: getComputedStyle(panel).visibility,
      inert: panel.inert,
    });
    if (running) requestAnimationFrame(tick);
  };
  tick();
  await act();
  await new Promise((resolve) => setTimeout(resolve, ms));
  running = false;
  return { frames, full: group.querySelector<HTMLElement>('.ds-nav__panel-content')!.scrollHeight };
}

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs navigation` (sets item_parent, item_link, item_child).
const meta = {
  title: "Components/Navigation/Gallery",
  id: 'components-navigation-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** 주요 종류와 크기, 구성 방식을 한눈에 비교합니다. */
export const Overview: Story = {
  name: "Overview",
  render: () => (
    <Navigation aria-label="주 메뉴" style={{ width: 240 }}>
      <NavGroup label="1뎁스명" icon={<ListIcon />}>
        <NavChild href="#a">2뎁스명</NavChild>
      </NavGroup>
      <NavGroup label="1뎁스명" icon={<ListIcon />} defaultExpanded>
        <NavChild href="#b">2뎁스명</NavChild>
        <NavChild href="#c">2뎁스명</NavChild>
        <NavChild href="#d" selected>
          2뎁스명
        </NavChild>
      </NavGroup>
      <NavLink href="#e" icon={<ListIcon />}>
        1뎁스명
      </NavLink>
      <NavLink href="#f" icon={<ListIcon />} selected>
        1뎁스명
      </NavLink>
    </Navigation>
  ),
};

const STATES = ['Default', 'Hover'] as const;
const pseudo = (state: (typeof STATES)[number]) => (state === 'Hover' ? PSEUDO.hover : undefined);

/** 펼칠 수 있는 메뉴 그룹의 상태를 비교합니다. */
export const ParentMatrix: Story = {
  name: "Menu Groups",
  render: () => (
    <FigmaMatrix
      cellWidth={200}
      columns={STATES.map((s) => s)}
      rows={[false, true].map((expanded) => ({
        label: expanded ? 'Expanded' : 'Collapsed',
        cells: STATES.map((state) => ({
          figma: `State=${state}, Expanded=${expanded ? 'True' : 'False'}`,
          node: (
            <NavParentItem icon={<ListIcon />} expanded={expanded} className={pseudo(state)}>
              1뎁스명
            </NavParentItem>
          ),
        })),
      }))}
    />
  ),
};

/** 페이지로 바로 이동하는 메뉴 링크의 상태를 비교합니다. */
export const LinkMatrix: Story = {
  name: "Links",
  render: () => (
    <FigmaMatrix
      cellWidth={200}
      columns={STATES.map((s) => s)}
      rows={(['Unselected', 'Selected'] as const).map((variant) => ({
        label: variant,
        cells: STATES.map((state) => ({
          figma: `State=${state}, Variant=${variant}`,
          node: (
            <NavLink href="#" icon={<ListIcon />} selected={variant === 'Selected'} className={pseudo(state)}>
              1뎁스명
            </NavLink>
          ),
        })),
      }))}
    />
  ),
};

/** 하위 메뉴의 기본·선택 상태를 비교합니다. */
export const ChildMatrix: Story = {
  name: "Submenu",
  render: () => (
    <FigmaMatrix
      cellWidth={200}
      columns={STATES.map((s) => s)}
      rows={(['Unselected', 'Selected'] as const).map((variant) => ({
        label: variant,
        cells: STATES.map((state) => ({
          figma: `State=${state}, Variant=${variant}`,
          node: (
            <NavChild href="#" selected={variant === 'Selected'} className={pseudo(state)}>
              2뎁스명
            </NavChild>
          ),
        })),
      }))}
    />
  ),
};

/**
 * 그룹을 누르면 하위 메뉴가 실제 높이만큼 아래로 펼쳐지고 아래 메뉴가 함께 내려가며, 다시 누르면 위로 접힙니다(화살표도 함께 돎).
 * The group button toggles its list (Enter / Space / click); a closed list is skipped by Tab; groups open independently.
 */
export const Interaction: StoryObj<{ onExpandedChange: Mock<(expanded: boolean) => void> }> = {
  name: "Interaction",
  args: { onExpandedChange: fn() },
  render: (args) => (
    <Navigation aria-label="주 메뉴" style={{ width: 240 }}>
      <NavGroup label="설정" icon={<ListIcon />} onExpandedChange={args.onExpandedChange}>
        <NavChild href="#profile">프로필</NavChild>
        <NavChild href="#alerts">알림</NavChild>
      </NavGroup>
      <NavGroup label="에너지 관리" icon={<ListIcon />}>
        <NavChild href="#usage">사용량</NavChild>
        <NavChild href="#saving" selected>
          에너지 절약
        </NavChild>
        <NavChild href="#report">월별 에너지 사용량 비교 리포트</NavChild>
      </NavGroup>
      <NavLink href="#home" icon={<ListIcon />}>
        대시보드
      </NavLink>
    </Navigation>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const group = canvas.getByRole('button', { name: '설정' });
    const energy = canvas.getByRole('button', { name: '에너지 관리' });
    const panelOf = (button: HTMLElement) => button.closest('.ds-nav__group')!.querySelector<HTMLElement>('.ds-nav__panel')!;
    await step('collapsed: children are hidden and take no space', async () => {
      await expect(group).toHaveAttribute('aria-expanded', 'false');
      await expect(canvas.queryByRole('link', { name: '프로필' })).not.toBeInTheDocument();
      await expect(panelOf(group).getBoundingClientRect().height).toBe(0);
      // Figma LNB: entries 6px apart — the next group button starts 44 + 6 below this one
      await expect(energy.getBoundingClientRect().top - group.getBoundingClientRect().top).toBe(50);
    });
    await step('Enter expands: the list grows to its height, the entries below move down with it, the caret turns', async () => {
      group.focus();
      const { frames, full } = await recordGroup(group, () => userEvent.keyboard('{Enter}'));
      await expect(group).toHaveAttribute('aria-expanded', 'true');
      await expect(group).toHaveFocus();
      await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true);
      await expect(frames.filter((f) => f.height > 0.5 && f.height < full - 0.5).length).toBeGreaterThanOrEqual(3);
      await expect(frames.filter((f, i) => i && f.height < frames[i - 1].height - 0.01)).toEqual([]);
      await expect(frames.filter((f) => Math.abs(f.below - frames[0].below - f.height) > 0.6)).toEqual([]);
      await expect(frames.filter((f) => f.angle > 0 && f.angle < 180).length).toBeGreaterThanOrEqual(2);
      await motionSettled();
      await expect(panelOf(group).getBoundingClientRect().height).toBe(full);
      await expect(canvas.getByRole('link', { name: '프로필' })).toBeVisible();
    });
    await step('Tab moves into the children, skips the closed list of the next group, then reaches the link', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '프로필' })).toHaveFocus();
      await userEvent.tab();
      await userEvent.tab();
      await expect(energy).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '대시보드' })).toHaveFocus();
    });
    await step('Space on the group collapses it: the list shrinks to 0, inert at once, hidden only at the end', async () => {
      group.focus();
      const { frames } = await recordGroup(group, () => userEvent.keyboard(' '));
      await waitFor(() => expect(group).toHaveAttribute('aria-expanded', 'false'));
      const closing = frames.filter((f) => f.inert);
      await expect(closing.filter((f) => f.height > 0.5).length).toBeGreaterThanOrEqual(3);
      await expect(closing.filter((f) => f.height > 0.5 && f.visibility !== 'visible')).toEqual([]);
      await expect(frames.at(-1)).toMatchObject({ height: 0, visibility: 'hidden', angle: 0, inert: true });
      await expect(energy.getBoundingClientRect().top - group.getBoundingClientRect().top).toBe(50);
    });
    await step('rapid clicks and a reversal mid-way end on the last state, at the real content height (long names wrap)', async () => {
      for (let i = 0; i < 3; i++) await userEvent.click(energy);
      await motionSettled();
      await expect(energy).toHaveAttribute('aria-expanded', 'true');
      const panel = panelOf(energy);
      const content = panel.querySelector<HTMLElement>('.ds-nav__panel-content')!;
      await expect(panel.getBoundingClientRect().height).toBe(content.scrollHeight);
      const long = canvas.getByRole('link', { name: '월별 에너지 사용량 비교 리포트' });
      await expect(long.getBoundingClientRect().height).toBeGreaterThan(32);
      await expect(long.getBoundingClientRect().bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom);
      await expect(canvas.getByRole('link', { name: '에너지 절약' })).toHaveAttribute('aria-current', 'page');
      const { frames, full } = await recordGroup(energy, async () => {
        energy.click();
        await new Promise((resolve) => setTimeout(resolve, 60));
        energy.click();
      });
      const steps = frames.slice(1).map((f, i) => Math.abs(f.height - frames[i].height));
      await expect(Math.min(...frames.map((f) => f.height))).toBeGreaterThan(0);
      await expect(Math.max(...steps)).toBeLessThan(full * 0.45);
      await motionSettled();
      await expect(energy).toHaveAttribute('aria-expanded', 'true');
      await expect(panel.getBoundingClientRect().height).toBe(content.scrollHeight);
    });
    await step('closing while a link inside has focus returns focus to the group button', async () => {
      const link = canvas.getByRole('link', { name: '사용량' });
      link.focus();
      energy.click(); // a click that does not move focus (like a controlled close): React commits it in a microtask
      await waitFor(() => expect(energy).toHaveAttribute('aria-expanded', 'false'));
      await expect(energy).toHaveFocus();
      await expect(panelOf(energy).inert).toBe(true);
      await motionSettled();
    });
  },
};

/** nav landmark, lists, aria-current for the selected page, aria-expanded / aria-controls on groups. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <Navigation aria-label="주 메뉴" style={{ width: 240 }}>
      <NavGroup label="에너지" icon={<ListIcon />} defaultExpanded>
        <NavChild href="#usage" selected>
          사용량
        </NavChild>
      </NavGroup>
      <NavLink href="#report" icon={<ListIcon />}>
        리포트
      </NavLink>
    </Navigation>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: '주 메뉴' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('list')).toHaveLength(2);
    const group = canvas.getByRole('button', { name: '에너지' });
    await expect(group).toHaveAttribute('aria-expanded', 'true');
    await expect(document.getElementById(group.getAttribute('aria-controls') ?? '')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '사용량' })).toHaveAttribute('aria-current', 'page');
  },
};
