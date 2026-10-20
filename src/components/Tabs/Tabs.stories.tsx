import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { TABS_APPEARANCES, TABS_SHAPES, TABS_SIZES, TABS_VARIANTS } from './Tabs.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Tabs.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Tabs/Tabs',
  id: 'components-tabs-tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '한 화면의 내용을 탭으로 나눠 보여 줍니다. 모양은 `appearance`(밑줄 · 채움), 선택 색은 `variant`, 크기는 `size`로 고르고, `Tab`과 `TabPanel`은 같은 `id`로 잇습니다.',
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

export const Playground: Story = { name: '직접 체험' };

export const Filled: Story = {
  name: 'Filled',
  args: { appearance: 'filled' },
};

export const FilledRounded: Story = {
  name: 'Filled · 둥근 모양',
  args: { appearance: 'filled', shape: 'rounded', variant: 'secondary', size: 'md' },
};

export const Large: Story = {
  name: '큰 크기',
  args: { size: 'lg' },
};
