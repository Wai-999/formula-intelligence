// Source-level learning metrics for docs/learning-8020/ (BASELINE_AUDIT.md,
// COURSE_GAP_MAP.md): written vs planned lessons per course, how many lesson
// questions are independent or transfer, applied-problem coverage, and where
// "Continue" leads when a course's written lessons run out. Reads a checkout's
// data modules only; runs on any revision that has src/lib/learningPath.js.
//
//   node scripts/learning-metrics.mjs [checkoutRoot] [out.json]

import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const out = process.argv[3] ?? null;
const load = (p) => import(pathToFileURL(resolve(root, p)).href);

const { COURSES } = await load('src/data/curriculum/catalog.js');
const { LESSONS } = await load('src/data/curriculum/lessons/index.js');
const { lessonItems } = await load('src/data/curriculum/lessonItems.js');
const { CURRICULUM: cur } = await load('src/data/curriculum/path.js');
const { recommend } = await load('src/lib/learningPath.js');
const problems = await load('src/data/curriculum/problems.js').catch(() => ({ PROBLEMS: [] }));
// The next-action layer exists from the 80/20 upgrade on; earlier revisions use the path engine alone.
const nextAction = await load('src/lib/nextAction.js').catch(() => null);
const { PROJECTS } = await load('src/data/projects/index.js');

const bodies = {};
for (const l of LESSONS) bodies[l.id] = (await l.load()).default;

const courses = COURSES.map((c) => {
  const written = c.units.flatMap((u) => u.lessons).filter((id) => bodies[id]);
  const planned = c.units.reduce((n, u) => n + u.planned.length, 0);
  // Every written lesson done: where does the course page's primary action go?
  const lessons = Object.fromEntries(written.map((id, i) => [id, { opened: i + 1, completed: i + 1 }]));
  const rec = written.length ? recommend(cur, { lessons }, { courseId: c.id }) : null;
  const action = written.length && nextAction ? nextAction.getNextLearningAction(cur, { state: { lessons, status: {} }, from: { courseId: c.id } }) : null;
  return {
    id: c.id,
    title: c.title,
    units: c.units.length,
    written: written.length,
    planned,
    unitsWithNoLesson: c.units.filter((u) => !u.lessons.some((id) => bodies[id])).length,
    afterWrittenLessons: rec ? {
      status: action ? action.kind : rec.status,
      rule: action?.evidence.ruleId ?? null,
      label: action ? action.label : rec.label,
      headline: action?.headline ?? null,
      // Since the owner's 2026-11-05 direction the course moves on; the gap is named in a visible notice.
      notice: action?.notice ?? null,
      saysNotComplete: [...rec.warnings, ...(action?.reasons ?? [])].some((w) => /not complete|not written yet/.test(w)),
    } : null,
  };
});

let items = 0;
let independent = 0;
let transfer = 0;
let withFeedback = 0;
let numericWithoutExplanation = 0;
let withHints = 0;
const perLesson = [];
for (const l of LESSONS) {
  const its = lessonItems(bodies[l.id]);
  const ind = its.filter((i) => i.level === 'independent' || i.level === 'transfer' || i.difficulty >= 2).length;
  const tr = its.filter((i) => i.transfer).length;
  items += its.length;
  independent += ind;
  transfer += tr;
  withFeedback += its.filter((i) => i.feedbackIncorrect || Object.keys(i.feedback ?? {}).length).length;
  numericWithoutExplanation += its.filter((i) => i.answer.type !== 'choice' && !i.feedbackIncorrect).length;
  withHints += its.filter((i) => i.hints?.length).length;
  const probs = (problems.PROBLEMS ?? []).filter((p) => p.lessonIds.includes(l.id));
  perLesson.push({
    id: l.id,
    course: l.course,
    items: its.length,
    independentOrHarder: ind,
    transfer: tr,
    appliedProblems: probs.length,
    fadedExample: !!bodies[l.id].faded,
    simpler: !!bodies[l.id].intuition?.simpler,
    explainBack: !!problems.EXPLAIN_BACK?.[l.id],
  });
}

const PROBLEMS = problems.PROBLEMS ?? [];
const metrics = {
  root,
  courses,
  totals: {
    courses: COURSES.length,
    coursesWithWrittenLessons: courses.filter((c) => c.written).length,
    writtenLessons: LESSONS.length,
    plannedLessons: courses.reduce((n, c) => n + c.planned, 0),
    lessonItems: items,
    independentOrHarderShare: Math.round((independent / items) * 1000) / 10,
    transferShare: Math.round((transfer / items) * 1000) / 10,
    itemsWithWrongAnswerExplanation: withFeedback,
    numericItemsWithoutWrongAnswerExplanation: numericWithoutExplanation,
    itemsWithAHint: withHints,
    appliedProblems: PROBLEMS.length,
    appliedProblemSteps: PROBLEMS.reduce((n, p) => n + p.items.length, 0),
    appliedProblemsLinkedToProjects: PROBLEMS.filter((p) => p.projectId).length,
    projectsLinkedFromProblems: new Set(PROBLEMS.map((p) => p.projectId).filter(Boolean)).size,
    lessonsWithAppliedProblem: perLesson.filter((l) => l.appliedProblems).length,
    lessonsWithFadedExample: perLesson.filter((l) => l.fadedExample).length,
    projects: PROJECTS.length,
    // Courses with planned lessons whose primary action, once the written ones are done, moves on without naming the gap.
    coursesThatMoveOnWithoutNamingTheGap: courses.filter((c) => c.afterWrittenLessons && c.planned > 0 && !c.afterWrittenLessons.notice && !['content-gap', 'path-finished'].includes(c.afterWrittenLessons.status)).length,
    // Courses whose primary action, once the written lessons are done, is not the next course or the path's end (the owner's "move to next level").
    coursesThatHoldTheLearnerBack: courses.filter((c) => c.afterWrittenLessons && !['course-transition', 'path-finished'].includes(c.afterWrittenLessons.status)).length,
  },
  perLesson,
};

if (out) writeFileSync(out, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics.totals, null, 2));
