# platform-design-system

React component library for the Figma file **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, page `🔵 Ver 0.4`).
Implemented so far: design tokens, Button family, Input / Textarea / SearchField, Checkbox, Radio, Switch,
Select, Slider, SegmentedControl, Chip / InputChip / FilterChip, DatePicker / Calendar, FileUploader, Loading, Link, Tabs,
Pagination, DropdownMenu, Breadcrumb, Navigation, Stepper, Badge, Progress, Alert, Toast, Tooltip, EmptyState, Accordion, Dialog, Table, Card, Chart, Skeleton,
MetricTrend, DataFreshness, MetricCard, DataState, DashboardFilterBar — status in docs/component-inventory.md, next steps in docs/progress.md.

## Storybook MCP

Always use the `platform-ds-storybook` MCP tools (Storybook running on `npm run storybook`, http://localhost:6006/mcp)
to access component and documentation knowledge before answering or acting on UI work.

- Check `docs-list` / `docs-show` before using a component. Do not invent props — if a prop or variant is not documented, ask.
- Call `get-storybook-story-instructions` before creating or updating stories.
- After visual changes (components, stories, styles, tokens) call `stories-preview`; verify with `test-run`.

## Ground rules

- Source of truth is Figma. Use only values that exist there: tokens come from `figma/` snapshots via
  `npm run tokens`; never hand-edit `src/tokens/*` and never add tokens that are not in Figma.
  The only exception is `figma-pending/primitive.txt` (currently empty — F69 `rounded-[12px]` is now in Figma): tokens the
  team explicitly decided on that await Figma registration. Add entries only on such a decision; remove them once Figma has them.
- Only implement Figma variant combinations that exist (Button Secondary / Solid exists since the 2026-10-19 sync).
- The Figma file is read-only for this project — do not modify it unless the user explicitly authorizes a specific
  change (as for the 2026-10-19 Tertiary fill tokens and the R1–R8 fixes in docs/figma-fix-requests.md). Others edit the file
  concurrently: re-run the checksums and a fingerprint before trusting the snapshot.
- Story-only helpers in `src/components/*/stories/` (icons, matrix layout) are not part of the package API.

## Commands

- `npm run storybook` — Storybook on :6006 (also serves the MCP endpoint)
- `npm test` — story tests (Vitest + Playwright Chromium)
- `npm run typecheck`, `npm run lint`, `npm run build`
- `npm run tokens` — regenerate CSS tokens from `figma/`
- `npm run figma:checksum` — checksums to compare with `figma/checksum.figma.js` run in Figma
- `npm run verify:button` — DOM/pixel parity check of all 352 Button variants against Figma (Storybook must be running);
  add `-- --browser=firefox` or `webkit` to check other engines (see docs/browser-support.md)
- `node scripts/verify-figma.mjs <component> [--browser=…]` — parity check driven by figma/verify/<component>.json;
  `npm run verify:all` runs every component in Chromium, Firefox and WebKit
- `npm run verify:a11y` — axe-core audit of every story (known Figma token contrast issues listed separately)
- `npm run docs:api` — regenerate docs/api.md (public API) after changing exports or prop JSDoc

## Docs

- docs/developer-guide.md — handover guide for the frontend team (stack, install, tokens, versioning, MCP)
- docs/public-api.md — generated list of public (49) / auxiliary (32) components and the internal API not to use;
  every new component export must be classified at the top of scripts/generate-api-docs.mjs (the script fails otherwise)
- docs/api.md — generated public API; docs/figma-issue-triage.md — open Figma issues by category
- docs/release-checklist.md — pre-release checklist; docs/breaking-changes.md — compatibility analysis and version policy
- docs/figma-fix-requests.md — fixes requested in the Figma source (node / variable IDs); add new ones there, never edit Figma
- docs/usage.md — consuming the package from another React project
- docs/browser-support.md — CSS features, fallbacks, measured per-engine results
- docs/figma-issues.md — token / variant naming issues in the Figma source (report, don't "fix" them in code)
