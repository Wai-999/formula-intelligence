import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getMasteryLevel, isDue, useSRStore } from '../useSRStore.js';

const DEFAULT_CARD = { ef: 2.5, interval: 1, reps: 0, due: 0, rating: 0, reviews: 0 };
const DAY_MS = 86400000;

// The scheduler decides WHEN every flashcard comes back. Bugs here are
// invisible day-to-day (nothing crashes; cards just resurface at subtly
// wrong times) and corrupt the learning signal the whole app is built on,
// which makes it the highest-value pure logic in the codebase to pin down.
describe('getMasteryLevel', () => {
  it('reports level 0 for a never-reviewed card', () => {
    expect(getMasteryLevel(DEFAULT_CARD)).toBe(0);
  });

  it('drops to level 1 whenever the last rating was "again", regardless of interval', () => {
    expect(getMasteryLevel({ ...DEFAULT_CARD, reviews: 8, rating: 1, interval: 60 })).toBe(1);
  });

  it('reports level 2 for a reviewed card still under a 3-day interval', () => {
    expect(getMasteryLevel({ ...DEFAULT_CARD, reviews: 2, rating: 3, interval: 2 })).toBe(2);
  });

  it('reports mastered (3) at a 3-day interval or longer', () => {
    expect(getMasteryLevel({ ...DEFAULT_CARD, reviews: 2, rating: 3, interval: 3 })).toBe(3);
    expect(getMasteryLevel({ ...DEFAULT_CARD, reviews: 5, rating: 3, interval: 45 })).toBe(3);
  });
});

describe('isDue', () => {
  it('treats a brand-new card as due', () => {
    expect(isDue(DEFAULT_CARD)).toBe(true);
  });

  it('is due once the timestamp has passed and not before', () => {
    expect(isDue({ ...DEFAULT_CARD, reviews: 1, due: Date.now() - 1000 })).toBe(true);
    expect(isDue({ ...DEFAULT_CARD, reviews: 1, due: Date.now() + 60_000 })).toBe(false);
  });
});

describe('useSRStore.rateCard (SM-2 style scheduling)', () => {
  beforeEach(() => {
    useSRStore.setState({ srData: {} });
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-01T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  const card = (id = 'mean') => useSRStore.getState().srData[id];

  it('resets interval and reps to the start on "again" (rating 1)', () => {
    const { rateCard } = useSRStore.getState();
    rateCard('mean', 3);
    rateCard('mean', 3);
    expect(card().interval).toBeGreaterThan(1);
    rateCard('mean', 1);
    expect(card().interval).toBe(1);
    expect(card().reps).toBe(0);
  });

  it('grows the interval more slowly on "hard" (2) than on "good" (3)', () => {
    const { rateCard } = useSRStore.getState();
    rateCard('hard-card', 2);
    rateCard('good-card', 3);
    const hard = useSRStore.getState().srData['hard-card'];
    const good = useSRStore.getState().srData['good-card'];
    expect(hard.interval).toBeLessThan(good.interval);
  });

  it('raises ease on "good" but never above the 2.5 ceiling', () => {
    const { rateCard } = useSRStore.getState();
    for (let i = 0; i < 5; i++) rateCard('mean', 3);
    expect(card().ef).toBeLessThanOrEqual(2.5);
  });

  it('never lets ease fall below the 1.3 floor', () => {
    const { rateCard } = useSRStore.getState();
    useSRStore.setState({ srData: { low: { ...DEFAULT_CARD, ef: 1.31 } } });
    for (let i = 0; i < 6; i++) rateCard('low', 1);
    expect(useSRStore.getState().srData.low.ef).toBeGreaterThanOrEqual(1.3);
  });

  it('sets the due date interval-days into the future', () => {
    useSRStore.getState().rateCard('mean', 3);
    const c = card();
    expect(c.due).toBe(Date.now() + c.interval * DAY_MS);
  });

  it('counts every review, including lapses', () => {
    const { rateCard } = useSRStore.getState();
    rateCard('mean', 3);
    rateCard('mean', 1);
    rateCard('mean', 2);
    expect(card().reviews).toBe(3);
  });

  it('keeps intervals at a whole number of days', () => {
    const { rateCard } = useSRStore.getState();
    for (let i = 0; i < 4; i++) rateCard('mean', 3);
    expect(Number.isInteger(card().interval)).toBe(true);
  });

  it('never schedules a card less than a day out', () => {
    const { rateCard } = useSRStore.getState();
    useSRStore.setState({ srData: { tiny: { ...DEFAULT_CARD, ef: 1.3, interval: 1 } } });
    rateCard('tiny', 2);
    expect(useSRStore.getState().srData.tiny.interval).toBeGreaterThanOrEqual(1);
  });
});

describe('useSRStore.recordQuizAnswer', () => {
  beforeEach(() => {
    useSRStore.setState({ quizStats: { correct: 0, total: 0, best: 0 } });
  });

  it('accumulates correct and total counts', () => {
    const { recordQuizAnswer } = useSRStore.getState();
    recordQuizAnswer(true, 1);
    recordQuizAnswer(false, 0);
    recordQuizAnswer(true, 1);
    const { correct, total } = useSRStore.getState().quizStats;
    expect(correct).toBe(2);
    expect(total).toBe(3);
  });

  it('keeps the best streak as a high-water mark that never regresses', () => {
    const { recordQuizAnswer } = useSRStore.getState();
    recordQuizAnswer(true, 7);
    recordQuizAnswer(false, 0);
    expect(useSRStore.getState().quizStats.best).toBe(7);
  });
});

describe('useSRStore.pushSession', () => {
  beforeEach(() => useSRStore.setState({ sessions: [] }));

  it('keeps only the ten most recent sessions', () => {
    const { pushSession } = useSRStore.getState();
    for (let i = 0; i < 14; i++) pushSession({ n: i });
    const sessions = useSRStore.getState().sessions;
    expect(sessions).toHaveLength(10);
    expect(sessions[0].n).toBe(4);
    expect(sessions.at(-1).n).toBe(13);
  });
});
