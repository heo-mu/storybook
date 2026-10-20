import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { SKELETON_SHAPES } from './Skeleton.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Skeleton.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Skeleton/Skeleton',
  id: 'components-skeleton-skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '내용을 불러오는 동안 그 자리를 표시하는 도형입니다. 모양은 `shape`로 고르고, 크기는 `style`의 width · height로 바꿀 수 있습니다.',
      },
    },
  },
  args: { shape: 'line' },
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: SKELETON_SHAPES,
      description: '모양과 기본 크기 — line(60 × 8) · shape4(100 × 10) · block(140 × 12) · circle(24 × 24)',
      table: { defaultValue: { summary: 'line' } },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모양을 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

/** 도형을 조합해 만든 목록 행 자리 표시입니다. */
export const ListRow: Story = {
  name: '목록 행',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton shape="circle" />
      <div style={{ display: 'grid', gap: 4 }}>
        <Skeleton shape="block" />
        <Skeleton shape="line" />
      </div>
    </div>
  ),
};

/** `style`로 크기를 바꾼 예입니다. 색과 모서리는 그대로입니다. */
export const CustomSize: Story = {
  name: '크기 지정',
  args: { shape: 'block', style: { width: 240, height: 12 } },
};
