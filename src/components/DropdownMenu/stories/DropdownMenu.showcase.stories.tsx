import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from 'react-aria-components';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator } from '../DropdownMenu';
import { Button } from '../../Button';
import { FolderSimpleDashedIcon } from '../../../icons';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs dropdown-menu` (sets dropdownmenu_item, dropdownmenu_line).
const meta = {
  title: 'Components/DropdownMenu/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
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

/** Figma `dropdownmenu_item` (5): Content in four states and the group Title, 216px wide. */
export const ItemMatrix: Story = {
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
              node: (
                <Menu aria-label="title">
                  <DropdownMenuSection title="제목">{[]}</DropdownMenuSection>
                </Menu>
              ),
            },
          ],
        },
      ]}
    />
  ),
};

/** Figma `dropdownmenu_line`, 224px wide. */
export const LineMatrix: Story = {
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

/** Keyboard: Enter / ArrowDown opens, arrows move (disabled skipped), Enter activates, Escape closes. */
export const Interaction: StoryObj<{ onAction: Mock<(key: unknown) => void> }> = {
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
    await expect(canvas.getByRole('group', { name: '편집' })).toBeInTheDocument();
    await expect(canvas.getByRole('menuitem', { name: '삭제' })).toBeInTheDocument();
    await expect(canvas.getByRole('separator')).toBeInTheDocument();
  },
};
