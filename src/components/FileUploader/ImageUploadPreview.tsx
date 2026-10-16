import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { XIcon } from '../../icons';
import { cx } from '../../utils/cx';

export type ImageUploadPreviewProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Image to show (e.g. an object URL of the chosen file). */
  src: string;
  /** Text alternative of the image. */
  alt: string;
  /** Called by the remove button; without it there is no button. */
  onRemove?: () => void;
  /** Accessible name of the remove button. @default '이미지 삭제' */
  removeLabel?: string;
};

/**
 * The uploaded image of the Figma key-value File Upload cell (`table_value_editable`, 503:23264): a 100px square with
 * a round remove button (18px, padding p-0_5, colors/fill/secondary/subtle/default, 1px colors/border/gray-subtler,
 * X 12px colors/icon/secondary) centred on its top-right corner.
 */
export const ImageUploadPreview = forwardRef<HTMLDivElement, ImageUploadPreviewProps>(function ImageUploadPreview(
  { src, alt, onRemove, removeLabel = '이미지 삭제', className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('ds-image-preview', className)}>
      <img className="ds-image-preview__image" src={src} alt={alt} />
      {onRemove && (
        <button type="button" className="ds-image-preview__remove" aria-label={removeLabel} onClick={onRemove}>
          <XIcon />
        </button>
      )}
    </div>
  );
});
