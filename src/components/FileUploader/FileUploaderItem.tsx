import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DownloadSimpleIcon, FileTextIcon, XCircleFillIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { TextButton } from '../Button';
import { Loading } from '../Loading';
import type { FileUploaderItemStatus } from './FileUploader.options';

export type FileUploaderItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Figma "File Name". */
  fileName: ReactNode;
  /** Figma "File Info" (size, status text …). */
  fileInfo?: ReactNode;
  /** Figma State: Completed (remove button), uploading (spinner), download (download button). @default 'completed' */
  status?: FileUploaderItemStatus;
  /** Called by the "삭제" button (status 'completed'). */
  onRemove?: () => void;
  /** Called by the "다운로드" button (status 'download'). */
  onDownload?: () => void;
  /** @default '삭제' */
  removeLabel?: string;
  /** @default '다운로드' */
  downloadLabel?: string;
  /** Accessible name of the spinner. @default '업로드 중' */
  uploadingLabel?: string;
};

/**
 * Figma component set `file-uploader-item` (651:3999): one file in an upload list. The actions are the
 * TextButton (button_text Primary sm) with the file name as their description.
 */
export const FileUploaderItem = forwardRef<HTMLDivElement, FileUploaderItemProps>(function FileUploaderItem(
  {
    fileName,
    fileInfo,
    status = 'completed',
    onRemove,
    onDownload,
    removeLabel = '삭제',
    downloadLabel = '다운로드',
    uploadingLabel = '업로드 중',
    className,
    ...rest
  },
  ref,
) {
  const nameId = `${useId()}-name`;
  return (
    <div {...rest} ref={ref} className={cx('ds-file-item', className)} data-status={status} aria-busy={status === 'uploading' || undefined}>
      <FileTextIcon className="ds-file-item__icon" />
      <div className="ds-file-item__info">
        <span className="ds-file-item__name" id={nameId}>
          {fileName}
        </span>
        {fileInfo != null && fileInfo !== false && <span className="ds-file-item__meta">{fileInfo}</span>}
      </div>
      {status === 'completed' && (
        <TextButton className="ds-file-item__action" rightIcon={<XCircleFillIcon />} aria-describedby={nameId} onClick={onRemove}>
          {removeLabel}
        </TextButton>
      )}
      {status === 'download' && (
        <TextButton
          className="ds-file-item__action ds-file-item__download"
          rightIcon={<DownloadSimpleIcon />}
          aria-describedby={nameId}
          onClick={onDownload}
        >
          {downloadLabel}
        </TextButton>
      )}
      {status === 'uploading' && <Loading size="sm" className="ds-file-item__spinner" aria-label={uploadingLabel} />}
    </div>
  );
});
