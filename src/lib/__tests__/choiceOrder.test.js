import { describe, it, expect } from 'vitest';
import { choiceOrder } from '../choiceOrder.js';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { lessonItems } from '../../data/curriculum/lessonItems.js';
import { PROBLEMS } from '../../data/curriculum/problems.js';

describe('choice order', () => {
  it('is a permutation, the same for the same id', () => {
    for (const n of [2, 3, 4, 5]) {
      const o = choiceOrder(n, 'a2-comp.u3');
      expect([...o].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(choiceOrder(n, 'a2-comp.u3')).toEqual(o);
    }
  });

  it('spreads the right answer over the positions, across every choice question', async () => {
    const items = [...PROBLEMS.flatMap((p) => p.items)];
    for (const l of LESSONS) {
      const b = (await l.load()).default;
      items.push(...lessonItems(b), ...b.priorCheck, ...(b.faded?.steps.filter((s) => s.item).map((s) => s.item) ?? []));
    }
    const choice = items.filter((i) => i.answer.type === 'choice' && i.answer.choices.length >= 3);
    const at = [0, 0, 0, 0, 0];
    for (const i of choice) at[choiceOrder(i.answer.choices.length, i.id).indexOf(i.answer.correct)] += 1;
    // Authored, most right answers were first; shown, no position holds more than 40% of them.
    for (const n of at) expect(n / choice.length).toBeLessThanOrEqual(0.4);
    expect(at[0] / choice.length).toBeLessThan(0.35);
  });
});
