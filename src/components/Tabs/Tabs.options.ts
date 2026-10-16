/** Figma set: `tab_filled` → 'filled', `tab_line` → 'line'. */
export const TABS_APPEARANCES = ['line', 'filled'] as const;
export type TabsAppearance = (typeof TABS_APPEARANCES)[number];
/** Figma tab "Variant". */
export const TABS_VARIANTS = ['primary', 'secondary'] as const;
export type TabsVariant = (typeof TABS_VARIANTS)[number];
/** Figma tab "Size". */
export const TABS_SIZES = ['sm', 'md', 'lg'] as const;
export type TabsSize = (typeof TABS_SIZES)[number];
/** Figma tab_filled "Shape". */
export const TABS_SHAPES = ['square', 'rounded'] as const;
export type TabsShape = (typeof TABS_SHAPES)[number];
