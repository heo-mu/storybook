import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavChild, NavGroup, NavLink, Navigation } from './Navigation';
import { ListIcon } from '../../icons';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Navigation.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Navigation/Navigation',
  id: 'components-navigation-navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '화면 왼쪽에 두는 메뉴(LNB)입니다. 바로 이동하는 메뉴는 `NavLink`, 펼치는 메뉴 그룹은 `NavGroup`과 하위 메뉴 `NavChild`로 만들고, 지금 페이지에는 `selected`를 줍니다.',
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

export const Playground: Story = { name: '직접 체험' };

/** 첫 단계 메뉴가 지금 페이지로 선택된 모양입니다. */
export const SelectedLink: Story = {
  name: '선택된 링크',
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

/** 아이콘 없이 글자만 있는 메뉴입니다. */
export const WithoutIcons: Story = {
  name: '아이콘 없음',
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
