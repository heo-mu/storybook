import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Breadcrumb } from './Breadcrumb';
import { BREADCRUMB_LAYOUTS, BREADCRUMB_SIZES } from './Breadcrumb.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Breadcrumb.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Breadcrumb/Breadcrumb',
  id: 'components-breadcrumb-breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '지금 페이지의 위치를 홈부터 이어지는 경로로 보여 줍니다. 상위 경로는 `items`, 지금 페이지 이름은 `current`로 넘기고, 경로가 길면 `layout="collapsed"`로 접습니다.',
      },
    },
  },
  args: {
    items: [
      { label: '에너지 관리', href: '#energy' },
      { label: '에너지 절약', href: '#saving' },
      { label: '프로그램 목록', href: '#programs' },
    ],
    current: '프로그램 등록',
    size: 'md',
    layout: 'full',
    showParent: true,
    onExpandedChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: BREADCRUMB_SIZES, description: '크기', table: { defaultValue: { summary: 'md' } } },
    layout: { control: 'inline-radio', options: BREADCRUMB_LAYOUTS, description: '배치 — 전체 경로(full) · 접힘(collapsed)', table: { defaultValue: { summary: 'full' } } },
  },
  decorators: [(Story) => <div style={{ minHeight: 180 }}>{Story()}</div>],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Collapsed: Story = {
  name: '접힘',
  args: { layout: 'collapsed' },
};

export const Small: Story = {
  name: '작은 크기',
  args: { size: 'sm' },
};

/** 상위 페이지까지 접은 모양입니다. 홈 · … · 지금 페이지만 보입니다(`showParent` 끔). */
export const CollapsedWithoutParent: Story = {
  name: '접힘 · 상위 없음',
  args: { layout: 'collapsed', showParent: false },
};
