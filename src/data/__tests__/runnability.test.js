import { describe, it, expect } from 'vitest';
import { NOT_RUNNABLE, runnability, RUNTIME_NOTE } from '../python/runnability.js';
import { PY_ALL_ENTRIES } from '../python/index.js';
import { formatPythonError } from '../../lib/pyodideRunner.js';

// This table was produced by actually executing all 126 samples in Pyodide,
// not by guessing from imports. It drives whether a Run button appears, so a
// stale entry either hides a button that would work or offers one that
// always fails — both worse than no button at all.

const ids = new Set(PY_ALL_ENTRIES.map((e) => e.id));

describe('runnability table', () => {
  it('references only entries that still exist', () => {
    const orphans = Object.keys(NOT_RUNNABLE).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  it('marks 16 of 126 samples unrunnable, and the rest runnable', () => {
    expect(Object.keys(NOT_RUNNABLE)).toHaveLength(16);
    const runnable = PY_ALL_ENTRIES.filter((e) => runnability(e.id).runnable);
    expect(runnable).toHaveLength(110);
  });

  it('gives every blocked sample a kind and a human reason', () => {
    for (const [id, v] of Object.entries(NOT_RUNNABLE)) {
      expect(['package', 'slow', 'heavy', 'network', 'other'], `${id}.kind`).toContain(v.kind);
      expect(v.why.length, `${id}.why`).toBeGreaterThan(20);
      // The reason is shown to a user, so it must read as prose, not as a
      // stack trace fragment.
      expect(v.why, `${id}.why`).not.toMatch(/Traceback|File "|\bline \d+/);
    }
  });

  it('blocks every sample importing a package Pyodide has no build for', () => {
    // If this fails, someone added a torch/xgboost sample without marking it,
    // and the Run button would appear and then fail on ModuleNotFoundError.
    const UNAVAILABLE = ['torch', 'xgboost', 'lightgbm', 'catboost', 'arch', 'prophet', 'gymnasium'];
    const unmarked = PY_ALL_ENTRIES.filter((e) => {
      const imports = [...e.code.matchAll(/(?:^|\n)\s*(?:import|from)\s+([a-zA-Z_][\w.]*)/g)]
        .map((m) => m[1].split('.')[0]);
      return imports.some((lib) => UNAVAILABLE.includes(lib)) && runnability(e.id).runnable;
    }).map((e) => e.id);
    expect(unmarked).toEqual([]);
  });

  it('blocks every sample that downloads a dataset at runtime', () => {
    const unmarked = PY_ALL_ENTRIES
      .filter((e) => /fetch_(california_housing|20newsgroups|openml)/.test(e.code) && runnability(e.id).runnable)
      .map((e) => e.id);
    expect(unmarked).toEqual([]);
  });

  it('returns runnable:true for anything not listed', () => {
    expect(runnability('linreg')).toEqual({ runnable: true });
    expect(runnability('not-a-real-id')).toEqual({ runnable: true });
  });

  it('warns about the runtime download without overpromising privacy', () => {
    expect(RUNTIME_NOTE).toMatch(/MB/);
    expect(RUNTIME_NOTE).toMatch(/locally|Nothing is uploaded/);
  });
});

describe('formatPythonError', () => {
  it('extracts the meaningful last line of a Python traceback', () => {
    const traceback = [
      'Traceback (most recent call last):',
      '  File "<exec>", line 3, in <module>',
      '    x = 1 / 0',
      'ZeroDivisionError: division by zero',
    ].join('\n');
    expect(formatPythonError(new Error(traceback))).toBe('ZeroDivisionError: division by zero');
  });

  it('falls back to the last line when nothing looks like an error name', () => {
    expect(formatPythonError(new Error('something odd\nhappened here'))).toBe('happened here');
  });

  it('never returns empty for empty input', () => {
    expect(formatPythonError(new Error('')).length).toBeGreaterThan(0);
  });
});
