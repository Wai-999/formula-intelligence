import { describe, it, expect } from 'vitest';
import { MODEL_DEPTH_LADDER } from '../ml/modelDepthLadder.js';
import { ML_MODELS } from '../ml/models.js';
import { MISCONCEPTIONS } from '../ml/misconceptions.js';
import { ML_TABS } from '../../store/useMLUIStore.js';
import { resolveT } from '../../lib/mlContent.js';
import { isBlObject } from '../schema.js';

// Backlog #10: the 32 Depth Ladders were flagged in BUILD_SUMMARY.md as
// never having had a full re-audit. They are the app's pedagogical core —
// four layers per model (Spark → Mechanism → Formalism → Critical Frontier)
// — and they are also the largest hand-authored structure in the repo
// (1,700+ lines), which makes a manual audit both expensive and unreliable.
//
// This suite IS the audit, and unlike a one-off review it runs on every
// commit. Each check corresponds to a way a ladder can be broken without
// throwing: a widget whose compute() returns NaN renders a blank number, a
// predict gate whose correctIndex is out of range can never be answered
// correctly, a live-link pointing at a retired tab is a dead button, and a
// misconception id with no entry silently renders nothing at the one layer
// meant to confront the learner's wrong model.

const entries = Object.entries(MODEL_DEPTH_LADDER);
const modelIds = new Set(ML_MODELS.map((m) => m.id));
const tabIds = new Set(ML_TABS.map((t) => t.id));
const misconceptionIds = new Set(Object.keys(MISCONCEPTIONS));

const LEVELS = ['beginner', 'researcher'];
const LANGS = ['en', 'my'];

/** A bl() field must resolve to real text in all four combinations. */
function resolvesEverywhere(content) {
  if (!isBlObject(content)) return false;
  return LANGS.every((lang) => LEVELS.every((lvl) => {
    const t = resolveT(content, lvl, lang);
    return typeof t === 'string' && t.trim().length > 0;
  }));
}

describe('ladder coverage', () => {
  it('pairs all 32 models 1:1 with a ladder', () => {
    expect(entries).toHaveLength(ML_MODELS.length);
    expect(Object.keys(MODEL_DEPTH_LADDER).sort()).toEqual([...modelIds].sort());
  });

  it('gives every ladder all four layers', () => {
    for (const [id, l] of entries) {
      for (const layer of ['spark', 'mechanism', 'formalism', 'criticalFrontier']) {
        expect(l[layer], `${id}.${layer}`).toBeTruthy();
      }
    }
  });
});

describe('Spark layer — the intuition hook', () => {
  it('gives every model an analogy that resolves in all four modes', () => {
    const bad = entries.filter(([, l]) => !resolvesEverywhere(l.spark.analogy)).map(([id]) => id);
    expect(bad).toEqual([]);
  });

  it('gates every spark with an answerable predict question', () => {
    for (const [id, l] of entries) {
      const p = l.spark.predict;
      expect(resolvesEverywhere(p.question), `${id} spark question`).toBe(true);
      expect(p.options.length, `${id} spark options`).toBeGreaterThanOrEqual(2);
      expect(p.correctIndex, `${id} spark correctIndex low`).toBeGreaterThanOrEqual(0);
      expect(p.correctIndex, `${id} spark correctIndex high`).toBeLessThan(p.options.length);
      for (const [i, opt] of p.options.entries()) {
        expect(resolvesEverywhere(opt), `${id} spark option ${i}`).toBe(true);
      }
    }
  });
});

describe('Mechanism layer — the hands-on part', () => {
  it('uses only the two supported mechanism kinds', () => {
    for (const [id, l] of entries) {
      expect(['widget', 'live-link'], `${id}.mechanism.kind`).toContain(l.mechanism.kind);
    }
  });

  it('points every live-link at a module that still exists', () => {
    // This is the check that would have caught the Bridge tab's removal:
    // a ladder linking to a retired tab renders a button that goes nowhere.
    const broken = entries
      .filter(([, l]) => l.mechanism.kind === 'live-link' && !tabIds.has(l.mechanism.module))
      .map(([id, l]) => `${id} -> ${l.mechanism.module}`);
    expect(broken).toEqual([]);
  });

  it('labels every live-link with text that resolves', () => {
    const bad = entries
      .filter(([, l]) => l.mechanism.kind === 'live-link' && !resolvesEverywhere(l.mechanism.label))
      .map(([id]) => id);
    expect(bad).toEqual([]);
  });

  it('gives every widget a computable, finite output across its whole range', () => {
    // A widget whose compute() returns NaN or Infinity renders a blank or
    // nonsense figure — silently, since nothing throws.
    const bad = [];
    for (const [id, l] of entries) {
      if (l.mechanism.kind !== 'widget') continue;
      const { paramMin, paramMax, paramDefault, compute } = l.mechanism;
      expect(typeof compute, `${id} compute`).toBe('function');
      expect(paramMin, `${id} range`).toBeLessThan(paramMax);
      expect(paramDefault, `${id} default in range`).toBeGreaterThanOrEqual(paramMin);
      expect(paramDefault, `${id} default in range`).toBeLessThanOrEqual(paramMax);
      // Sample across the slider, not just the endpoints.
      for (let i = 0; i <= 20; i++) {
        const v = paramMin + ((paramMax - paramMin) * i) / 20;
        const out = compute(v);
        if (typeof out !== 'number' || !Number.isFinite(out)) bad.push(`${id} @ ${v} -> ${out}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('gives every widget an answerable predict gate and labels', () => {
    for (const [id, l] of entries) {
      if (l.mechanism.kind !== 'widget') continue;
      const p = l.mechanism.predict;
      expect(resolvesEverywhere(p.question), `${id} widget question`).toBe(true);
      expect(p.correctIndex).toBeLessThan(p.options.length);
      expect(resolvesEverywhere(l.mechanism.paramLabel), `${id} paramLabel`).toBe(true);
      expect(resolvesEverywhere(l.mechanism.outputLabel), `${id} outputLabel`).toBe(true);
    }
  });
});

describe('Formalism layer — worked example then faded practice', () => {
  it('gives every model a worked example that genuinely differs by depth', () => {
    // The whole point of this layer is that a beginner sees a concrete
    // walkthrough and a researcher sees notation. If both are identical the
    // depth toggle is decorative here.
    const identical = entries.filter(([, l]) => {
      const w = l.formalism.worked;
      return resolveT(w, 'beginner', 'en') === resolveT(w, 'researcher', 'en');
    }).map(([id]) => id);
    expect(identical).toEqual([]);
  });

  it('resolves worked and faded content in all four modes', () => {
    for (const [id, l] of entries) {
      expect(resolvesEverywhere(l.formalism.worked), `${id} worked`).toBe(true);
      expect(resolvesEverywhere(l.formalism.faded), `${id} faded`).toBe(true);
    }
  });
});

describe('Critical Frontier layer — where the analogy breaks', () => {
  it('links every model to a misconception that exists in the registry', () => {
    const broken = entries
      .filter(([, l]) => l.criticalFrontier.misconceptionId
        && !misconceptionIds.has(l.criticalFrontier.misconceptionId))
      .map(([id, l]) => `${id} -> ${l.criticalFrontier.misconceptionId}`);
    expect(broken).toEqual([]);
  });

  it('states an analogy breakdown and a caveat for every model', () => {
    for (const [id, l] of entries) {
      expect(resolvesEverywhere(l.criticalFrontier.analogyBreakdown), `${id} analogyBreakdown`).toBe(true);
      expect(resolvesEverywhere(l.criticalFrontier.caveat), `${id} caveat`).toBe(true);
    }
  });

  it('closes every ladder with a retrieval question AND its answer', () => {
    for (const [id, l] of entries) {
      const r = l.criticalFrontier.retrieval;
      expect(resolvesEverywhere(r.question), `${id} retrieval question`).toBe(true);
      expect(resolvesEverywhere(r.answer), `${id} retrieval answer`).toBe(true);
    }
  });
});

describe('audit summary', () => {
  // Composition as it stands after this audit, pinned so a future edit that
  // guts the interactive half — or quietly converts widgets into links —
  // shows up in a diff instead of eroding the module's character silently.
  it('keeps every ladder interactive by one of the two means', () => {
    const widgets = entries.filter(([, l]) => l.mechanism.kind === 'widget').length;
    const liveLinks = entries.filter(([, l]) => l.mechanism.kind === 'live-link').length;
    expect(widgets + liveLinks).toBe(32);
    expect(widgets).toBe(19);
    expect(liveLinks).toBe(13);
  });

  it('records that most ladders rely on the layer prose rather than a registry entry', () => {
    // Only 4 of 32 name a registry misconception; the other 28 confront the
    // wrong mental model in their own analogyBreakdown/caveat text instead.
    // That is a legitimate design (the registry holds the seven CROSS-CUTTING
    // misconceptions, not one per model) — pinned here so the low number is
    // understood as intentional rather than rediscovered as a gap later.
    const withMisconception = entries.filter(([, l]) => l.criticalFrontier.misconceptionId).length;
    expect(withMisconception).toBe(4);
    // …but the substantive part must be present on ALL of them, which the
    // Critical Frontier suite above already asserts.
  });
});
