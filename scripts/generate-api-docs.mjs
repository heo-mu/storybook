// Generates docs/api.md — the public API of the package (everything exported from src/index.ts):
// components with their props (react-docgen-typescript, same options as Storybook), option constants,
// types, functions and icons.
//
//   npm run docs:api
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import docgen from 'react-docgen-typescript';
import { ROOT } from './lib/figma-snapshot.mjs';

const entry = path.join(ROOT, 'src', 'index.ts');
const tsconfig = path.join(ROOT, 'tsconfig.app.json');
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

// 1. Exports of the entry point and where each is declared.
const program = ts.createProgram([entry], { ...ts.parseJsonConfigFileContent(ts.readConfigFile(tsconfig, ts.sys.readFile).config, ts.sys, ROOT).options, noEmit: true });
const checker = program.getTypeChecker();
const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(entry));
const exportsList = checker.getExportsOfModule(moduleSymbol).map((sym) => {
  const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
  const decl = target.declarations?.[0];
  const file = decl ? rel(decl.getSourceFile().fileName) : '';
  let kind = 'value';
  if (target.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) kind = 'type';
  else if (target.flags & ts.SymbolFlags.Function) kind = 'function';
  else if (decl && ts.isVariableDeclaration(decl) && decl.initializer && /as const/.test(decl.initializer.getText())) kind = 'constant';
  return { name: sym.getName(), kind, file };
});

// 2. Component props.
const parser = docgen.withCustomConfig(tsconfig, {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
  savePropValueAsString: true,
});
const componentFiles = [...new Set(exportsList.filter((e) => /^src\/components\/.*\.tsx$/.test(e.file) && !/\/stories\//.test(e.file)).map((e) => path.join(ROOT, e.file)))];
const docs = new Map(parser.parse(componentFiles).map((d) => [d.displayName, d]));

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
const typeText = (p) => {
  const t = p.type?.raw && p.type.raw.length < 160 ? p.type.raw : p.type?.name ?? '';
  return t === 'enum' && p.type.value ? p.type.value.map((v) => v.value).join(' | ') : t;
};

// 3. Group by module (src/components/<Name>), then write.
const groups = new Map();
for (const e of exportsList) {
  const m = e.file.match(/^src\/components\/([^/]+)\//);
  const key = m ? m[1] : e.file.startsWith('src/icons/') ? '(icons)' : '(other)';
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(e);
}

const out = [];
out.push('# Public API', '');
out.push('`platform-design-system`이 export 하는 전부입니다. **자동 생성 문서** — `npm run docs:api`로 다시 만듭니다(직접 수정하지 마세요).', '');
out.push('- Props 표는 각 컴포넌트가 직접 정의한 Prop만 보여 줍니다. 그 밖의 HTML 속성(`className`, `style`, `aria-*`, 이벤트 등)과');
out.push('  react-aria-components 기반 컴포넌트의 react-aria Prop(`onPress` 등)은 그대로 전달됩니다(각 Usage 문서 참고).');
out.push('- 모든 컴포넌트는 `ref`를 실제 DOM 요소로 전달합니다(`forwardRef`).', '');
const componentGroups = [...groups.keys()].filter((k) => !k.startsWith('(')).sort();
out.push('## 목차', '', componentGroups.map((k) => `[${k}](#${k.toLowerCase()})`).join(' · ') + ' · [아이콘](#아이콘) · [기타](#기타)', '');

for (const key of componentGroups) {
  const items = groups.get(key);
  out.push(`## ${key}`, '');
  const comps = items.filter((e) => docs.has(e.name));
  for (const c of comps) {
    const d = docs.get(c.name);
    out.push(`### \`${c.name}\``, '');
    if (d.description) out.push(esc(d.description), '');
    const props = Object.values(d.props).sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    if (props.length) {
      out.push('| Prop | Type | Default | 설명 |', '| --- | --- | --- | --- |');
      for (const p of props) out.push(`| \`${p.name}\`${p.required ? ' *(필수)*' : ''} | \`${esc(typeText(p))}\` | ${p.defaultValue?.value != null ? '`' + esc(p.defaultValue.value) + '`' : ''} | ${esc(p.description)} |`);
      out.push('');
    }
  }
  const rest = items.filter((e) => !docs.has(e.name));
  const byKind = (k) => rest.filter((e) => e.kind === k).map((e) => '`' + e.name + '`');
  const lines = [['상수', byKind('constant')], ['함수', byKind('function')], ['타입', byKind('type')], ['기타 값', byKind('value')]].filter(([, l]) => l.length);
  if (lines.length) {
    for (const [label, l] of lines) out.push(`- ${label}: ${l.join(', ')}`);
    out.push('');
  }
}
const icons = (groups.get('(icons)') ?? []).filter((e) => e.kind !== 'type').map((e) => '`' + e.name + '`');
out.push('## 아이콘', '', 'Figma 아이콘 벡터(16 또는 32 그리드). Prop: `size`(기본 viewBox 크기) + SVG 속성. 색은 `currentColor`.', '', icons.join(', '), '');
const other = [...(groups.get('(other)') ?? []), ...(groups.get('(icons)') ?? []).filter((e) => e.kind === 'type')];
out.push('## 기타', '', other.map((e) => `- \`${e.name}\` (${e.kind}, \`${e.file}\`)`).join('\n'), '');

writeFileSync(path.join(ROOT, 'docs', 'api.md'), out.join('\n'));
console.log(`docs/api.md: ${exportsList.length} exports, ${docs.size} components documented`);
