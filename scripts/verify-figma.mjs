// Generic Figma ↔ Storybook parity check, driven by figma/verify/<component>.json.
//
//   npm run storybook                                   (in another terminal)
//   node scripts/verify-figma.mjs input [--browser=firefox|webkit] [--set=input]
//
// For every Figma variant rendered in the configured story (element with data-figma="<variant name>"):
//   • root width/height and every mapped part's box (relative to the root) vs figma/geometry/<set>.json
//   • pixels outside text boxes vs the Figma screenshot (figma/reference/<set>.png) — colours, borders,
//     icons, radii; text is rasterised differently by Figma and browsers, so text boxes are compared by
//   • glyph placement (ink centroid of each Figma text box, ±0.5px)
// Variant positions inside the set come from figma/metadata/section-58-5174.xml.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { ROOT } from './lib/figma-snapshot.mjs';
import { findById, loadPage } from './lib/figma-metadata.mjs';

const args = process.argv.slice(2);
const component = args.find((a) => !a.startsWith('--'));
if (!component) throw new Error('usage: node scripts/verify-figma.mjs <component> [--browser=…] [--set=…]');
const BROWSER = args.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const ONLY_SET = args.find((a) => a.startsWith('--set='))?.split('=')[1];
const SB = process.env.STORYBOOK_URL ?? 'http://localhost:6006';
const OUT = path.join(ROOT, '.verify', component);
mkdirSync(OUT, { recursive: true });

const readJson = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'));
const config = readJson(`figma/verify/${component}.json`);
const sectionMeta = loadPage('section-58-5174.xml');
const dashboardMeta = (() => { try { return loadPage('section-728-25472.xml'); } catch { return null; } })();

const glob = (pattern) => new RegExp('^' + pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '$');
const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function cropOver(png, x, y, w, h, bg) {
  const out = new PNG({ width: w, height: h });
  const [br, bgc, bb] = hexRgb(bg);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const sx = x + i, sy = y + j;
    const d = (j * w + i) * 4;
    if (sx < 0 || sy < 0 || sx >= png.width || sy >= png.height) { out.data[d] = br; out.data[d + 1] = bgc; out.data[d + 2] = bb; out.data[d + 3] = 255; continue; }
    const s = (sy * png.width + sx) * 4;
    const a = png.data[s + 3] / 255;
    out.data[d] = Math.round(png.data[s] * a + br * (1 - a));
    out.data[d + 1] = Math.round(png.data[s + 1] * a + bgc * (1 - a));
    out.data[d + 2] = Math.round(png.data[s + 2] * a + bb * (1 - a));
    out.data[d + 3] = 255;
  }
  return out;
}

function inkCentroid(img, box) {
  const at = (x, y) => { const i = (y * img.width + x) * 4; return img.data[i] + img.data[i + 1] + img.data[i + 2]; };
  const x0 = Math.max(0, Math.floor(box.x) - 1), y0 = Math.max(0, Math.floor(box.y) - 1);
  const x1 = Math.min(img.width, Math.ceil(box.x + box.w) + 1), y1 = Math.min(img.height, Math.ceil(box.y + box.h) + 1);
  if (x1 <= x0 || y1 <= y0) return null;
  // Background = the most common colour in the box border ring.
  const counts = new Map();
  for (let x = x0; x < x1; x++) for (const y of [y0, y1 - 1]) { const v = at(x, y); counts.set(v, (counts.get(v) || 0) + 1); }
  const base = [...counts].sort((a, b) => b[1] - a[1])[0][0];
  let sum = 0, sx = 0, sy = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const d = Math.abs(at(x, y) - base); if (d < 30) continue; sum += d; sx += d * x; sy += d * y; }
  return sum > 200 ? { x: sx / sum, y: sy / sum } : null;
}

function sideBySide(a, b, diff) {
  const w = a.width + b.width + diff.width + 8, h = Math.max(a.height, b.height, diff.height);
  const out = new PNG({ width: w, height: h, fill: true });
  out.data.fill(255);
  let ox = 0;
  for (const img of [a, b, diff]) { PNG.bitblt(img, out, 0, 0, img.width, img.height, ox, 0); ox += img.width + 4; }
  return out;
}

/** Measures the mapped parts inside each data-figma element (runs in the page). */
function measure(partSelectors) {
  const visible = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  return [...document.querySelectorAll('[data-figma]')].map((el) => {
    const r = el.getBoundingClientRect();
    const parts = {};
    for (const [key, selectors] of Object.entries(partSelectors)) {
      parts[key] = selectors.flatMap((sel) => [...el.querySelectorAll(sel)]).filter(visible).map((p) => {
        const b = p.getBoundingClientRect();
        return { x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height };
      });
    }
    return { name: el.getAttribute('data-figma'), x: r.left, y: r.top, w: r.width, h: r.height, parts };
  });
}

const ENGINE = { chromium, firefox, webkit }[BROWSER];
const browser = await ENGINE.launch(BROWSER === 'chromium' ? { args: ['--disable-lcd-text', '--font-render-hinting=none'] } : {});
const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

// A story can re-render once after load (args from the URL, a dependency re-optimised by Vite), detaching the
// cell between measuring and capturing it: retry that case once instead of failing the run.
async function screenshotCell(page, name) {
  const locate = () => page.locator(`[data-figma="${name.replace(/"/g, '\\"')}"]`).first();
  try {
    return await locate().screenshot();
  } catch (e) {
    if (!/not attached/.test(String(e))) throw e;
    await page.waitForTimeout(500);
    return locate().screenshot();
  }
}

const report = { component, browser: `${BROWSER} ${browser.version()}`, sets: {} };
let failures = 0;
const lines = ['', `Figma ↔ Storybook parity — ${component} (${report.browser})`];

for (const set of config.sets) {
  if (ONLY_SET && set.set !== ONLY_SET) continue;
  const geometry = readJson(`figma/geometry/${set.set}.json`);
  // A single component (geometry.single) is its own reference image; `origin` is where it starts in that image
  // (a screenshot includes effects such as drop shadows around the node).
  let positions;
  if (geometry.positions) {
    // Sets missing from the section metadata carry their variant positions (from use_figma) in the geometry file.
    positions = new Map(Object.entries(geometry.positions).map(([name, [x, y]]) => [name, { x, y }]));
  } else if (geometry.single) {
    const [ox, oy] = geometry.origin ?? [0, 0];
    positions = new Map(Object.keys(geometry.variants).map((name) => [name, { x: ox, y: oy }]));
  } else {
    const setNode = findById(sectionMeta, geometry.id) ?? (dashboardMeta && findById(dashboardMeta, geometry.id));
    if (!setNode) throw new Error(`set ${geometry.id} not in metadata`);
    positions = new Map(setNode.children.map((c) => [c.name, c]));
  }
  const reference = PNG.sync.read(readFileSync(path.join(ROOT, 'figma', 'reference', `${set.set}.png`)));

  // Normalise selectors: string | string[] | { selector(s), compare }
  const partSpecs = Object.entries(set.parts).map(([key, spec]) => {
    const s = typeof spec === 'string' || Array.isArray(spec) ? { selector: spec } : spec;
    return { key, re: glob(key), selectors: [].concat(s.selector), compare: s.compare ?? 'xywh', optional: Boolean(s.optional) };
  });
  const contentDependent = (set.contentDependent ?? []).map(glob);
  // Figma layers that cannot be reproduced statically (e.g. a scroll indicator): not compared, masked in
  // the pixel check and listed for manual review.
  const ignored = (set.ignore ?? []).map(glob);
  const isIgnored = (p) => ignored.some((re) => re.test(p));
  const tol = set.tolerance ?? 0.5;

  const results = [];
  const measured = [];
  // `story` may list several stories (e.g. states that need an open overlay); "id&args=…" sets story args.
  for (const story of [].concat(set.story)) {
  await page.goto(`${SB}/iframe.html?id=${story}&viewMode=story`);
  await page.waitForSelector('[data-figma]');
  if (set.waitFor) await page.waitForSelector(set.waitFor);
  await page.addStyleTag({ content: `html, body { background: ${set.background} !important; } ${set.harnessCss ?? ''}` });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);

  // `figmaPrefix`: one story holds several sets — cells named "<prefix><variant>" belong to this set.
  const prefix = set.figmaPrefix ?? '';
  const storyMeasured = (await page.evaluate(measure, Object.fromEntries(partSpecs.map((p) => [p.key, p.selectors]))))
    .filter((m) => m.name.startsWith(prefix))
    .map((m) => ({ ...m, attr: m.name, name: m.name.slice(prefix.length) }));
  measured.push(...storyMeasured);
  const calcSize = await page.evaluate(() => CSS.supports('width', 'calc-size(fit-content, round(up, size, 1px))'));

  for (const m of storyMeasured) {
    const g = geometry.variants[m.name];
    const issues = [];
    const notes = [];
    if (!g) { issues.push({ cat: 'structure', detail: 'not a Figma variant name' }); results.push({ name: m.name, issues, notes }); continue; }
    const dw = Math.abs(m.w - g.w);
    // Without calc-size() each box that hugs text may be < 1px narrower. With `accumulatedFallback` (a row of
    // several hugging labels, e.g. Breadcrumb) the allowance is 1px per text box at or before that position.
    const texts = g.n.filter((n) => n[5] === 'T' && !isIgnored(n[0]));
    const fallbackPx = (x) => (set.accumulatedFallback ? Math.max(1, texts.filter((n) => n[1] <= x + tol).length) : 1);
    // A root that hugs its text is < 1px narrower without calc-size() (Firefox, Safari) — docs/browser-support.md.
    if (dw > tol && !calcSize && dw <= fallbackPx(g.w) && Math.abs(m.h - g.h) <= tol) notes.push(`root width ${m.w.toFixed(2)} vs ${g.w} (no calc-size)`);
    else if (dw > tol || Math.abs(m.h - g.h) > tol) issues.push({ cat: 'size', detail: `root ${m.w.toFixed(2)}×${m.h.toFixed(2)} ≠ ${g.w}×${g.h}` });

    // Parts
    for (const spec of partSpecs) {
      const figmaNodes = g.n.filter(([p]) => spec.re.test(p) && !isIgnored(p));
      const dom = [...m.parts[spec.key]];
      for (const [p, x, y, w, h, flag] of figmaNodes) {
        if (!dom.length) { issues.push({ cat: 'structure', detail: `${p}: missing in DOM` }); continue; }
        // nearest DOM candidate
        dom.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
        const d = dom.shift();
        const isText = flag === 'T';
        const dep = contentDependent.some((re) => re.test(p));
        const checks = { x: [d.x, x], y: [d.y, y], w: [d.w, w], h: [d.h, h] };
        for (const axis of spec.compare.split('')) {
          const [a, b] = checks[axis];
          const diff = Math.abs(a - b);
          if (diff <= tol) continue;
          if (dep) continue;
          // Auto-width text boxes are whole pixels in Figma; browsers keep the sub-pixel text width.
          if (isText && axis === 'w' && diff < 1) { notes.push(`${p} text width ${a.toFixed(2)} vs ${b}`); continue; }
          // Without calc-size() (Firefox, Safari) boxes that hug text stay < 1px narrower — docs/browser-support.md.
          if (!calcSize && (axis === 'w' || axis === 'x') && diff <= fallbackPx(axis === 'x' ? x - tol : x + w)) { notes.push(`${p}.${axis} ${a.toFixed(2)} vs ${b} (no calc-size)`); continue; }
          issues.push({ cat: 'geometry', detail: `${p}.${axis} ${a.toFixed(2)} ≠ ${b}` });
        }
      }
      if (!figmaNodes.length && dom.length && !spec.optional) issues.push({ cat: 'structure', detail: `${spec.key}: visible in DOM but not in Figma` });
    }

    // Pixels
    const fp = positions.get(m.name);
    let pixel = null;
    if (fp) {
      const shot = PNG.sync.read(await screenshotCell(page, m.attr));
      const w = Math.min(shot.width, Math.round(g.w)), h = Math.min(shot.height, Math.round(g.h));
      const fig = cropOver(reference, Math.round(fp.x), Math.round(fp.y), w, h, set.background);
      const dom = cropOver(shot, 0, 0, w, h, set.background);
      const textBoxes = g.n.filter((n) => n[5] === 'T' && !isIgnored(n[0])).map(([p, x, y, bw, bh]) => ({ p, x, y, w: bw, h: bh }));
      // maskPixels: ["<layer glob>" | { node, pad }] — areas excluded from the pixel diff only (geometry still checked).
      const pixelMasks = (set.maskPixels ?? []).map((e) => (typeof e === 'string' ? { re: glob(e), pad: 1 } : { re: glob(e.node), pad: e.pad ?? 1 }));
      const maskBoxes = [
        ...textBoxes,
        ...g.n.filter((n) => isIgnored(n[0])).map(([p, x, y, bw, bh]) => ({ p, x, y, w: bw, h: bh })),
        ...g.n.flatMap(([p, x, y, bw, bh]) => pixelMasks.filter((mk) => mk.re.test(p)).map((mk) => ({ p, x: x - mk.pad + 1, y: y - mk.pad + 1, w: bw + 2 * (mk.pad - 1), h: bh + 2 * (mk.pad - 1) }))),
        // maskRects: [[x, y, w, h], …] relative to the variant (negative w / h count from the right / bottom edge);
        // maskRectsFor: { "<variant glob>": [[x, y, w, h], …] } for the matching variants only.
        ...[...(set.maskRects ?? []), ...Object.entries(set.maskRectsFor ?? {}).flatMap(([pat, rects]) => (glob(pat).test(m.name) ? rects : []))].map(
          ([x, y, w, h]) => ({ p: 'rect', x: x < 0 ? g.w + x : x, y: y < 0 ? g.h + y : y, w: w <= 0 ? g.w + w : w, h: h <= 0 ? g.h + h : h }),
        ),
      ];
      // Strict comparison outside text boxes (padded by 1px).
      const mask = (img) => { const c = new PNG({ width: w, height: h }); img.data.copy(c.data); for (const t of maskBoxes) for (let yy = Math.max(0, Math.floor(t.y) - 1); yy < Math.min(h, Math.ceil(t.y + t.h) + 1); yy++) for (let xx = Math.max(0, Math.floor(t.x) - 1); xx < Math.min(w, Math.ceil(t.x + t.w) + 1); xx++) { const i = (yy * w + xx) * 4; c.data[i] = c.data[i + 1] = c.data[i + 2] = 0; } return c; };
      const diff = new PNG({ width: w, height: h });
      const differing = pixelmatch(mask(fig).data, mask(dom).data, diff.data, w, h, { threshold: 0.1 });
      pixel = { nonTextDiffering: differing, ratio: differing / (w * h) };
      // A root that hugs its text is < 1px narrower without calc-size(), so everything right of the text is
      // shifted: recorded (up to 5%) instead of failed — colours and shapes are checked strictly in Chromium.
      const widthFallback = !calcSize && dw > tol && dw <= fallbackPx(g.w);
      if (pixel.ratio > (set.pixelTolerance ?? 0.005) && widthFallback && pixel.ratio <= 0.05) notes.push(`pixels ${(pixel.ratio * 100).toFixed(2)}% (shifted by the no-calc-size width)`);
      else if (pixel.ratio > (set.pixelTolerance ?? 0.005)) issues.push({ cat: 'pixels', detail: `${(pixel.ratio * 100).toFixed(2)}% of non-text pixels differ` });
      // Glyph placement
      const offsets = [];
      for (const t of textBoxes) {
        if (contentDependent.some((re) => re.test(t.p))) continue;
        const a = inkCentroid(fig, t), b = inkCentroid(dom, t);
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        offsets.push({ p: t.p, dx: +dx.toFixed(2), dy: +dy.toFixed(2) });
        const subpixel = fp.x % 1 !== 0;
        // Chromium is the reference engine; other engines rasterise text differently, so horizontal
        // offsets under 1px there are recorded as rendering differences, not defects.
        const dxTol = BROWSER === 'chromium' ? (set.glyphDxTolerance ?? 0.5) : Math.max(fallbackPx(t.x), set.glyphDxTolerance ?? 0);
        // knownDifferences: { "<variant>": "reason" } for every engine, or { "<variant>": { "<engine>": "reason" } }.
        const knownEntry = set.knownDifferences?.[m.name];
        const known = typeof knownEntry === 'string' ? knownEntry : knownEntry?.[BROWSER];
        // Documented engine rendering differences (config knownDifferences) are recorded, not failed.
        if ((Math.abs(dy) > 0.5 || (!subpixel && Math.abs(dx) > dxTol)) && known) notes.push(`${t.p} glyphs dx ${dx.toFixed(2)} dy ${dy.toFixed(2)} — known: ${known}`);
        else if (Math.abs(dy) > 0.5 || (!subpixel && Math.abs(dx) > dxTol)) issues.push({ cat: 'text-position', detail: `${t.p} glyphs dx ${dx.toFixed(2)} dy ${dy.toFixed(2)}` });
        else if (!subpixel && Math.abs(dx) > 0.5) notes.push(`${t.p} glyph dx ${dx.toFixed(2)} (${BROWSER} text rendering)`);
      }
      pixel.glyphs = offsets;
      if (issues.some((i) => i.cat === 'pixels' || i.cat === 'text-position')) {
        const pixDiff = new PNG({ width: w, height: h });
        pixelmatch(fig.data, dom.data, pixDiff.data, w, h, { threshold: 0.1 });
        const file = `${BROWSER}--${set.set}--${m.name.replace(/[^a-zA-Z0-9]+/g, '_')}.png`;
        writeFileSync(path.join(OUT, file), PNG.sync.write(sideBySide(fig, dom, pixDiff)));
        pixel.diffImage = path.join('.verify', component, file);
      }
    } else {
      issues.push({ cat: 'structure', detail: 'variant not found in set metadata' });
    }
    results.push({ name: m.name, issues, notes, pixel });
  }
  }
  const expected = Object.keys(geometry.variants);
  const missing = expected.filter((n) => !measured.some((m) => m.name === n));
  report.sets[set.set] = { expected: expected.length, rendered: measured.length, missing, results };

  const clean = results.filter((r) => !r.issues.length).length;
  const byCat = {};
  for (const r of results) for (const i of r.issues) (byCat[i.cat] ??= []).push(`${r.name}: ${i.detail}`);
  const ratios = results.map((r) => r.pixel?.ratio ?? 0);
  const glyphs = results.flatMap((r) => r.pixel?.glyphs ?? []);
  lines.push('', `${set.set}: rendered ${measured.length}/${expected.length}${missing.length ? ` (missing: ${missing.join(' | ')})` : ''}`);
  lines.push(`  all checks passed: ${clean}/${results.length}`);
  for (const [v, entry] of Object.entries(set.knownDifferences ?? {})) { const why = typeof entry === 'string' ? entry : entry[BROWSER]; if (why) lines.push(`  ◇ known difference — ${v}: ${why}`); }
  if (set.maskRects) lines.push(`  ◇ manual review (pixels not compared): ${set['//maskRects'] ?? 'masked areas'}`);
  if (ignored.length) lines.push(`  ◇ manual review (not compared): ${set.ignore.join(", ")}`);
  for (const [cat, list] of Object.entries(byCat)) lines.push(`  ✗ ${cat}: ${list.length} — e.g. ${list[0]}`);
  lines.push(`  non-text pixels: mean ${((ratios.reduce((a, b) => a + b, 0) / Math.max(1, ratios.length)) * 100).toFixed(2)}% differing, max ${(Math.max(0, ...ratios) * 100).toFixed(2)}%`);
  if (glyphs.length) lines.push(`  glyph offset vs Figma: max |dx| ${Math.max(...glyphs.map((o) => Math.abs(o.dx))).toFixed(2)}px, max |dy| ${Math.max(...glyphs.map((o) => Math.abs(o.dy))).toFixed(2)}px`);
  const noteCount = results.reduce((a, r) => a + r.notes.length, 0);
  if (noteCount) lines.push(`  ~ ${noteCount} sub-pixel text-width notes (Figma whole-pixel text boxes)`);
  failures += results.reduce((a, r) => a + r.issues.length, 0) + missing.length;
}
await browser.close();

if (consoleErrors.length) { lines.push('', `browser console errors: ${consoleErrors.length} — e.g. ${consoleErrors[0]}`); failures += consoleErrors.length; }
writeFileSync(path.join(OUT, `report-${BROWSER}.json`), JSON.stringify(report, null, 2));
console.log(lines.join('\n'));
console.log(`\nreport: .verify/${component}/report-${BROWSER}.json${failures ? `\n${failures} failing checks` : '\nall checks passed'}`);
process.exitCode = failures ? 1 : 0;
