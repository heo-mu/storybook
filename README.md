# platform-design-system

React component library for the Figma file **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, page `🔵 Ver 0.4`).
Tokens and components are built only from values that exist in Figma (plus one decided token awaiting Figma registration,
`figma-pending/primitive.txt`).

Status: design tokens and every component of the Figma Component section (58:5174) and Dashboard components section
(728:25472) — Button family (400 variants) plus 842 further variants in 71 sets, checked against Figma in Chromium,
Firefox and WebKit. Inventory: [docs/component-inventory.md](docs/component-inventory.md) · results:
[docs/final-report.md](docs/final-report.md).

## Docs

- [docs/developer-guide.md](docs/developer-guide.md) — stack, structure, install, Storybook, tokens, browsers, versioning, Storybook MCP (Korean)
- [docs/public-api.md](docs/public-api.md) — what to use and what not to use: 49 public components, 32 auxiliary components, internal API (generated, Korean)
- [docs/api.md](docs/api.md) — public API, generated from the source (`npm run docs:api`)
- [docs/release-checklist.md](docs/release-checklist.md) — pre-release checklist (Korean)
- [docs/breaking-changes.md](docs/breaking-changes.md) — compatibility analysis of the 2026-10-19 changes and the version policy proposal (Korean)
- [docs/figma-fix-requests.md](docs/figma-fix-requests.md) — fixes requested in the Figma source, with node and variable IDs (Korean)
- [docs/usage.md](docs/usage.md) — using the package in another React project (Korean)
- [docs/final-report.md](docs/final-report.md) — inventory, verification results and open design decisions (Korean)
- [docs/accessibility.md](docs/accessibility.md) — keyboard and screen-reader behaviour per component
- [docs/browser-support.md](docs/browser-support.md) — CSS features, fallbacks and measured results in Chromium / Firefox / WebKit
- [docs/figma-issues.md](docs/figma-issues.md) — token and variant naming issues found in the Figma source

## Use it in another React project

```bash
npm install ../platform-design-system/platform-design-system-0.1.0.tgz   # from `npm pack`
```

```tsx
// once, at the app entry
import 'platform-design-system/fonts.css';  // Pretendard Variable (font/family/basic)
import 'platform-design-system/styles.css'; // tokens + component styles

import { Button, IconButton, TextButton } from 'platform-design-system';

<Button variant="primary" size="md" leftIcon={<MyIcon />}>저장</Button>
<IconButton variant="tertiary" appearance="outline" icon={<PlusIcon />} aria-label="추가" />
<TextButton size="md">더보기</TextButton>
```

Package entry points:

| Import | Contents |
| --- | --- |
| `platform-design-system` | Components and option constants (ESM + CJS, `.d.ts`). React 18.2+ / 19 as peer dependency |
| `platform-design-system/styles.css` | All tokens + component CSS |
| `platform-design-system/fonts.css` | Pretendard Variable (dynamic subset) |
| `platform-design-system/tokens.css`, `.../tokens/*` | Tokens only (CSS Variables) and `tokens.json` |

## Figma → code

| Figma | Code |
| --- | --- |
| Variables: Primitive (615), Theme (44), Semantic (68), Component `colors/button*` (73) | `src/tokens/*.css` — `colors/text/primary` → `--colors-text-primary`; aliases stay `var()` references |
| Text Styles (46) | `--typography-<style>-*` variables + `.ds-typography-<style>` classes |
| Effect Styles (4) | `--effect-elevation-*` |
| `button_basic` (192) | `Button` — `variant`, `appearance`, `size`, `shape`, `leftIcon`, `rightIcon`, `children`, `disabled` |
| `button_icon` (144) | `IconButton` — same, no `lg`; `icon`, required `aria-label` |
| `button_text` (16) | `TextButton` — `variant` (Figma "Type"), `size`, `leftIcon`, `rightIcon`, `children`, `disabled` |

State Hover / Pressed are the native `:hover` / `:active` states; Disabled is `disabled`. Every Variant × Appearance pair
exists in Figma since the 2026-10-19 sync (Secondary / Solid added); without `appearance`, Secondary stays Outline.

`figma/` holds the read-only Figma export the code is generated and verified from:
`variables/`, `styles/` (token snapshot), `button-spec.json` (per Size/Shape geometry and per State colours),
`button-variants.json` (variant positions), `reference/*.png` (Figma screenshots), `checksum.figma.js`.

## Scripts

| Command | |
| --- | --- |
| `npm run storybook` | Storybook on http://localhost:6006 (also the Storybook MCP endpoint `/mcp`) |
| `npm test` | Story tests (Vitest + Playwright Chromium): computed styles, prop → state transitions, variant counts |
| `npm run verify:button` | Figma parity of all 400 Button variants (Storybook must be running); `-- --browser=firefox` / `webkit` for other engines |
| `node scripts/verify-figma.mjs <component>` | Figma parity of one component (`figma/verify/<component>.json`); `--browser=`, `--set=` |
| `npm run verify:all` | Every component in Chromium, Firefox and WebKit |
| `npm run verify:a11y` | axe-core audit of every story |
| `npm run docs:api` | Regenerate docs/api.md from the exports and JSDoc |
| `npm run typecheck` · `npm run lint` · `npm run build` | |
| `npm run tokens` | Regenerate `src/tokens` from `figma/` |
| `npm run figma:checksum` | Snapshot checksums; compare with `figma/checksum.figma.js` run through the Figma MCP |

## Storybook

- `컴포넌트/<Name>/사용 방법` — purpose, when to use, variants, states, code, accessibility (plain Korean)
- `컴포넌트/<Name>/<Component>` — 문서 (props table), 직접 체험 and usage stories (in the MCP manifest)
- `컴포넌트/<Name>/전체 보기` (Button: `개요`, `모든 변형`, `상태별 보기`, `동작 확인`) — visual verification against Figma (not in the MCP manifest). Story IDs stay English (`components-<name>-showcase--…`).
- `기초/디자인 토큰`, `기초/포커스`
- Developer details (Figma mapping, node IDs, policy details): `docs/` — start at `docs/README.md`

The Storybook MCP server is registered for Claude Code in `.mcp.json` (`platform-ds-storybook`); see `CLAUDE.md`.
