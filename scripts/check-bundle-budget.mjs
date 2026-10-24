// Initial-load JS budget (docs/audits/MIGRATION_RISKS.md R-12).
// Run after `npm run build`. Measures exactly what index.html loads up front
// — the entry module plus every <link rel="modulepreload"> — gzipped, and
// fails if it exceeds the budget. Lazy chunks (Python Hub data, the Model Map,
// any future 3D or curriculum bundle) are deliberately excluded: the rule is
// that they must never become part of this set, which this check enforces.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

// Baseline at d1d0ce1, measured by this script: 79.2 KB gzip (Vite's own
// build report says ~81.4 because it gzips each file differently). The
// budget leaves headroom for Phase 1 shell changes without inviting drift.
const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB || 90);
const dist = 'dist';
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const base = '/formula-intelligence/';

const refs = [
  ...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g),
  ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g),
].map((m) => m[1].replace(base, ''));

let total = 0;
for (const ref of new Set(refs)) {
  const kb = gzipSync(readFileSync(join(dist, ref))).length / 1024;
  total += kb;
  console.log(`  ${ref.padEnd(44)} ${kb.toFixed(1)} KB gzip`);
}
console.log(`Initial JS: ${total.toFixed(1)} KB gzip (budget ${BUDGET_KB} KB)`);
if (!refs.length) {
  console.error('No initial scripts found in dist/index.html — is the build missing?');
  process.exit(1);
}
if (total > BUDGET_KB) {
  console.error(`Over budget by ${(total - BUDGET_KB).toFixed(1)} KB.`);
  process.exit(1);
}
