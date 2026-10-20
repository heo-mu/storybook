import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploaderItem } from './FileUploaderItem';
import { FILE_UPLOADER_ITEM_STATUSES } from './FileUploader.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/FileUploader.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/FileUploader/FileUploaderItem',
  id: 'components-fileuploader-fileuploaderitem',
  component: FileUploaderItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '업로드 목록에서 파일 하나를 보여 주는 줄입니다. `status`로 "삭제" 버튼(`completed`), 로딩 표시(`uploading`), "다운로드" 버튼(`download`) 중 하나를 고릅니다.',
      },
    },
  },
  args: {
    fileName: '에너지절약_참여안내.pdf',
    fileInfo: '1.2 MB · 업로드 완료',
    status: 'completed',
    onRemove: fn(),
    onDownload: fn(),
  },
  argTypes: {
    status: { control: 'inline-radio', options: FILE_UPLOADER_ITEM_STATUSES, description: '상태 — 삭제 버튼 · 업로드 중 · 다운로드 버튼' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof FileUploaderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Uploading: Story = {
  name: '업로드 중',
  args: { status: 'uploading', fileInfo: '1.2 MB · 업로드 중' },
};

export const Download: Story = {
  name: '내려받기',
  args: { status: 'download', fileInfo: '1.2 MB' },
};

export const LongName: Story = {
  name: '긴 파일 이름',
  args: { fileName: '2026년_하반기_에너지절약_캠페인_참여안내_최종_수정본.pdf' },
};
