import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUploader } from './FileUploader';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/FileUploader.showcase.stories.tsx
const meta = {
  title: 'Components/FileUploader/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **file-uploader** (651:3945, 5 states): drop area that also opens the file dialog. ' +
          'Title Text → `title`, Helper Text → `helperText`, Show Icon → `showIcon`. Files (chosen or dropped, filtered by `accept`) ' +
          'arrive in `onFilesSelected`. State: Hover / Pressed = :hover / :active, Drag-over = files over the area, Disabled = `disabled`. ' +
          'Show the chosen files with `FileUploaderItem`.',
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

export const Playground: Story = {};

export const WithoutIcon: Story = {
  args: { showIcon: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};
