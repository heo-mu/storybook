import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator } from './DropdownMenu';
import { Button } from '../Button';
import { FolderSimpleDashedIcon } from '../../icons';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/DropdownMenu.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/DropdownMenu/DropdownMenu',
  id: 'components-dropdownmenu-dropdownmenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '버튼을 누르면 펼쳐지는 동작 메뉴입니다. 여는 버튼은 `trigger`로 넘기고, 안에 `DropdownMenuItem` · `DropdownMenuSection` · `DropdownMenuSeparator`를 넣습니다.',
      },
    },
  },
  args: {
    'aria-label': '작업',
    placement: 'bottom start',
    onAction: fn(),
    trigger: <Button>메뉴</Button>,
    children: null,
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end'] },
  },
  decorators: [(Story) => <div style={{ minHeight: 280 }}>{Story()}</div>],
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuSection title="파일">
        <DropdownMenuItem id="new" icon={<FolderSimpleDashedIcon />}>
          새 폴더
        </DropdownMenuItem>
        <DropdownMenuItem id="move" icon={<FolderSimpleDashedIcon />} chevron>
          이동
        </DropdownMenuItem>
        <DropdownMenuItem id="lock" icon={<FolderSimpleDashedIcon />} disabled>
          잠금
        </DropdownMenuItem>
      </DropdownMenuSection>
      <DropdownMenuSeparator />
      <DropdownMenuItem id="delete" icon={<FolderSimpleDashedIcon />} danger>
        삭제
      </DropdownMenuItem>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Open: Story = {
  name: '열림',
  args: { open: true },
};

/** 아이콘 없이 글자만 있는 메뉴입니다(예: 정렬 메뉴). */
export const TextOnly: Story = {
  name: '글자만',
  args: { 'aria-label': '정렬', trigger: <Button variant="secondary" appearance="outline">정렬</Button> },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuItem id="latest">최신순</DropdownMenuItem>
      <DropdownMenuItem id="oldest">오래된순</DropdownMenuItem>
      <DropdownMenuItem id="name">이름순</DropdownMenuItem>
    </DropdownMenu>
  ),
};

/** 이름 아래에 설명(`description`)이 있는 항목입니다. */
export const WithDescription: Story = {
  name: '설명 있음',
  args: { open: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuItem id="share" icon={<FolderSimpleDashedIcon />} description="링크가 있는 모든 사용자">
        공유
      </DropdownMenuItem>
      <DropdownMenuItem id="archive" icon={<FolderSimpleDashedIcon />} description="목록에서 숨깁니다">
        보관
      </DropdownMenuItem>
    </DropdownMenu>
  ),
};
