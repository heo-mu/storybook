// Read-only analysis of one component set for the Figma MCP use_figma tool.
// Set SET_ID (and optionally REP_INDEX) at the top. Returns the representative variant's full layer
// tree and, for every other variant, only the facets that differ from it.
const SET_ID = '__SET_ID__';
const REP_INDEX = 0;
const vars = await figma.variables.getLocalVariablesAsync();
const vName = new Map(vars.map((v) => [v.id, v.name]));
const vn = (a) => (a ? vName.get(a.id) || 'ext:' + a.id : '');
const short = (n) => n.replace(/^colors\//, '').replace(/^spacing\/padding\//, '').replace(/^border-radius\//, '').replace(/^border-width\//, '');
const hex = (c, o = 1) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (o < 1 ? Math.round(o * 255).toString(16).padStart(2, '0') : '');
const paints = (ps) => (ps === figma.mixed ? 'MIXED' : (ps || []).filter((p) => p.visible !== false).map((p) => (p.type === 'SOLID' ? hex(p.color, p.opacity) + (p.boundVariables?.color ? '{' + short(vn(p.boundVariables.color)) + '}' : '') : p.type)).join('+'));
const r1 = (n) => Math.round(n * 100) / 100;
const styleCache = new Map();
const styleName = async (id) => { if (!id || id === figma.mixed) return id === figma.mixed ? 'MIXED' : ''; if (!styleCache.has(id)) { const s = await figma.getStyleByIdAsync(id); styleCache.set(id, s ? s.name : '?'); } return styleCache.get(id); };
const bvList = (n) => Object.entries(n.boundVariables || {}).filter(([k]) => !['fills', 'strokes', 'componentProperties', 'characters'].includes(k)).map(([k, a]) => k.replace(/(top|bottom)(Left|Right)Radius/, 'r').replace(/stroke(\w+)Weight/, 'sw').replace(/padding(\w+)/, 'p$1') + ':' + short(Array.isArray(a) ? a.map(vn).join(',') : vn(a)));
async function facets(n, path, out) {
  const f = {};
  f.geo = `${r1(n.width)}x${r1(n.height)}@${r1(n.x)},${r1(n.y)}${n.visible ? '' : ' HIDDEN'}`;
  if ('layoutMode' in n && n.layoutMode !== 'NONE') f.layout = `${n.layoutMode} p${n.paddingTop},${n.paddingRight},${n.paddingBottom},${n.paddingLeft} gap${n.itemSpacing} ${n.primaryAxisAlignItems}/${n.counterAxisAlignItems} sz:${n.primaryAxisSizingMode}/${n.counterAxisSizingMode}`;
  if ('layoutSizingHorizontal' in n && n.parent && n.parent.type !== 'COMPONENT_SET') f.sizing = `${n.layoutSizingHorizontal}/${n.layoutSizingVertical}${n.layoutPositioning === 'ABSOLUTE' ? ' ABS' : ''}`;
  if ('cornerRadius' in n && n.cornerRadius !== 0) f.radius = n.cornerRadius === figma.mixed ? [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].join(',') : String(n.cornerRadius);
  if ('fills' in n) { const p = paints(n.fills); if (p) f.fill = p; }
  if ('strokes' in n && n.strokes.length) f.stroke = `${paints(n.strokes)} w${n.strokeWeight === figma.mixed ? [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight].join(',') : n.strokeWeight} ${n.strokeAlign}${n.dashPattern && n.dashPattern.length ? ' dash' + n.dashPattern.join(',') : ''}`;
  if ('effects' in n && n.effects.length) f.fx = n.effects.filter((e) => e.visible).map((e) => `${e.type} ${e.color ? hex(e.color, e.color.a) : ''} ${e.offset ? e.offset.x + ',' + e.offset.y : ''} r${e.radius} s${e.spread ?? ''}`).join(';') + ((await (async () => n.effectStyleId ? ' style:' + (await styleName(n.effectStyleId)) : '')()));
  if ('opacity' in n && n.opacity !== 1) f.opacity = String(n.opacity);
  if (n.type === 'TEXT') {
    f.text = `${n.fontName === figma.mixed ? 'MIXED' : n.fontName.family + '/' + n.fontName.style} ${String(n.fontSize)} lh${n.lineHeight === figma.mixed ? 'M' : n.lineHeight.unit === 'AUTO' ? 'auto' : n.lineHeight.value + n.lineHeight.unit[0]} ls${n.letterSpacing === figma.mixed ? 'M' : n.letterSpacing.value + n.letterSpacing.unit[0]} ts:${await styleName(n.textStyleId)} ${n.textAlignHorizontal}/${n.textAlignVertical} auto:${n.textAutoResize}${n.textTruncation && n.textTruncation !== 'DISABLED' ? ' trunc' : ''}${n.textDecoration && n.textDecoration !== 'NONE' ? ' ' + n.textDecoration : ''}`;
    f.chars = JSON.stringify(n.characters.slice(0, 40));
  }
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); f.main = mc ? (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name + '/' : '') + mc.name : '?'; }
  const b = bvList(n); if (b.length) f.bv = b.join(' ');
  for (const [k, v] of Object.entries(f)) out[path + '|' + k] = v;
  if ('children' in n && n.type !== 'INSTANCE') {
    const seen = {};
    for (const c of n.children) { const key = c.name; seen[key] = (seen[key] || 0) + 1; await facets(c, path + '/' + key + (seen[key] > 1 ? '#' + seen[key] : ''), out); }
  } else if (n.type === 'INSTANCE') {
    // one level into instances (icons, nested components) for paint/geometry only
    for (const c of n.children) { const sub = {}; await facets(c, path + '/' + c.name, sub); for (const [k, v] of Object.entries(sub)) if (/\|(geo|fill|stroke|text|chars|main)$/.test(k) && k.split('/').length <= path.split('/').length + 2) out[k] = v; }
  }
}
const set = await figma.getNodeByIdAsync(SET_ID);
const comps = set.children.filter((c) => c.type === 'COMPONENT');
const flat = [];
for (const c of comps) { const o = {}; await facets(c, '', o); flat.push({ name: c.name, vp: c.variantProperties || {}, o }); }
const rep = flat[REP_INDEX];
const lines = [`SET ${set.name} (${comps.length}) rep="${rep.name}"`];
for (const [k, v] of Object.entries(rep.o)) lines.push(`  ${k || '(root)'} = ${v}`);
const diff = (a, b) => { const keys = new Set([...Object.keys(a), ...Object.keys(b)]); const d = {}; for (const k of keys) if (a[k] !== b[k]) d[k] = b[k] ?? '∅'; return d; };
// Effect of each single property value (others held at the representative's values).
const deltas = {};
for (const [prop, repVal] of Object.entries(rep.vp)) {
  for (const v of flat) {
    if (v.vp[prop] === repVal) continue;
    if (!Object.entries(rep.vp).every(([p, x]) => p === prop || v.vp[p] === x)) continue;
    deltas[prop + '=' + v.vp[prop]] = diff(rep.o, v.o);
  }
}
for (const [k, d] of Object.entries(deltas)) lines.push(`- ${k}: ${Object.entries(d).map(([p, x]) => p + '=' + x).join(' ; ') || '(same)'}`);
// Variants that are not explained by summing the single-property effects.
const odd = [];
for (const v of flat) {
  if (v === rep) continue;
  const predicted = { ...rep.o };
  for (const [prop, val] of Object.entries(v.vp)) { const d = deltas[prop + '=' + val]; if (d) for (const [k, x] of Object.entries(d)) { if (x === '∅') delete predicted[k]; else predicted[k] = x; } }
  const r = diff(predicted, v.o);
  if (Object.keys(r).length) odd.push(`  ~ ${Object.values(v.vp).join('/')}: ${Object.entries(r).map(([p, x]) => p + '=' + x).join(' ; ')}`);
}
lines.push(`interaction residuals: ${odd.length}`);
return [...lines, ...odd].join('\n').slice(0, 20000);
