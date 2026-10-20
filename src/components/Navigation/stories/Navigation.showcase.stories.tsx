import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, type Mock } from 'storybook/test';
import { NavChild, NavGroup, NavLink, NavParentItem, Navigation } from '../Navigation';
import { ListIcon } from '../../../icons';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs navigation` (sets item_parent, item_link, item_child).
const meta = {
  title: '컴포넌트/Navigation/전체 보기',
  id: 'components-navigation-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The Figma LNB example: two groups (one expanded with a selected child) and two links, 240px wide. */
export const Overview: Story = {
  name: '개요',
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

/** Figma `item_parent` (4): State × Expanded, 200px wide. */
export const ParentMatrix: Story = {
  name: '상위 메뉴 모든 변형',
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

/** Figma `item_link` (4): State × Variant, 200px wide. */
export const LinkMatrix: Story = {
  name: '링크 메뉴 모든 변형',
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

/** Figma `item_child` (4): State × Variant, 200px wide. */
export const ChildMatrix: Story = {
  name: '하위 메뉴 모든 변형',
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

/** The group button toggles its list (Enter / Space / click); links stay in the Tab order. */
export const Interaction: StoryObj<{ onExpandedChange: Mock<(expanded: boolean) => void> }> = {
  name: '동작',
  args: { onExpandedChange: fn() },
  render: (args) => (
    <Navigation aria-label="주 메뉴" style={{ width: 240 }}>
      <NavGroup label="설정" icon={<ListIcon />} onExpandedChange={args.onExpandedChange}>
        <NavChild href="#profile">프로필</NavChild>
        <NavChild href="#alerts">알림</NavChild>
      </NavGroup>
      <NavLink href="#home" icon={<ListIcon />}>
        대시보드
      </NavLink>
    </Navigation>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const group = canvas.getByRole('button', { name: '설정' });
    await step('collapsed: children are hidden', async () => {
      await expect(group).toHaveAttribute('aria-expanded', 'false');
      await expect(canvas.queryByRole('link', { name: '프로필' })).not.toBeInTheDocument();
    });
    await step('Enter expands, focus stays on the group button', async () => {
      group.focus();
      await userEvent.keyboard('{Enter}');
      await expect(group).toHaveAttribute('aria-expanded', 'true');
      await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true);
      await expect(canvas.getByRole('link', { name: '프로필' })).toBeVisible();
    });
    await step('Tab moves into the children, then to the next link', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '프로필' })).toHaveFocus();
      await userEvent.tab();
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '대시보드' })).toHaveFocus();
    });
    await step('Space on the group collapses it', async () => {
      group.focus();
      await userEvent.keyboard(' ');
      await waitFor(() => expect(group).toHaveAttribute('aria-expanded', 'false'));
    });
  },
};

/** nav landmark, lists, aria-current for the selected page, aria-expanded / aria-controls on groups. */
export const Accessibility: Story = {
  name: '접근성',
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
