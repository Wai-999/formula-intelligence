import { describe, it, expect } from 'vitest';
import { loadJSON, conformToShape, QUARANTINE_KEY } from '../storage.js';

// Fixtures mirror the four malformed shapes that crashed 13 of 44 cases in
// the Phase 0 audit (docs/audits/BASELINE_AUDIT.md §4), plus a partial
// record. The contract: never throw, always return the fallback's shape, and
// never lose the original.
const MALFORMED = {
  truncatedJSON: '{"a":',
  wrongType: '"a string"',
  nullValue: 'null',
  futureVersion: JSON.stringify({ schemaVersion: 99, data: { unexpected: true } }),
};

const quarantined = () => JSON.parse(localStorage.getItem(QUARANTINE_KEY) || '{}');

describe('loadJSON shape guard', () => {
  it('returns the fallback when the key is missing, without quarantining', () => {
    expect(loadJSON('k', [])).toEqual([]);
    expect(localStorage.getItem(QUARANTINE_KEY)).toBeNull();
  });

  for (const [name, raw] of Object.entries(MALFORMED)) {
    it(`array fallback survives ${name}`, () => {
      localStorage.setItem('k', raw);
      const v = loadJSON('k', []);
      expect(Array.isArray(v)).toBe(true);
    });

    it(`object fallback survives ${name} and keeps every default field`, () => {
      localStorage.setItem('k', raw);
      const fallback = { layersByNode: {}, domainsVisited: [], predictions: {} };
      const v = loadJSON('k', fallback);
      expect(v.layersByNode).toEqual({});
      expect(Array.isArray(v.domainsVisited)).toBe(true);
      expect(v.predictions).toEqual({});
    });

    it(`quarantines the untouched original for ${name}`, () => {
      localStorage.setItem('k', raw);
      loadJSON('k', []);
      expect(quarantined().k.raw).toBe(raw);
    });
  }

  it('keeps valid data exactly and does not quarantine it', () => {
    localStorage.setItem('k', JSON.stringify([{ id: 1 }]));
    expect(loadJSON('k', [])).toEqual([{ id: 1 }]);
    expect(localStorage.getItem(QUARANTINE_KEY)).toBeNull();
  });

  it('repairs a partial record: fills missing fields, keeps unknown ones', () => {
    localStorage.setItem('k', JSON.stringify({ level: 'researcher', extra: 7 }));
    expect(loadJSON('k', { level: 'beginner', lang: 'en' })).toEqual({ level: 'researcher', lang: 'en', extra: 7 });
  });

  it('replaces a field of the wrong kind', () => {
    localStorage.setItem('k', JSON.stringify({ domainsVisited: 'gold', predictions: {} }));
    const v = loadJSON('k', { domainsVisited: [], predictions: {} });
    expect(v.domainsVisited).toEqual([]);
  });

  it('keeps the first quarantined original when a key fails twice', () => {
    localStorage.setItem('k', 'null');
    loadJSON('k', []);
    localStorage.setItem('k', '"later"');
    loadJSON('k', []);
    expect(quarantined().k.raw).toBe('null');
  });

  it('leaves the stored value itself untouched on read', () => {
    localStorage.setItem('k', 'null');
    loadJSON('k', {});
    expect(localStorage.getItem('k')).toBe('null');
  });

  it('a null fallback opts out of the guard (caller validates)', () => {
    expect(conformToShape('dark', null)).toEqual({ value: 'dark', repaired: false });
  });
});
