// Prints checksums of the /figma snapshot files so they can be compared with the same
// checksums computed inside Figma (see figma/README.md → "Verifying the snapshot").
import { readVariables, readStyleLines, fnv1a } from './lib/figma-snapshot.mjs';

const canon = (vars, withScopes) => vars.map((v) => `${v.name}=${v.raw}${withScopes ? ` [${v.scopes}]` : ''}`);
const groups = {
  primColors: canon(readVariables('primitive-colors.txt', 'Primitive'), false),
  primScalars: canon(readVariables('primitive-scalars.txt', 'Primitive'), true),
  theme: canon(readVariables('theme.txt', 'Theme'), true),
  semantic: canon(readVariables('semantic.txt', 'Semantic'), true),
  compButton: canon(readVariables('component-button.txt', 'Component'), true),
  compOthers: canon(readVariables('component-others.txt', 'Component'), true),
  text: readStyleLines('text-styles.txt'),
  effect: readStyleLines('effect-styles.txt'),
};
// Lines are trimmed and sorted: Figma's variable order is not stable between reads, and
// trailing whitespace is not significant.
const out = Object.fromEntries(Object.entries(groups).map(([k, lines]) => {
  const canonical = lines.map((l) => l.trimEnd()).sort();
  return [k, { n: canonical.length, h: fnv1a(canonical.join('\n')) }];
}));
console.log(JSON.stringify(out, null, 1));
