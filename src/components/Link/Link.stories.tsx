import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { LINK_SIZES } from './Link.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Link.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Link/Link',
  id: 'components-link-link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '다른 페이지나 문서로 이동하는 밑줄 글자 링크입니다. 크기는 `size`로 고르고, 새 창으로 열 때는 `external`을 켭니다.',
      },
    },
  },
  args: {
    children: '라벨명',
    href: '#',
    size: 'sm',
    external: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: LINK_SIZES, description: '크기', table: { defaultValue: { summary: 'sm' } } },
    showIcon: { control: 'boolean', description: '새 창 아이콘 표시 여부' },
    external: { control: 'boolean' },
    disabled: { control: 'boolean', description: '비활성 — 누를 수 없고 키보드로도 선택되지 않음' },
    children: { control: 'text', description: '링크 글자' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const External: Story = {
  name: '새 창 링크',
  args: { href: 'https://www.figma.com', external: true, children: 'Figma 열기' },
};

export const Large: Story = {
  name: '큰 크기',
  args: { size: 'lg' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
