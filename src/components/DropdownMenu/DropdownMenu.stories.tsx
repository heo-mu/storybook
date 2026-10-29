import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator, DropdownMenuSub } from './DropdownMenu';
import { Button } from '../Button';
import { FolderSimpleDashedIcon } from '../../icons';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/DropdownMenu.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/DropdownMenu/DropdownMenu",
  id: 'components-dropdownmenu-dropdownmenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "버튼을 누르면 관련 동작 목록이 열립니다. 이동·복제·삭제처럼 같은 대상에 적용할 작업을 모아 제공합니다.",
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

export const Playground: Story = { name: "Playground" };

export const Open: Story = {
  name: "Open",
  args: { open: true },
};

/** 아이콘 없이 글자만 있는 메뉴입니다(예: 정렬 메뉴). */
export const TextOnly: Story = {
  name: "Text Only",
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
  name: "With Description",
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

/**
 * 하위 메뉴(2단계): `DropdownMenuSub` 항목에 마우스를 올리거나 → · Enter를 누르면 옆에 글자만 있는 좁은 메뉴가 열리고, ← · Esc로 닫힙니다.
 * 상위 메뉴와 같이 애니메이션 없이 바로 열리고 닫힙니다.
 */
export const Submenu: Story = {
  name: '하위 메뉴',
  render: (args) => (
    <DropdownMenu {...args} aria-label="파일 작업">
      <DropdownMenuItem id="new" icon={<FolderSimpleDashedIcon />}>
        새 폴더
      </DropdownMenuItem>
      <DropdownMenuItem id="copy" icon={<FolderSimpleDashedIcon />}>
        복제
      </DropdownMenuItem>
      <DropdownMenuSub id="export" label="내보내기" icon={<FolderSimpleDashedIcon />} onAction={args.onAction}>
        <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
        <DropdownMenuItem id="xlsx">Excel</DropdownMenuItem>
        <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="more">더보기...</DropdownMenuItem>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem id="delete" icon={<FolderSimpleDashedIcon />} danger>
        삭제
      </DropdownMenuItem>
    </DropdownMenu>
  ),
};
