import { describe, it, expect } from 'vitest';
import { estimateAbility, assessDomain, nextItem, recommend, placementChoices } from '../diagnostic.js';
import { DX_ITEMS, BANK_VERSION } from '../../data/diagnostic/itemBank.js';
import { DOMAINS, competencyById } from '../../data/curriculum/competencies.js';
import { checkAnswer } from '../answers.js';

// Acceptance test 5 and §8: the diagnostic screens broadly before targeting,
// never claims readiness from one lucky answer, shows its uncertainty,
// explains its recommendation, and can be skipped, stopped or overridden.

const answerAs = (item, ok) => ({ item: item.id, domain: item.domain, difficulty: item.difficulty, ok });

/** Simulate a learner whose answers depend only on the item’s domain and difficulty. */
function simulate(policy) {
  const state = { responses: [], skippedDomains: [] };
  for (let i = 0; i < 100; i++) {
    const it = nextItem(DX_ITEMS, state);
    if (!it) break;
    state.responses.push(answerAs(it, policy(it)));
  }
  return state;
}

describe('item bank', () => {
  it('is versioned, covers all eight domains, and has at least two items per competency', () => {
    expect(BANK_VERSION).toMatch(/^dx-/);
    for (const d of DOMAINS) expect(DX_ITEMS.some((i) => i.domain === d.id), d.id).toBe(true);
    const counts = {};
    for (const i of DX_ITEMS) counts[i.competency] = (counts[i.competency] ?? 0) + 1;
    for (const [c, n] of Object.entries(counts)) {
      expect(competencyById[c], c).toBeTruthy();
      expect(n, c).toBeGreaterThanOrEqual(2);
    }
  });

  it('has unique ids, and every numeric key agrees with its recomputation', () => {
    expect(new Set(DX_ITEMS.map((i) => i.id)).size).toBe(DX_ITEMS.length);
    for (const i of DX_ITEMS) {
      if (i.answer.type === 'numeric' && i.compute) expect(Math.abs(i.compute() - i.answer.value), i.id).toBeLessThanOrEqual(Math.max(i.answer.tolerance, 1e-9));
      const key = i.answer.type === 'choice' ? i.answer.correct : i.answer.type === 'numeric' ? String(i.answer.value) : i.answer.values.map(String);
      expect(checkAnswer(i.answer, key).correct, i.id).toBe(true);
    }
  });

  it('offers every domain an item at each difficulty the procedure may ask for', () => {
    for (const d of DOMAINS) {
      const ds = new Set(DX_ITEMS.filter((i) => i.domain === d.id).map((i) => i.difficulty));
      expect(ds.size, d.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('adaptive procedure', () => {
  it('screens every domain once before asking any domain a second question', () => {
    const state = simulate(() => true);
    const firstEight = state.responses.slice(0, DOMAINS.length).map((r) => r.domain);
    expect(new Set(firstEight).size).toBe(DOMAINS.length);
  });

  it('goes harder after a correct answer and easier after a miss', () => {
    const right = simulate(() => true).responses;
    const wrong = simulate(() => false).responses;
    for (const d of DOMAINS) {
      const r = right.filter((x) => x.domain === d.id);
      const w = wrong.filter((x) => x.domain === d.id);
      if (r.length > 1) expect(r[1].difficulty, d.id).toBeGreaterThanOrEqual(r[0].difficulty);
      if (w.length > 1) expect(w[1].difficulty, d.id).toBeLessThanOrEqual(w[0].difficulty);
    }
  });

  it('asks a third item only to break a disagreement, and never more than three answered per domain', () => {
    const consistent = simulate(() => true).responses;
    for (const d of DOMAINS) expect(consistent.filter((x) => x.domain === d.id).length, d.id).toBeLessThanOrEqual(2);
    const mixed = simulate((it) => it.difficulty <= 2).responses; // right at d1–2, wrong at d3
    for (const d of DOMAINS) expect(mixed.filter((x) => x.domain === d.id).length, d.id).toBeLessThanOrEqual(3);
    expect(mixed.length).toBeLessThanOrEqual(24);
  });

  it('respects skipped domains and skipped questions', () => {
    const state = { responses: [], skippedDomains: ['python', 'calculus'] };
    for (let i = 0; i < 100; i++) {
      const it = nextItem(DX_ITEMS, state);
      if (!it) break;
      expect(['python', 'calculus']).not.toContain(it.domain);
      state.responses.push(answerAs(it, i % 5 === 0 ? null : true)); // every fifth question skipped
    }
    expect(nextItem(DX_ITEMS, state)).toBeNull();
  });
});

describe('estimates and uncertainty', () => {
  it('one lucky correct answer — even a hard one — is never “likely ready” (acceptance test 5)', () => {
    const one = assessDomain('algebra', [{ domain: 'algebra', difficulty: 3, ok: true }], false);
    expect(one.level).not.toBe('strong');
    expect(one.confidence).toBe('low');
  });

  it('consistent success across difficulties is “likely ready”, with only moderate confidence', () => {
    const rs = [2, 3, 3].map((d) => ({ domain: 'algebra', difficulty: d, ok: true }));
    const a = assessDomain('algebra', rs, false);
    expect(a.level).toBe('strong');
    expect(a.confidence).toBe('moderate');
  });

  it('consistent misses are a likely gap; a skipped domain is “not assessed”, not a failure', () => {
    expect(assessDomain('algebra', [2, 1].map((d) => ({ domain: 'algebra', difficulty: d, ok: false })), false).level).toBe('gap');
    expect(assessDomain('algebra', [], true).level).toBe('not-assessed');
  });

  it('more evidence narrows the uncertainty', () => {
    const one = estimateAbility([{ d: 2, ok: true }]);
    const three = estimateAbility([{ d: 2, ok: true }, { d: 3, ok: true }, { d: 2, ok: true }]);
    expect(three.sd).toBeLessThan(one.sd);
    expect(one.sd).toBeGreaterThan(0.6); // a single item says little — and the estimate admits it
  });
});

describe('recommendation', () => {
  const est = (levels) => DOMAINS.map((d) => ({ domain: d.id, level: levels[d.id] ?? 'gap', correct: 1, answered: 2, confidence: 'low' }));

  it('starts at the first course on the mathematics path that is not likely ready, and says why', () => {
    const r = recommend(est({ arithmetic: 'strong', algebra: 'developing' }));
    expect(r.course).toBe('algebra-1');
    expect(r.reasons.join(' ')).toMatch(/Algebra: 1 of 2 correct/);
    expect(r.reasons.join(' ')).toMatch(/Arithmetic & number sense/);
  });

  it('treats a skipped domain as unstudied and says so', () => {
    const r = recommend(est({ arithmetic: 'not-assessed' }));
    expect(r.course).toBe('prealgebra');
    expect(r.reasons.join(' ')).toMatch(/not assessed/);
  });

  it('suggests parallel tracks only when their prerequisites look ready', () => {
    const r = recommend(est({ arithmetic: 'strong', algebra: 'strong', functions: 'developing' }));
    expect(r.course).toBe('algebra-2');
    expect(r.alsoConsider.map((a) => a.course)).toEqual(expect.arrayContaining(['linear-algebra', 'prob-stats', 'python-ds']));
    const weak = recommend(est({}));
    expect(weak.alsoConsider.map((a) => a.course)).not.toContain('linear-algebra');
  });
});

describe('start earlier / start here / skip ahead (V4 §6)', () => {
  it('offers one step either way along the mathematics path', () => {
    expect(placementChoices('algebra-2')).toEqual({ earlier: 'algebra-1', here: 'algebra-2', ahead: 'precalculus' });
    expect(placementChoices('calculus-1')).toEqual({ earlier: 'precalculus', here: 'calculus-1', ahead: 'calculus-2' });
  });

  it('has no earlier step before Prealgebra and no step past Calculus III', () => {
    expect(placementChoices('prealgebra').earlier).toBeNull();
    expect(placementChoices('calculus-3').ahead).toBeNull();
  });

  it('steps back to the first prerequisite of a course off the path', () => {
    const c = placementChoices('ml-foundations');
    expect(c.earlier).toBe('prob-stats');
    expect(c.ahead).toBeNull();
  });
});
