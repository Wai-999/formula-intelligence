import { describe, it, expect, beforeAll } from 'vitest';
import katex from 'katex';
import { LESSONS, lessonById } from '../lessons/index.js';
import { lessonItems } from '../lessonItems.js';
import { PROBLEMS, EXPLAIN_BACK, problemsForLesson } from '../problems.js';
import { PROJECTS } from '../../projects/index.js';
import { PRIORITY_LESSONS, CONTRACT_LESSONS } from '../priority.js';
import { CURRICULUM as cur } from '../path.js';
import { checkAnswer } from '../../../lib/answers.js';
import { tokenize } from '../../../lib/mathFormat.js';
import { getNextLearningAction } from '../../../lib/nextAction.js';

// The professor teaching contract (docs/learning-8020/TEACHING_RUBRIC.md)
// and "one real application per priority skill" (the brief's Intervention
// C), as machine checks on the five priority lessons and the lessons written
// to the same contract since (phase 5). They check that each
// element exists and that every number in it is right — not that the
// teaching is good, which only a human review can say.

const bodies = {};
beforeAll(async () => {
  for (const l of LESSONS) bodies[l.id] = (await l.load()).default;
});
const ids = PRIORITY_LESSONS.map((p) => p.id);
const contractIds = CONTRACT_LESSONS.map((p) => p.id);
const fadedItems = (b) => b.faded.steps.filter((s) => s.item).map((s) => s.item);

function renders(text, where) {
  for (const tok of tokenize(text)) {
    if (tok.t === 'math' || tok.t === 'display') {
      expect(() => katex.renderToString(tok.v, { throwOnError: true, strict: 'ignore', displayMode: tok.t === 'display' }), `${where}: ${tok.v}`).not.toThrow();
    }
  }
}

describe('the five priority lessons', () => {
  it('exist, one per area', () => {
    expect(ids).toHaveLength(5);
    for (const id of ids) expect(lessonById[id], id).toBeTruthy();
    expect(new Set(PRIORITY_LESSONS.map((p) => p.area)).size).toBe(5);
  });
});

describe.each(contractIds)('%s meets the teaching contract', (id) => {
  const b = () => bodies[id];

  it('1–2. starts from a concrete problem, says what the learner will be able to do, defines its symbols, and has a simpler explanation', () => {
    expect(b().intuition.question.length).toBeGreaterThan(60);
    expect(b().outcomes.length).toBeGreaterThanOrEqual(2);
    expect(b().glossary.length).toBeGreaterThanOrEqual(3);
    expect(b().intuition.simpler.length).toBeGreaterThanOrEqual(1);
  });

  it('3. reasons step by step', () => {
    expect(b().derivation.steps.length).toBeGreaterThanOrEqual(3);
  });

  it('4. works examples, checked, including why a tempting alternative fails', () => {
    expect(b().examples.length).toBeGreaterThanOrEqual(2);
    for (const ex of b().examples) expect(Math.abs(ex.check.compute() - ex.check.value)).toBeLessThanOrEqual(ex.check.tolerance ?? 1e-9);
    const t = b().examples[0].tempting;
    expect(t.wrong.length).toBeGreaterThan(20);
    expect(t.why.length).toBeGreaterThan(40);
  });

  it('5. asks for a prediction before revealing, and names the misconception', () => {
    expect(b().predict.choices.length).toBeGreaterThanOrEqual(3);
    expect(b().predict.misconception.belief).toBeTruthy();
    expect(b().predict.misconception.correction).toBeTruthy();
  });

  it('6. has a faded example whose blanks are right, checkable and explained', () => {
    const f = b().faded;
    expect(f.steps.some((s) => s.say && !s.item)).toBe(true);
    const blanks = fadedItems(b());
    expect(blanks.length).toBeGreaterThanOrEqual(2);
    for (const it of blanks) {
      expect(it.hints.length, it.id).toBeGreaterThan(0);
      expect(it.solution, it.id).toBeTruthy();
      expect(it.competency, it.id).toSatisfy((c) => lessonById[id].competencies.includes(c));
      const a = it.answer;
      expect(Math.abs(it.compute() - a.value), it.id).toBeLessThanOrEqual(Math.max(a.tolerance, 1e-9));
      expect(a.tolerance, it.id).toBeLessThanOrEqual(Math.max(0.001, 0.01 * Math.abs(a.value)));
      expect(checkAnswer(a, String(a.value)).correct, it.id).toBe(true);
      expect(checkAnswer(a, String(a.value + 1)).correct, it.id).toBe(false);
    }
    for (const s of [f.title, f.problem, f.answer, ...f.steps.map((x) => x.say ?? '')]) renders(s, `${id}.faded`);
    for (const it of blanks) for (const s of [it.prompt, it.solution, ...it.hints]) renders(s, it.id);
  });

  it('faded blanks have ids no other question uses', () => {
    const all = LESSONS.flatMap((l) => [...bodies[l.id].priorCheck, ...lessonItems(bodies[l.id]), ...(bodies[l.id].faded ? fadedItems(bodies[l.id]) : [])].map((i) => i.id));
    expect(new Set(all).size).toBe(all.length);
    for (const it of fadedItems(b())) expect(PROBLEMS.flatMap((p) => p.items).some((x) => x.id === it.id)).toBe(false);
  });

  it('7–8. gives independent problems that differ, and transfer problems', () => {
    const independent = b().practice.filter((p) => p.level === 'independent');
    expect(independent.length).toBeGreaterThanOrEqual(2);
    expect(new Set(independent.map((p) => p.prompt)).size).toBe(independent.length);
    expect(b().practice.some((p) => p.level === 'transfer')).toBe(true);
  });

  it('9. asks the learner to explain it back, with points to check against and a model answer', () => {
    const e = EXPLAIN_BACK[id];
    expect(e.points.length).toBeGreaterThanOrEqual(3);
    expect(e.model.length).toBeGreaterThan(150);
  });

  it('10. finishes with a checkpoint and a reachable next action', () => {
    expect(b().checkpoint.length).toBeGreaterThanOrEqual(3);
    const a = getNextLearningAction(cur, { state: { lessons: {}, status: {} }, from: { lessonId: id } });
    expect(a.target).toBeTruthy();
    if (a.target.page === 'learn/lesson') expect(cur.lessonById[a.target.params.lessonId]).toBeTruthy();
  });
});

describe('one real application per priority skill (Intervention C)', () => {
  it.each(contractIds)('%s: every skill has a worked example, two independent questions, a misconception check, applied problems, a review item and a project', (id) => {
    const b = bodies[id];
    const meta = lessonById[id];
    const items = lessonItems(b);
    const problems = problemsForLesson(id);
    for (const c of meta.competencies) {
      const mine = items.filter((i) => i.competency === c);
      // A spaced review draws on the lesson's questions for the skill.
      expect(mine.length, `${id} ${c} review items`).toBeGreaterThanOrEqual(2);
    }
    const main = meta.competencies[0];
    expect(b.examples.length).toBeGreaterThan(0);
    expect(items.filter((i) => i.competency === main && (i.level === 'independent' || i.difficulty >= 2)).length).toBeGreaterThanOrEqual(2);
    // A misconception or debugging challenge: the prediction's misconception, or a choice item with feedback on wrong options.
    expect(!!b.predict.misconception || items.some((i) => i.answer.type === 'choice' && Object.keys(i.feedback ?? {}).length)).toBe(true);
    // Applied problems that end in an interpretation, at least one tied to a project's running case.
    expect(problems.length, `${id} problems`).toBeGreaterThanOrEqual(3);
    for (const p of problems) expect(p.interpretation.length).toBeGreaterThan(40);
    expect(problems.some((p) => p.projectId), `${id} project link`).toBe(true);
  });

  it('at least twelve applied problems on the priority lessons are new in this release, across at least three projects', () => {
    const onPriority = PROBLEMS.filter((p) => p.lessonIds.some((l) => ids.includes(l)));
    expect(onPriority.length).toBeGreaterThanOrEqual(15);
    const projects = new Set(onPriority.map((p) => p.projectId).filter(Boolean));
    expect(projects.size).toBeGreaterThanOrEqual(3);
    for (const pid of projects) expect(PROJECTS.find((x) => x.id === pid), pid).toBeTruthy();
  });

  it('every project link names a real project', () => {
    for (const p of PROBLEMS.filter((x) => x.projectId)) expect(PROJECTS.find((x) => x.id === p.projectId), p.id).toBeTruthy();
  });

  it('the cases say how to check them, another route, and what the learner produces', () => {
    for (const p of PROBLEMS.filter((x) => x.lessonIds.some((l) => contractIds.includes(l)) && x.projectId && x.artifact)) {
      expect(p.verification.length, p.id).toBeGreaterThan(20);
      expect(p.alternative.length, p.id).toBeGreaterThan(20);
      renders(p.verification, p.id);
      renders(p.alternative, p.id);
      renders(p.artifact, p.id);
    }
  });
});
