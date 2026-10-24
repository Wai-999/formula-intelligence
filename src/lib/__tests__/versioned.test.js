import { describe, it, expect, beforeEach } from 'vitest';
import { readVersioned, writeVersioned } from '../versioned.js';
import { QUARANTINE_KEY } from '../storage.js';
import { compactEvidence } from '../../store/useLearningStore.js';

// Acceptance test 2 for the V3.1 records: missing, corrupt, partial, future
// and older-version data each load safely, and nothing is ever destroyed.
const KEY = 'fi_test_v1';
const SPEC = {
  version: 2,
  empty: () => ({ schemaVersion: 2, items: [], name: '' }),
  // v1 stored a bare list under `list`; v2 renamed it and added `name`.
  migrations: { 1: (r) => ({ items: r.list, name: 'migrated' }) },
  validate: (r) => Array.isArray(r.items),
};
const quarantined = () => JSON.parse(localStorage.getItem(QUARANTINE_KEY) || '{}');

beforeEach(() => localStorage.clear());

describe('readVersioned', () => {
  it('missing → a fresh record', () => {
    expect(readVersioned(KEY, SPEC)).toEqual(SPEC.empty());
  });

  it('corrupt JSON → fresh record, original quarantined byte-for-byte', () => {
    localStorage.setItem(KEY, '{not json');
    expect(readVersioned(KEY, SPEC)).toEqual(SPEC.empty());
    expect(quarantined()[KEY].raw).toBe('{not json');
  });

  it('valid JSON of the wrong shape → quarantined, not trusted', () => {
    for (const raw of ['null', '"text"', '[1,2]', '{"items":[]}']) {
      localStorage.clear();
      localStorage.setItem(KEY, raw);
      expect(readVersioned(KEY, SPEC), raw).toEqual(SPEC.empty());
      expect(quarantined()[KEY].raw, raw).toBe(raw);
    }
  });

  it('a record from a NEWER app version is kept aside, never overwritten', () => {
    const future = JSON.stringify({ schemaVersion: 9, items: ['x'] });
    localStorage.setItem(KEY, future);
    expect(readVersioned(KEY, SPEC)).toEqual(SPEC.empty());
    expect(quarantined()[KEY].raw).toBe(future);
  });

  it('an older record is migrated step by step', () => {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, list: [1, 2, 3] }));
    expect(readVersioned(KEY, SPEC)).toEqual({ schemaVersion: 2, items: [1, 2, 3], name: 'migrated' });
    expect(quarantined()[KEY]).toBeUndefined();
  });

  it('a migration that fails is never half-applied', () => {
    const raw = JSON.stringify({ schemaVersion: 0, list: [] });
    localStorage.setItem(KEY, raw);
    expect(readVersioned(KEY, SPEC)).toEqual(SPEC.empty());
    expect(quarantined()[KEY].raw).toBe(raw);
  });

  it('partial data that fails validation after migration is quarantined', () => {
    const raw = JSON.stringify({ schemaVersion: 1, list: 'not a list' });
    localStorage.setItem(KEY, raw);
    expect(readVersioned(KEY, SPEC)).toEqual(SPEC.empty());
    expect(quarantined()[KEY].raw).toBe(raw);
  });

  it('round-trips what it writes', () => {
    const rec = { schemaVersion: 2, items: [{ a: 'Σ unicode' }], name: 'n' };
    expect(writeVersioned(KEY, rec)).toBe(true);
    expect(readVersioned(KEY, SPEC)).toEqual(rec);
  });
});

describe('evidence compaction', () => {
  const e = (item, at) => ({ c: 'k', item, ok: true, at });

  it('is a no-op under the cap', () => {
    const log = [e('a', 1), e('a', 2)];
    expect(compactEvidence(log, 5)).toBe(log);
  });

  it('drops only superseded attempts, so the latest per item survives', () => {
    const log = [e('a', 1), e('b', 2), e('a', 3), e('c', 4), e('b', 5)];
    const out = compactEvidence(log, 3);
    expect(out.map((x) => `${x.item}${x.at}`)).toEqual(['a3', 'c4', 'b5']);
  });
});
