import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
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

/** Figma State=Disabled: surface/container background, border/disabled dashes, text/inactive title — and nothing can be dropped or picked. */
export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const area = canvas.getByRole('button', { name: /파일을 끌어다 놓거나 선택하세요/ });
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await expect(area).toBeDisabled();
    await expect(input).toBeDisabled();
    await expect(getComputedStyle(area).backgroundColor).toBe('rgb(239, 240, 243)');
    await expect(getComputedStyle(canvas.getByText(/파일을 끌어다 놓거나 선택하세요/)).color).toBe('rgb(161, 168, 181)');
    await expect(getComputedStyle(canvas.getByText(/PDF, HWP/)).color).toBe('rgb(161, 168, 181)');
    await expect(getComputedStyle(canvasElement.querySelector('.ds-file-uploader__border rect')!).stroke).toBe('rgb(201, 206, 214)');
    // Pointer and keyboard: no file dialog, no callback, not in the Tab order.
    let dialogOpened = 0;
    input.addEventListener('click', () => dialogOpened++);
    // A real pointer lands on the root (the disabled button ignores the pointer); a programmatic click on the button is inert too.
    await userEvent.click(area.parentElement!);
    area.click();
    await userEvent.tab();
    await expect(area).not.toHaveFocus();
    await userEvent.keyboard('{Enter} ');
    await expect(dialogOpened).toBe(0);
    await expect(args.onFilesSelected).not.toHaveBeenCalled();
    // Drag and drop: the drop is refused (default prevented, dropEffect none) so the browser does not open the file.
    const data = new DataTransfer();
    data.items.add(new File(['x'], 'a.pdf', { type: 'application/pdf' }));
    for (const target of [area, area.parentElement!]) {
      for (const type of ['dragenter', 'dragover', 'drop'] as const) {
        const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: data });
        target.dispatchEvent(event);
        await expect(event.defaultPrevented).toBe(true);
        await expect(event.dataTransfer!.dropEffect).toBe('none');
      }
    }
    await expect(area).not.toHaveAttribute('data-drag-over');
    await expect(args.onFilesSelected).not.toHaveBeenCalled();
  },
};
