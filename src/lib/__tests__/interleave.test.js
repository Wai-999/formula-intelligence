import { describe, it, expect } from 'vitest';
import { interleave, switches } from '../interleave.js';

const pool = (key, n) => ({ key, items: Array.from({ length: n }, (_, i) => ({ id: `${key}-${i}` })) });

describe('interleave', () => {
  it('never takes two in a row from one subject while another has items', () => {
    const set = interleave([pool('alg', 5), pool('calc', 2), pool('stats', 1)], { size: 6 });
    expect(set).toHaveLength(6);
    // 8 items, 3 pools: alternation holds until only one pool is left.
    expect(switches(set.slice(0, 5))).toBe(4);
  });

  it('puts never-answered items first, then the stalest', () => {
    const answered = { 'alg-0': 300, 'alg-1': 100 };
    const set = interleave([pool('alg', 3)], { size: 3, lastAnswered: (id) => answered[id] ?? 0 });
    expect(set.map((s) => s.item.id)).toEqual(['alg-2', 'alg-1', 'alg-0']);
  });

  it('starts with the subject whose next question is stalest', () => {
    const answered = { 'alg-0': 500, 'calc-0': 50 };
    const set = interleave([pool('alg', 1), pool('calc', 1)], { size: 2, lastAnswered: (id) => answered[id] ?? 0 });
    expect(set[0].key).toBe('calc');
  });

  it('is deterministic and copes with empty or short pools', () => {
    const a = interleave([pool('x', 2), pool('y', 2)]);
    const b = interleave([pool('x', 2), pool('y', 2)]);
    expect(a).toEqual(b);
    expect(a).toHaveLength(4);
    expect(interleave([pool('x', 0)])).toEqual([]);
    expect(interleave([])).toEqual([]);
  });

  it('does not mutate its input', () => {
    const p = [pool('x', 3)];
    interleave(p, { size: 2 });
    expect(p[0].items).toHaveLength(3);
  });
});
