/** "name: a, b, c 외 2" — the applied (or, while open, chosen) values after the filter name. */
export function filterChipText(label: string, names: string[], maxDisplayed = 3) {
  if (!names.length) return label;
  const shown = names.slice(0, Math.max(1, maxDisplayed)).join(', ');
  const rest = names.length - Math.max(1, maxDisplayed);
  return `${label}: ${shown}${rest > 0 ? ` 외 ${rest}` : ''}`;
}
