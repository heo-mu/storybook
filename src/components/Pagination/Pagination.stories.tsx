import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';
import { PAGINATION_SHAPES, PAGINATION_SIZES } from './Pagination.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Pagination.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Pagination/Pagination',
  id: 'components-pagination-pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 페이지로 나뉜 내용에서 페이지를 옮겨 가는 페이지 이동 막대입니다. 전체 페이지 수는 `totalPages`, 지금 페이지는 `page` 또는 `defaultPage`, 보이는 번호 수는 `visiblePages`로 정합니다.',
      },
    },
  },
  args: {
    totalPages: 12,
    defaultPage: 1,
    size: 'sm',
    shape: 'square',
    visiblePages: 5,
    onPageChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: PAGINATION_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    shape: { control: 'inline-radio', options: PAGINATION_SHAPES, description: '모서리 모양', table: { defaultValue: { summary: 'square' } } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Middle: Story = {
  name: '중간 페이지',
  args: { defaultPage: 6 },
};

export const RoundedLarge: Story = {
  name: '둥근 모양 · 큰 크기',
  args: { size: 'lg', shape: 'rounded' },
};

export const FewPages: Story = {
  name: '페이지가 적을 때',
  args: { totalPages: 3 },
};
