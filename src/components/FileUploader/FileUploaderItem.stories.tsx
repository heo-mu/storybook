import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploaderItem } from './FileUploaderItem';
import { FILE_UPLOADER_ITEM_STATUSES } from './FileUploader.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/FileUploader.showcase.stories.tsx
const meta = {
  title: 'Components/FileUploader/FileUploaderItem',
  component: FileUploaderItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **file-uploader-item** (651:3999): one file in an upload list. State → `status` ' +
          '(`completed`: "삭제" button → `onRemove`, `uploading`: spinner, `download`: "다운로드" button → `onDownload`). ' +
          'File Name → `fileName`, File Info → `fileInfo`.',
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
    status: { control: 'inline-radio', options: FILE_UPLOADER_ITEM_STATUSES, description: 'Figma "State"' },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof FileUploaderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Uploading: Story = {
  args: { status: 'uploading', fileInfo: '1.2 MB · 업로드 중' },
};

export const Download: Story = {
  args: { status: 'download', fileInfo: '1.2 MB' },
};

export const LongName: Story = {
  args: { fileName: '2026년_하반기_에너지절약_캠페인_참여안내_최종_수정본.pdf' },
};
