import { forwardRef, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import { UploadSimpleIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useMergedRef } from '../Field';

export type FileUploaderProps = {
  /** 제목. @default '파일을 끌어다 놓거나 선택하세요' */
  title?: ReactNode;
  /** 제목 아래 안내 문구(허용 형식 · 크기 제한 등). */
  helperText?: ReactNode;
  /** 업로드 아이콘 표시 여부. @default true */
  showIcon?: boolean;
  /** 받을 파일 형식(예: '.pdf,image/*'). 끌어다 놓은 파일에도 똑같이 적용됩니다. */
  accept?: string;
  /** 여러 파일을 한 번에 받을지 여부. @default false */
  multiple?: boolean;
  /** 비활성 — 누를 수 없고 파일을 놓아도 받지 않습니다. */
  disabled?: boolean;
  /** 선택 창에서 고르거나 끌어다 놓은 파일로 호출됩니다. */
  onFilesSelected?: (files: File[]) => void;
  /** 폼으로 파일을 보낼 때 쓰는 필드 이름. */
  name?: string;
  id?: string;
  /** 업로드 영역의 클래스 이름. */
  className?: string;
  /** 업로드 영역의 스타일(예: 너비). */
  style?: CSSProperties;
};

/** `accept` matching for dropped files: extensions (.pdf), exact types (image/png) and wildcards (image/*). */
function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a));
}

/** 드래그 앤 드롭 또는 파일 선택 창으로 파일을 받습니다. 선택한 파일은 FileUploaderItem으로 표시합니다. */
export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(function FileUploader(
  { title = '파일을 끌어다 놓거나 선택하세요', helperText, showIcon = true, accept, multiple = false, disabled = false, onFilesSelected, name, id, className, style },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const [dragDepth, setDragDepth] = useState(0);

  const deliver = (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => matchesAccept(f, accept));
    const picked = multiple ? files : files.slice(0, 1);
    if (picked.length) onFilesSelected?.(picked);
  };

  const onDrag = (event: DragEvent<HTMLButtonElement>, delta: number) => {
    if (disabled || !event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    if (delta) setDragDepth((d) => Math.max(0, d + delta));
  };
  // Figma State=Disabled: the area takes nothing. The disabled button ignores the pointer (CSS), so a drag lands on
  // this root, which refuses the drop (cursor "not allowed", no file delivered) instead of letting the browser open the file.
  const refuseWhenDisabled = (event: DragEvent<HTMLDivElement>) => {
    if (!disabled) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  };

  return (
    <div className="ds-file-uploader__root" data-disabled={disabled || undefined} onDragEnter={refuseWhenDisabled} onDragOver={refuseWhenDisabled} onDrop={refuseWhenDisabled}>
      <button
        type="button"
        id={id}
        className={cx('ds-file-uploader', className)}
        style={style}
        disabled={disabled}
        data-drag-over={dragDepth > 0 || undefined}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => onDrag(e, 1)}
        onDragOver={(e) => onDrag(e, 0)}
        onDragLeave={(e) => onDrag(e, -1)}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragDepth(0);
          deliver(event.dataTransfer.files);
        }}
      >
        {/* Figma 1px INSIDE dashed stroke (dash 6, gap 4) — drawn in SVG so the dash pattern matches. */}
        <svg className="ds-file-uploader__border" aria-hidden="true">
          <rect />
        </svg>
        {showIcon && <UploadSimpleIcon className="ds-file-uploader__icon" />}
        <span className="ds-file-uploader__text">
          <span className="ds-file-uploader__title">
            {title}
          </span>
          {helperText != null && helperText !== false && (
            <span className="ds-file-uploader__helper">
              {helperText}
            </span>
          )}
        </span>
      </button>
      <input
        ref={mergedRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        tabIndex={-1}
        onChange={(event) => deliver(event.target.files)}
      />
    </div>
  );
});
