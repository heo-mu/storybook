// Read-only script for the Figma MCP `use_figma` tool (file Ry3WecA6sP6lKPop1vXrTp).
// Produces the same checksums as `npm run figma:checksum` so the snapshot in /figma can be
// verified against the live Figma file without re-exporting it.
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(vars.map((v) => [v.id, v]));
const ci = new Map(cols.map((c) => [c.id, c.name[0]]));
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, '0') : '');
const ref = (a) => (byId.get(a.id) ? ci.get(byId.get(a.id).variableCollectionId) + ':' + byId.get(a.id).name : 'ext:' + a.id);
const fmt = (val) => (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') ? '@' + ref(val) : (val && typeof val === 'object' && 'r' in val) ? hex(val) : JSON.stringify(val);
const al = (a) => (a && a.type === 'VARIABLE_ALIAS' ? ref(a) : JSON.stringify(a));
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const list = (name, pred) => { const col = cols.find((c) => c.name === name); const m = col.modes[0].modeId; return col.variableIds.map((id) => byId.get(id)).filter((v) => v && pred(v)).map((v) => [v, v.valuesByMode[m]]); };
const withScopes = (arr) => arr.map(([v, val]) => v.name + '=' + fmt(val) + ' [' + v.scopes.join(',') + ']');
const groups = {
  primColors: list('Primitive', (v) => v.resolvedType === 'COLOR').map(([v, val]) => v.name + '=' + fmt(val)),
  primScalars: withScopes(list('Primitive', (v) => v.resolvedType !== 'COLOR')),
  theme: withScopes(list('Theme', () => true)),
  semantic: withScopes(list('Semantic', () => true)),
  compButton: withScopes(list('Component', (v) => /^colors\/button/.test(v.name))),
  compOthers: withScopes(list('Component', (v) => !/^colors\/button/.test(v.name))),
};
groups.text = (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s.fontName.family + '/' + s.fontName.style, s.fontSize, s.lineHeight.unit === 'AUTO' ? 'AUTO' : s.lineHeight.value + (s.lineHeight.unit === 'PIXELS' ? 'px' : '%'), s.letterSpacing.value + (s.letterSpacing.unit === 'PIXELS' ? 'px' : '%'), s.textDecoration, s.textCase, Object.entries(s.boundVariables || {}).map(([k, a]) => k + ':' + al(a)).join(' ')].join(' | '));
groups.effect = (await figma.getLocalEffectStylesAsync()).map((s) => s.name + ' :: ' + s.effects.map((e) => [e.type, e.color ? hex(e.color) : '', e.offset ? e.offset.x + ',' + e.offset.y : '', 'r' + e.radius, 'sp' + (e.spread ?? ''), e.visible ? '' : 'HIDDEN', e.blendMode, Object.entries(e.boundVariables || {}).map(([k, a]) => k + ':' + al(a)).join(' ')].join(' ')).join(' ;; '));
return Object.entries(groups).map(([k, lines]) => { const c = lines.map((l) => l.trimEnd()).sort(); return k + ' ' + c.length + ' ' + fnv(c.join('\n')); }).join('\n');
