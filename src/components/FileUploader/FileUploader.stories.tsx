import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploader } from './FileUploader';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/FileUploader.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/FileUploader/FileUploader',
  id: 'components-fileuploader-fileuploader',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '파일을 끌어다 놓거나 눌러서 고르는 업로드 영역입니다. 받을 파일 형식은 `accept`, 여러 파일 허용은 `multiple`로 정하고, 고른 파일은 `onFilesSelected`로 받습니다.',
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

export const Playground: Story = { name: '직접 체험' };

export const WithoutIcon: Story = {
  name: '아이콘 없음',
  args: { showIcon: false },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
