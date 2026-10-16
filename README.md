# platform-design-system

React component library for the Figma file **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, page `🔵 Ver 0.4`).
Tokens and components are built only from values that exist in Figma.

Status: design tokens · `Button` · `IconButton` · `TextButton` (Figma frame "Button", 296 variants).

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
| `button_basic` (160) | `Button` — `variant`, `appearance`, `size`, `shape`, `leftIcon`, `rightIcon`, `children`, `disabled` |
| `button_icon` (120) | `IconButton` — same, no `lg`; `icon`, required `aria-label` |
| `button_text` (16) | `TextButton` — `variant` (Figma "Type"), `size`, `leftIcon`, `rightIcon`, `children`, `disabled` |

State Hover / Pressed are the native `:hover` / `:active` states; Disabled is `disabled`. Only combinations that
exist in Figma are typed (there is no Secondary/Solid).

`figma/` holds the read-only Figma export the code is generated and verified from:
`variables/`, `styles/` (token snapshot), `button-spec.json` (per Size/Shape geometry and per State colours),
`button-variants.json` (variant positions), `reference/*.png` (Figma screenshots), `checksum.figma.js`.

## Scripts

| Command | |
| --- | --- |
| `npm run storybook` | Storybook on http://localhost:6006 (also the Storybook MCP endpoint `/mcp`) |
| `npm test` | Story tests (Vitest + Playwright Chromium): computed styles, prop → state transitions, variant counts |
| `npm run verify:button` | Figma parity of all 296 Button variants (Storybook must be running) |
| `npm run typecheck` · `npm run lint` · `npm run build` | |
| `npm run tokens` | Regenerate `src/tokens` from `figma/` |
| `npm run figma:checksum` | Snapshot checksums; compare with `figma/checksum.figma.js` run through the Figma MCP |

## Storybook

- `Components/Button/Usage` — usage guide, Figma → props mapping, notes on the Figma data
- `Components/Button/{Button, IconButton, TextButton}` — Docs (props table), Playground and usage stories
- `Components/Button/Overview`, `Variant Matrix`, `States`, `Tests` — visual verification (not in the MCP manifest)
- `Foundations/Design Tokens`

The Storybook MCP server is registered for Claude Code in `.mcp.json` (`platform-ds-storybook`); see `CLAUDE.md`.
