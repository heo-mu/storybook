/**
 * Variant property values of the Figma Button frame (58:4971), normalised to lower-case.
 * These arrays are the single source of truth for the TypeScript unions, Storybook controls
 * and the variant matrices — only combinations that exist in Figma are listed.
 */

/** Figma "Variant" (button_basic, button_icon) */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary'] as const;
/** Figma "Appearance" (button_basic, button_icon) */
export const BUTTON_APPEARANCES = ['solid', 'outline'] as const;
/** Figma "Shape" (button_basic, button_icon) */
export const BUTTON_SHAPES = ['square', 'rounded'] as const;
/** Figma "Size" of button_basic */
export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
/** Figma "Size" of button_icon (no lg) */
export const ICON_BUTTON_SIZES = ['xs', 'sm', 'md'] as const;
/** Figma "Type" of button_text ("Primary", "SecondarySecondary") */
export const TEXT_BUTTON_VARIANTS = ['primary', 'secondary'] as const;
/** Figma "Size" of button_text */
export const TEXT_BUTTON_SIZES = ['sm', 'md'] as const;
/** Figma "State" — Hover/Pressed are interaction states (:hover/:active), Disabled is the `disabled` prop. */
export const BUTTON_STATES = ['default', 'hover', 'pressed', 'disabled'] as const;

/** Variant × Appearance pairs present in button_basic and button_icon (there is no Secondary/Solid). */
export const BUTTON_TONES = [
  { variant: 'primary', appearance: 'solid' },
  { variant: 'primary', appearance: 'outline' },
  { variant: 'secondary', appearance: 'outline' },
  { variant: 'tertiary', appearance: 'solid' },
  { variant: 'tertiary', appearance: 'outline' },
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonAppearance = (typeof BUTTON_APPEARANCES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number];
export type TextButtonVariant = (typeof TEXT_BUTTON_VARIANTS)[number];
export type TextButtonSize = (typeof TEXT_BUTTON_SIZES)[number];
export type ButtonState = (typeof BUTTON_STATES)[number];

/**
 * Variant/Appearance props constrained to the pairs that exist in Figma.
 * Secondary only exists as Outline, so its appearance defaults to (and can only be) "outline".
 */
export type ButtonToneProps =
  | { variant?: 'primary' | 'tertiary'; appearance?: ButtonAppearance }
  | { variant: 'secondary'; appearance?: 'outline' };

export function resolveAppearance(variant: ButtonVariant, appearance: ButtonAppearance | undefined): ButtonAppearance {
  if (variant === 'secondary') return 'outline';
  return appearance ?? 'solid';
}
