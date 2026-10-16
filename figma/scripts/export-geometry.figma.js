// Read-only geometry export for the Figma MCP use_figma tool. Set SET_ID (and optionally FROM/TO for
// large sets). Returns, per variant, the root size and every visible descendant up to MAX_DEPTH
// (vectors excluded) as [path, x, y, w, h, flags] relative to the variant (flags: T = text).
const SET_ID = '__SET_ID__';
const FROM = 0, TO = 9999, MAX_DEPTH = 4;
const set = await figma.getNodeByIdAsync(SET_ID);
const r = (n) => Math.round(n * 100) / 100;
const out = { set: set.name, id: set.id, variants: {} };
for (const v of set.children.filter((c) => c.type === 'COMPONENT').slice(FROM, TO)) {
  const base = v.absoluteBoundingBox;
  const nodes = [];
  const walk = (n, path, depth) => {
    if (!n.visible || depth > MAX_DEPTH) return;
    if (n !== v) {
      if (n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'ELLIPSE' || n.type === 'LINE' || n.type === 'STAR' || n.type === 'POLYGON') return;
      const b = n.absoluteBoundingBox;
      if (b) nodes.push([path, r(b.x - base.x), r(b.y - base.y), r(b.width), r(b.height), n.type === 'TEXT' ? 'T' : '']);
    }
    if ('children' in n) {
      const seen = {};
      for (const c of n.children) { seen[c.name] = (seen[c.name] || 0) + 1; walk(c, (path ? path + '/' : '') + c.name + (seen[c.name] > 1 ? '#' + seen[c.name] : ''), depth + 1); }
    }
  };
  walk(v, '', 0);
  out.variants[v.name] = { w: r(v.width), h: r(v.height), n: nodes };
}
return JSON.stringify(out);
