import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator } from './DropdownMenu';
import { Button } from '../Button';
import { FolderSimpleDashedIcon } from '../../icons';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/DropdownMenu.showcase.stories.tsx
const meta = {
  title: 'Components/DropdownMenu/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma components **dropdownmenu_item** (179:4819, Type Content / Title × State) and **dropdownmenu_line** (179:5082) in the ' +
          'menu panel of the Figma examples. Compose `DropdownMenu` (trigger + panel) > `DropdownMenuItem` / `DropdownMenuSection` ' +
          '(Type Title) / `DropdownMenuSeparator`. State Hover → pointer hover or keyboard focus, Alert → `danger`, Disabled → ' +
          '`disabled`; Left / Right Icon → `icon` / `chevron`. Keyboard, focus return and menu / menuitem roles come from ' +
          'react-aria-components.',
      },
    },
  },
  args: {
    'aria-label': '작업',
    placement: 'bottom start',
    onAction: fn(),
    trigger: <Button>메뉴</Button>,
    children: null,
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end'] },
  },
  decorators: [(Story) => <div style={{ minHeight: 280 }}>{Story()}</div>],
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuSection title="파일">
        <DropdownMenuItem id="new" icon={<FolderSimpleDashedIcon />}>
          새 폴더
        </DropdownMenuItem>
        <DropdownMenuItem id="move" icon={<FolderSimpleDashedIcon />} chevron>
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
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  args: { open: true },
};

/** Text-only items (Left / Right Icon off) — e.g. a sort menu. */
export const TextOnly: Story = {
  args: { 'aria-label': '정렬', trigger: <Button variant="secondary" appearance="outline">정렬</Button> },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuItem id="latest">최신순</DropdownMenuItem>
      <DropdownMenuItem id="oldest">오래된순</DropdownMenuItem>
      <DropdownMenuItem id="name">이름순</DropdownMenuItem>
    </DropdownMenu>
  ),
};

/** Items with sub text (`description`). */
export const WithDescription: Story = {
  args: { open: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuItem id="share" icon={<FolderSimpleDashedIcon />} description="링크가 있는 모든 사용자">
        공유
      </DropdownMenuItem>
      <DropdownMenuItem id="archive" icon={<FolderSimpleDashedIcon />} description="목록에서 숨깁니다">
        보관
      </DropdownMenuItem>
    </DropdownMenu>
  ),
};
