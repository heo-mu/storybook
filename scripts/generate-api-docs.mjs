// Generates the API documentation from everything exported by src/index.ts:
//   docs/api.md        — every export: components with their props (react-docgen-typescript, same options as
//                        Storybook), option constants, types, functions and icons, each labelled with its category
//   docs/public-api.md — the handover list for app developers: public components, auxiliary components and the
//                        internal API that must not be used
// The classification below is the single source of truth. A component export that is not classified makes the
// script fail, so a new export always gets an explicit decision.
//
//   npm run docs:api
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import docgen from 'react-docgen-typescript';
import { ROOT } from './lib/figma-snapshot.mjs';

// ── Classification ────────────────────────────────────────────────────────────────────────────────────────────
/** Public components — placed directly in apps. Value: what it is for (Korean, for the handover list). */
const PUBLIC = {
  Button: '기본 버튼 — Primary · Secondary · Tertiary × Solid · Outline',
  IconButton: '아이콘만 있는 버튼(`aria-label` 필수)',
  TextButton: '배경 없는 텍스트 버튼',
  Input: '한 줄 입력',
  Textarea: '여러 줄 입력',
  SearchField: '검색 입력',
  Checkbox: '체크박스(단독 또는 `CheckboxGroup` 안)',
  CheckboxGroup: '체크박스 묶음(라벨 · 방향 · 크기)',
  RadioGroup: '라디오 묶음',
  Switch: '켜기 · 끄기',
  Select: '목록에서 하나 선택',
  Slider: '범위 값 선택',
  SegmentedControl: '세그먼트 선택',
  Chip: '선택 칩',
  InputChip: '지울 수 있는 입력값 칩',
  FilterChip: '필터 칩(메뉴 · 패널을 여는 트리거)',
  Calendar: '달력(화면에 펼쳐 둔 형태)',
  DatePicker: '날짜 입력 + 달력',
  Loading: '로딩 표시',
  FileUploader: '파일 업로드 영역',
  Link: '텍스트 링크',
  Tabs: '탭',
  Pagination: '페이지 이동',
  DropdownMenu: '동작 메뉴',
  Breadcrumb: '현재 위치 경로(`items`)',
  Navigation: '좌측 메뉴(LNB)',
  Stepper: '단계 진행 표시(`steps`)',
  Badge: '상태 배지',
  BadgeDot: '점 배지(새 항목 표시 등)',
  BadgeCount: '숫자 배지',
  Progress: '진행 막대',
  Alert: '화면 안 알림 메시지',
  Toast: '화면 안에 고정해 두는 토스트(정적)',
  ToastRegion: '토스트 표시 영역 — 앱에 1개, `showToast()` · `closeToast()`와 함께',
  Tooltip: '툴팁',
  EmptyState: '빈 상태 안내',
  Accordion: '아코디언 묶음',
  AccordionItem: '아코디언 항목(단독 사용 가능)',
  Dialog: '대화 상자',
  Table: '데이터 표(정렬 · 선택 · 순서 변경)',
  KeyValueTable: '항목명–값 표(조회 · 관리 모드)',
  Card: '카드 컨테이너',
  Chart: '차트(선 · 세로 막대 · 가로 막대)',
  Skeleton: '로딩 자리 표시',
  MetricTrend: '증감 표시',
  DataFreshness: '데이터 기준 시각 · 갱신 상태',
  MetricCard: '대시보드 지표 카드',
  DataState: '데이터 상태(로딩 · 오류 · 결과 없음 등)',
  DashboardFilterBar: '대시보드 조회 조건 막대',
};
/** Auxiliary components — composed by the app inside a parent. Value: where they go. */
const AUXILIARY = {
  Radio: '`RadioGroup` 안',
  SelectOption: '`Select` 안',
  SegmentedControlItem: '`SegmentedControl` 안',
  TabList: '`Tabs` 안',
  Tab: '`TabList` 안',
  TabPanel: '`Tabs` 안',
  DropdownMenuItem: '`DropdownMenu` 안',
  DropdownMenuSection: '`DropdownMenu` 안',
  DropdownMenuSeparator: '`DropdownMenu` 안',
  NavLink: '`Navigation` 안',
  NavGroup: '`Navigation` 안',
  NavChild: '`NavGroup` 안',
  TableHeader: '`Table` 안',
  TableColumn: '`TableHeader` 안',
  TableSelectionColumn: '`TableHeader` 안(다중 선택 표)',
  TableEmptyColumn: '`TableHeader` 안(제목 없는 열)',
  TableBody: '`Table` 안',
  TableRow: '`TableBody` 안',
  TableCell: '`TableRow` 안',
  TableSelectionCell: '`TableRow` 안(다중 선택 표)',
  TableDragHandle: '`TableCell` 안(순서 변경 표)',
  KeyValueItem: '`KeyValueTable` 안',
  KeyValueGroup: '`KeyValueItem` 안(값 여러 개를 한 줄로)',
  CardHeader: '`Card` 안',
  CardContent: '`Card` 안',
  CardFooter: '`Card` 안',
  DashboardFilterGroup: '`DashboardFilterBar` 안',
  DashboardFilterRange: '`DashboardFilterGroup` 안(기간 등 두 값)',
  FileUploaderItem: '`FileUploader` 아래 파일 목록',
  ImageUploadPreview: '`KeyValueItem`의 이미지 업로드 칸',
  ChartLegendItem: '직접 만드는 범례(`Chart`는 범례를 스스로 그림)',
  ChartTooltip: '직접 만드는 차트의 값 표시(`Chart`는 툴팁을 스스로 그림)',
};
/** Internal parts — rendered by their parent; using them directly skips its state, labels and keyboard handling. */
const INTERNAL_PARTS = {
  PaginationItem: 'Pagination',
  PaginationControl: 'Pagination',
  BreadcrumbItem: 'Breadcrumb',
  BreadcrumbSeparator: 'Breadcrumb',
  StepperIndicator: 'Stepper',
  StepperConnector: 'Stepper',
  NavParentItem: 'NavGroup',
};
/** Internal non-component exports. Value: [what to use instead, why]. */
const INTERNAL = {
  resolveAppearance: ['`Button` · `IconButton`의 `appearance` 생략', 'Button 내부의 기본값 계산'],
  toastQueue: ['`showToast()` · `closeToast()`', 'react-aria UNSTABLE_ToastQueue 그대로 — 라이브러리 업데이트 때 바뀔 수 있음'],
  BUTTON_STATES: ['—', 'Figma State 목록(Hover · Pressed는 Prop이 아니라 `:hover` · `:active`) — 스토리 · 검증용'],
  ButtonState: ['—', '`BUTTON_STATES`의 타입'],
  BUTTON_TONES: ['`BUTTON_VARIANTS` · `BUTTON_APPEARANCES`', 'Figma Variant × Appearance 조합 목록 — 스토리 · 검증용'],
  ButtonToneProps: ['`ButtonProps` / `IconButtonProps`', 'Props 구성용 보조 타입'],
  ButtonDisabledProp: ['`ButtonProps` / `IconButtonProps` / `TextButtonProps`', 'Props 구성용 보조 타입'],
  PaginationItemProps: ['`PaginationProps`', '내부 부품의 Props'],
  PaginationControlProps: ['`PaginationProps`', '내부 부품의 Props'],
  BreadcrumbItemProps: ['`BreadcrumbProps` · `BreadcrumbEntry`', '내부 부품의 Props'],
  StepperIndicatorProps: ['`StepperProps` · `StepperStep`', '내부 부품의 Props'],
  StepperConnectorProps: ['`StepperProps`', '내부 부품의 Props'],
  NavParentItemProps: ['`NavGroupProps`', '내부 부품의 Props'],
};
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

const entry = path.join(ROOT, 'src', 'index.ts');
const tsconfig = path.join(ROOT, 'tsconfig.app.json');
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');

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

// 3. Classify every export.
const category = (e) => {
  if (docs.has(e.name)) {
    if (e.name in PUBLIC) return 'public';
    if (e.name in AUXILIARY) return 'auxiliary';
    if (e.name in INTERNAL_PARTS) return 'internal-part';
    throw new Error(`Component export "${e.name}" is not classified — add it to PUBLIC, AUXILIARY or INTERNAL_PARTS in scripts/generate-api-docs.mjs`);
  }
  if (e.name in INTERNAL) return 'internal';
  if (e.file.startsWith('src/icons/') && e.kind !== 'type') return 'icon';
  return e.kind; // type · constant · function · value
};
for (const e of exportsList) e.category = category(e);
for (const name of [...Object.keys(PUBLIC), ...Object.keys(AUXILIARY), ...Object.keys(INTERNAL_PARTS), ...Object.keys(INTERNAL)]) {
  if (!exportsList.some((e) => e.name === name)) throw new Error(`Classified name "${name}" is not exported from src/index.ts`);
}
const count = (c) => exportsList.filter((e) => e.category === c).length;

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
const typeText = (p) => {
  const t = p.type?.raw && p.type.raw.length < 160 ? p.type.raw : p.type?.name ?? '';
  return t === 'enum' && p.type.value ? p.type.value.map((v) => v.value).join(' | ') : t;
};
/** Every "`button_basic` (54:2904)" pair in the description → "`button_basic` 54:2904"; "—" for compositions without their own set. */
const figmaRef = (name) => {
  const pairs = [...(docs.get(name)?.description ?? '').matchAll(/`([a-z][\w-]*)` \((\d+:\d+)\)/g)].map((m) => `\`${m[1]}\` ${m[2]}`);
  return pairs.length ? [...new Set(pairs)].join(' · ') : '—';
};
const label = {
  public: '**공개 컴포넌트**',
  auxiliary: (n) => `**보조 컴포넌트** — ${AUXILIARY[n]}`,
  'internal-part': (n) => `⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 \`${INTERNAL_PARTS[n]}\` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).`,
};

// 4. docs/api.md — grouped by module (src/components/<Name>).
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
out.push('- 어떤 컴포넌트를 써야 하는지와 사용 금지 목록은 [public-api.md](./public-api.md)에 있습니다. 각 컴포넌트 제목 아래에 분류를 적었습니다.');
out.push('- Props 표는 각 컴포넌트가 직접 정의한 Prop만 보여 줍니다. 그 밖의 HTML 속성(`className`, `style`, `aria-*`, 이벤트 등)과');
out.push('  react-aria-components 기반 컴포넌트의 react-aria Prop(`onPress` 등)은 그대로 전달됩니다(각 Usage 문서 참고).');
out.push('- 모든 컴포넌트는 `ref`를 실제 DOM 요소로 전달합니다(`forwardRef`).', '');
out.push(`export ${exportsList.length}개: 공개 컴포넌트 ${count('public')} · 보조 컴포넌트 ${count('auxiliary')} · 내부 부품 ${count('internal-part')} · 타입 ${count('type')} · 상수 ${count('constant')} · 함수 ${count('function')} · 아이콘 ${count('icon')} · 내부 API ${count('internal')}`, '');
const componentGroups = [...groups.keys()].filter((k) => !k.startsWith('(')).sort();
out.push('## 목차', '', componentGroups.map((k) => `[${k}](#${k.toLowerCase()})`).join(' · ') + ' · [아이콘](#아이콘) · [기타](#기타)', '');

for (const key of componentGroups) {
  const items = groups.get(key);
  out.push(`## ${key}`, '');
  const comps = items.filter((e) => docs.has(e.name));
  for (const c of comps) {
    const d = docs.get(c.name);
    out.push(`### \`${c.name}\``, '');
    const l = label[c.category];
    out.push(typeof l === 'function' ? l(c.name) : l, '');
    if (d.description) out.push(esc(d.description), '');
    const props = Object.values(d.props).sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    if (props.length) {
      out.push('| Prop | Type | Default | 설명 |', '| --- | --- | --- | --- |');
      for (const p of props) out.push(`| \`${p.name}\`${p.required ? ' *(필수)*' : ''} | \`${esc(typeText(p))}\` | ${p.defaultValue?.value != null ? '`' + esc(p.defaultValue.value) + '`' : ''} | ${esc(p.description)} |`);
      out.push('');
    }
  }
  const rest = items.filter((e) => !docs.has(e.name));
  const fmt = (e) => '`' + e.name + '`' + (e.category === 'internal' ? ' *(내부 — 사용 금지)*' : '');
  const byKind = (k) => rest.filter((e) => e.kind === k).map(fmt);
  const lines = [['상수', byKind('constant')], ['함수', byKind('function')], ['타입', byKind('type')], ['기타 값', byKind('value')]].filter(([, l]) => l.length);
  if (lines.length) {
    for (const [title, l] of lines) out.push(`- ${title}: ${l.join(', ')}`);
    out.push('');
  }
}
const icons = (groups.get('(icons)') ?? []).filter((e) => e.kind !== 'type').map((e) => '`' + e.name + '`');
out.push('## 아이콘', '', 'Figma 아이콘 벡터(16 또는 32 그리드). Prop: `size`(기본 viewBox 크기) + SVG 속성. 색은 `currentColor`.', '', icons.join(', '), '');
const other = [...(groups.get('(other)') ?? []), ...(groups.get('(icons)') ?? []).filter((e) => e.kind === 'type')];
out.push('## 기타', '', other.map((e) => `- \`${e.name}\` (${e.kind}, \`${e.file}\`)`).join('\n'), '');
writeFileSync(path.join(ROOT, 'docs', 'api.md'), out.join('\n'));

// 5. docs/public-api.md — handover list.
const anchor = (name) => `./api.md#${name.toLowerCase()}`;
const moduleOf = (name) => exportsList.find((e) => e.name === name).file.match(/^src\/components\/([^/]+)\//)?.[1];
const partsOf = (parent) => Object.entries(AUXILIARY).filter(([, where]) => where.startsWith(`\`${parent}\``)).map(([n]) => `\`${n}\``);
const p = [];
p.push('# 공개 API 가이드 — 쓸 것과 쓰지 말 것', '');
p.push('**자동 생성 문서** — `npm run docs:api`(분류표는 `scripts/generate-api-docs.mjs` 맨 위). Props 상세는 [api.md](./api.md).', '');
p.push('## 요약', '');
p.push('| 분류 | 개수 | 쓰는 법 |', '| --- | ---: | --- |');
p.push(`| 공개 컴포넌트 | ${count('public')} | 화면에 바로 배치합니다. |`);
p.push(`| 보조 컴포넌트 | ${count('auxiliary')} | 적힌 상위 컴포넌트 안에서만 조합합니다. |`);
p.push(`| 타입 | ${count('type')} | \`<컴포넌트>Props\`와 값 타입(\`ISODate\`, \`BreadcrumbEntry\`, \`ChartSeries\` …) |`);
p.push(`| 상수 | ${count('constant')} | Figma 속성 값 목록(\`BUTTON_VARIANTS\` 등) — 선택지 UI · 값 검증용 |`);
p.push(`| 함수 | ${count('function')} | ${exportsList.filter((e) => e.category === 'function').map((e) => '`' + e.name + '()`').join(' · ')} |`);
p.push(`| 아이콘 | ${count('icon')} | \`<이름>Icon\` 컴포넌트 |`);
p.push(`| **내부 부품 — 사용 금지** | ${count('internal-part')} | 상위 컴포넌트가 그립니다. |`);
p.push(`| **내부 API — 사용 금지** | ${count('internal')} | 아래 대체 수단을 씁니다. |`);
p.push(`| 합계 | ${exportsList.length} | \`src/index.ts\`의 export 전체 |`, '');
p.push('내부 부품 · 내부 API는 하위 호환을 보장하지 않으며 다음 메이저 버전에서 export 목록에서 빠질 수 있습니다.', '');
p.push('## 가져오는 경로', '');
p.push('- 컴포넌트 · 타입 · 아이콘: `import { … } from \'platform-design-system\'` 하나만 씁니다.');
p.push('- 스타일: `platform-design-system/styles.css`(컴포넌트 + 토큰), 글꼴 `platform-design-system/fonts.css`, 토큰만 `platform-design-system/tokens.css` · `platform-design-system/tokens/*`.');
p.push('- 그 밖의 경로(`platform-design-system/dist/...`, `src/...`)는 `package.json` `exports`에 없어 가져올 수 없고, 가져와서도 안 됩니다.', '');
p.push(`## 1. 공개 컴포넌트 (${count('public')})`, '');
p.push('| 컴포넌트 | 용도 | Figma | 함께 쓰는 보조 컴포넌트 |', '| --- | --- | --- | --- |');
for (const [name, purpose] of Object.entries(PUBLIC)) p.push(`| [\`${name}\`](${anchor(moduleOf(name))}) | ${purpose} | ${figmaRef(name)} | ${partsOf(name).join(' ') || ''} |`);
p.push('');
p.push(`## 2. 보조 컴포넌트 (${count('auxiliary')})`, '');
p.push('| 컴포넌트 | 쓰는 곳 | Figma |', '| --- | --- | --- |');
for (const [name, where] of Object.entries(AUXILIARY)) p.push(`| \`${name}\` | ${where} | ${figmaRef(name)} |`);
p.push('');
p.push('## 3. 사용 금지 — 내부 API', '');
p.push(`### 내부 부품 (${count('internal-part')})`, '');
p.push('Figma 하위 세트를 그대로 옮긴 부품으로, 상위 컴포넌트가 상태 · 라벨 · 키보드 동작과 함께 그립니다. 직접 쓰면 이 동작이 빠집니다.', '');
p.push('| 이름 | 대신 쓸 것 | Figma |', '| --- | --- | --- |');
for (const [name, parent] of Object.entries(INTERNAL_PARTS)) p.push(`| \`${name}\` | \`${parent}\` | ${figmaRef(name)} |`);
p.push('');
p.push(`### 내부 함수 · 상수 · 타입 (${count('internal')})`, '');
p.push('| 이름 | 종류 | 대신 쓸 것 | 이유 |', '| --- | --- | --- | --- |');
for (const [name, [instead, why]] of Object.entries(INTERNAL)) p.push(`| \`${name}\` | ${exportsList.find((e) => e.name === name).kind} | ${instead} | ${why} |`);
p.push('');
p.push('### export 되지 않는 내부 구현', '');
p.push('- CSS 클래스(`.ds-…`), 컴포넌트 CSS의 지역 변수(`--_…`, `--ds-button-…` 등), `data-*` 속성: 구조 · 이름이 예고 없이 바뀔 수 있습니다.');
p.push('  모양을 바꿀 때는 Prop · `className`(바깥 여백 · 배치)과 **토큰 CSS 변수**(`--colors-…`, `--spacing-…`; 공개 API)를 씁니다.');
p.push('- `src/components/*/stories/`의 스토리 도우미, `figma/` · `figma-pending/` · `scripts/`는 패키지에 들어가지 않습니다.');
p.push('- react-aria-components의 UNSTABLE API(토스트 큐 등)는 이 패키지의 래퍼로만 씁니다.', '');
p.push('## 4. 상수 · 아이콘', '');
p.push('- 상수: ' + exportsList.filter((e) => e.category === 'constant').map((e) => '`' + e.name + '`').join(', '));
p.push('- 아이콘: ' + exportsList.filter((e) => e.category === 'icon').map((e) => '`' + e.name + '`').join(', '), '');
writeFileSync(path.join(ROOT, 'docs', 'public-api.md'), p.join('\n'));

console.log(`docs/api.md, docs/public-api.md: ${exportsList.length} exports — public ${count('public')}, auxiliary ${count('auxiliary')}, internal parts ${count('internal-part')}, types ${count('type')}, constants ${count('constant')}, functions ${count('function')}, icons ${count('icon')}, internal ${count('internal')}, other values ${count('value')}`);
