import type { ButtonState } from '../Button.options';

/** Figma variant-property value casing ("primary" → "Primary"). */
export const figmaCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Props that put a button into a Figma "State" inside a story.
 * Hover/Pressed are forced through storybook-addon-pseudo-states (see PSEUDO_PARAMETERS);
 * the component itself only has `disabled`.
 */
export function stateProps(state: ButtonState) {
  if (state === 'disabled') return { disabled: true };
  if (state === 'default') return {};
  return { 'data-pseudo': state };
}

export const PSEUDO_PARAMETERS = {
  pseudo: { hover: ['[data-pseudo="hover"]'], active: ['[data-pseudo="pressed"]'] },
};

/** Figma "Type" value names of button_text (the second one is literally "SecondarySecondary" in Ver 0.4). */
export const FIGMA_TEXT_BUTTON_TYPE = { primary: 'Primary', secondary: 'SecondarySecondary' } as const;
