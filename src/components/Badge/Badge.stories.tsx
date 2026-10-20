import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, BadgeCount, BadgeDot } from './Badge';
import { BADGE_APPEARANCES, BADGE_SHAPES, BADGE_SIZES, BADGE_STATUSES } from './Badge.options';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Badge.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: "Components/Badge/Badge",
  id: 'components-badge-badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "상태나 개수를 간결하게 표시합니다. 사용자 동작을 실행하는 버튼과 구분해 사용합니다.",
      },
    },
  },
  args: { children: '진행 중', status: 'basic', appearance: 'filled', size: 'sm', shape: 'square', dot: true },
  argTypes: {
    status: { control: 'select', options: BADGE_STATUSES, description: '종류 — 상태를 나타내는 색', table: { defaultValue: { summary: 'basic' } } },
    appearance: { control: 'inline-radio', options: BADGE_APPEARANCES, description: '모양 — 채움(filled) · 테두리(outline)', table: { defaultValue: { summary: 'filled' } } },
    size: { control: 'inline-radio', options: BADGE_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    shape: { control: 'inline-radio', options: BADGE_SHAPES, description: '모서리 모양', table: { defaultValue: { summary: 'square' } } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

export const OutlineRounded: Story = {
  name: "Outline Rounded",
  args: { children: '경고', status: 'warning', appearance: 'outline', shape: 'rounded', size: 'md' },
};

export const WithoutDot: Story = {
  name: '점 없음',
  args: { children: '정보', status: 'information', dot: false, size: 'lg' },
};

/** 글자 옆에 `BadgeDot`과 `BadgeCount`를 둔 예입니다. */
export const DotAndCount: Story = {
  name: '점 · 숫자 배지',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        공지사항 <BadgeDot status="point" size="md" aria-label="새 글" />
      </span>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        알림 <BadgeCount count={7} status="point" aria-label="읽지 않은 알림 7개" />
      </span>
      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        오류 <BadgeCount count={150} status="danger" aria-label="오류 150개" />
      </span>
    </div>
  ),
};
