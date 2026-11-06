import { describe, it, expect, beforeAll } from 'vitest';
import { LESSONS } from '../../curriculum/lessons/index.js';
import { FORMULAS } from '../../curriculum/formulas.js';
import { PY_ALL_ENTRIES } from '../../python/index.js';
import { SPOKEN, isPlainWords, spokenFor } from '../spoken.js';
import { forSpeech } from '../../../lib/notation.js';

// Every symbol the app breaks down has a name a learner can say: lesson
// glossaries, curriculum formulas and their variables, and the Formula map's
// notation tables. These check that a reading exists and is plain spoken
// English — not that it is the best reading, which a human review decides.

const bodies = {};
beforeAll(async () => {
  for (const l of LESSONS) bodies[l.id] = (await l.load()).default;
});

// A reading is said, not typeset: no LaTeX, no dollar signs, no backticks.
const spoken = (text, where) => {
  expect(typeof text === 'string' && text.trim().length > 0, `${where}: missing reading`).toBe(true);
  expect(text, where).not.toMatch(/[$\\`{}^_]/);
};

describe('how to say the notation', () => {
  it('every glossary term written in math or code has a reading', () => {
    let n = 0;
    for (const l of LESSONS) {
      for (const g of bodies[l.id].glossary) {
        if (/[$`]/.test(g.term)) { spoken(g.say, `${l.id}: ${g.term}`); n += 1; }
        else if (g.say !== undefined) spoken(g.say, `${l.id}: ${g.term}`);
      }
    }
    expect(n).toBeGreaterThan(100);
  });

  it('every curriculum formula, and every symbol in it, has a reading', () => {
    for (const f of FORMULAS) {
      spoken(f.say, f.id);
      for (const v of f.variables) spoken(v.say, `${f.id} ${v.symbol}`);
    }
  });

  it('every symbol in the Formula map’s notation tables that is not plain words has a reading', () => {
    const symbols = new Set(PY_ALL_ENTRIES.flatMap((e) => (e.variables ?? []).map(([s]) => s)));
    const missing = [...symbols].filter((s) => !isPlainWords(s) && !spokenFor(s));
    expect(missing).toEqual([]);
    // No stale entries: each reading belongs to a symbol that is shown.
    expect(Object.keys(SPOKEN).filter((s) => !symbols.has(s))).toEqual([]);
    for (const [s, r] of Object.entries(SPOKEN)) spoken(r, s);
  });

  it('tells plain words from notation', () => {
    for (const w of ['Range', 'margin of error', 'max_depth', 'out-of-fold predictions']) expect(isPlainWords(w), w).toBe(true);
    for (const s of ['X̄', 'σ²', 'IQR', 'p-value', 'n_estimators', 'L2 penalty', 'k']) expect(isPlainWords(s), s).toBe(false);
  });

  it('respells Greek names for the voice only, whole words only', () => {
    expect(forSpeech('mu, sigma')).toBe('mew, sigma');
    expect(forSpeech('chi-square sub R')).toBe('kye-square sub R');
    expect(forSpeech('phi of z')).toBe('fye of z');
    expect(forSpeech('the number of beta')).toBe('the number of beta');
  });
});
