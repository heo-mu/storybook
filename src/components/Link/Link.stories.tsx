import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { LINK_SIZES } from './Link.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Link.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Link/Link",
  id: 'components-link-link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "다른 페이지나 문서로 이동하는 텍스트 링크입니다. 현재 화면에서 동작을 실행할 때는 Button을 사용합니다.",
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
    disabled: { control: 'boolean', description: '비활성 — 조작과 키보드 포커스 제한' },
    children: { control: 'text', description: '링크 글자' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const External: Story = {
  name: '새 창 링크',
  args: { href: 'https://www.figma.com', external: true, children: 'Figma 열기' },
};

export const Large: Story = {
  name: "Large",
  args: { size: 'lg' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
