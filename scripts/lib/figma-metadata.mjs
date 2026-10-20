// Parser for figma/metadata/*.xml (Figma MCP get_metadata output): node tree with names and boxes.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './figma-snapshot.mjs';

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function parseMetadata(xml) {
  const re = /<(\/?)([a-z-]+)((?:\s+[a-zA-Z]+="[^"]*")*)\s*(\/?)>/g;
  const root = { children: [] };
  const stack = [root];
  let m;
  while ((m = re.exec(xml))) {
    const [, close, tag, attrs, self] = m;
    if (close) { stack.pop(); continue; }
    const node = { tag, children: [] };
    attrs.replace(/([a-zA-Z]+)="([^"]*)"/g, (_, k, v) => { node[k] = ['x', 'y', 'width', 'height'].includes(k) ? Number(v) : unescape(v); });
    node.parent = stack[stack.length - 1];
    stack[stack.length - 1].children.push(node);
    if (!self) stack.push(node);
  }
  return root.children[0];
}

export function loadPage(file = 'page-0-1.xml') {
  return parseMetadata(readFileSync(path.join(ROOT, 'figma', 'metadata', file), 'utf8'));
}

export function findById(node, id) {
  if (node.id === id) return node;
  for (const c of node.children) { const r = findById(c, id); if (r) return r; }
  return null;
}

/**
 * Finds a component set by name (`symbol` / `frame` nodes in the metadata). Node IDs change when the Figma file is
 * copied or a new version is made; the set name is the stable key. Throws when the name is ambiguous.
 */
export function findSetByName(node, name) {
  const hits = [];
  walk(node, (x) => { if (x.name === name && x.children.length) hits.push(x); });
  if (hits.length > 1) throw new Error(`set name "${name}" is not unique in the metadata (${hits.map((h) => h.id).join(', ')})`);
  return hits[0] ?? null;
}

export const walk = (node, fn, depth = 0) => { fn(node, depth); for (const c of node.children) walk(c, fn, depth + 1); };
export const count = (node, tag) => { let n = 0; walk(node, (x) => { if (x.tag === tag) n++; }); return n - (node.tag === tag ? 1 : 0); };
