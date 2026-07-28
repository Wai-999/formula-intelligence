import { describe, it, expect, beforeEach } from 'vitest';
import { computeNodeState, useMasteryStore } from '../useMasteryStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';

// computeNodeState decides the color of every node on the Stats map and the
// mastery counts on the Dashboard. It is pure and cheap to test, and its
// rules are ORDERED — a Feynman score outranks a streak, a streak outranks
// a review flag — so the tests below pin the precedence, not just the
// individual branches. Precedence is the part a future refactor is most
// likely to break silently.
describe('computeNodeState', () => {
  it('returns "none" for an untouched node', () => {
    expect(computeNodeState(undefined, 0)).toEqual({
      state: 'none', streak: 0, lastRecall: null,
    });
  });

  it('promotes to blue at the first correct recall', () => {
    const r = computeNodeState({ streak: 1, lastDate: '2026-07-01' }, 0);
    expect(r.state).toBe('blue');
    expect(r.streak).toBe(1);
    expect(r.lastRecall).toBe('2026-07-01');
  });

  it('holds blue through streak 2 and promotes to green at 3', () => {
    expect(computeNodeState({ streak: 2 }, 0).state).toBe('blue');
    expect(computeNodeState({ streak: 3 }, 0).state).toBe('green');
    expect(computeNodeState({ streak: 9 }, 0).state).toBe('green');
  });

  it('marks red when review is needed and no streak exists', () => {
    expect(computeNodeState({ streak: 0, needsReview: true }, 0).state).toBe('red');
  });

  it('gives gold precedence over every streak-based state', () => {
    // A high Feynman (self-explanation) score means the learner can teach
    // the concept; that outranks raw recall streaks by design.
    expect(computeNodeState({ streak: 0, needsReview: true }, 0.71).state).toBe('gold');
    expect(computeNodeState({ streak: 9 }, 0.9).state).toBe('gold');
  });

  it('treats 0.71 as the inclusive gold threshold', () => {
    expect(computeNodeState({ streak: 0 }, 0.7099).state).not.toBe('gold');
    expect(computeNodeState({ streak: 0 }, 0.71).state).toBe('gold');
  });

  it('gives a streak precedence over the needsReview flag', () => {
    // Both can be set at once (answered wrong, then right). The newer
    // signal — the streak — should win, or a recovered node would stay red.
    expect(computeNodeState({ streak: 1, needsReview: true }, 0).state).toBe('blue');
  });
});

describe('useMasteryStore.markRecalled', () => {
  beforeEach(() => {
    useMasteryStore.setState({ recallData: {} });
  });

  it('increments the streak on a correct answer and clears review', () => {
    const { markRecalled, getNodeState } = useMasteryStore.getState();
    markRecalled('mean', true);
    markRecalled('mean', true);
    expect(getNodeState('mean').streak).toBe(2);
    expect(useMasteryStore.getState().recallData.mean.needsReview).toBe(false);
  });

  it('resets the streak to zero and flags review on a wrong answer', () => {
    const { markRecalled } = useMasteryStore.getState();
    markRecalled('mean', true);
    markRecalled('mean', true);
    markRecalled('mean', false);
    const entry = useMasteryStore.getState().recallData.mean;
    expect(entry.streak).toBe(0);
    expect(entry.needsReview).toBe(true);
  });

  it('persists recall data to localStorage under the documented key', () => {
    useMasteryStore.getState().markRecalled('variance', true);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.recall));
    expect(saved.variance.streak).toBe(1);
  });

  it('keeps nodes independent of one another', () => {
    const { markRecalled, getNodeState } = useMasteryStore.getState();
    markRecalled('mean', true);
    markRecalled('median', false);
    expect(getNodeState('mean').state).toBe('blue');
    expect(getNodeState('median').state).toBe('red');
  });

  it('stamps lastDate as an ISO calendar date', () => {
    useMasteryStore.getState().markRecalled('mode', true);
    expect(useMasteryStore.getState().recallData.mode.lastDate)
      .toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
