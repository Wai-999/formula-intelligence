import { describe, it, expect } from 'vitest';
import {
  levelThreshold, levelFromXp, levelProgress, computeXp, computeBadges, BADGES, XP_RULES,
} from '../progression.js';

// XP is derived from real recorded work, so the arithmetic has to be right
// or the number silently contradicts the mastery dashboard beside it. These
// also pin the curve: changing it later is a product decision, and it
// should require deliberately updating a test, not slip through unnoticed.

describe('level curve', () => {
  it('starts everyone at level 1 with zero XP', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelThreshold(1)).toBe(0);
  });

  it('places the documented thresholds where the comment says', () => {
    expect(levelThreshold(2)).toBe(100);
    expect(levelThreshold(3)).toBe(300);
    expect(levelThreshold(4)).toBe(600);
    expect(levelThreshold(5)).toBe(1000);
  });

  it('levels up exactly at the threshold, not one XP late', () => {
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(299)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
  });

  it('costs progressively more XP per level', () => {
    const costs = [2, 3, 4, 5, 6].map((n) => levelThreshold(n) - levelThreshold(n - 1));
    for (let i = 1; i < costs.length; i++) expect(costs[i]).toBeGreaterThan(costs[i - 1]);
  });

  it('never returns a level below 1, even for junk input', () => {
    for (const v of [-500, NaN, undefined, null]) expect(levelFromXp(v)).toBe(1);
  });
});

describe('levelProgress', () => {
  it('reports progress within the current level', () => {
    const p = levelProgress(150);
    expect(p.level).toBe(2);
    expect(p.intoLevel).toBe(50);       // 150 - 100
    expect(p.neededForNext).toBe(150);  // 300 - 150
    expect(p.pct).toBe(25);             // 50 of a 200-wide band
  });

  it('reads 0% immediately after levelling and approaches 100% before the next', () => {
    expect(levelProgress(100).pct).toBe(0);
    expect(levelProgress(299).pct).toBeGreaterThan(95);
  });

  it('handles zero without dividing by zero', () => {
    const p = levelProgress(0);
    expect(p.level).toBe(1);
    expect(p.pct).toBe(0);
    expect(Number.isFinite(p.pct)).toBe(true);
  });
});

describe('computeXp', () => {
  it('returns zero and a full breakdown for a brand-new learner', () => {
    const { total, breakdown } = computeXp({});
    expect(total).toBe(0);
    expect(breakdown).toHaveLength(7);
    expect(breakdown.every((b) => b.xp === 0)).toBe(true);
  });

  it('weights each source by its documented rule', () => {
    expect(computeXp({ mastered: 2 }).total).toBe(2 * XP_RULES.masteredFormula);
    expect(computeXp({ quizCorrect: 10 }).total).toBe(10 * XP_RULES.quizCorrect);
    expect(computeXp({ journalEntries: 3 }).total).toBe(3 * XP_RULES.journalEntry);
  });

  it('sums independent sources', () => {
    const { total } = computeXp({ mastered: 1, reviewed: 2, quizCorrect: 4, domainsVisited: 1 });
    expect(total).toBe(50 + 20 + 20 + 20);
  });

  it('values mastery above mere review, and review above a single answer', () => {
    expect(XP_RULES.masteredFormula).toBeGreaterThan(XP_RULES.reviewedFormula);
    expect(XP_RULES.reviewedFormula).toBeGreaterThan(XP_RULES.quizCorrect);
  });

  it('ignores negative counts rather than subtracting XP', () => {
    expect(computeXp({ mastered: -5 }).total).toBe(0);
  });

  it('keeps the breakdown consistent with the total', () => {
    const { total, breakdown } = computeXp({ mastered: 3, quizCorrect: 7, depthLayers: 2 });
    expect(breakdown.reduce((a, b) => a + b.xp, 0)).toBe(total);
  });
});

describe('computeBadges', () => {
  it('earns nothing on an empty profile but still reports every badge', () => {
    const badges = computeBadges({});
    expect(badges).toHaveLength(BADGES.length);
    expect(badges.every((b) => !b.earned)).toBe(true);
  });

  it('shows partial progress on locked badges instead of just greying them out', () => {
    const b = computeBadges({ mastered: 4 }).find((x) => x.id === 'ten-mastered');
    expect(b.earned).toBe(false);
    expect(b.have).toBe(4);
    expect(b.pct).toBe(40);
  });

  it('earns a badge exactly at its threshold', () => {
    expect(computeBadges({ mastered: 9 }).find((b) => b.id === 'ten-mastered').earned).toBe(false);
    expect(computeBadges({ mastered: 10 }).find((b) => b.id === 'ten-mastered').earned).toBe(true);
  });

  it('counts mastered formulas toward review-based badges too', () => {
    // Mastering a card implies having reviewed it; the badge would
    // otherwise un-earn itself as cards graduate to mastery.
    const b = computeBadges({ reviewed: 0, mastered: 12 }).find((x) => x.id === 'ten-reviewed');
    expect(b.earned).toBe(true);
  });

  it('requires both accuracy AND volume for Sharpshooter', () => {
    expect(computeBadges({ quizAccuracy: 100, quizTotal: 5 })
      .find((b) => b.id === 'sharpshooter').earned).toBe(false);
    expect(computeBadges({ quizAccuracy: 80, quizTotal: 20 })
      .find((b) => b.id === 'sharpshooter').earned).toBe(true);
  });

  it('caps displayed progress at the requirement', () => {
    const b = computeBadges({ mastered: 999 }).find((x) => x.id === 'ten-mastered');
    expect(b.have).toBe(10);
    expect(b.pct).toBe(100);
  });

  it('gives every badge a unique id, an icon and a hint', () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const b of BADGES) {
      expect(b.icon.startsWith('ti-')).toBe(true);
      expect(b.hint.length).toBeGreaterThan(8);
    }
  });
});
