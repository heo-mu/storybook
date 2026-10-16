// Canonical snapshot lines per checksum group (shared by snapshot-checksum and snapshot-diff tooling).
import { readVariables } from './figma-snapshot.mjs';

const canon = (vars, withScopes) => vars.map((v) => `${v.name}=${v.raw}${withScopes ? ` [${v.scopes}]` : ''}`.trimEnd());

export function snapshotGroups() {
  return {
    primScalars: canon(readVariables('primitive-scalars.txt', 'Primitive'), true),
    semantic: canon(readVariables('semantic.txt', 'Semantic'), true),
    compButton: canon(readVariables('component-button.txt', 'Component'), true),
    compOthers: canon(readVariables('component-others.txt', 'Component'), true),
  };
}
