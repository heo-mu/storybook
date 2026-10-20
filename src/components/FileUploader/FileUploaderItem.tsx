import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DownloadSimpleIcon, FileTextIcon, XCircleFillIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { TextButton } from '../Button';
import { Loading } from '../Loading';
import type { FileUploaderItemStatus } from './FileUploader.options';

export type FileUploaderItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 파일 이름. 길면 말줄임표로 줄입니다. */
  fileName: ReactNode;
  /** 파일 정보(크기, 진행 상태 글자 등). */
  fileInfo?: ReactNode;
  /** 상태 — 삭제 버튼(`completed`), 업로드 중 표시(`uploading`), 다운로드 버튼(`download`). @default 'completed' */
  status?: FileUploaderItemStatus;
  /** "삭제" 버튼을 누르면 호출됩니다(`completed`일 때). */
  onRemove?: () => void;
  /** "다운로드" 버튼을 누르면 호출됩니다(`download`일 때). */
  onDownload?: () => void;
  /** 삭제 버튼 글자. @default '삭제' */
  removeLabel?: string;
  /** 다운로드 버튼 글자. @default '다운로드' */
  downloadLabel?: string;
  /** 화면 낭독기가 읽는 업로드 중 표시의 이름. @default '업로드 중' */
  uploadingLabel?: string;
};

/**
 * 업로드 목록에서 파일 하나를 보여 주는 줄입니다. 버튼은 파일 이름을 설명으로 함께 읽어 어느 파일의 버튼인지 구분됩니다.
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
