import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { ICON_CSS, ICON_FONT, usedIconClasses } from '../../../scripts/lib/icons.mjs';

// The icon font is a committed subset of Tabler Icons (scripts/build-icon-subset.mjs).
// An icon class with no rule renders nothing, silently — so a missing one
// fails here, with the command that fixes it.

const css = readFileSync(ICON_CSS, 'utf8');
const inSubset = new Set([...css.matchAll(/^\.(ti-[a-z0-9-]+):before\{content:"\\[0-9a-f]+"\}$/gm)].map((m) => m[1]));

describe('icon subset', () => {
  it('has a glyph for every icon class the app uses', () => {
    const missing = usedIconClasses().filter((name) => !inSubset.has(name));
    expect(missing, 'run `npm run icons` to rebuild the subset').toEqual([]);
  });

  it('is served by the app itself, not a third-party stylesheet', () => {
    expect(readFileSync('index.html', 'utf8')).not.toMatch(/tabler-icons|cdnjs/);
    expect(readFileSync('src/main.jsx', 'utf8')).toMatch(/import '\.\/styles\/tabler-icons\.css'/);
    expect(statSync(ICON_FONT).size).toBeLessThan(30 * 1024);
  });
});
