import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploader } from './FileUploader';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/FileUploader.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/FileUploader/FileUploader",
  id: 'components-fileuploader-fileuploader',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "드래그 앤 드롭 또는 파일 선택 창으로 파일을 받습니다. 선택한 파일은 FileUploaderItem으로 표시합니다.",
      },
    },
  },
  args: {
    helperText: 'PDF, HWP, DOCX, JPG, PNG · 파일당 10 MB · 최대 5개',
    accept: '.pdf,.hwp,.docx,.jpg,.png',
    multiple: true,
    showIcon: true,
    disabled: false,
    onFilesSelected: fn(),
  },
  decorators: [(Story) => <div style={{ width: 353 }}><Story /></div>],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const WithoutIcon: Story = {
  name: "Without Icon",
  args: { showIcon: false },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
