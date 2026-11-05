import { describe, it, expect, beforeAll } from 'vitest';
import katex from 'katex';
import { COURSES } from '../catalog.js';
import { LESSONS, lessonById } from '../lessons/index.js';
import { competencyById } from '../competencies.js';
import { PROBLEMS, PROBLEM_DOMAINS, EXPLAIN_BACK, problemsForLesson } from '../problems.js';
import { lessonItems } from '../lessonItems.js';
import { tokenize } from '../../../lib/mathFormat.js';
import { checkAnswer } from '../../../lib/answers.js';

// The real-world problem bank (src/data/curriculum/problems.js) gets the same
// machine checks as the lessons: structure, honest data labels, every answer
// recomputed independently, every formula parsed. Like the lessons, the
// problems are AI drafts: these checks are not the human review they await.

const bodies = {};
beforeAll(async () => {
  for (const l of LESSONS) bodies[l.id] = (await l.load()).default;
});

const writtenCourses = COURSES.filter((c) => c.units.some((u) => u.lessons.length));
const order = (c) => c.units.flatMap((u) => u.lessons);
// First and last written lesson of every course that has any: the lessons the
// upgrade enhances first (docs/CONTINUOUS_LEARNING_UPGRADE.md, P1).
const enhanced = [...new Set(writtenCourses.flatMap((c) => [order(c)[0], order(c).at(-1)]))];
const allItems = PROBLEMS.flatMap((p) => p.items.map((i) => ({ ...i, problem: p.id })));

function renderAll(text, where) {
  for (const tok of tokenize(text)) {
    if (tok.t === 'math' || tok.t === 'display') {
      expect(() => katex.renderToString(tok.v, { throwOnError: true, strict: 'ignore', displayMode: tok.t === 'display' }), `${where}: ${tok.v}`).not.toThrow();
    }
    if (tok.t === 'bold') renderAll(tok.v, where);
  }
}

function strings(value, path = '') {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => (['id', 'competency', 'level', 'kind', 'domain', 'courseId', 'reviewedStatus'].includes(k) ? [] : strings(v, `${path}.${k}`)));
  }
  return [];
}

describe('problem bank: structure and honesty', () => {
  it('has unique ids, for problems and for items — including against every lesson item', () => {
    expect(new Set(PROBLEMS.map((p) => p.id)).size).toBe(PROBLEMS.length);
    const lessonIds = new Set(LESSONS.flatMap((l) => [...bodies[l.id].priorCheck, ...lessonItems(bodies[l.id])].map((i) => i.id)));
    const ids = allItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(lessonIds.has(id), id).toBe(false);
    for (const i of allItems) expect(i.id.startsWith(`${i.problem}.`), i.id).toBe(true);
  });

  it('every problem fills in the whole schema', () => {
    for (const p of PROBLEMS) {
      for (const f of ['title', 'topic', 'scenario', 'question', 'explanation', 'interpretation', 'extension']) {
        expect(typeof p[f] === 'string' && p[f].length > (f === 'topic' || f === 'title' ? 3 : 20), `${p.id}.${f}`).toBe(true);
      }
      for (const f of ['variables', 'units', 'assumptions', 'solution', 'commonMistakes']) {
        expect(Array.isArray(p[f]) && p[f].length > 0, `${p.id}.${f}`).toBe(true);
      }
      for (const v of p.variables) expect(v.name && v.units !== undefined && v.value !== undefined, `${p.id} variable`).toBeTruthy();
      expect(PROBLEM_DOMAINS[p.domain], `${p.id} domain`).toBeTruthy();
      expect([1, 2, 3]).toContain(p.difficulty);
      expect(p.reviewedStatus, p.id).toBe('awaiting-human-review');
    }
  });

  it('labels its data: invented numbers say so; measured data would need a source, a licence and a link', () => {
    for (const p of PROBLEMS) {
      expect(['synthetic', 'measured'], p.id).toContain(p.data.kind);
      if (p.data.kind === 'synthetic') expect(p.data.note.length, p.id).toBeGreaterThan(5);
      else for (const f of ['source', 'license', 'url']) expect(p.data[f], `${p.id} data.${f}`).toBeTruthy();
    }
  });

  it('refers to real courses, lessons of that course, and real competencies', () => {
    for (const p of PROBLEMS) {
      expect(writtenCourses.some((c) => c.id === p.courseId), p.id).toBe(true);
      for (const l of p.lessonIds) {
        expect(lessonById[l], `${p.id} → ${l}`).toBeTruthy();
        expect(lessonById[l].course, `${p.id} → ${l}`).toBe(p.courseId);
        expect(lessonById[l].competencies.some((c) => p.competencies.includes(c)), `${p.id} shares a skill with ${l}`).toBe(true);
      }
      for (const c of p.competencies) expect(competencyById[c], `${p.id} → ${c}`).toBeTruthy();
      for (const i of p.items) expect(p.competencies, `${i.id} competency`).toContain(i.competency);
    }
  });
});

describe('problem bank: answers', () => {
  it('each problem has at least three steps, with hints, a solution, and at least one reasoning (not numeric) step', () => {
    for (const p of PROBLEMS) {
      expect(p.items.length, p.id).toBeGreaterThanOrEqual(3);
      expect(p.items.some((i) => i.answer.type === 'choice'), `${p.id} reasoning step`).toBe(true);
      for (const i of p.items) {
        expect(i.hints.length, `${i.id} hints`).toBeGreaterThan(0);
        expect(i.solution, `${i.id} solution`).toBeTruthy();
        expect([1, 2, 3]).toContain(i.difficulty);
      }
    }
  });

  it('every numeric answer agrees with its independent recomputation, within a rounding-only tolerance', () => {
    let checked = 0;
    for (const i of allItems) {
      const a = i.answer;
      if (a.type === 'choice') continue;
      expect(typeof i.compute, `${i.id} needs compute`).toBe('function');
      const got = i.compute();
      if (a.type === 'numeric') {
        expect(a.tolerance, i.id).toBeLessThanOrEqual(Math.max(0.001, 0.01 * Math.abs(a.value)));
        expect(Math.abs(got - a.value), i.id).toBeLessThanOrEqual(Math.max(a.tolerance, 1e-9));
      } else {
        a.values.forEach((v, k) => expect(Math.abs(got[k] - v), `${i.id}[${k}]`).toBeLessThanOrEqual(Math.max(a.tolerance, 1e-9)));
      }
      checked += 1;
    }
    expect(checked).toBeGreaterThan(30);
  });

  it('accepts each key and rejects an obviously wrong answer; wrong choices explain themselves', () => {
    for (const i of allItems) {
      const a = i.answer;
      const right = a.type === 'choice' ? a.correct : a.type === 'numeric' ? String(a.value) : a.values.map(String);
      const wrong = a.type === 'choice' ? (a.correct + 1) % a.choices.length : a.type === 'numeric' ? String(a.value + 1) : a.values.map((x) => String(x + 1));
      expect(checkAnswer(a, right).correct, i.id).toBe(true);
      expect(checkAnswer(a, wrong).correct, i.id).toBe(false);
      if (a.type === 'choice') {
        for (let k = 0; k < a.choices.length; k++) {
          if (k !== a.correct) expect(i.feedback[k], `${i.id} feedback for choice ${k}`).toBeTruthy();
        }
      }
    }
  });

  it('every formula in the bank and in the explain-back prompts parses', () => {
    for (const p of PROBLEMS) for (const [path, text] of strings(p)) renderAll(text, `${p.id}${path}`);
    for (const [id, e] of Object.entries(EXPLAIN_BACK)) for (const [path, text] of strings(e)) renderAll(text, `${id}${path}`);
  });
});

describe('coverage of the enhanced lessons', () => {
  it('the first and last written lesson of every course has a real-world problem and an explain-back prompt', () => {
    expect(enhanced.length).toBeGreaterThanOrEqual(writtenCourses.length);
    for (const id of enhanced) {
      expect(problemsForLesson(id).length, `${id} problem`).toBeGreaterThan(0);
      expect(EXPLAIN_BACK[id], `${id} explain-back`).toBeTruthy();
    }
  });

  it('explain-back prompts belong to written lessons and give at least three points and a model answer', () => {
    for (const [id, e] of Object.entries(EXPLAIN_BACK)) {
      expect(lessonById[id], id).toBeTruthy();
      expect(e.prompt.length, id).toBeGreaterThan(20);
      expect(e.points.length, id).toBeGreaterThanOrEqual(3);
      expect(e.model.length, id).toBeGreaterThan(150);
    }
  });

  it('every enhanced lesson offers at least six assessable activities, of several kinds', () => {
    for (const id of enhanced) {
      const items = [...lessonItems(bodies[id]), ...problemsForLesson(id).flatMap((p) => p.items)];
      expect(items.length, id).toBeGreaterThanOrEqual(6);
      expect(new Set(items.map((i) => i.answer.type)).size, `${id} kinds`).toBeGreaterThanOrEqual(2);
      expect(items.some((i) => i.transfer), `${id} transfer`).toBe(true);
    }
  });
});
