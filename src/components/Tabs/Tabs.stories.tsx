import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { TABS_APPEARANCES, TABS_SHAPES, TABS_SIZES, TABS_VARIANTS } from './Tabs.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Tabs.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Tabs/Tabs",
  id: 'components-tabs-tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "같은 화면의 관련 콘텐츠를 구분하고 탭을 선택해 전환합니다.",
      },
    },
  },
  args: {
    appearance: 'line',
    variant: 'primary',
    size: 'sm',
    shape: 'square',
    defaultSelectedKey: 'all',
    onSelectionChange: fn(),
    children: null,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: TABS_APPEARANCES, description: '모양 — 밑줄(line) · 채움(filled)' },
    variant: { control: 'inline-radio', options: TABS_VARIANTS, description: '종류 — 선택된 탭의 색' },
    size: { control: 'inline-radio', options: TABS_SIZES, description: '크기' },
    shape: { control: 'inline-radio', options: TABS_SHAPES, description: '모서리 모양(filled에만 적용)' },
    children: { control: false },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="상태">
        <Tab id="all">전체</Tab>
        <Tab id="open">진행 중</Tab>
        <Tab id="done">완료</Tab>
        <Tab id="hold" disabled>
          보류
        </Tab>
      </TabList>
      <TabPanel id="all">전체 목록</TabPanel>
      <TabPanel id="open">진행 중 목록</TabPanel>
      <TabPanel id="done">완료 목록</TabPanel>
      <TabPanel id="hold">보류 목록</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Filled: Story = {
  name: 'Filled',
  args: { appearance: 'filled' },
};

export const FilledRounded: Story = {
  name: "Filled Rounded",
  args: { appearance: 'filled', shape: 'rounded', variant: 'secondary', size: 'md' },
};

export const Large: Story = {
  name: "Large",
  args: { size: 'lg' },
};
