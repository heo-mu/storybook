// Runs every Figma parity check (figma/verify/*.json) in the given engines and prints one summary line each.
//
//   npm run storybook                                   (in another terminal)
//   node scripts/verify-all.mjs [--browsers=chromium,firefox,webkit]
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/figma-snapshot.mjs';

const browsers = (process.argv.find((a) => a.startsWith('--browsers='))?.split('=')[1] ?? 'chromium,firefox,webkit').split(',');
const components = readdirSync(path.join(ROOT, 'figma', 'verify')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
let failed = 0;
for (const browser of browsers) {
  for (const component of components) {
    let out = '';
    let ok = true;
    try {
      out = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'verify-figma.mjs'), component, `--browser=${browser}`], { cwd: ROOT, encoding: 'utf8' });
    } catch (e) {
      ok = false;
      out = String(e.stdout ?? '');
    }
    const sets = [...out.matchAll(/^(\S+): rendered (\d+)\/(\d+)[^\n]*\n\s+all checks passed: (\d+)\/(\d+)/gm)].map((m) => `${m[1]} ${m[4]}/${m[3]}`);
    console.log(`${ok ? '✓' : '✗'} ${browser.padEnd(8)} ${component.padEnd(18)} ${sets.join(' · ')}`);
    if (!ok) failed++;
  }
}
console.log(failed ? `\n${failed} component checks failing` : '\nall components pass');
process.exitCode = failed ? 1 : 0;
