// Which Tabler icon classes the app uses — shared by
// scripts/build-icon-subset.mjs and src/styles/__tests__/icons.test.js.
//
// A class counts as used when `ti-<name>` appears in index.html or anywhere
// in src/ (components, and the data whose `icon` fields they render). Tests
// and the generated stylesheet itself are not scanned: the stylesheet lists
// every icon in the subset, so counting it would keep stale icons forever.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const TABLER_VERSION = '3.44.0';
export const ICON_CSS = 'src/styles/tabler-icons.css';
export const ICON_FONT = 'src/styles/fonts/tabler-icons-subset.woff2';

// Paths are relative to the repository root, where npm scripts and Vitest run.
const SCANNED = /\.(jsx?|css)$/;
// `multi-step` must not count as the icon `ti-step`.
const CLASS = /(?<![\w-])ti-[a-z0-9]+(?:-[a-z0-9]+)*/g;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const path = join(dir, d.name);
    if (d.isDirectory()) return d.name === '__tests__' ? [] : walk(path);
    return SCANNED.test(d.name) && path !== ICON_CSS ? [path] : [];
  });
}

/** Sorted `ti-…` class names used by the app. */
export function usedIconClasses() {
  const names = new Set();
  for (const file of ['index.html', ...walk('src')]) {
    for (const m of readFileSync(file, 'utf8').matchAll(CLASS)) names.add(m[0]);
  }
  return [...names].sort();
}
