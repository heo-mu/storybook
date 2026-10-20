import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, type Mock } from 'storybook/test';

const vi = (f: unknown) => f as Mock<(files: File[]) => void>;
import { FileUploader } from '../FileUploader';
import { FileUploaderItem } from '../FileUploaderItem';
import { Loading } from '../../Loading';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs file-uploader` (sets file-uploader, file-uploader-item, loading).
const meta = {
  title: '컴포넌트/FileUploader/전체 보기',
  id: 'components-fileuploader-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const FIGMA_TITLE = '파일을 끌어다 놓거나 선택하세요';
const FIGMA_HELPER = 'PDF, HWP, DOCX, JPG, PNG · 파일당 10 MB · 최대 5개';
const STATES = ['Default', 'Hover', 'Pressed', 'Drag-over', 'Disabled'] as const;

/** Story-only: shows the Drag-over state without a real drag (the attribute the component sets while dragging). */
function DragOver({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref.current?.querySelector('.ds-file-uploader')?.setAttribute('data-drag-over', '');
  });
  return <div ref={ref}>{children}</div>;
}

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div style={{ width: 353, display: 'grid', gap: 16 }}>
      <FileUploader helperText={FIGMA_HELPER} multiple accept=".pdf,.hwp,.docx,.jpg,.png" />
      <FileUploaderItem fileName="에너지절약_참여안내.pdf" fileInfo="1.2 MB · 업로드 완료" status="completed" />
      <FileUploaderItem fileName="설문결과_2026.xlsx" fileInfo="3.4 MB · 업로드 중" status="uploading" />
      <FileUploaderItem fileName="참가신청서_양식.hwp" fileInfo="85 KB" status="download" />
      <StorySection title="Loading (md · sm)">
        <Loading label="무엇하는 중..." />
        <Loading size="sm" label="무엇하는 중..." />
        <Loading size="sm" aria-label="불러오는 중" />
      </StorySection>
    </div>
  ),
};

/** Figma `file-uploader` (5 states), 353px wide. */
export const DropzoneMatrix: Story = {
  name: '첨부 영역 모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={353}
      columns={['file-uploader']}
      rows={STATES.map((state) => {
        const node = (
          <FileUploader
            title={FIGMA_TITLE}
            helperText={FIGMA_HELPER}
            disabled={state === 'Disabled'}
            className={state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined}
          />
        );
        return { label: state, cells: [{ figma: `State=${state}`, node: state === 'Drag-over' ? <DragOver>{node}</DragOver> : node }] };
      })}
    />
  ),
};

/** Figma `file-uploader-item` (Completed · uploading · download), 320px wide. */
export const ItemMatrix: Story = {
  name: '항목 모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={['file-uploader-item']}
      rows={(['Completed', 'uploading', 'download'] as const).map((state) => ({
        label: state,
        cells: [
          {
            figma: `State=${state}`,
            node: <FileUploaderItem fileName="에너지절약_참여안내.pdf" fileInfo="1.2 MB · 업로드 완료" status={state.toLowerCase() as 'completed' | 'uploading' | 'download'} />,
          },
        ],
      }))}
    />
  ),
};

/** Figma `loading` (md · sm) with the label. */
export const LoadingMatrix: Story = {
  name: '로딩 모든 변형',
  render: () => (
    <FigmaMatrix
      columns={['loading']}
      rows={(['md', 'sm'] as const).map((size) => ({
        label: size,
        cells: [{ figma: `size=${size}`, node: <Loading size={size} label="무엇하는 중..." /> }],
      }))}
    />
  ),
};

/** Every drop-area state. */
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <StorySection title="State" direction="column">
      {STATES.map((state) => {
        const node = (
          <div key={state} style={{ width: 353 }}>
            <FileUploader
              title={state}
              helperText={FIGMA_HELPER}
              disabled={state === 'Disabled'}
              className={state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined}
            />
          </div>
        );
        return state === 'Drag-over' ? <DragOver key={state}>{node}</DragOver> : node;
      })}
    </StorySection>
  ),
};

function Uploads({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: 353, display: 'grid', gap: 8 }}>
      <FileUploader
        helperText="PDF · 최대 3개"
        accept=".pdf"
        multiple
        name="attachments"
        onFilesSelected={(picked) => {
          onFilesSelected(picked);
          setFiles((all) => [...all, ...picked]);
        }}
      />
      {files.map((f) => (
        <FileUploaderItem key={f.name} fileName={f.name} fileInfo={`${f.size} B`} onRemove={() => setFiles((all) => all.filter((x) => x !== f))} />
      ))}
    </div>
  );
}

/** Dropping files (filtered by `accept`) lists them; the remove button deletes an item. */
export const Interaction: StoryObj<{ onFilesSelected: (files: File[]) => void }> = {
  name: '동작',
  args: { onFilesSelected: fn() },
  render: (args) => <Uploads onFilesSelected={args.onFilesSelected} />,
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const zone = canvasElement.querySelector<HTMLButtonElement>('.ds-file-uploader')!;
    const transfer = new DataTransfer();
    transfer.items.add(new File(['%PDF'], '보고서.pdf', { type: 'application/pdf' }));
    transfer.items.add(new File(['x'], '사진.png', { type: 'image/png' }));
    await step('dragging files over the area shows Drag-over', async () => {
      zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: transfer }));
      await waitFor(() => expect(zone).toHaveAttribute('data-drag-over'));
    });
    await step('dropping delivers the accepted files only', async () => {
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
      await waitFor(() => expect(args.onFilesSelected).toHaveBeenCalledTimes(1));
      await expect(vi(args.onFilesSelected).mock.calls[0][0].map((f: File) => f.name)).toEqual(['보고서.pdf']);
      await expect(zone).not.toHaveAttribute('data-drag-over');
      await expect(canvas.getByText('보고서.pdf')).toBeInTheDocument();
    });
    await step('remove deletes the item', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '삭제', description: '보고서.pdf' }));
      await expect(canvas.queryByText('보고서.pdf')).not.toBeInTheDocument();
    });
  },
};

/** The drop area is a button described by the helper text; the spinner is a status. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <div style={{ width: 353, display: 'grid', gap: 8 }}>
      <FileUploader helperText={FIGMA_HELPER} />
      <FileUploaderItem fileName="자료.pdf" fileInfo="업로드 중" status="uploading" />
    </div>
  ),
  play: async ({ canvas }) => {
    // The name is the visible text (title + helper), as WCAG 2.5.3 (label in name) asks.
    const zone = canvas.getByRole('button', { name: (name) => name.startsWith(FIGMA_TITLE) && name.endsWith(FIGMA_HELPER) });
    await expect(zone).toBeInTheDocument();
    await expect(canvas.getByRole('status', { name: '업로드 중' })).toBeInTheDocument();
  },
};
