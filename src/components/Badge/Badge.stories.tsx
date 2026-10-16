import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, BadgeCount, BadgeDot } from './Badge';
import { BADGE_APPEARANCES, BADGE_SHAPES, BADGE_SIZES, BADGE_STATUSES } from './Badge.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Badge.showcase.stories.tsx
const meta = {
  title: 'Components/Badge/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **badge_status** (91:6152, 84 variants), **badge_dot** (95:2681, 21) and **badge_count** ' +
          '(95:2762, 14). `Badge`: Status → `status`, Appearance → `appearance`, Size → `size`, Shape → `shape`, Dot → `dot`, ' +
          'Label Text → children. `BadgeDot`: Status · Size (4 / 6 / 8px), decorative unless `aria-label`. `BadgeCount`: ' +
          '`count` with `max` (Digits Multiple shows "99+").',
      },
    },
  },
  args: { children: '진행 중', status: 'basic', appearance: 'filled', size: 'sm', shape: 'square', dot: true },
  argTypes: {
    status: { control: 'select', options: BADGE_STATUSES, description: 'Figma "Status"', table: { defaultValue: { summary: 'basic' } } },
    appearance: { control: 'inline-radio', options: BADGE_APPEARANCES, description: 'Figma "Appearance"', table: { defaultValue: { summary: 'filled' } } },
    size: { control: 'inline-radio', options: BADGE_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    shape: { control: 'inline-radio', options: BADGE_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OutlineRounded: Story = {
  args: { children: '경고', status: 'warning', appearance: 'outline', shape: 'rounded', size: 'md' },
};

export const WithoutDot: Story = {
  args: { children: '정보', status: 'information', dot: false, size: 'lg' },
};

/** `BadgeDot` and `BadgeCount` next to a label. */
export const DotAndCount: Story = {
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
