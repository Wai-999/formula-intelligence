import { describe, it, expect } from 'vitest';
import { practiceSuccess, unassistedTransfer, retention, applicationCompletion, MIN_N } from '../learningSignals.js';

const DAY = 24 * 60 * 60 * 1000;
const ev = (fields) => ({ c: 'alg.slope', item: 'i', ok: true, d: 1, s: 'practice', at: 0, ...fields });

describe('learning signals (V4 §7)', () => {
  it('practice success is split by difficulty and withheld below the minimum sample', () => {
    const log = [
      ...Array.from({ length: 6 }, (_, i) => ev({ item: `a${i}`, d: 2, ok: i < 3 })),
      ev({ item: 'b', d: 3, ok: true }),
      ev({ item: 'c', d: 1, s: 'diagnostic' }), // placement answers are not practice
    ];
    const r = practiceSuccess(log);
    expect(r[2]).toEqual({ k: 3, n: 6, rate: 0.5 });
    expect(r[3]).toEqual({ k: 1, n: 1, rate: null });
    expect(r[1].n).toBe(0);
    expect(MIN_N).toBeGreaterThan(1);
  });

  it('unassisted transfer counts only transfer items, and a hinted correct answer does not count', () => {
    const log = [
      ...Array.from({ length: 3 }, (_, i) => ev({ item: `t${i}`, x: true, ok: true, at: 10 + i })),
      ev({ item: 't3', x: true, ok: true, h: true, at: 5 }),
      ev({ item: 't4', x: true, ok: false, at: 7 }),
      ev({ item: 'old', tr: true }), // written before x/h existed: left out, not guessed
    ];
    expect(unassistedTransfer(log)).toEqual({ k: 3, n: 5, rate: 0.6, since: 5 });
  });

  it('retention needs a later attempt at least 14 days after the first correct one', () => {
    const skill = (c, laterDays, laterOk) => [
      ev({ c, item: `${c}1`, ok: false, at: 0 }),
      ev({ c, item: `${c}2`, ok: true, at: 1 * DAY }),
      ev({ c, item: `${c}3`, ok: laterOk, at: (1 + laterDays) * DAY }),
    ];
    const log = [
      ...skill('a', 14, true), ...skill('b', 20, true), ...skill('c', 30, false),
      ...skill('d', 15, true), ...skill('e', 40, true),
      ...skill('f', 3, true), // too soon: not eligible
    ];
    expect(retention(log)).toEqual({ k: 4, n: 5, rate: 0.8 });
  });

  it('application completion is completed over started projects', () => {
    const projects = [{ id: 'p1', steps: [1, 2] }, { id: 'p2', steps: [1, 2] }, { id: 'p3', steps: [1] }];
    const done = { p1: [1, 2], p2: [1] };
    const r = applicationCompletion(projects, (p, st) => (done[p.id] ?? []).includes(st));
    expect(r).toEqual({ k: 1, n: 2, rate: 0.5 });
    expect(applicationCompletion(projects, () => false).rate).toBeNull();
  });
});
