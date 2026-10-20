import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { TextButton } from '../Button';
import { CaretRightIcon, DatabaseIcon } from '../../icons';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/EmptyState.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/EmptyState/EmptyState',
  id: 'components-emptystate-emptystate',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '보여 줄 내용이 없을 때 그 자리에 안내를 보여 주는 빈 상태입니다. `title`은 꼭 넣고, `icon` · `description` · `action`은 필요할 때만 넣습니다.',
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

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

export const WithoutAction: Story = {
  name: '버튼 없음',
  args: { action: undefined, title: '검색 결과가 없습니다', description: '다른 검색어를 입력해 보세요.' },
};

export const TitleOnly: Story = {
  name: '제목만',
  args: { action: undefined, description: undefined, icon: undefined, title: '표시할 항목이 없습니다' },
};
