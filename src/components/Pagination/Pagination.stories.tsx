import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';
import { PAGINATION_SHAPES, PAGINATION_SIZES } from './Pagination.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Pagination.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Pagination/Pagination",
  id: 'components-pagination-pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "여러 페이지로 나뉜 목록에서 현재 페이지를 표시하고 다른 페이지로 이동합니다.",
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

export const Playground: Story = { name: "Playground" };

export const Middle: Story = {
  name: '중간 페이지',
  args: { defaultPage: 6 },
};

export const RoundedLarge: Story = {
  name: "Large Rounded",
  args: { size: 'lg', shape: 'rounded' },
};

export const FewPages: Story = {
  name: "짧은 페이지 목록",
  args: { totalPages: 3 },
};
