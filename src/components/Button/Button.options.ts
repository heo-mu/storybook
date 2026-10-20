/**
 * Button 계열의 속성 값 목록(소문자). TypeScript 타입 · Storybook 컨트롤 · 변형 매트릭스가 모두 이 배열을 씁니다.
 * Figma에 있는 조합만 담습니다.
 */

/** Button · IconButton 종류 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary'] as const;
/** Button · IconButton 모양 */
export const BUTTON_APPEARANCES = ['solid', 'outline'] as const;
/** Button · IconButton 모서리 모양 */
export const BUTTON_SHAPES = ['square', 'rounded'] as const;
/** Button 크기 */
export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
/** IconButton 크기(lg 없음) */
export const ICON_BUTTON_SIZES = ['xs', 'sm', 'md'] as const;
/** TextButton 종류 */
export const TEXT_BUTTON_VARIANTS = ['primary', 'secondary'] as const;
/** TextButton 크기 */
export const TEXT_BUTTON_SIZES = ['sm', 'md'] as const;
/**
 * Figma "State" — Hover/Pressed are interaction states (:hover/:active), Disabled is the `disabled` prop.
 * @internal Stories and parity checks only — not a prop (docs/public-api.md).
 */
export const BUTTON_STATES = ['default', 'hover', 'pressed', 'disabled'] as const;

/**
 * Variant × Appearance pairs present in button_basic and button_icon — all six since the Figma sync of 2026-10-19
 * (Secondary / Solid added in Figma; docs/analysis/F31-button-sync.md).
 * @internal Stories and parity checks only — use BUTTON_VARIANTS / BUTTON_APPEARANCES (docs/public-api.md).
 */
export const BUTTON_TONES = [
  { variant: 'primary', appearance: 'solid' },
  { variant: 'primary', appearance: 'outline' },
  { variant: 'secondary', appearance: 'solid' },
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
 * Variant/Appearance props — every pair exists in Figma (Secondary / Solid since 2026-10-19).
 * Without `appearance`, Secondary stays Outline (its only appearance before) and the others are Solid.
 * @internal Building block of ButtonProps / IconButtonProps — use those.
 */
export type ButtonToneProps = {
  /** 종류 — 행동의 중요도. @default 'primary' */
  variant?: ButtonVariant;
  /** 모양 — 채움(solid) · 테두리(outline). @default 'solid' (secondary는 'outline') */
  appearance?: ButtonAppearance;
};

/**
 * Figma "State": Hover/Pressed are the native :hover/:active states, Disabled is this prop.
 * @internal Building block of the button props types — use ButtonProps / IconButtonProps / TextButtonProps.
 */
export type ButtonDisabledProp = {
  /** 비활성 — 누를 수 없고 키보드로도 선택되지 않습니다. */
  disabled?: boolean;
};

/**
 * The appearance a button renders with: the given one, else Outline for Secondary (backward compatible) and Solid otherwise.
 * @internal Used by Button and IconButton.
 */
export function resolveAppearance(variant: ButtonVariant, appearance: ButtonAppearance | undefined): ButtonAppearance {
  return appearance ?? (variant === 'secondary' ? 'outline' : 'solid');
}
