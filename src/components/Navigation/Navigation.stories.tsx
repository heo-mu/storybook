import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavChild, NavGroup, NavLink, Navigation } from './Navigation';
import { ListIcon } from '../../icons';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Navigation.showcase.stories.tsx
const meta = {
  title: 'Components/Navigation/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LNB built from the Figma component sets **item_parent** (180:5246), **item_link** (180:6174) and **item_child** ' +
          '(180:6249), composed as in the Figma LNB example. `Navigation` > `NavLink` (item_link, Selected → `selected`) and ' +
          '`NavGroup` (item_parent, Expanded → `expanded` / `defaultExpanded`) > `NavChild` (item_child, Selected → `selected`). ' +
          'Selected items get `aria-current="page"`; groups are buttons with `aria-expanded`. `NavParentItem` is the bare group button.',
      },
    },
  },
  args: {
    'aria-label': '주 메뉴',
    style: { width: 240 },
    children: null,
  },
  argTypes: {
    children: { control: false },
    header: { control: false },
  },
  render: (args) => (
    <Navigation {...args}>
      <NavGroup label="에너지 관리" icon={<ListIcon />} defaultExpanded>
        <NavChild href="#usage">사용량</NavChild>
        <NavChild href="#saving" selected>
          에너지 절약
        </NavChild>
        <NavChild href="#report">리포트</NavChild>
      </NavGroup>
      <NavGroup label="설비" icon={<ListIcon />}>
        <NavChild href="#devices">장비 목록</NavChild>
      </NavGroup>
      <NavLink href="#dashboard" icon={<ListIcon />}>
        대시보드
      </NavLink>
      <NavLink href="#settings" icon={<ListIcon />}>
        설정
      </NavLink>
    </Navigation>
  ),
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A selected top-level page (item_link Selected). */
export const SelectedLink: Story = {
  render: (args) => (
    <Navigation {...args}>
      <NavLink href="#dashboard" icon={<ListIcon />} selected>
        대시보드
      </NavLink>
      <NavLink href="#settings" icon={<ListIcon />}>
        설정
      </NavLink>
    </Navigation>
  ),
};

/** Items without icons (Figma "Icon" off). */
export const WithoutIcons: Story = {
  render: (args) => (
    <Navigation {...args}>
      <NavGroup label="에너지 관리" defaultExpanded>
        <NavChild href="#usage" selected>
          사용량
        </NavChild>
      </NavGroup>
      <NavLink href="#dashboard">대시보드</NavLink>
    </Navigation>
  ),
};
