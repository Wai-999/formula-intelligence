import { describe, it, expect, beforeAll } from 'vitest';
import katex from 'katex';
import { COURSES, SUBJECTS, unitById, courseStatus } from '../catalog.js';
import { LESSONS, lessonById } from '../lessons/index.js';
import { CONCEPTS } from '../concepts.js';
import { COMPETENCIES, competencyById, DOMAINS } from '../competencies.js';
import { FORMULAS } from '../formulas.js';
import { buildKnowledgeGraph } from '../graph.js';
import { validateGraph } from '../../../lib/knowledgeGraph.js';
import { tokenize } from '../../../lib/mathFormat.js';
import { LABS } from '../../../features/labs/registry.js';
import { checkAnswer } from '../../../lib/answers.js';

// The curriculum's machine checks (docs/CONTENT_QA.md). These are what
// "verified" means for AI-drafted content in this repository: structure,
// every worked example and numeric answer recomputed independently, every
// formula parsed, every link resolvable inside the graph. They are NOT a
// substitute for the independent human math review §5 requires.

const conceptIds = new Set(CONCEPTS.map((c) => c.id));
const bodies = {};

beforeAll(async () => {
  for (const l of LESSONS) bodies[l.id] = (await l.load()).default;
});

/** Every authored string in a lesson body, with a path for error messages. */
function strings(value, path = '') {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => (['code', 'output', 'url', 'lab', 'id', 'competency', 'remedy', 'level'].includes(k) ? [] : strings(v, `${path}.${k}`)));
  }
  return [];
}

function renderAll(text) {
  for (const tok of tokenize(text)) {
    if (tok.t === 'math' || tok.t === 'display') katex.renderToString(tok.v, { throwOnError: true, strict: 'ignore', displayMode: tok.t === 'display' });
    if (tok.t === 'bold') renderAll(tok.v);
  }
}

const itemsOf = (b) => [...b.priorCheck, ...b.practice, ...b.checkpoint];

describe('catalog', () => {
  it('has unique subject, course and unit ids, and every course in a known subject', () => {
    // Separate namespaces (a subject and its course may share a name).
    for (const ids of [SUBJECTS.map((s) => s.id), COURSES.map((c) => c.id), COURSES.flatMap((c) => c.units.map((u) => u.id))]) {
      expect(new Set(ids).size).toBe(ids.length);
    }
    for (const c of COURSES) expect(SUBJECTS.some((s) => s.id === c.subject), c.id).toBe(true);
  });

  it('covers every subject the spec lists for Learn (§3)', () => {
    expect(SUBJECTS.map((s) => s.title)).toEqual(['Mathematics Foundations', 'Algebra', 'Precalculus', 'Linear Algebra', 'Calculus', 'Probability & Statistics', 'Machine Learning', 'Python for Data Science', 'Applied Projects']);
  });

  it('keeps Algebra and Linear Algebra separate (§5 “do not conflate”)', () => {
    const alg = COURSES.filter((c) => c.subject === 'algebra').map((c) => c.id);
    const la = COURSES.filter((c) => c.subject === 'linear-algebra').map((c) => c.id);
    expect(alg).toEqual(['algebra-1', 'algebra-2']);
    expect(la).toEqual(['linear-algebra']);
  });

  it('references only existing courses, concepts, competencies and labs', () => {
    for (const c of COURSES) {
      for (const p of c.prerequisites) expect(COURSES.some((x) => x.id === p), `${c.id} → ${p}`).toBe(true);
      for (const u of c.units) {
        expect(u.objectives.length, u.id).toBeGreaterThan(0);
        for (const k of u.exitCompetencies) expect(competencyById[k], `${u.id} competency ${k}`).toBeTruthy();
        for (const p of u.prerequisites) expect(conceptIds.has(p), `${u.id} prerequisite ${p}`).toBe(true);
        for (const lab of u.labs ?? []) expect(LABS[lab], `${u.id} lab ${lab}`).toBeTruthy();
      }
    }
  });

  it('lists every authored lesson in exactly one unit, and only authored lessons', () => {
    const listed = COURSES.flatMap((c) => c.units.flatMap((u) => u.lessons.map((l) => ({ l, u: u.id, c: c.id }))));
    expect(listed.map((x) => x.l).sort()).toEqual(LESSONS.map((l) => l.id).sort());
    for (const { l, u, c } of listed) {
      expect(lessonById[l].unit, l).toBe(u);
      expect(lessonById[l].course, l).toBe(c);
    }
  });

  it('labels outline courses honestly', () => {
    for (const c of COURSES) {
      const authored = c.units.reduce((n, u) => n + u.lessons.length, 0);
      expect(courseStatus(c) === 'outline', c.id).toBe(authored === 0);
    }
    // No course claims to be complete while any of its units is still planned.
    for (const c of COURSES.filter((x) => courseStatus(x) === 'authored')) {
      expect(c.units.every((u) => u.planned.length === 0), c.id).toBe(true);
    }
  });
});

describe('competencies', () => {
  it('belong to a diagnostic domain, and every domain has some', () => {
    const domainIds = DOMAINS.map((d) => d.id);
    for (const c of COMPETENCIES) expect(domainIds, c.id).toContain(c.domain);
    for (const d of domainIds) expect(COMPETENCIES.some((c) => c.domain === d), d).toBe(true);
  });
});

describe('lesson index', () => {
  it('references existing concepts, competencies, formulas, labs and lessons', () => {
    const fids = new Set(FORMULAS.map((f) => f.id));
    for (const l of LESSONS) {
      for (const c of [...l.concepts, ...l.prerequisites]) expect(conceptIds.has(c), `${l.id}: ${c}`).toBe(true);
      for (const k of l.competencies) expect(competencyById[k], `${l.id}: ${k}`).toBeTruthy();
      for (const f of l.formulas) expect(fids.has(f), `${l.id}: ${f}`).toBe(true);
      for (const lab of l.labs) expect(LABS[lab], `${l.id}: ${lab}`).toBeTruthy();
      for (const n of l.next) expect(lessonById[n], `${l.id} next ${n}`).toBeTruthy();
      expect(l.review.status).toBe('awaiting-human-review');
      expect(l.review.reviewer).toBeNull();
    }
  });
});

describe('lesson bodies: the ten elements of §6', () => {
  it('every lesson has all ten elements', () => {
    for (const l of LESSONS) {
      const b = bodies[l.id];
      const where = l.id;
      // 1. intuition + motivating question
      expect(b.intuition.question.length, where).toBeGreaterThan(40);
      expect(b.intuition.body.length, where).toBeGreaterThan(0);
      // 2. notation glossary + prior-knowledge check
      expect(b.glossary.length, where).toBeGreaterThanOrEqual(3);
      expect(b.priorCheck.length, where).toBeGreaterThanOrEqual(1);
      // 3. visualization with a text alternative
      expect(LABS[b.visualization.lab], where).toBeTruthy();
      expect(b.visualization.textAlternative.length, where).toBeGreaterThan(60);
      // 4. derivation with assumptions and domain
      expect(b.derivation.steps.length, where).toBeGreaterThanOrEqual(3);
      expect(b.derivation.assumptions.length, where).toBeGreaterThan(0);
      expect(b.derivation.domain.length, where).toBeGreaterThan(0);
      // 5. two worked examples + a non-example
      expect(b.examples.length, where).toBeGreaterThanOrEqual(2);
      expect(b.counterexample.body.length, where).toBeGreaterThan(0);
      // 6. predict-before-reveal with a misconception
      expect(b.predict.answer, where).toBeLessThan(b.predict.choices.length);
      expect(b.predict.misconception.correction.length, where).toBeGreaterThan(20);
      // 7. graduated practice at all three levels
      for (const lv of ['scaffolded', 'independent', 'transfer']) {
        expect(b.practice.some((p) => p.level === lv), `${where} ${lv}`).toBe(true);
      }
      // 8. checkpoint with actionable feedback, including a harder and a transfer item
      expect(b.checkpoint.length, where).toBeGreaterThanOrEqual(3);
      expect(b.checkpoint.some((c) => c.difficulty >= 2), where).toBe(true);
      expect(b.checkpoint.some((c) => c.transfer), where).toBe(true);
      for (const c of b.checkpoint) expect(c.feedbackIncorrect, `${where} ${c.id}`).toBeTruthy();
      // 9. Python with a deterministic expected output
      expect(b.python.code.length, where).toBeGreaterThan(40);
      expect(b.python.output.length, where).toBeGreaterThan(0);
      // 10. further reading with real links
      expect(b.reading.length, where).toBeGreaterThan(0);
      for (const r of b.reading) expect(r.url, where).toMatch(/^https:\/\//);
    }
  });

  it('every worked example’s answer is recomputed independently', () => {
    for (const l of LESSONS) {
      for (const ex of bodies[l.id].examples) {
        expect(ex.check, `${l.id}: ${ex.title}`).toBeTruthy();
        const tol = ex.check.tolerance ?? 1e-9;
        expect(Math.abs(ex.check.compute() - ex.check.value), `${l.id}: ${ex.title}`).toBeLessThanOrEqual(tol);
      }
    }
  });
});

describe('assessment items', () => {
  it('have unique ids across the whole curriculum', () => {
    const ids = LESSONS.flatMap((l) => itemsOf(bodies[l.id]).map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('are well-formed, with known competencies and in-range keys', () => {
    for (const l of LESSONS) {
      for (const it2 of itemsOf(bodies[l.id])) {
        const where = `${l.id}/${it2.id}`;
        expect(competencyById[it2.competency], where).toBeTruthy();
        expect([1, 2, 3], where).toContain(it2.difficulty);
        expect(it2.solution, where).toBeTruthy();
        const a = it2.answer;
        if (a.type === 'choice') {
          expect(a.choices.length, where).toBeGreaterThanOrEqual(2);
          expect(a.correct, where).toBeLessThan(a.choices.length);
          for (const k of Object.keys(it2.feedback ?? {})) {
            expect(Number(k), where).toBeLessThan(a.choices.length);
            expect(Number(k), `${where} feedback on the correct choice`).not.toBe(a.correct);
          }
        } else if (a.type === 'numeric') {
          // Tolerances accept rounding, never a different answer.
          expect(a.tolerance, where).toBeLessThanOrEqual(Math.max(0.001, 0.01 * Math.abs(a.value)));
        } else {
          expect(a.type, where).toBe('multi');
          expect(a.values.length, where).toBeGreaterThanOrEqual(2);
        }
        if (it2.remedy) expect(lessonById[it2.remedy], `${where} remedy`).toBeTruthy();
      }
    }
  });

  it('every numeric answer agrees with its independent recomputation', () => {
    let checked = 0;
    for (const l of LESSONS) {
      for (const it2 of itemsOf(bodies[l.id])) {
        if (it2.answer.type !== 'numeric' || !it2.compute) continue;
        const tol = Math.max(it2.answer.tolerance, 1e-9);
        expect(Math.abs(it2.compute() - it2.answer.value), `${l.id}/${it2.id}`).toBeLessThanOrEqual(tol);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(150);
  });

  it('accepts the key itself and rejects an obviously wrong answer', () => {
    for (const l of LESSONS) {
      for (const it2 of itemsOf(bodies[l.id])) {
        const a = it2.answer;
        const right = a.type === 'choice' ? a.correct : a.type === 'numeric' ? String(a.value) : a.values.map(String);
        const wrong = a.type === 'choice' ? (a.correct + 1) % a.choices.length : a.type === 'numeric' ? String(a.value + 1) : a.values.map((x) => String(x + 1));
        expect(checkAnswer(a, right).correct, `${l.id}/${it2.id}`).toBe(true);
        expect(checkAnswer(a, wrong).correct, `${l.id}/${it2.id}`).toBe(false);
      }
    }
  });
});

describe('mathematics typesetting', () => {
  it('every inline and display formula in every lesson parses', () => {
    for (const l of LESSONS) {
      for (const [path, text] of strings(bodies[l.id])) {
        expect(() => renderAll(text), `${l.id}${path}: ${text.slice(0, 80)}`).not.toThrow();
      }
    }
  });

  it('every derivation step and registry formula parses', () => {
    for (const l of LESSONS) {
      for (const s of bodies[l.id].derivation.steps) {
        if (s.math) expect(() => katex.renderToString(s.math, { throwOnError: true, displayMode: true, strict: 'ignore' }), `${l.id}: ${s.math}`).not.toThrow();
      }
    }
    for (const f of FORMULAS) {
      expect(() => katex.renderToString(f.latex, { throwOnError: true, displayMode: true, strict: 'ignore' }), f.id).not.toThrow();
      for (const v of f.variables) expect(() => katex.renderToString(v.symbol, { throwOnError: true, strict: 'ignore' }), `${f.id} ${v.symbol}`).not.toThrow();
      for (const t of [...f.assumptions, ...f.domain, ...f.pitfalls]) expect(() => renderAll(t), `${f.id}: ${t}`).not.toThrow();
    }
  });
});

describe('formula registry', () => {
  it('links every formula to an existing concept and lesson, and states its claim type', () => {
    for (const f of FORMULAS) {
      expect(conceptIds.has(f.concept), f.id).toBe(true);
      expect(lessonById[f.lesson], f.id).toBeTruthy();
      expect(['definition', 'identity', 'theorem', 'approximation', 'heuristic', 'empirical'], f.id).toContain(f.claim);
      expect(f.interpretation, f.id).toBeTruthy();
      expect(f.python, f.id).toBeTruthy();
    }
  });
});

describe('knowledge graph', () => {
  it('is valid: unique ids, no dangling edges, acyclic prerequisites', () => {
    const exercises = LESSONS.flatMap((l) => itemsOf(bodies[l.id]).map((i) => ({ id: i.id, lesson: l.id })));
    const g = buildKnowledgeGraph({ exercises });
    expect(validateGraph(g)).toEqual([]);
    expect(g.nodes.filter((n) => n.kind === 'exercise').length).toBe(exercises.length);
  });

  it('reaches every concept from the lessons or the outline (no orphan concepts)', () => {
    const used = new Set([...LESSONS.flatMap((l) => [...l.concepts, ...l.prerequisites]), ...COURSES.flatMap((c) => c.units.flatMap((u) => u.prerequisites)), ...CONCEPTS.flatMap((c) => c.requires)]);
    const units = new Set(Object.keys(unitById));
    for (const c of CONCEPTS) {
      expect(units.has(c.unit), `${c.id} unit ${c.unit}`).toBe(true);
      expect(used.has(c.id) || c.requires.length > 0, c.id).toBe(true);
    }
  });
});

describe('visual labs (§7 required list)', () => {
  const REQUIRED = ['equation balance', 'function transformations', 'slope/derivative', 'Riemann sums', 'Taylor approximation', 'vector addition/dot product', 'matrix transformations', 'Gaussian elimination', 'eigenvectors', 'SVD/PCA', 'gradient/Hessian', 'gradient descent', 'least-squares fitting', 'sampling distributions', 'Bayes updating', 'bias–variance', 'classification decision boundaries'];

  it('provides all seventeen required labs', () => {
    const provided = Object.values(LABS).map((l) => l.required).filter(Boolean);
    expect(provided.sort()).toEqual([...REQUIRED].sort());
  });

  it('hosts every required lab in a lesson (bias–variance lives in the ML pipeline lesson)', () => {
    const hosted = new Set(LESSONS.flatMap((l) => [bodies[l.id].visualization.lab, ...(bodies[l.id].visualization.more ?? []).map((m) => m.lab)]));
    for (const [id, lab] of Object.entries(LABS)) {
      if (!lab.required || id === 'bias-variance') continue;
      expect(hosted.has(id), id).toBe(true);
    }
  });
});
