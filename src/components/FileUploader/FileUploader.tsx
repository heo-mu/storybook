import { forwardRef, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import { UploadSimpleIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useMergedRef } from '../Field';

export type FileUploaderProps = {
  /** Figma "Title Text". @default '파일을 끌어다 놓거나 선택하세요' */
  title?: ReactNode;
  /** Figma "Helper Text" (allowed types, size limits …). */
  helperText?: ReactNode;
  /** Figma "Show Icon". @default true */
  showIcon?: boolean;
  /** Accepted file types, as for `<input type="file" accept>` (e.g. '.pdf,image/*'). Dropped files are filtered too. */
  accept?: string;
  /** Allows several files. @default false */
  multiple?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Called with the files chosen in the dialog or dropped on the area. */
  onFilesSelected?: (files: File[]) => void;
  /** Form field name of the underlying file input. */
  name?: string;
  id?: string;
  /** Class name of the drop area. */
  className?: string;
  /** Style of the drop area (e.g. its width — Figma 353px). */
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

/**
 * Figma component set `file-uploader` (651:3945): a drop area that also opens the file dialog.
 * State: Hover / Pressed = :hover / :active, Drag-over = files dragged over it, Disabled = `disabled`.
 * The area is a `<button>` (Enter / Space open the dialog); a hidden `<input type="file">` holds the
 * selection for forms.
 */
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

  return (
    <>
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
    </>
  );
});
