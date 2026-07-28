import { describe, it, expect } from 'vitest';
import { bl, blSame, resolveT } from '../mlContent.js';

// This module is the single most dangerous piece of plumbing in the app.
// Its objects are shaped { en: {beginner, researcher}, my: {...} } and are
// NOT strings — rendering one directly as a JSX child throws "Objects are
// not valid as a React child", which (before error boundaries existed)
// blanked the entire app. That exact bug shipped twice: 22 argument-count
// errors caught in d3b3ed4, and an unresolved family.name in the Model Map
// detail panel caught in the Fifth Pass. These tests pin the contract.
describe('bl()', () => {
  it('builds all four language/depth combinations', () => {
    const c = bl('EB', 'ER', 'MB', 'MR');
    expect(c).toEqual({
      en: { beginner: 'EB', researcher: 'ER' },
      my: { beginner: 'MB', researcher: 'MR' },
    });
  });

  it('leaves omitted arguments undefined rather than silently shifting them', () => {
    // The historical bug was calling bl() with 2 or 3 args, which quietly
    // produced undefined researcher/Burmese text that rendered as blank.
    // Being undefined (not shifted) is what lets the validator below catch it.
    const c = bl('only-one');
    expect(c.en.beginner).toBe('only-one');
    expect(c.en.researcher).toBeUndefined();
    expect(c.my.beginner).toBeUndefined();
  });
});

describe('blSame()', () => {
  it('uses one string for both depths in each language', () => {
    const c = blSame('EN', 'MY');
    expect(c.en.beginner).toBe('EN');
    expect(c.en.researcher).toBe('EN');
    expect(c.my.beginner).toBe('MY');
    expect(c.my.researcher).toBe('MY');
  });
});

describe('resolveT()', () => {
  const content = bl('en-beg', 'en-res', 'my-beg', 'my-res');

  it('resolves every level/language pair to the right string', () => {
    expect(resolveT(content, 'beginner', 'en')).toBe('en-beg');
    expect(resolveT(content, 'researcher', 'en')).toBe('en-res');
    expect(resolveT(content, 'beginner', 'my')).toBe('my-beg');
    expect(resolveT(content, 'researcher', 'my')).toBe('my-res');
  });

  it('always returns a string, never an object, for any input', () => {
    // The property that actually prevents the white-screen class of bug.
    for (const input of [null, undefined, content, blSame('a', 'b'), {}]) {
      expect(typeof resolveT(input, 'beginner', 'en')).toBe('string');
    }
  });

  it('returns empty string for missing content instead of throwing', () => {
    expect(resolveT(null, 'beginner', 'en')).toBe('');
    expect(resolveT(undefined, 'researcher', 'my')).toBe('');
  });

  it('falls back to English when the requested language is absent', () => {
    expect(resolveT({ en: { beginner: 'fallback' } }, 'beginner', 'my')).toBe('fallback');
  });

  it('falls back to beginner text when researcher text is missing', () => {
    const partial = { en: { beginner: 'only-beginner' } };
    expect(resolveT(partial, 'researcher', 'en')).toBe('only-beginner');
  });

  it('handles an unknown level without throwing', () => {
    expect(typeof resolveT(content, 'expert', 'en')).toBe('string');
  });
});
