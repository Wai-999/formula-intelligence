import { describe, it, expect } from 'vitest';
import { parseNumber, checkAnswer, numericMatches } from '../answers.js';
import { assessCompetency, recencyWeight, HALF_LIFE_DAYS } from '../mastery.js';
import { review, newCard, dueCards, BOX_DAYS } from '../reviewSchedule.js';

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 24);

describe('parseNumber', () => {
  it('accepts the forms learners actually type', () => {
    expect(parseNumber('2')).toBe(2);
    expect(parseNumber(' -0.5 ')).toBe(-0.5);
    expect(parseNumber('3/4')).toBe(0.75);
    expect(parseNumber('−2')).toBe(-2); // typographic minus
    expect(parseNumber('1e-3')).toBe(0.001);
    expect(parseNumber('1,200')).toBe(1200);
    expect(parseNumber('25%')).toBe(0.25);
    expect(parseNumber('.5')).toBe(0.5);
  });

  it('rejects what is not a number instead of guessing', () => {
    for (const bad of ['', 'two', '1/0', '2x', '--1', null, undefined, '1/2/3']) {
      expect(parseNumber(bad), String(bad)).toBeNull();
    }
  });
});

describe('checkAnswer', () => {
  it('compares numbers with a tolerance, never as strings', () => {
    expect(checkAnswer({ type: 'numeric', value: 0.75 }, '3/4').correct).toBe(true);
    expect(checkAnswer({ type: 'numeric', value: 1 / 3, tolerance: 0.005 }, '0.333').correct).toBe(true);
    expect(checkAnswer({ type: 'numeric', value: 1 / 3 }, '0.33').correct).toBe(false);
    expect(checkAnswer({ type: 'numeric', value: 0.1 + 0.2 }, '0.3').correct).toBe(true);
  });

  it('supports relative tolerance for large magnitudes', () => {
    expect(numericMatches(1001, 1000, { tolerance: 0.01, relative: true })).toBe(true);
    expect(numericMatches(1100, 1000, { tolerance: 0.01, relative: true })).toBe(false);
  });

  it('explains a non-numeric entry rather than marking it wrong silently', () => {
    const r = checkAnswer({ type: 'numeric', value: 2 }, 'two');
    expect(r.correct).toBe(false);
    expect(r.reason).toMatch(/Enter a number/);
  });

  it('checks choices and multi-part numeric answers', () => {
    expect(checkAnswer({ type: 'choice', correct: 2 }, 2).correct).toBe(true);
    expect(checkAnswer({ type: 'choice', correct: 2 }, '1').correct).toBe(false);
    expect(checkAnswer({ type: 'multi', values: [3, -1] }, ['3', '-1']).correct).toBe(true);
    expect(checkAnswer({ type: 'multi', values: [3, -1] }, ['3']).correct).toBe(false);
  });
});

describe('mastery from evidence', () => {
  const ev = (item, ok, { d = 1, tr = false, daysAgo = 0 } = {}) => ({ item, ok, d, tr, at: NOW - daysAgo * DAY });

  it('one lucky correct answer is never mastery (acceptance test 5)', () => {
    const r = assessCompetency([ev('q1', true, { d: 3, tr: true })], NOW);
    expect(r.level).toBe('learning');
    expect(r.confidence).toBe('low');
    expect(r.reasons.join(' ')).toMatch(/3 different correct answers/);
  });

  it('answering the same item repeatedly does not count as more evidence', () => {
    const r = assessCompetency([ev('q1', true, { d: 2 }), ev('q1', true, { d: 2 }), ev('q1', true, { d: 2 })], NOW);
    expect(r.distinctItems).toBe(1);
    expect(r.level).toBe('learning');
  });

  it('three different correct answers including a harder one is proficient', () => {
    const r = assessCompetency([ev('q1', true), ev('q2', true), ev('q3', true, { d: 2 })], NOW);
    expect(r.level).toBe('proficient');
    expect(r.reasons.join(' ')).toMatch(/transfer/);
  });

  it('easy-only success stays below proficient', () => {
    const r = assessCompetency([ev('q1', true), ev('q2', true), ev('q3', true), ev('q4', true)], NOW);
    expect(r.level).toBe('learning');
  });

  it('mastery needs transfer, spacing across days, and a correct latest answer', () => {
    const base = [ev('q1', true, { daysAgo: 3 }), ev('q2', true, { d: 2, daysAgo: 3 }), ev('q3', true, { d: 2 })];
    expect(assessCompetency(base, NOW).level).toBe('proficient');
    const withTransfer = [...base, ev('q4', true, { d: 3, tr: true })];
    expect(assessCompetency(withTransfer, NOW).level).toBe('mastered');
    const thenWrong = [...withTransfer, { ...ev('q5', false), at: NOW + 1 }];
    expect(assessCompetency(thenWrong, NOW + 1).level).toBe('proficient');
  });

  it('mastery shown only on one day is not yet mastery', () => {
    const sameDay = [ev('q1', true), ev('q2', true, { d: 2 }), ev('q3', true, { d: 2 }), ev('q4', true, { d: 3, tr: true })];
    expect(assessCompetency(sameDay, NOW).level).toBe('proficient');
  });

  it('old evidence fades but is never deleted', () => {
    expect(recencyWeight(NOW - HALF_LIFE_DAYS * DAY, NOW)).toBeCloseTo(0.5, 10);
    const old = [ev('q1', true, { daysAgo: 200 }), ev('q2', true, { d: 2, daysAgo: 199 }), ev('q3', true, { d: 2, daysAgo: 199 }), ev('q4', true, { d: 3, tr: true, daysAgo: 198 })];
    const r = assessCompetency(old, NOW);
    expect(r.level).toBe('proficient');
    expect(r.reasons.join(' ')).toMatch(/quick review/);
    expect(r.distinctItems).toBe(4);
  });

  it('mostly wrong answers keep a learner at "learning" however many there are', () => {
    const r = assessCompetency([ev('a', true), ev('b', false), ev('c', false), ev('d', true, { d: 2 }), ev('e', false), ev('f', true)], NOW);
    expect(r.level).toBe('learning');
    expect(r.confidence).toBe('high');
  });
});

describe('review schedule', () => {
  it('moves up a box when right, down ONE box when wrong — never back to the start', () => {
    let card = newCard(NOW);
    card = review(card, true, NOW);
    card = review(card, true, NOW);
    card = review(card, true, NOW);
    expect(card.box).toBe(3);
    card = review(card, false, NOW);
    expect(card.box).toBe(2);
    expect(card.due).toBe(NOW + BOX_DAYS[2] * DAY);
  });

  it('does not punish a late review', () => {
    const card = { box: 2, due: NOW - 10 * DAY, reviews: 3 };
    const onTime = review({ ...card, due: NOW }, true, NOW);
    const late = review(card, true, NOW);
    expect(late.box).toBe(onTime.box);
    expect(late.due).toBe(onTime.due);
  });

  it('caps at the last box and floors at the first', () => {
    let c = { box: BOX_DAYS.length - 1, due: NOW };
    expect(review(c, true, NOW).box).toBe(BOX_DAYS.length - 1);
    c = { box: 0, due: NOW };
    expect(review(c, false, NOW).box).toBe(0);
  });

  it('lists due cards most-overdue first and ignores malformed ones', () => {
    const due = dueCards({ a: { box: 1, due: NOW - DAY }, b: { box: 1, due: NOW - 5 * DAY }, c: { box: 1, due: NOW + DAY }, d: null, e: { box: 1 } }, NOW);
    expect(due.map((x) => x.id)).toEqual(['b', 'a']);
  });
});

describe('authored-text tokenizer', async () => {
  const { tokenize } = await import('../mathFormat.js');
  it('splits math, display math, bold, emphasis, code and escaped dollars', () => {
    expect(tokenize('a $x^2$ b')).toEqual([{ t: 'text', v: 'a ' }, { t: 'math', v: 'x^2' }, { t: 'text', v: ' b' }]);
    expect(tokenize('$$y$$').map((x) => x.t)).toEqual(['display']);
    expect(tokenize('**big** and *small* and `code`').map((x) => x.t)).toEqual(['bold', 'text', 'em', 'text', 'code']);
    expect(tokenize('costs \\$5')).toEqual([{ t: 'text', v: 'costs $5' }]);
  });
  it('leaves a spaced-out multiplication star alone', () => {
    expect(tokenize('2 * 3 * 4')).toEqual([{ t: 'text', v: '2 * 3 * 4' }]);
  });
});
