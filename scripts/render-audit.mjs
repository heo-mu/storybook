// Render audit of every Storybook entry — stories AND docs pages — in a real browser.
//
//   npm run storybook                                  (in another terminal)
//   node scripts/render-audit.mjs [--filter=components-select] [--browser=firefox|webkit] [--workers=4]
//   STORYBOOK_URL=https://storybook-heo-mu.vercel.app node scripts/render-audit.mjs   → the deployed site
//
// Story tests only run the `play` functions; a docs page can still throw (a component referenced in MDX without an
// import, a broken `of={}`), and a story can render empty or log React errors without any test noticing. For every
// entry in index.json this script opens the iframe and records:
//   • page errors (uncaught exceptions) and console error / warning messages
//   • the Storybook error overlay (`.sb-errordisplay`, body.sb-show-errordisplay)
//   • visible content (2026-10-30): an element the user can actually see — non-zero box inside the document,
//     `visibility: visible`, opacity > 0 on it and its ancestors, not `display: none` — in #storybook-root OR in a
//     portal (dialog · tooltip · popover · toast region · react-aria overlays) for stories, in `.sbdocs-content` for
//     docs, plus every docs Canvas (`.docs-story`) having visible content
//   • a story with no visible content: if it offers a trigger (button / focusable control) the trigger is pressed and
//     the content must then appear (reported as 'content-after-trigger', informational); otherwise 'no-visible-content'
//   • persistence (2026-10-30): the visible content is sampled again 1 s and 6 s after mount (toasts auto-close at
//     5 s); content that was there and is gone with nothing else on screen is 'content-vanishes'
//   • broken images (naturalWidth 0) and inline SVG icons without a viewBox
//   • fonts that did not load (document.fonts.check for the Pretendard family)
//   • horizontal overflow of the page (scrollWidth > viewport) — layout spill at 1400 × 1000
// Informational (reported, not failed): 'content-after-trigger'; 'overflow-gallery' — a */Gallery verification matrix
// that mirrors the Figma set frame and is wider than the viewport; 'docs-inert-warning' — react-aria Pressable warning
// raised only because Storybook keeps docs-page story containers [inert] while the page builds (no warning in story mode).
// Report: .verify/render/report-<browser>.json. Exit code 1 when any entry fails.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { ROOT } from './lib/figma-snapshot.mjs';

const SB = (process.env.STORYBOOK_URL ?? 'http://localhost:6006').replace(/\/$/, '');
const FILTER = process.argv.find((a) => a.startsWith('--filter='))?.split('=')[1];
const BROWSER = process.argv.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const WORKERS = Number(process.argv.find((a) => a.startsWith('--workers='))?.split('=')[1] ?? 4);
const ENGINE = { chromium, firefox, webkit }[BROWSER];
if (!ENGINE) throw new Error(`Unknown --browser=${BROWSER}`);
const OUT = path.join(ROOT, '.verify', 'render');
mkdirSync(OUT, { recursive: true });

// Console messages that are not defects of this library (dev-server / addon chatter). Everything else counts.
const IGNORED_CONSOLE = [
  /\[vite\] (connecting|connected)/,
  /Download the React DevTools/,
  /%cDownload the React DevTools/,
  // Firefox font diagnostics, not content defects: Storybook's own docs-theme font (Nunito Sans) that the preview never
  // uses, and the Pretendard Variable file's unsorted name table (a property of the vendor's font build; rendering is unaffected).
  /downloadable font: download failed \(font-family: "Nunito Sans"/,
  /downloadable font: name: name records are not sorted/,
  // Firefox performance hint for position: sticky / fixed layouts (chart tooltip at the viewport edge), not an error.
  /scroll-linked positioning effect/,
];

/** Runs in the page: what can the user see? */
const VISIBLE_CONTENT = `(() => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const docW = Math.max(document.documentElement.scrollWidth, vw), docH = Math.max(document.documentElement.scrollHeight, vh);
  const seen = (el) => {
    if (!(el instanceof Element)) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= docW || r.top >= docH) return false; // outside the document
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || Number(cs.opacity) === 0) return false;
      if (n.hasAttribute('hidden') && cs.display === 'none') return false;
    }
    return true;
  };
  const leafLike = (el) => el.children.length === 0 || /^(svg|img|canvas|video|input|select|textarea|button)$/i.test(el.tagName) || (el.textContent || '').trim().length > 0;
  const count = (root) => { if (!root) return 0; let n = 0; for (const el of root.querySelectorAll('*')) { if (el.closest('template, [data-sb-hidden]')) continue; if (seen(el) && leafLike(el)) n++; } return n; };
  const root = document.querySelector('#storybook-root');
  const portals = [...document.body.children].filter((c) => c !== root && !/^(script|style|template)$/i.test(c.tagName) && !c.className?.toString?.().startsWith('sb-'));
  return { root: count(root), portal: portals.reduce((n, p) => n + count(p), 0), text: ((root?.innerText) || '').trim().length };
})()`;

const index = await (await fetch(`${SB}/index.json`)).json();
const entries = Object.values(index.entries).filter((e) => (e.type === 'story' || e.type === 'docs') && (!FILTER || e.id.startsWith(FILTER)));

const browser = await ENGINE.launch();
const results = [];

async function audit(page, entry, messages) {
  const isDocs = entry.type === 'docs';
  const current = { id: entry.id, type: entry.type, title: `${entry.title} / ${entry.name}`, messages, issues: [] };
  const url = `${SB}/iframe.html?id=${entry.id}&viewMode=${isDocs ? 'docs' : 'story'}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page
      .waitForFunction(
        (docs) => (docs ? document.querySelector('.sbdocs') || document.body.classList.contains('sb-show-errordisplay') : document.querySelector('#storybook-root')?.querySelector(':scope > :not(template)') || document.body.classList.contains('sb-show-errordisplay')),
        isDocs,
        { timeout: 20000 },
      )
      .catch(() => current.issues.push({ cat: 'timeout', detail: 'nothing rendered within 20 s' }));
    // Let lazy docs blocks (Canvas / ArgTypes) and fonts settle; large pages (Design Tokens) fill their text in late.
    await page.waitForTimeout(isDocs ? 800 : 300);
    const state = await page.evaluate((docs) => {
      const overlay = document.querySelector('.sb-errordisplay');
      const overlayVisible = overlay && getComputedStyle(overlay).display !== 'none' && document.body.classList.contains('sb-show-errordisplay');
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src').slice(0, 120));
      const svgNoViewBox = [...document.querySelectorAll('svg')].filter((s) => !s.getAttribute('viewBox') && s.getBoundingClientRect().width > 0 && !s.closest('.sbdocs-content pre, .docblock-source, [class*="sb-"]')).length;
      const fontOk = document.fonts ? document.fonts.check('16px Pretendard') : true;
      const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
      let docsCanvases = null;
      if (docs) {
        const content = document.querySelector('.sbdocs-content');
        const canvases = [...document.querySelectorAll('.docs-story')]; // one per Canvas block (.sb-story sits inside it)
        const visibleIn = (el) => [...el.querySelectorAll('*')].some((n) => { const r = n.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let p = n; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false; } return n.children.length === 0 || (n.textContent || '').trim().length > 0; });
        docsCanvases = { total: canvases.length, empty: canvases.filter((c) => !visibleIn(c)).length, text: (content?.innerText || '').trim().length };
      }
      return { overlay: overlayVisible ? (overlay.querySelector('.sb-heading')?.textContent || overlay.textContent || '').trim().slice(0, 200) : null, images: imgs, svgNoViewBox, fontOk, overflow, docsCanvases };
    }, isDocs);
    if (state.overlay) current.issues.push({ cat: 'error-overlay', detail: state.overlay });
    if (isDocs) {
      if (!state.docsCanvases || state.docsCanvases.text === 0) current.issues.push({ cat: 'no-visible-content', detail: 'docs page shows no text' });
      else if (state.docsCanvases.empty) {
        const settled = await canvasesFilled(page);
        if (settled.empty) current.issues.push({ cat: 'docs-canvas-empty', detail: `${settled.empty} of ${settled.total} Canvas blocks still show nothing after 8 s` });
      }
    } else {
      const sample = () => page.evaluate(VISIBLE_CONTENT);
      let first = await sample();
      let triggered = null;
      if (first.root + first.portal === 0) {
        // Nothing to see: is there a control the user would press? (tooltip · dialog · menu · toast demos)
        const trigger = page.locator('#storybook-root button:not([disabled]), #storybook-root [role=button]:not([aria-disabled=true]), #storybook-root a[href], #storybook-root input, #storybook-root [tabindex="0"]').first();
        if (await trigger.count()) {
          await trigger.click({ timeout: 3000 }).catch(() => {});
          await page.waitForTimeout(700);
          triggered = await sample();
        }
      }
      if (first.root + first.portal === 0 && !(triggered && triggered.root + triggered.portal > 0)) {
        current.issues.push({ cat: 'no-visible-content', detail: triggered ? 'nothing visible, and pressing the first control shows nothing' : 'nothing visible and no control to press' });
      } else if (first.root + first.portal === 0 && triggered) {
        current.issues.push({ cat: 'content-after-trigger', detail: `nothing visible at first; pressing the first control shows ${triggered.root + triggered.portal} element(s)` });
      } else {
        // Persistence: still something to see after the play function and after any 5 s auto-close.
        await page.waitForTimeout(1000);
        const t1 = await sample();
        await page.waitForTimeout(5000);
        const t6 = await sample();
        if (t1.root + t1.portal === 0 || t6.root + t6.portal === 0) current.issues.push({ cat: 'content-vanishes', detail: `visible at mount (${first.root + first.portal} element(s)) but empty after ${t1.root + t1.portal === 0 ? '1 s' : '6 s'}` });
      }
    }
    if (state.images.length) current.issues.push({ cat: 'broken-image', detail: state.images.join(', ') });
    if (!state.fontOk) current.issues.push({ cat: 'font', detail: 'Pretendard not loaded' });
    const gallery = /\/Gallery$/.test(entry.title);
    if (state.overflow > 1) current.issues.push({ cat: gallery ? 'overflow-gallery' : 'overflow', detail: `page ${state.overflow}px wider than the 1400px viewport` + (gallery ? ' (verification matrix mirroring the Figma set frame)' : '') });
    for (const m of messages) {
      // Storybook renders docs-page story containers inside an [inert] ancestor until the page is ready; react-aria's Pressable
      // (DropdownMenu trigger) then warns that its child is not focusable. Story mode shows no warning — docs artifact, reported as info.
      const docsInert = isDocs && /<Pressable> child must be focusable/.test(m.text);
      current.issues.push({ cat: docsInert ? 'docs-inert-warning' : m.kind, detail: m.text });
    }
  } catch (e) {
    current.issues.push({ cat: 'load', detail: String(e.message).split('\n')[0].slice(0, 200) });
  }
  return current;
}

/**
 * Docs pages mount their Canvas stories lazily, one after another; a long page under a slow engine (WebKit with several
 * tabs) can still be filling them a second after load. Poll until every Canvas shows something or 8 s have passed, and
 * only then judge — a Canvas that is still empty after 8 s is a real defect.
 */
async function canvasesFilled(page) {
  let last = { total: 0, empty: 0 };
  for (let waited = 0; waited <= 8000; waited += 500) {
    last = await page.evaluate(() => {
      const canvases = [...document.querySelectorAll('.docs-story')];
      const visibleIn = (el) => [...el.querySelectorAll('*')].some((n) => { const r = n.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let p = n; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false; } return n.children.length === 0 || (n.textContent || '').trim().length > 0; });
      return { total: canvases.length, empty: canvases.filter((x) => !visibleIn(x)).length };
    });
    if (!last.empty) return last;
    await page.waitForTimeout(500);
  }
  return last;
}

let next = 0;
async function worker() {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  let messages = [];
  const log = (kind, text) => { if (!IGNORED_CONSOLE.some((re) => re.test(text))) messages.push({ kind, text: text.slice(0, 300) }); };
  page.on('pageerror', (e) => log('pageerror', String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log(m.type(), m.text()); });
  while (next < entries.length) {
    const entry = entries[next++];
    messages = [];
    const own = messages;
    results.push(await audit(page, entry, own));
  }
  await context.close();
}
await Promise.all(Array.from({ length: Math.max(1, Math.min(WORKERS, entries.length)) }, worker));
await browser.close();
results.sort((a, b) => entries.findIndex((e) => e.id === a.id) - entries.findIndex((e) => e.id === b.id));

const INFO = new Set(['content-after-trigger', 'overflow-gallery', 'docs-inert-warning']);
const failed = results.filter((r) => r.issues.some((i) => !INFO.has(i.cat)));
const info = results.filter((r) => r.issues.length && !failed.includes(r));
const byCat = {};
for (const r of results) for (const i of r.issues) byCat[i.cat] = (byCat[i.cat] || 0) + 1;
const report = { target: SB, browser: BROWSER, checked: results.length, stories: results.filter((r) => r.type === 'story').length, docs: results.filter((r) => r.type === 'docs').length, failed: failed.length, byCat, results };
writeFileSync(path.join(OUT, `report-${BROWSER}.json`), JSON.stringify(report, null, 2));
console.log(`\nStorybook render audit — ${SB} (${BROWSER})`);
console.log(`  checked ${report.checked} entries (${report.stories} stories · ${report.docs} docs), failed ${report.failed}, informational ${info.length}`);
for (const [cat, n] of Object.entries(byCat)) console.log(`  ${cat}: ${n}`);
for (const r of [...failed, ...info].slice(0, 60)) console.log(`  ✗ ${r.id} [${r.type}] — ${r.issues.map((i) => `${i.cat}: ${i.detail.slice(0, 140)}`).join(' | ')}`);
if (failed.length > 60) console.log(`  … ${failed.length - 60} more in the report`);
console.log(`report: .verify/render/report-${BROWSER}.json`);
process.exitCode = failed.length ? 1 : 0;
