// Parsers for the Figma snapshot files in /figma (exported read-only via Figma MCP).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const figmaPath = (...p) => path.join(ROOT, 'figma', ...p);

const LINE = /^(.+?)=(.*?)(?: \[([A-Z_,]+)\])?$/;

/** Reads a variables snapshot. Returns [{ collection, name, raw, scopes }] in Figma order. */
export function readVariables(file, collection) {
  const out = [];
  let prefix = '';
  let defaultScopes = '';
  for (const line of readFileSync(figmaPath('variables', file), 'utf8').split(/\r?\n/)) {
    if (line.startsWith('#prefix')) { prefix = line.slice('#prefix'.length).trim(); continue; }
    if (line.startsWith('#scopes')) { defaultScopes = line.slice('#scopes'.length).trim(); continue; }
    if (!line || line.startsWith('#')) continue;
    const m = LINE.exec(line);
    if (!m) throw new Error(`Unparseable line in ${file}: ${line}`);
    out.push({ collection, name: prefix + m[1], raw: m[2], scopes: m[3] ?? defaultScopes, explicitScopes: m[3] !== undefined });
  }
  return out;
}

export function readAllVariables() {
  return [
    ...readVariables('primitive-colors.txt', 'Primitive'),
    ...readVariables('primitive-scalars.txt', 'Primitive'),
    ...readVariables('theme.txt', 'Theme'),
    ...readVariables('semantic.txt', 'Semantic'),
    ...readVariables('component-button.txt', 'Component'),
    ...readVariables('component-others.txt', 'Component'),
  ];
}

/** Raw data lines (comments removed) of a styles snapshot. */
export function readStyleLines(file) {
  return readFileSync(figmaPath('styles', file), 'utf8').split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l && !l.startsWith('#'));
}

export function readTextStyles() {
  return readStyleLines('text-styles.txt').map((line) => {
    const [name, font, size, lineHeight, letterSpacing, decoration, textCase, bound] = (line.endsWith(' |') ? `${line} ` : line).split(' | ');
    const [family, style] = font.split('/');
    const boundVariables = {};
    for (const pair of (bound ?? '').trim().split(' ').filter(Boolean)) {
      const [field, ...rest] = pair.split(':');
      const ref = rest.join(':');
      boundVariables[field] = ref.startsWith('ext:') ? { external: ref.slice(4) } : { collection: { P: 'Primitive', T: 'Theme', S: 'Semantic', C: 'Component' }[ref[0]], name: ref.slice(2) };
    }
    return { name, family, style, fontSize: Number(size), lineHeight, letterSpacing, decoration, textCase, boundVariables };
  });
}

export function readEffectStyles() {
  return readStyleLines('effect-styles.txt').map((line) => {
    const [name, effects] = line.split(' :: ');
    return {
      name,
      effects: effects.split(' ;; ').map((e) => {
        const m = /^(\w+) (#[0-9a-f]+) (-?[\d.]+),(-?[\d.]+) r(-?[\d.]+) sp(-?[\d.]*) (HIDDEN)? ?(\w+)/.exec(e.trim());
        if (!m) throw new Error(`Unparseable effect: ${e}`);
        return { type: m[1], color: m[2], x: Number(m[3]), y: Number(m[4]), blur: Number(m[5]), spread: Number(m[6] || 0), visible: !m[7], blendMode: m[8] };
      }),
    };
  });
}

/** FNV-1a 32-bit over UTF-16 code units — mirrored in the Figma-side checksum script. */
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
