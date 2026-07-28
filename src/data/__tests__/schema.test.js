import { describe, it, expect } from 'vitest';
import { nodes } from '../nodes.js';
import { ML_MODELS, ML_LINKS, ML_FAMILIES } from '../ml/models.js';
import { PY_ALL_ENTRIES } from '../python/index.js';
import { bl, blSame } from '../../lib/mlContent.js';
import {
  STATS_NODE, ML_MODEL, ML_FAMILY, ML_LINK, PY_ENTRY,
  validateRecord, validateCollection, checkUniqueIds, checkReferences, isBlObject,
} from '../schema.js';

// Two jobs here. First: enforce the schemas against the real corpus, so CI
// fails on malformed content rather than shipping a blank card. Second:
// prove the validator actually catches each bug class this repo has really
// shipped — a validator that silently passes bad input is worse than none,
// because it manufactures false confidence.

describe('live content conforms to its schema', () => {
  it('validates all 94 stats formulas', () => {
    expect(validateCollection(STATS_NODE, nodes, 'STATS_NODE')).toEqual([]);
  });

  it('validates all 32 ML models', () => {
    expect(validateCollection(ML_MODEL, ML_MODELS, 'ML_MODEL')).toEqual([]);
  });

  it('validates all 10 ML families', () => {
    expect(validateCollection(ML_FAMILY, ML_FAMILIES, 'ML_FAMILY')).toEqual([]);
  });

  it('validates all 37 graph edges and their references', () => {
    const ids = new Set(ML_MODELS.map((m) => m.id));
    expect([
      ...validateCollection(ML_LINK, ML_LINKS, 'ML_LINK', 's'),
      ...checkReferences(ML_LINKS, 's', ids, 'ML_LINK'),
      ...checkReferences(ML_LINKS, 't', ids, 'ML_LINK'),
    ]).toEqual([]);
  });

  it('validates all 126 Python Hub entries', () => {
    expect(validateCollection(PY_ENTRY, PY_ALL_ENTRIES, 'PY_ENTRY')).toEqual([]);
  });

  it('finds no duplicate ids in any collection', () => {
    expect(checkUniqueIds(nodes, 'STATS_NODE')).toEqual([]);
    expect(checkUniqueIds(ML_MODELS, 'ML_MODEL')).toEqual([]);
    expect(checkUniqueIds(PY_ALL_ENTRIES, 'PY_ENTRY')).toEqual([]);
  });
});

describe('the validator catches the bug classes this repo has actually shipped', () => {
  const first = (errs) => errs[0] || '';

  it('catches bl() called with too few arguments (d3b3ed4, 22 occurrences)', () => {
    const errs = validateRecord({ f: { kind: 'bl' } }, { f: bl('en-b', 'en-r') }, 'X');
    expect(errs.length).toBeGreaterThan(0);
    expect(first(errs)).toMatch(/missing text/);
  });

  it('catches a bilingual object in a field rendered as a raw string (Fifth Pass)', () => {
    const errs = validateRecord({ name: { kind: 'string' } }, { name: blSame('a', 'b') }, 'X');
    expect(first(errs)).toMatch(/expected a string/);
    expect(first(errs)).toMatch(/useT/); // tells the author the actual fix
  });

  it('catches a plain string where the bilingual contract requires bl()', () => {
    const errs = validateRecord(ML_FAMILY, { id: 1, name: 'Linear', color: '#fff' }, 'X');
    expect(first(errs)).toMatch(/expected a bl\(\)/);
  });

  it('catches out-of-range compass values', () => {
    const errs = validateRecord(
      { compass: { kind: 'object', shape: { interpretability: { kind: 'number', min: 1, max: 5 } } } },
      { compass: { interpretability: 9 } }, 'X'
    );
    expect(first(errs)).toMatch(/above maximum 5/);
  });

  it('catches missing required fields with the exact path', () => {
    const errs = validateRecord(STATS_NODE, { id: 'mean', ch: 3, name: 'Mean' }, 'STATS_NODE[mean]');
    expect(errs).toContain('STATS_NODE[mean].formula — required, but missing');
  });

  it('catches docstrings that would break the code highlighter', () => {
    const errs = validateRecord(
      { code: PY_ENTRY.code },
      { code: '"""doc"""\n' + 'x = 1\n'.repeat(30) }, 'X'
    );
    expect(first(errs)).toMatch(/triple-quoted/);
  });

  it('catches an edge pointing at a renamed or deleted model', () => {
    const errs = checkReferences([{ id: 'e', t: 'gone' }], 't', new Set(['real']), 'ML_LINK');
    expect(first(errs)).toMatch(/"gone" does not exist/);
  });

  it('catches duplicate ids, naming both positions', () => {
    const errs = checkUniqueIds([{ id: 'a' }, { id: 'a' }], 'N');
    expect(first(errs)).toMatch(/duplicate id/);
  });

  it('catches an empty or whitespace-only string', () => {
    expect(validateRecord({ s: { kind: 'string' } }, { s: '   ' }, 'X')[0]).toMatch(/empty/);
  });

  it('accepts a fully valid record without complaint', () => {
    expect(validateRecord(ML_FAMILY, { id: 1, name: blSame('A', 'B'), color: '#fff' }, 'X')).toEqual([]);
  });
});

describe('isBlObject', () => {
  it('recognizes bl() and blSame() output', () => {
    expect(isBlObject(bl('a', 'b', 'c', 'd'))).toBe(true);
    expect(isBlObject(blSame('a', 'b'))).toBe(true);
  });

  it('rejects strings, arrays, null and partial objects', () => {
    for (const v of ['text', null, undefined, [], {}, { en: { beginner: 'x' } }]) {
      expect(isBlObject(v)).toBe(false);
    }
  });
});
