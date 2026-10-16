// Post-build: ships the raw token files and the font entry next to the bundled stylesheet.
import { cpSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/figma-snapshot.mjs';

const dist = path.join(ROOT, 'dist');
cpSync(path.join(ROOT, 'src', 'tokens'), path.join(dist, 'tokens'), { recursive: true });

// Pretendard Variable is the font family of every Figma text style ("font/family/basic").
// The bare @import is resolved by the consumer's bundler from this package's dependencies.
writeFileSync(
  path.join(dist, 'fonts.css'),
  '/* Pretendard Variable — the "font/family/basic" token of the design system. */\n@import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";\n',
);
console.log('dist: tokens/ and fonts.css copied');
