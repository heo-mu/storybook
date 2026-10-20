import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploaderItem } from './FileUploaderItem';
import { FILE_UPLOADER_ITEM_STATUSES } from './FileUploader.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/FileUploader.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/FileUploader/FileUploaderItem",
  id: 'components-fileuploader-fileuploaderitem',
  component: FileUploaderItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "파일 이름·정보와 업로드 상태를 표시합니다. 상태에 따라 삭제 또는 다운로드 동작을 제공합니다.",
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
    status: { control: 'inline-radio', options: FILE_UPLOADER_ITEM_STATUSES, description: '상태 — 삭제 버튼 · 업로드 중 · 다운로드 버튼 · 업로드 실패' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof FileUploaderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Uploading: Story = {
  name: "Uploading",
  args: { status: 'uploading', fileInfo: '1.2 MB · 업로드 중' },
};

export const Download: Story = {
  name: "Download",
  args: { status: 'download', fileInfo: '1.2 MB' },
};

export const Failed: Story = {
  name: "Upload Error",
  args: { status: 'error', fileInfo: '1.2 MB · 업로드 실패' },
};

export const LongName: Story = {
  name: "긴 파일명",
  args: { fileName: '2026년_하반기_에너지절약_캠페인_참여안내_최종_수정본.pdf' },
};
