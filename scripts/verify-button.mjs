// Figma ↔ Storybook parity check for every variant of the Button frame (296).
//
//   npm run storybook                              (in another terminal)
//   npm run verify:button                          → Chromium (reference engine)
//   npm run verify:button -- --browser=firefox     → or webkit
// Prints a report and writes .verify/button-report-<browser>.json + diff images.
//
// For each Figma variant the matching element (data-figma="<variant name>") in the Variant Matrix
// stories is measured in the browser and compared with figma/button-spec.json:
//   size, padding, gap, radius, stroke, background / label / icon colour, child (icon/label) boxes,
//   typography — and a pixel diff against the Figma screenshot in figma/reference/.
// Hover/Pressed are also checked with a real mouse (no pseudo-state forcing) on the Playground stories.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { ROOT } from './lib/figma-snapshot.mjs';

const SB = process.env.STORYBOOK_URL ?? 'http://localhost:6006';
const BROWSER = process.argv.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const ENGINE = { chromium, firefox, webkit }[BROWSER];
if (!ENGINE) throw new Error(`Unknown --browser=${BROWSER} (chromium | firefox | webkit)`);
const OUT = path.join(ROOT, '.verify');
mkdirSync(OUT, { recursive: true });
const json = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'));
const spec = json('figma/button-spec.json');
const positions = json('figma/button-variants.json');

const SETS = [
  { key: 'button_basic', story: 'components-button-variant-matrix--button-matrix', bg: '#fdfdfd' },
  { key: 'button_icon', story: 'components-button-variant-matrix--icon-button-matrix', bg: '#ffffff' },
  { key: 'button_text', story: 'components-button-variant-matrix--text-button-matrix', bg: '#ffffff' },
];
const WEIGHT = { Regular: '400', Medium: '500', SemiBold: '600', Bold: '700', ExtraBold: '800' };

const parseName = (name) => Object.fromEntries(name.split(', ').map((kv) => kv.split('=')));
// button_text geometry depends on the icons (Figma variant properties Left Icon / Right Icon since 2026-10-30)
const geoKey = (set, p) => (set === 'button_text' ? `${p.Size}/${p['Left Icon']}/${p['Right Icon']}` : `${p.Size}/${p.Shape}`);
const colorKey = (set, p) => (set === 'button_text' ? `${p.Type}/${p.State}` : `${p.Variant}/${p.Appearance}/${p.State}`);

function toHex(css) {
  const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(css);
  if (!m) return css;
  const hex = [m[1], m[2], m[3]].map((v) => Math.round(Number(v)).toString(16).padStart(2, '0')).join('');
  const a = m[4] === undefined ? 1 : Number(m[4]);
  return `#${hex}${a < 1 ? Math.round(a * 255).toString(16).padStart(2, '0') : ''}`;
}
function parseStroke(boxShadow) {
  // "rgb(0, 74, 56) 0px 0px 0px 1px inset" | "none"
  const m = /(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px inset/.exec(boxShadow);
  if (!m || Number(m[2]) === 0) return null;
  return { hex: toHex(m[1]), w: Number(m[2]) };
}

// ------------------------------------------------------------------ DOM measurement
function measureAll() {
  const px = (v) => parseFloat(v);
  return [...document.querySelectorAll('[data-figma]')].map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const kids = [...el.children].map((k) => {
      const kr = k.getBoundingClientRect();
      const ks = getComputedStyle(k);
      return {
        kind: k.classList.contains('ds-button__icon') ? 'icon' : 'label',
        x: kr.left - r.left, y: kr.top - r.top, w: kr.width, h: kr.height,
        color: ks.color, fontFamily: ks.fontFamily, fontSize: px(ks.fontSize), fontWeight: ks.fontWeight,
        lineHeight: ks.lineHeight, letterSpacing: ks.letterSpacing, paddingTop: px(ks.paddingTop),
      };
    });
    return {
      name: el.getAttribute('data-figma'),
      x: r.left, y: r.top, w: r.width, h: r.height,
      pad: [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)],
      gap: px(cs.columnGap) || 0,
      radius: px(cs.borderTopLeftRadius),
      bg: cs.backgroundColor, boxShadow: cs.boxShadow, kids,
    };
  });
}

function compare(setKey, m, calcSize) {
  const p = parseName(m.name);
  const g = spec[setKey].geometry[geoKey(setKey, p)];
  const c = spec[setKey].colors[colorKey(setKey, p)];
  const issues = [];
  const known = [];
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const check = (cat, ok, detail) => { if (!ok) issues.push({ cat, detail }); };
  // Values that depend on the label width. Without calc-size() (Firefox, Safari) the label keeps its
  // natural width, < 1px narrower than Figma's whole-pixel text box; that sub-pixel difference is the
  // documented fallback (docs/browser-support.md), anything larger is a failure.
  const checkLabelDependent = (cat, actual, expected, detail) => {
    if (near(actual, expected, 0.5)) return;
    (!calcSize && Math.abs(actual - expected) < 1 ? known : issues).push({ cat, detail });
  };

  check('size', near(m.h, g.h, 0.01), `height ${m.h} ≠ ${g.h}`);
  checkLabelDependent('size', m.w, g.w, `width ${m.w.toFixed(2)} ≠ ${g.w}`);
  check('padding', m.pad.every((v, i) => v === g.pad[i]), `padding ${m.pad} ≠ ${g.pad}`);
  check('gap', m.gap === g.gap, `gap ${m.gap} ≠ ${g.gap}`);
  check('radius', m.radius === g.radius, `radius ${m.radius} ≠ ${g.radius}`);
  const stroke = parseStroke(m.boxShadow);
  check('border', JSON.stringify(stroke) === JSON.stringify(c.stroke ? { hex: c.stroke.hex, w: c.stroke.w } : null), `stroke ${JSON.stringify(stroke)} ≠ ${JSON.stringify(c.stroke && { hex: c.stroke.hex, w: c.stroke.w })}`);
  check('color', toHex(m.bg) === c.bg.hex, `background ${toHex(m.bg)} ≠ ${c.bg.hex} (${c.bg.token})`);

  const domKids = m.kids;
  check('structure', domKids.length === g.kids.length, `children ${domKids.map((k) => k.kind)} ≠ ${g.kids.map((k) => k.kind)}`);
  g.kids.forEach((fk, i) => {
    const dk = domKids[i];
    if (!dk || dk.kind !== fk.kind) return;
    const tag = `${fk.kind}[${i}]`;
    if (fk.kind === 'icon') {
      check('icon', near(dk.w, fk.w, 0.01) && near(dk.h, fk.h, 0.01), `${tag} size ${dk.w}×${dk.h} ≠ ${fk.w}×${fk.h}`);
      check('alignment', near(dk.y, fk.y, 0.01), `${tag} y ${dk.y} ≠ ${fk.y}`);
      checkLabelDependent('alignment', dk.x, fk.x, `${tag} x ${dk.x.toFixed(2)} ≠ ${fk.x}`);
      check('color', toHex(dk.color) === c.icon.hex, `${tag} colour ${toHex(dk.color)} ≠ ${c.icon.hex} (${c.icon.token})`);
    } else {
      check('alignment', near(dk.y, fk.y, 0.01) && near(dk.h, fk.h, 0.01), `label y/h ${dk.y}/${dk.h} ≠ ${fk.y}/${fk.h}`);
      check('alignment', near(dk.x, fk.x, 0.01), `label x ${dk.x} ≠ ${fk.x}`);
      checkLabelDependent('label-width', dk.w, fk.w, `label width ${dk.w.toFixed(2)} ≠ ${fk.w}`);
      const [family, style] = fk.font.split('/');
      check('typography', dk.fontFamily.includes(family), `font-family ${dk.fontFamily}`);
      // Line box = padding-top + line-height (lg splits its 24px line box as 1px + 23px, see Button.css).
      const lineBox = parseFloat(dk.lineHeight) + dk.paddingTop;
      check('typography', dk.fontSize === fk.size && dk.fontWeight === WEIGHT[style] && lineBox === fk.lh, `font ${dk.fontSize}/${lineBox}px/${dk.fontWeight} ≠ ${fk.size}/${fk.lh}px/${WEIGHT[style]}`);
      check('typography', dk.letterSpacing === 'normal' ? fk.ls === 0 : parseFloat(dk.letterSpacing) === fk.ls, `letter-spacing ${dk.letterSpacing} ≠ ${fk.ls}`);
      check('color', toHex(dk.color) === c.label.hex, `label colour ${toHex(dk.color)} ≠ ${c.label.hex} (${c.label.token})`);
    }
  });
  return { issues, known };
}

// ------------------------------------------------------------------ pixel diff
const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
function cropOver(png, x, y, w, h, bg) {
  const out = new PNG({ width: w, height: h });
  const [br, bgc, bb] = hexRgb(bg);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const s = ((y + j) * png.width + (x + i)) * 4;
      const d = (j * w + i) * 4;
      const a = png.data[s + 3] / 255;
      out.data[d] = Math.round(png.data[s] * a + br * (1 - a));
      out.data[d + 1] = Math.round(png.data[s + 1] * a + bgc * (1 - a));
      out.data[d + 2] = Math.round(png.data[s + 2] * a + bb * (1 - a));
      out.data[d + 3] = 255;
    }
  }
  return out;
}
/** Intensity-weighted centroid of the label glyphs inside the Figma label box (x, y, w, h). */
function inkCentroid(img, box) {
  const at = (x, y) => { const i = (y * img.width + x) * 4; return img.data[i] + img.data[i + 1] + img.data[i + 2]; };
  const base = at(Math.max(0, Math.floor(box.x) - 1), Math.floor(box.y) + 1);
  let sum = 0, sx = 0, sy = 0;
  for (let y = Math.max(0, Math.floor(box.y) - 2); y < Math.min(img.height, box.y + box.h + 2); y++) {
    for (let x = Math.max(0, Math.floor(box.x) - 2); x < Math.min(img.width, box.x + box.w + 2); x++) {
      const d = Math.abs(at(x, y) - base); sum += d; sx += d * x; sy += d * y;
    }
  }
  return sum ? { x: sx / sum, y: sy / sum } : null;
}
function sideBySide(a, b, diff) {
  const w = a.width + b.width + diff.width + 8;
  const h = Math.max(a.height, b.height, diff.height);
  const out = new PNG({ width: w, height: h, fill: true });
  out.data.fill(255);
  let ox = 0;
  for (const img of [a, b, diff]) { PNG.bitblt(img, out, 0, 0, img.width, img.height, ox, 0); ox += img.width + 4; }
  return out;
}

// ------------------------------------------------------------------ run
// Grayscale, unhinted text like Figma's renderer (Windows Chromium defaults to LCD subpixel text).
const browser = await ENGINE.launch(BROWSER === 'chromium' ? { args: ['--disable-lcd-text', '--font-render-hinting=none'] } : {});
const browserVersion = browser.version();
const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
const report = { storybook: SB, sets: {}, interaction: [] };
let failures = 0;

for (const set of SETS) {
  await page.goto(`${SB}/iframe.html?id=${set.story}&viewMode=story`);
  await page.waitForSelector('[data-figma]');
  // storybook-addon-pseudo-states applies its classes after the first render.
  await page.waitForSelector('[data-pseudo="hover"].pseudo-hover');
  await page.waitForSelector('[data-pseudo="pressed"].pseudo-active');
  // Comparison harness only: Figma background + an integer-pixel grid so every button sits on whole pixels.
  await page.addStyleTag({
    content: `html, body { background: ${set.bg} !important; }
      table { table-layout: fixed; }
      th, td { width: 128px; min-width: 128px; max-width: 128px; overflow: hidden; }
      tr > :first-child { width: 280px; min-width: 280px; max-width: 280px; }`,
  });
  await page.evaluate(() => document.fonts.ready);
  const fontLoaded = await page.evaluate(() => document.fonts.check('500 12px "Pretendard Variable"'));
  const calcSize = await page.evaluate(() => CSS.supports('width', 'calc-size(fit-content, round(up, size, 1px))'));
  const measured = await page.evaluate(measureAll);
  const ref = PNG.sync.read(readFileSync(path.join(ROOT, 'figma', 'reference', `${set.key}.png`)));
  const pos = new Map(positions[set.key].variants.map((v) => [v.name, v]));

  const results = [];
  for (const m of measured) {
    const { issues, known } = compare(set.key, m, calcSize);
    const fp = pos.get(m.name);
    let pixel = null;
    if (fp) {
      const shot = PNG.sync.read(await page.locator(`[data-figma="${m.name}"]`).screenshot());
      const w = Math.min(shot.width, Math.round(fp.w));
      const h = Math.min(shot.height, Math.round(fp.h));
      const figmaCrop = cropOver(ref, Math.round(fp.x), Math.round(fp.y), w, h, set.bg);
      const domCrop = cropOver(shot, 0, 0, w, h, set.bg);
      const diff = new PNG({ width: w, height: h });
      const differing = pixelmatch(figmaCrop.data, domCrop.data, diff.data, w, h, { threshold: 0.1 });
      pixel = { differing, total: w * h, ratio: differing / (w * h), subpixelX: fp.x % 1 !== 0 };
      // Glyph placement: the label ink must sit where Figma draws it (±0.5px). Figma variants placed
      // on half pixels (button_text) are rasterised between pixels, so only y is compared there.
      const labelBox = spec[set.key].geometry[geoKey(set.key, parseName(m.name))].kids.find((k) => k.kind === 'label');
      if (labelBox) {
        const f = inkCentroid(figmaCrop, labelBox), d = inkCentroid(domCrop, labelBox);
        if (f && d) {
          pixel.glyphOffset = { dx: +(d.x - f.x).toFixed(2), dy: +(d.y - f.y).toFixed(2) };
          const dx = Math.abs(d.x - f.x);
          const detail = `label glyphs offset dx ${pixel.glyphOffset.dx} dy ${pixel.glyphOffset.dy}`;
          if (Math.abs(d.y - f.y) > 0.5) issues.push({ cat: 'text-position', detail });
          // Without calc-size() the centred glyphs shift by half the missing sub-pixel label width.
          else if (!pixel.subpixelX && dx > 0.5) (!calcSize && dx < 1 ? known : issues).push({ cat: 'text-position', detail });
        }
      }
      if (pixel.ratio > 0.02) {
        const file = `${BROWSER}--${set.key}--${m.name.replace(/[^a-zA-Z0-9]+/g, '_')}.png`;
        writeFileSync(path.join(OUT, file), PNG.sync.write(sideBySide(figmaCrop, domCrop, diff)));
        pixel.diffImage = `.verify/${file}`;
      }
    } else {
      issues.push({ cat: 'structure', detail: 'variant not found in Figma metadata' });
    }
    results.push({ name: m.name, issues, known, pixel });
  }
  const missing = positions[set.key].variants.map((v) => v.name).filter((n) => !measured.some((m) => m.name === n));
  report.sets[set.key] = { expected: positions[set.key].variants.length, rendered: measured.length, missing, fontLoaded, calcSize, results };
}

// Real pointer interaction on the Playground stories (no pseudo-state forcing).
const INTERACTIONS = [
  ...[['primary', 'solid'], ['primary', 'outline'], ['secondary', 'solid'], ['secondary', 'outline'], ['tertiary', 'solid'], ['tertiary', 'outline']].map(([v, a]) => ({
    set: 'button_basic', story: 'components-button-button--playground', args: `variant:${v};appearance:${a}`, key: `${v[0].toUpperCase() + v.slice(1)}/${a[0].toUpperCase() + a.slice(1)}`,
  })),
  ...[['primary', 'solid'], ['secondary', 'solid'], ['tertiary', 'solid'], ['tertiary', 'outline']].map(([v, a]) => ({
    set: 'button_icon', story: 'components-button-iconbutton--playground', args: `variant:${v};appearance:${a}`, key: `${v[0].toUpperCase() + v.slice(1)}/${a[0].toUpperCase() + a.slice(1)}`,
  })),
  { set: 'button_text', story: 'components-button-textbutton--playground', args: 'variant:primary;leftIcon:CaretLeft', key: 'Primary' },
  { set: 'button_text', story: 'components-button-textbutton--playground', args: 'variant:secondary;leftIcon:CaretLeft', key: 'SecondarySecondary' },
];
for (const it of INTERACTIONS) {
  await page.goto(`${SB}/iframe.html?id=${it.story}&viewMode=story&args=${it.args}`);
  const btn = page.locator('#storybook-root button').first();
  await btn.waitFor();
  const read = () => btn.evaluate((el) => {
    const icon = el.querySelector('.ds-button__icon');
    const label = el.querySelector('.ds-button__label');
    return { bg: getComputedStyle(el).backgroundColor, label: label && getComputedStyle(label).color, icon: icon && getComputedStyle(icon).color };
  });
  const states = {};
  await page.mouse.move(0, 0);
  states.Default = await read();
  await btn.hover();
  states.Hover = await read();
  await page.mouse.down();
  states.Pressed = await read();
  await page.mouse.up();
  for (const [state, got] of Object.entries(states)) {
    const c = spec[it.set].colors[`${it.key}/${state}`];
    const issues = [];
    if (toHex(got.bg) !== c.bg.hex) issues.push(`background ${toHex(got.bg)} ≠ ${c.bg.hex}`);
    if (c.label && got.label && toHex(got.label) !== c.label.hex) issues.push(`label ${toHex(got.label)} ≠ ${c.label.hex}`);
    if (c.icon && got.icon && toHex(got.icon) !== c.icon.hex) issues.push(`icon ${toHex(got.icon)} ≠ ${c.icon.hex}`);
    report.interaction.push({ component: it.set, tone: it.key, state, ok: issues.length === 0, issues });
  }
}
await browser.close();

// ------------------------------------------------------------------ summary
const lines = ['', `Figma ↔ Storybook parity — Button frame (${BROWSER} ${browserVersion})`, ''];
for (const [key, s] of Object.entries(report.sets)) {
  const byCat = {};
  for (const r of s.results) for (const i of r.issues) (byCat[i.cat] ??= []).push(`${r.name}: ${i.detail}`);
  const clean = s.results.filter((r) => r.issues.length === 0).length;
  const ratios = s.results.map((r) => r.pixel?.ratio ?? 0);
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const worst = [...s.results].sort((a, b) => (b.pixel?.ratio ?? 0) - (a.pixel?.ratio ?? 0))[0];
  lines.push(`${key}: rendered ${s.rendered}/${s.expected}${s.missing.length ? ` (missing ${s.missing.length})` : ''}, font loaded: ${s.fontLoaded}, calc-size(): ${s.calcSize}`);
  lines.push(`  all checks passed: ${clean}/${s.rendered}`);
  for (const [cat, list] of Object.entries(byCat)) {
    lines.push(`  ✗ ${cat}: ${list.length} — e.g. ${list[0]}`);
    failures += list.length;
  }
  const knownList = s.results.flatMap((r) => r.known.map((k) => `${r.name}: ${k.detail}`));
  if (knownList.length) {
    const affected = s.results.filter((r) => r.known.length).length;
    lines.push(`  ~ known sub-pixel fallback (no calc-size): ${affected} variants, all < 1px — e.g. ${knownList[0]}`);
  }
  lines.push(`  pixels: mean ${(mean * 100).toFixed(2)}% differing, worst ${((worst.pixel?.ratio ?? 0) * 100).toFixed(2)}% (${worst.name})`);
  const offs = s.results.map((r) => r.pixel?.glyphOffset).filter(Boolean);
  if (offs.length) lines.push(`  label glyph offset vs Figma: max |dx| ${Math.max(...offs.map((o) => Math.abs(o.dx))).toFixed(2)}px, max |dy| ${Math.max(...offs.map((o) => Math.abs(o.dy))).toFixed(2)}px`);
  failures += s.missing.length;
}
const badInteraction = report.interaction.filter((i) => !i.ok);
lines.push('', `real pointer Default/Hover/Pressed: ${report.interaction.length - badInteraction.length}/${report.interaction.length} ok`);
for (const b of badInteraction) lines.push(`  ✗ ${b.component} ${b.tone}/${b.state}: ${b.issues.join('; ')}`);
failures += badInteraction.length;

writeFileSync(path.join(OUT, `button-report-${BROWSER}.json`), JSON.stringify(report, null, 2));
console.log(lines.join('\n'));
console.log(`\nreport: .verify/button-report-${BROWSER}.json${failures ? `\n${failures} failing checks` : '\nall checks passed'}`);
process.exitCode = failures ? 1 : 0;
