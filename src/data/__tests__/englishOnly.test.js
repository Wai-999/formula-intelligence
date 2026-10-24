import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Master Prompt V3.1 §4/§14: "English-only visible UI, no dangling
// localization toggle or broken text rendering." The rendered-DOM check lives
// in e2e/english-only.spec.js, but it can only see what is on screen — three
// predict options in a collapsed Pipeline stage carried Burmese as their
// researcher-depth text and survived it (found by the codemod snapshot, see
// docs/UPGRADE_PROGRESS.md). Scanning the source catches every string,
// visible or not, before it ships.
const MYANMAR = /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/;

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(jsx?|css|html)$/.test(name) ? [p] : [];
  });
}

describe('English-only source', () => {
  it('contains no Myanmar script anywhere in src/', () => {
    const offenders = [];
    for (const f of files('src')) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (MYANMAR.test(line)) offenders.push(`${f}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('index.html declares English', () => {
    expect(readFileSync('index.html', 'utf8')).toMatch(/<html[^>]*\blang="en"/);
  });
});
