import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';
import { PAGINATION_SHAPES, PAGINATION_SIZES } from './Pagination.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Pagination.showcase.stories.tsx
const meta = {
  title: 'Components/Pagination/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **pagination** (132:871), **pagination_item** (132:520) and **pagination_control** (132:604). ' +
          'Size → `size`, Shape → `shape`, current page → `page` / `defaultPage` / `onPageChange`, `totalPages`, window of numbers → ' +
          '`visiblePages` (Figma shows 5). Previous / next are disabled at the ends. `PaginationItem` and `PaginationControl` are ' +
          'exported for custom layouts.',
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
    size: { control: 'inline-radio', options: PAGINATION_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    shape: { control: 'inline-radio', options: PAGINATION_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'square' } } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Middle: Story = {
  args: { defaultPage: 6 },
};

export const RoundedLarge: Story = {
  args: { size: 'lg', shape: 'rounded' },
};

export const FewPages: Story = {
  args: { totalPages: 3 },
};
