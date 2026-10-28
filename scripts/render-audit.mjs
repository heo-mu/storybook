// Render audit of every Storybook entry — stories AND docs pages — in a real browser (Chromium).
//
//   npm run storybook                                  (in another terminal)
//   node scripts/render-audit.mjs [--filter=components-select] [--browser=firefox|webkit]
//   STORYBOOK_URL=https://storybook-heo-mu.vercel.app node scripts/render-audit.mjs   → the deployed site
//
// Story tests only run the `play` functions; a docs page can still throw (a component referenced in MDX without an
// import, a broken `of={}`), and a story can render empty or log React errors without any test noticing. For every
// entry in index.json this script opens the iframe and records:
//   • page errors (uncaught exceptions) and console error / warning messages
//   • the Storybook error overlay (`.sb-errordisplay`, body.sb-show-errordisplay)
//   • an empty render (story: #storybook-root has no element; docs: no .sbdocs content)
//   • broken images (naturalWidth 0) and inline SVG icons without a viewBox
//   • fonts that did not load (document.fonts.check for the Pretendard family)
//   • horizontal overflow of the page (scrollWidth > viewport) — layout spill at 1400 × 1000
// Informational (reported, not failed): 'empty-before-play' — a story that only renders inside its play function;
// 'overflow-gallery' — a */Gallery verification matrix that mirrors the Figma set frame and is wider than the viewport;
// 'docs-inert-warning' — react-aria Pressable warning raised only because Storybook keeps docs-page story containers [inert]
// while the page builds (no warning in story mode).
// Report: .verify/render/report-<browser>.json. Exit code 1 when any entry fails.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { ROOT } from './lib/figma-snapshot.mjs';

const SB = (process.env.STORYBOOK_URL ?? 'http://localhost:6006').replace(/\/$/, '');
const FILTER = process.argv.find((a) => a.startsWith('--filter='))?.split('=')[1];
const BROWSER = process.argv.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const ENGINE = { chromium, firefox, webkit }[BROWSER];
if (!ENGINE) throw new Error(`Unknown --browser=${BROWSER}`);
const OUT = path.join(ROOT, '.verify', 'render');
mkdirSync(OUT, { recursive: true });

// Console messages that are not defects of this library (dev-server / addon chatter). Everything else counts.
const IGNORED_CONSOLE = [
  /\[vite\] (connecting|connected)/,
  /Download the React DevTools/,
  /%cDownload the React DevTools/,
];

const index = await (await fetch(`${SB}/index.json`)).json();
const entries = Object.values(index.entries).filter((e) => (e.type === 'story' || e.type === 'docs') && (!FILTER || e.id.startsWith(FILTER)));

const browser = await ENGINE.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
const page = await context.newPage();
let current = null;
const log = (kind, text) => { if (current && !IGNORED_CONSOLE.some((re) => re.test(text))) current.messages.push({ kind, text: text.slice(0, 300) }); };
page.on('pageerror', (e) => log('pageerror', String(e.message)));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log(m.type(), m.text()); });

const results = [];
for (const entry of entries) {
  const isDocs = entry.type === 'docs';
  current = { id: entry.id, type: entry.type, title: `${entry.title} / ${entry.name}`, messages: [], issues: [] };
  const url = `${SB}/iframe.html?id=${entry.id}&viewMode=${isDocs ? 'docs' : 'story'}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page
      .waitForFunction(
        (docs) => (docs ? document.querySelector('.sbdocs, .sb-errordisplay') : document.querySelector('#storybook-root')?.childElementCount > 0 || document.querySelector('.sb-errordisplay')),
        isDocs,
        { timeout: 20000 },
      )
      .catch(() => current.issues.push({ cat: 'timeout', detail: 'nothing rendered within 20 s' }));
    // Let lazy docs blocks (Canvas / ArgTypes) and fonts settle; large pages (Design Tokens) fill their text in late.
    await page.waitForTimeout(isDocs ? 600 : 200);
    await page.waitForFunction((docs) => ((docs ? document.querySelector('.sbdocs') : document.querySelector('#storybook-root'))?.textContent || '').trim().length > 0 || document.querySelector('.sb-errordisplay'), isDocs, { timeout: 5000 }).catch(() => {});
    const state = await page.evaluate((docs) => {
      const overlay = document.querySelector('.sb-errordisplay');
      const overlayVisible = overlay && getComputedStyle(overlay).display !== 'none' && document.body.classList.contains('sb-show-errordisplay');
      const root = document.querySelector('#storybook-root');
      const docsRoot = document.querySelector('.sbdocs');
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src').slice(0, 120));
      const svgNoViewBox = [...document.querySelectorAll('svg')].filter((s) => !s.getAttribute('viewBox') && s.getBoundingClientRect().width > 0 && !s.closest('.sbdocs-content pre, .docblock-source, [class*="sb-"]')).length;
      const fontOk = document.fonts ? document.fonts.check('16px Pretendard') : true;
      const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
      return {
        overlay: overlayVisible ? (overlay.querySelector('.sb-heading')?.textContent || overlay.textContent || '').trim().slice(0, 200) : null,
        empty: docs ? !docsRoot || docsRoot.textContent.trim().length === 0 : !root || root.childElementCount === 0,
        emptyText: docs ? (docsRoot?.textContent || '').trim().length : (root?.textContent || '').trim().length,
        images: imgs,
        svgNoViewBox,
        fontOk,
        overflow,
      };
    }, isDocs);
    if (state.overlay) current.issues.push({ cat: 'error-overlay', detail: state.overlay });
    const playOnly = !isDocs && (entry.tags || []).includes('play-fn');
    if (state.empty) current.issues.push({ cat: playOnly ? 'empty-before-play' : 'empty', detail: isDocs ? 'no docs content' : '#storybook-root has no element' + (playOnly ? ' (story renders during its play function — checked by the story tests)' : '') });
    if (state.images.length) current.issues.push({ cat: 'broken-image', detail: state.images.join(', ') });
    if (!state.fontOk) current.issues.push({ cat: 'font', detail: 'Pretendard not loaded' });
    const gallery = /\/Gallery$/.test(entry.title);
    if (state.overflow > 1) current.issues.push({ cat: gallery ? 'overflow-gallery' : 'overflow', detail: `page ${state.overflow}px wider than the 1400px viewport` + (gallery ? ' (verification matrix mirroring the Figma set frame)' : '') });
    for (const m of current.messages) {
      // Storybook renders docs-page story containers inside an [inert] ancestor until the page is ready; react-aria's Pressable
      // (DropdownMenu trigger) then warns that its child is not focusable. Story mode shows no warning — docs artifact, reported as info.
      const docsInert = isDocs && /<Pressable> child must be focusable/.test(m.text);
      current.issues.push({ cat: docsInert ? 'docs-inert-warning' : m.kind, detail: m.text });
    }
  } catch (e) {
    current.issues.push({ cat: 'load', detail: String(e.message).split('\n')[0].slice(0, 200) });
  }
  results.push(current);
  current = null;
}
await browser.close();

const INFO = new Set(['empty-before-play', 'overflow-gallery', 'docs-inert-warning']);
const failed = results.filter((r) => r.issues.some((i) => !INFO.has(i.cat)));
const info = results.filter((r) => r.issues.length && !failed.includes(r));
const byCat = {};
for (const r of results) for (const i of r.issues) byCat[i.cat] = (byCat[i.cat] || 0) + 1;
const report = { target: SB, browser: BROWSER, checked: results.length, stories: results.filter((r) => r.type === 'story').length, docs: results.filter((r) => r.type === 'docs').length, failed: failed.length, byCat, results };
writeFileSync(path.join(OUT, `report-${BROWSER}.json`), JSON.stringify(report, null, 2));
console.log(`\nStorybook render audit — ${SB} (${BROWSER})`);
console.log(`  checked ${report.checked} entries (${report.stories} stories · ${report.docs} docs), failed ${report.failed}, informational ${info.length}`);
for (const [cat, n] of Object.entries(byCat)) console.log(`  ${cat}: ${n}`);
for (const r of [...failed, ...info].slice(0, 40)) console.log(`  ✗ ${r.id} [${r.type}] — ${r.issues.map((i) => `${i.cat}: ${i.detail.slice(0, 140)}`).join(' | ')}`);
if (failed.length > 40) console.log(`  … ${failed.length - 40} more in the report`);
console.log(`report: .verify/render/report-${BROWSER}.json`);
process.exitCode = failed.length ? 1 : 0;
