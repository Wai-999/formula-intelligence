import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// An unclosed rule does not fail the build: the browser reads everything after
// it as nested inside that rule, so whole sections silently stop applying.
// That happened to Home's time-box and path styles after a merge
// (c17f789, found 2026-11-14). Every stylesheet must open and close evenly.

const ROOT = join(process.cwd(), 'src');

function cssFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' ? [] : cssFiles(p);
    return name.endsWith('.css') ? [p] : [];
  });
}

/** The first place the braces go wrong, or null. Comments and strings are skipped. */
function braceProblem(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
  let depth = 0;
  let line = 1;
  for (const ch of text) {
    if (ch === '\n') line += 1;
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth < 0) return `an extra } near line ${line}`;
  }
  return depth ? `${depth} unclosed { at the end` : null;
}

describe('stylesheets', () => {
  const files = cssFiles(ROOT);

  it('are found', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.map((f) => [f.slice(ROOT.length + 1), f]))('%s opens and closes every rule', (_, file) => {
    expect(braceProblem(readFileSync(file, 'utf8'))).toBeNull();
  });
});
