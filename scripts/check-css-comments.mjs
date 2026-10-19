// Finds CSS comments that end too early: a "*/" inside the comment text (e.g. "colors/chart/bar/*/gradient") closes
// it, the rest of the text becomes an invalid selector and the browser drops the next rule without an error.
// A stray "*/" outside any comment is the sign. Used by `npm run lint`.
//
//   node scripts/check-css-comments.mjs
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/figma-snapshot.mjs';

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const problems = [];
for (const file of walk(path.join(ROOT, 'src')).filter((f) => f.endsWith('.css'))) {
  const text = readFileSync(file, 'utf8');
  let i = 0;
  for (;;) {
    const open = text.indexOf('/*', i);
    const stray = text.indexOf('*/', i);
    if (stray !== -1 && (open === -1 || stray < open)) {
      problems.push(`${path.relative(ROOT, file)}:${text.slice(0, stray).split('\n').length}: "*/" outside a comment — a comment above ends too early`);
      i = stray + 2;
      continue;
    }
    if (open === -1) break;
    const close = text.indexOf('*/', open + 2);
    if (close === -1) { problems.push(`${path.relative(ROOT, file)}: unterminated comment`); break; }
    i = close + 2;
  }
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('css comments ok');
