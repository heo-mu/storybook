import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { XIcon } from '../../icons';
import { cx } from '../../utils/cx';

export type ImageUploadPreviewProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** 보여 줄 이미지 주소(예: 고른 파일의 object URL). */
  src: string;
  /** 이미지 대체 글자. */
  alt: string;
  /** 삭제 버튼을 누르면 호출됩니다. 넘기지 않으면 삭제 버튼이 없습니다. */
  onRemove?: () => void;
  /** 화면 낭독기가 읽는 삭제 버튼 이름. @default '이미지 삭제' */
  removeLabel?: string;
};

/**
 * 업로드한 이미지를 정사각형 미리보기로 보여 줍니다. 오른쪽 위 모서리에 둥근 삭제 버튼이 붙습니다.
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
