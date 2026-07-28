import { describe, it, expect } from 'vitest';
import { nodes } from '../index.js';
import { ML_MODELS, ML_LINKS, ML_FAMILIES, mlNodeById } from '../ml/models.js';
import { MODEL_DEPTH_LADDER } from '../ml/modelDepthLadder.js';
import { PY_ALL_ENTRIES, PY_SECTIONS } from '../python/index.js';
import { resolveT } from '../../lib/mlContent.js';

// Content in this app is hand-authored JS, not a validated CMS, so a typo
// in a data file is a runtime bug rather than a build error. Every check
// below corresponds to a class of failure that has ACTUALLY shipped here
// before (see FIX_LOG.md): bl() argument-count mistakes, an edge pointing
// at a renamed node id, a detail panel reading a field that didn't exist.
// Previous sessions caught these with one-off scripts that were thrown
// away afterwards; running them as tests is what stops the next one.

const isBl = (v) => v && typeof v === 'object' && 'en' in v && 'my' in v;

function everyBlObject(value, path, out) {
  if (!value || typeof value !== 'object') return;
  if (isBl(value)) { out.push([path, value]); return; }
  if (Array.isArray(value)) {
    value.forEach((v, i) => everyBlObject(v, `${path}[${i}]`, out));
    return;
  }
  for (const [k, v] of Object.entries(value)) everyBlObject(v, `${path}.${k}`, out);
}

describe('Stats formula data', () => {
  it('has unique ids across all 94 formulas', () => {
    const ids = nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every formula the fields the UI reads', () => {
    for (const n of nodes) {
      expect(n.id, `${n.id}.id`).toBeTruthy();
      expect(n.name, `${n.id}.name`).toBeTruthy();
      expect(typeof n.name, `${n.id}.name must be a string`).toBe('string');
      expect(n.ch, `${n.id}.ch`).toBeTypeOf('number');
    }
  });
});

describe('ML model graph', () => {
  it('has unique model ids and a matching lookup map', () => {
    const ids = ML_MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(mlNodeById).length).toBe(ML_MODELS.length);
  });

  it('points every edge at two real, distinct models', () => {
    const ids = new Set(ML_MODELS.map((m) => m.id));
    for (const l of ML_LINKS) {
      expect(ids.has(l.s), `edge source ${l.s}`).toBe(true);
      expect(ids.has(l.t), `edge target ${l.t}`).toBe(true);
      expect(l.s, 'self-link').not.toBe(l.t);
    }
  });

  it('assigns every model to a real family', () => {
    const famIds = new Set(ML_FAMILIES.map((f) => f.id));
    for (const m of ML_MODELS) {
      expect(famIds.has(m.ch), `${m.id} family ${m.ch}`).toBe(true);
    }
  });

  it('leaves no model isolated from the graph', () => {
    const connected = new Set(ML_LINKS.flatMap((l) => [l.s, l.t]));
    const orphans = ML_MODELS.filter((m) => !connected.has(m.id)).map((m) => m.id);
    expect(orphans).toEqual([]);
  });

  it('keeps every compass value within the documented 1-5 range', () => {
    for (const m of ML_MODELS) {
      for (const [axis, v] of Object.entries(m.compass || {})) {
        expect(v, `${m.id}.${axis}`).toBeGreaterThanOrEqual(1);
        expect(v, `${m.id}.${axis}`).toBeLessThanOrEqual(5);
      }
    }
  });

  it('pairs every model with exactly one depth ladder', () => {
    const modelIds = ML_MODELS.map((m) => m.id).sort();
    const ladderIds = Object.keys(MODEL_DEPTH_LADDER).sort();
    expect(ladderIds).toEqual(modelIds);
  });
});

describe('bilingual content objects', () => {
  // The exact bug class fixed in d3b3ed4 (22 occurrences): a bl() call with
  // too few arguments leaves researcher/Burmese text undefined, which
  // renders as silently blank UI rather than an error anyone would notice.
  it('fully populates all four slots of every bl() object in the ML data', () => {
    const found = [];
    everyBlObject(ML_MODELS, 'ML_MODELS', found);
    everyBlObject(ML_FAMILIES, 'ML_FAMILIES', found);
    everyBlObject(MODEL_DEPTH_LADDER, 'MODEL_DEPTH_LADDER', found);
    expect(found.length).toBeGreaterThan(500); // sanity: we are actually walking the data

    const incomplete = found.filter(([, c]) =>
      typeof c.en?.beginner !== 'string' || typeof c.en?.researcher !== 'string' ||
      typeof c.my?.beginner !== 'string' || typeof c.my?.researcher !== 'string'
    ).map(([path]) => path);
    expect(incomplete).toEqual([]);
  });

  it('resolves every ML content object to a non-empty string in all four modes', () => {
    const found = [];
    everyBlObject(ML_MODELS, 'ML_MODELS', found);
    const bad = [];
    for (const [path, c] of found) {
      for (const lang of ['en', 'my']) {
        for (const level of ['beginner', 'researcher']) {
          const out = resolveT(c, level, lang);
          if (typeof out !== 'string' || out.length === 0) bad.push(`${path} (${lang}/${level})`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('never leaves a raw bl() object where the UI renders a plain string', () => {
    // Model name/short are rendered directly as JSX children (no useT), so
    // they must be strings. This is precisely the Fifth Pass crash.
    for (const m of ML_MODELS) {
      expect(typeof m.name, `${m.id}.name`).toBe('string');
      expect(typeof m.short, `${m.id}.short`).toBe('string');
    }
    // Family names, by contrast, ARE bl() objects and must be resolved by
    // the caller — pin that so the contract can't silently flip.
    for (const f of ML_FAMILIES) {
      expect(isBl(f.name), `family ${f.id}.name should be a bl() object`).toBe(true);
    }
  });
});

describe('Python Hub content', () => {
  it('covers every stats formula and ML model exactly once', () => {
    const hubIds = PY_ALL_ENTRIES.map((e) => e.id);
    expect(new Set(hubIds).size).toBe(hubIds.length);

    const expected = [...nodes.map((n) => n.id), ...ML_MODELS.map((m) => m.id)].sort();
    expect(hubIds.slice().sort()).toEqual(expected);
  });

  it('gives every entry the sections the renderer expects', () => {
    for (const e of PY_ALL_ENTRIES) {
      expect(typeof e.name, `${e.id}.name`).toBe('string');
      expect(typeof e.overview, `${e.id}.overview`).toBe('string');
      expect(typeof e.code, `${e.id}.code`).toBe('string');
      expect(e.code.length, `${e.id}.code non-trivial`).toBeGreaterThan(80);
      expect(Array.isArray(e.mistakes), `${e.id}.mistakes`).toBe(true);
      expect(Array.isArray(e.tips), `${e.id}.tips`).toBe(true);
      expect(e.thinking?.workflow?.length, `${e.id}.thinking.workflow`).toBeGreaterThan(0);
      expect(e.scenario?.title, `${e.id}.scenario.title`).toBeTruthy();
    }
  });

  it('keeps code samples free of the constructs the highlighter cannot tokenize', () => {
    // PyCodeBlock tokenizes per line and documents the constraint that
    // samples use # comments, never triple-quoted strings, so no token
    // spans lines. A violation renders as mis-colored code, not an error.
    for (const e of PY_ALL_ENTRIES) {
      expect(e.code.includes('"""'), `${e.id} uses a docstring`).toBe(false);
      expect(e.code.includes("'''"), `${e.id} uses a docstring`).toBe(false);
    }
  });

  it('places every entry in exactly one navigable group', () => {
    const grouped = PY_SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.entries.map((e) => e.id)));
    expect(grouped.slice().sort()).toEqual(PY_ALL_ENTRIES.map((e) => e.id).sort());
  });
});
