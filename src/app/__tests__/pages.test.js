import { describe, it, expect } from 'vitest';
import { SECTIONS, PAGES, RENAMED, pageById, pagesInSection, parseHash, pageForLegacy, legacyOf, tabOf, hashFor } from '../pages.js';
import { PAGE_COMPONENTS } from '../pageComponents.js';

describe('V4 information architecture (§3)', () => {
  it('has five destinations at most, in the brief’s order', () => {
    expect(SECTIONS.map((s) => s.id)).toEqual(['home', 'learn', 'practice', 'apply', 'progress']);
  });

  it('gives every page a component and every child page a real parent tab in its own section', () => {
    for (const p of PAGES) {
      expect(PAGE_COMPONENTS[p.id], p.id).toBeTruthy();
      if (p.parent) {
        expect(pageById[p.parent], `${p.id} parent`).toBeTruthy();
        expect(pageById[p.parent].section, `${p.id} parent section`).toBe(p.section);
        expect(pagesInSection(p.section).map((x) => x.id), `${p.id} parent is a tab`).toContain(p.parent);
      }
    }
  });

  it('keeps each section’s sub-navigation short', () => {
    for (const s of SECTIONS) expect(pagesInSection(s.id).length, s.id).toBeLessThanOrEqual(4);
  });

  it('puts the maps and the Python library behind a tab, not in navigation', () => {
    expect(tabOf('learn/concepts')).toBe('learn/maps');
    expect(tabOf('apply/library')).toBe('apply/lab');
    expect(pagesInSection('learn').map((p) => p.id)).not.toContain('learn/formulas');
  });
});

describe('every old address still lands somewhere real', () => {
  it('maps every V3.1 id to an existing page', () => {
    for (const [old, r] of Object.entries(RENAMED)) {
      expect(pageById[r.page], old).toBeTruthy();
      expect(pageById[old], `${old} should not still be a page`).toBeFalsy();
    }
  });

  it('parses V3.1 addresses, keeping their parameter', () => {
    expect(parseHash('#maps/concepts/c.slope')).toEqual({ kind: 'page', page: 'learn/concepts', params: { conceptId: 'c.slope' } });
    expect(parseHash('#practice/quiz')).toEqual({ kind: 'page', page: 'practice/formulas', params: { mode: 'quiz' } });
    expect(parseHash('#notebook/journal')).toEqual({ kind: 'page', page: 'progress/notebook', params: { view: 'journal' } });
    expect(parseHash('#settings')).toEqual({ kind: 'page', page: 'progress/settings', params: {} });
    expect(parseHash('#maps')).toEqual({ kind: 'page', page: 'learn/maps', params: {} });
    expect(parseHash('#nonsense/x')).toBeNull();
  });

  it('maps the two-mode app’s tabs, including tabs that became views of one page', () => {
    expect(pageForLegacy('stats', 'quiz')).toEqual({ page: 'practice/formulas', params: { mode: 'quiz' } });
    expect(pageForLegacy('stats', 'story')).toEqual({ page: 'apply/cases', params: {} });
    expect(pageForLegacy('ml', 'python')).toEqual({ page: 'apply/library', params: {} });
    expect(legacyOf('practice/formulas', { mode: 'problems' })).toMatchObject({ mode: 'stats', tab: 'practice' });
  });

  it('round-trips a page with its parameter', () => {
    const h = hashFor('practice/formulas', { mode: 'quiz' });
    expect(h).toBe('#practice/formulas/quiz');
    expect(parseHash(h)).toEqual({ kind: 'page', page: 'practice/formulas', params: { mode: 'quiz' } });
  });
});
