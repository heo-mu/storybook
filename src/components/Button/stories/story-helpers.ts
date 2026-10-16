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
