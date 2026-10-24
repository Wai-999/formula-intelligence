import { describe, it, expect } from 'vitest';
import { buildIndex, search, normalize, KIND_LABEL } from '../searchIndex.js';
import { PAGES } from '../../app/pages.js';

const index = buildIndex();

describe('search index', () => {
  it('normalizes case, accents and punctuation', () => {
    expect(normalize('  Bayes’ Théorem! ')).toBe('bayes theorem');
  });

  it('has unique ids and a label for every kind', () => {
    const ids = index.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of index) expect(KIND_LABEL[e.kind], e.id).toBeTruthy();
  });

  it('points every entry at a real page', () => {
    const pageIds = new Set(PAGES.map((p) => p.id));
    for (const e of index) expect(pageIds.has(e.target.page), `${e.id} → ${e.target.page}`).toBe(true);
  });

  it('finds lessons, code exercises and projects', () => {
    expect(search(index, 'gradient descent').some((e) => e.kind === 'lesson')).toBe(true);
    expect(search(index, 'anscombe').some((e) => e.kind === 'project')).toBe(true);
    expect(index.some((e) => e.kind === 'exercise')).toBe(true);
  });

  it('requires every query word and ranks title matches first', () => {
    expect(search(index, 'zzzz qqqq')).toEqual([]);
    expect(search(index, '')).toEqual([]);
    const [top] = search(index, 'dot product');
    expect(normalize(top.title)).toContain('dot product');
  });
});
