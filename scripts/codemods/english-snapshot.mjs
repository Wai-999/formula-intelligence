// Snapshot of every depth-aware content string the app can render, for the
// English-only codemod (docs/audits/MIGRATION_RISKS.md R-04). Run before and
// after; the two files must be identical. Handles both content shapes:
//   old: { en: { beginner, researcher }, my: { ... } }
//   new: { beginner, researcher }
// Usage: node scripts/codemods/english-snapshot.mjs <out.json>
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = process.argv[2];
if (!out) throw new Error('usage: english-snapshot.mjs <out.json>');

function listJs(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '__tests__' ? [] : listJs(p);
    return p.endsWith('.js') ? [p] : [];
  });
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
function english(v) {
  if (!isObj(v)) return null;
  if (isObj(v.en) && typeof v.en.beginner === 'string') return [v.en.beginner, v.en.researcher];
  const keys = Object.keys(v);
  if (keys.length === 2 && typeof v.beginner === 'string' && typeof v.researcher === 'string') return [v.beginner, v.researcher];
  return null;
}

const snapshot = {};
const seen = new WeakSet();
function walk(value, path) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  const en = english(value);
  if (en) { snapshot[path] = en; return; }
  for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
}

const files = [...listJs('src/data'), 'src/store/useMLUIStore.js'];
for (const f of files.sort()) {
  const mod = await import(pathToFileURL(f).href);
  for (const [name, value] of Object.entries(mod)) walk(value, `${relative('src', f)}#${name}`);
}
writeFileSync(out, JSON.stringify(snapshot, null, 1));
console.log(`${Object.keys(snapshot).length} content objects from ${files.length} modules -> ${out}`);
