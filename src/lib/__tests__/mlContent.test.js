import { describe, it, expect } from 'vitest';
import { bl, blSame, resolveT } from '../mlContent.js';

// This module is the single most dangerous piece of plumbing in the app.
// Its objects are shaped { beginner, researcher } and are NOT strings —
// rendering one directly as a JSX child throws "Objects are not valid as a
// React child", which (before error boundaries existed) blanked the entire
// app. That exact bug shipped twice: 22 argument-count errors caught in
// d3b3ed4, and an unresolved family.name in the Model Map detail panel
// caught in the Fifth Pass. These tests pin the contract. (The content was
// bilingual until Master Prompt V3.1 made the app English-only.)
describe('bl()', () => {
  it('builds both depths', () => {
    expect(bl('B', 'R')).toEqual({ beginner: 'B', researcher: 'R' });
  });

  it('leaves an omitted researcher text undefined rather than inventing one', () => {
    // Being undefined is what lets the schema validator catch a bl() that
    // was called with too few arguments.
    const c = bl('only-one');
    expect(c.beginner).toBe('only-one');
    expect(c.researcher).toBeUndefined();
  });
});

describe('blSame()', () => {
  it('uses one string for both depths', () => {
    expect(blSame('T')).toEqual({ beginner: 'T', researcher: 'T' });
  });
});

describe('resolveT()', () => {
  const content = bl('beg', 'res');

  it('resolves each depth to the right string', () => {
    expect(resolveT(content, 'beginner')).toBe('beg');
    expect(resolveT(content, 'researcher')).toBe('res');
  });

  it('always returns a string, never an object, for any input', () => {
    // The property that actually prevents the white-screen class of bug.
    for (const input of [null, undefined, content, blSame('a'), {}, 'plain', 42, ['x']]) {
      expect(typeof resolveT(input, 'beginner')).toBe('string');
    }
  });

  it('returns empty string for missing content instead of throwing', () => {
    expect(resolveT(null, 'beginner')).toBe('');
    expect(resolveT(undefined, 'researcher')).toBe('');
    expect(resolveT({}, 'researcher')).toBe('');
  });

  it('falls back to the beginner text when researcher text is missing', () => {
    expect(resolveT(bl('only-beginner'), 'researcher')).toBe('only-beginner');
  });

  it('passes plain strings through, so unforked fields need no wrapper', () => {
    expect(resolveT('plain', 'researcher')).toBe('plain');
  });
});
