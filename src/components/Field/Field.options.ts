export const FIELD_SIZES = ['sm', 'md', 'lg'] as const;
/** Figma "Size" of the field components. */
export type FieldSize = (typeof FIELD_SIZES)[number];

export const FIELD_MESSAGE_TYPES = ['info', 'success', 'error'] as const;
/** Figma *_message "Type": Info · Success · Error. */
export type FieldMessageType = (typeof FIELD_MESSAGE_TYPES)[number];
