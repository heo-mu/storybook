/** Figma file-uploader-item "State". */
export const FILE_UPLOADER_ITEM_STATUSES = ['completed', 'uploading', 'download'] as const;
export type FileUploaderItemStatus = (typeof FILE_UPLOADER_ITEM_STATUSES)[number];
