import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { TextButton } from '../Button';
import { CaretRightIcon, DatabaseIcon } from '../../icons';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/EmptyState.showcase.stories.tsx
const meta = {
  title: 'Components/EmptyState/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component **empty-state** (724:14963): Title Text → `title`, Description / Description Text → `description`, ' +
          'Icon → `icon` (16px, decorative), the button below → `action` (Figma: TextButton with CaretRight). Centred, ' +
          '320px wide (narrower when the parent is).',
      },
    },
  },
  args: {
    title: '아직 수집된 데이터가 없습니다',
    description: '수집 설정과 데이터 연결을 확인하세요.',
    icon: <DatabaseIcon />,
    action: <TextButton rightIcon={<CaretRightIcon />}>수집 설정 확인</TextButton>,
  },
  argTypes: { icon: { control: false }, action: { control: false } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutAction: Story = {
  args: { action: undefined, title: '검색 결과가 없습니다', description: '다른 검색어를 입력해 보세요.' },
};

export const TitleOnly: Story = {
  args: { action: undefined, description: undefined, icon: undefined, title: '표시할 항목이 없습니다' },
};
