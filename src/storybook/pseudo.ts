/*
 * Forcing Figma interaction states in stories with storybook-addon-pseudo-states: the addon rewrites
 * :hover / :active / :focus-within rules so that they also match these classes. Components accept
 * `className` on their root element, so a matrix cell can be put into a state without a real pointer.
 */
export const PSEUDO = {
  hover: 'pseudo-hover',
  pressed: 'pseudo-active',
  focus: 'pseudo-focus-within',
  focusVisible: 'pseudo-focus-visible',
} as const;

/** Story parameters that enable the stylesheet rewriting for every pseudo class used above. */
export const PSEUDO_STORY_PARAMETERS = {
  pseudo: { hover: [], active: [], focusWithin: [], focusVisible: [] },
};

export const figmaCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
