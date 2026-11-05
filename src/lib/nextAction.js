// "What should I learn next?" — one primary action and at most two others,
// for every learner state (docs/learning-8020/LEARNING_FLOW_SPEC.md).
//
// The learning-path engine (src/lib/learningPath.js) decides the order of
// lessons and courses; this layer adds what it does not see — the saved
// place, recent wrong answers, reviews that are due, and lessons that are
// planned but not written — and turns the result into one action with a
// reason. Pure and deterministic: the same records always give the same
// answer, so Home, a course page, the end of a lesson and My Progress can
// never disagree. Pages render it; none of them decides what comes next.
//
// Priority, highest first (each rule's id is returned in `evidence.ruleId`):
//   resume-saved-place     a place the learner saved, in an unfinished lesson
//   bridge-after-errors    recent wrong answers in a lesson that names a
//                          short bridge to what it builds on
//   resume-recent          the last automatically saved step, unfinished
//   next-authored-lesson   the next written lesson on the path
//   prerequisite-bridge    a written prerequisite course left unfinished
//   content-gap            the next lesson of this course is planned, not
//                          written: say so, and offer practice or the next
//                          written course — never skip it silently
//   outline-course         a course with no written lessons at all
//   next-authored-course   the next written course, after a fully written one
//   path-finished          nothing written is left on the path
// Reviews that are due never block progress: they are offered alongside.

import { STATUS, recommend, buildsOn, pathFor } from './learningPath.js';

export const ACTION = {
  RESUME: 'resume',
  LESSON: 'lesson',
  BRIDGE: 'bridge',
  PRACTICE: 'practice',
  REVIEW: 'review',
  TRANSFER: 'transfer',
  PROJECT: 'project',
  TRANSITION: 'course-transition',
  GAP: 'content-gap',
  FINISHED: 'path-finished',
};

const DEMONSTRATED = new Set(['proficient', 'mastered']);
/** Answers looked at when deciding whether a lesson went badly: its most recent ones. */
export const RECENT_ANSWERS = 8;
const STEP_TITLES = { matters: 'Why it matters', understand: 'Understand', see: 'See it', try: 'Try it', use: 'Use it', check: 'Check understanding' };
const STEP_ORDER = Object.keys(STEP_TITLES);

const lessonTarget = (lessonId, sectionId = null) => ({ page: 'learn/lesson', params: { lessonId }, lessonId, sectionId });
const isDone = (state, id) => !!state.lessons?.[id]?.completed;
const titleOf = (cur, id) => cur.lessonById[id]?.title ?? id;
const courseTitle = (cur, id) => cur.courseById[id]?.title ?? id;
const plannedIn = (course) => course?.units.reduce((n, u) => n + u.planned.length, 0) ?? 0;
const round5 = (m) => Math.max(5, Math.round(m / 5) * 5);

/** Minutes left in a lesson from a step: the lesson's estimate, pro rata. */
export function minutesLeft(cur, lessonId, sectionId = null) {
  const minutes = cur.lessonById[lessonId]?.minutes ?? 30;
  const i = sectionId ? STEP_ORDER.indexOf(sectionId) : 0;
  return round5((minutes * (STEP_ORDER.length - Math.max(0, i))) / STEP_ORDER.length);
}

/**
 * How a lesson's recent answers went: wrong and right first attempts among
 * its latest RECENT_ANSWERS (any step, readiness checks included), the time
 * of the last wrong one, and the checkpoint score. Answers recorded before
 * lessons were stored with each answer carry no lesson and are not counted.
 */
export function lessonErrors(evidence, lessons, lessonId) {
  const mine = evidence.filter((e) => e.l === lessonId);
  const recent = mine.slice(-RECENT_ANSWERS);
  const wrong = recent.filter((e) => !e.ok).length;
  const right = recent.length - wrong;
  const lastError = [...mine].reverse().find((e) => !e.ok)?.at ?? null;
  const cp = lessons?.[lessonId]?.checkpoint ?? null;
  const recovered = recent.length >= 2 && recent.slice(-2).every((e) => e.ok);
  const failedCheckpoint = !!cp && cp.total > 0 && cp.correct / cp.total < 0.5;
  return {
    wrong,
    right,
    lastError: failedCheckpoint ? Math.max(lastError ?? 0, cp.at ?? 0) : lastError,
    checkpoint: cp,
    // Two or more misses that outnumber the hits, or a checkpoint under half
    // right — unless the last two answers were right (the learner recovered).
    struggling: !recovered && ((wrong >= 2 && wrong >= right) || failedCheckpoint),
  };
}

/**
 * The short bridge a lesson offers when it goes badly: the lesson's own
 * choice (`bridge` in its catalog entry: the part of an earlier lesson that
 * its most common mistakes come from), else the lesson that teaches the last
 * idea it builds on. Null when nothing written teaches what it builds on.
 */
export function bridgeFor(cur, lessonId) {
  const meta = cur.lessonById[lessonId];
  if (!meta) return null;
  if (meta.bridge && cur.lessonById[meta.bridge.lesson]) {
    return { lessonId: meta.bridge.lesson, sectionId: meta.bridge.step ?? 'understand', why: meta.bridge.why, minutes: meta.bridge.minutes ?? 5, concept: meta.bridge.concept ?? null };
  }
  const taught = buildsOn(cur, lessonId).taught.filter((t) => t.lessons.some((l) => l !== lessonId));
  const last = taught.at(-1);
  if (!last) return null;
  const target = last.lessons.find((l) => l !== lessonId);
  return {
    lessonId: target,
    sectionId: 'understand',
    why: `“${meta.title}” builds on ${last.title}, which “${titleOf(cur, target)}” teaches.`,
    minutes: 5,
    concept: last.id,
  };
}

/** The bridge the learner's recent answers call for, if any (only lessons in `scope`, when given). */
function errorBridge(cur, state, evidence, scope = null) {
  const inScope = (id) => cur.lessonById[id] && (!scope || scope.has(id));
  // The lesson of the most recent miss: a wrong answer that names its lesson,
  // or a checkpoint under half right, whichever came later.
  const latest = [...evidence].reverse().find((e) => !e.ok && e.l && inScope(e.l));
  let lessonId = latest?.l ?? null;
  let at = latest?.at ?? -1;
  for (const [id, r] of Object.entries(state.lessons ?? {})) {
    const cp = r?.checkpoint;
    if (inScope(id) && cp?.total > 0 && cp.correct / cp.total < 0.5 && (cp.at ?? 0) > at) { lessonId = id; at = cp.at ?? 0; }
  }
  if (!lessonId) return null;
  const errors = lessonErrors(evidence, state.lessons, lessonId);
  if (!errors.struggling) return null;
  const bridge = bridgeFor(cur, lessonId);
  if (!bridge) return null;
  // Taken already: the bridge lesson was opened, or answered in, after the last miss.
  const rec = state.lessons?.[bridge.lessonId];
  const seenSince = Math.max(rec?.visited ?? 0, rec?.opened ?? 0, ...evidence.filter((e) => e.l === bridge.lessonId).map((e) => e.at ?? 0));
  if (seenSince > (errors.lastError ?? 0)) return null;
  return { from: lessonId, errors, bridge };
}

/** The first planned (unwritten) lesson title after a course's written ones, with its unit. */
export function firstGap(course) {
  const units = course?.units ?? [];
  const lastWritten = units.reduce((k, u, i) => (u.lessons.length ? i : k), -1);
  for (const u of units.slice(Math.max(0, lastWritten))) if (u.planned.length) return { unitId: u.id, unitTitle: u.title, title: u.planned[0] };
  for (const u of units) if (u.planned.length) return { unitId: u.id, unitTitle: u.title, title: u.planned[0] };
  return null;
}

/** A course's written-lesson skills the learner has not yet shown at proficient or above. */
function skillsNotYetShown(cur, state, courseId) {
  const skills = [...new Set((cur.courseLessons[courseId] ?? []).flatMap((l) => cur.lessonById[l].competencies))];
  return skills.filter((c) => !DEMONSTRATED.has(state.status?.[c]?.level));
}

const reviewAction = (due) => ({
  kind: ACTION.REVIEW,
  label: `Review ${due.length} skill${due.length === 1 ? '' : 's'} due today`,
  target: { page: 'practice/review', params: {} },
  estimatedMinutes: Math.min(15, Math.max(5, due.length * 3)),
});

function base(kind, ruleId, rec) {
  return {
    kind,
    headline: null,
    label: '',
    target: null,
    reasons: [],
    warnings: [...(rec?.warnings ?? [])],
    estimatedMinutes: null,
    alternatives: [],
    evidence: { ruleId },
    rec,
  };
}

function finish(action, extra, due) {
  const seen = new Set([JSON.stringify(action.target)]);
  const alts = [];
  for (const a of [...extra, ...(due.length && action.kind !== ACTION.REVIEW ? [reviewAction(due)] : [])]) {
    if (!a?.target) continue;
    const key = JSON.stringify(a.target);
    if (seen.has(key)) continue;
    seen.add(key);
    alts.push(a);
  }
  // At most two other choices: the brief's "one primary action, at most two secondary".
  action.alternatives = alts.slice(0, 2);
  action.reason = action.reasons[0] ?? '';
  return action;
}

function bridgeAction(cur, found, rec, backTo) {
  const { bridge, from, errors } = found;
  const a = base(ACTION.BRIDGE, 'bridge-after-errors', rec);
  a.warnings = [];
  a.headline = `A ${bridge.minutes}-minute bridge before you go on`;
  a.label = `Bridge: ${titleOf(cur, bridge.lessonId)} — ${STEP_TITLES[bridge.sectionId] ?? 'Understand'}`;
  a.target = lessonTarget(bridge.lessonId, bridge.sectionId);
  a.estimatedMinutes = bridge.minutes;
  const what = errors.checkpoint && errors.checkpoint.total && errors.checkpoint.correct / errors.checkpoint.total < 0.5
    ? `${errors.checkpoint.correct} of ${errors.checkpoint.total} checkpoint answers in “${titleOf(cur, from)}” were right`
    : `${errors.wrong} of your last ${errors.wrong + errors.right} answers in “${titleOf(cur, from)}” were not right yet`;
  a.reasons.push(`${what}. ${bridge.why}`);
  a.reasons.push('A short look back usually fixes this faster than repeating the whole lesson. Nothing is locked: you can go straight back.');
  a.evidence = { ruleId: 'bridge-after-errors', lessonId: from, prerequisiteIds: bridge.concept ? [bridge.concept] : [], bridgeLessonId: bridge.lessonId };
  return { action: a, extra: [backTo] };
}

/**
 * The next action.
 *   input.state     usePathState(): { lessons, placement, pathId, weak, status }
 *   input.from      {} (Home, My Progress) | { lessonId } (a lesson's end) | { courseId } (a course page)
 *   input.resume    primaryTarget(...) from src/lib/studyResume.js, or null
 *   input.due       competency ids due for review
 *   input.evidence  learning records (fi_learning_v1 evidence)
 *   input.problemsFor(lessonId) → applied problems of a lesson (optional)
 */
export function getNextLearningAction(cur, { state, from = {}, resume = null, due = [], evidence = [], problemsFor = () => [] }) {
  const rec = recommend(cur, state, from.lessonId ? { lessonId: from.lessonId } : from.courseId ? { courseId: from.courseId } : {});
  const overall = !from.lessonId && !from.courseId;
  const notes = [];

  // 1. A saved place in a lesson not yet finished.
  if (overall && resume?.kind === 'missing') {
    notes.push(`Your saved place was in a lesson that is no longer in the course list (“${resume.loc.lessonId}”); your answers and notes are unchanged.`);
  }
  const resumable = overall && resume && resume.kind !== 'missing' && resume.lesson && !isDone(state, resume.lesson.id) ? resume : null;
  const scope = from.lessonId ? new Set([from.lessonId]) : from.courseId ? new Set(cur.courseLessons[from.courseId] ?? []) : null;
  const found = errorBridge(cur, state, evidence, scope);

  if (resumable?.kind === 'pinned') {
    const a = base(ACTION.RESUME, 'resume-saved-place', rec);
    a.warnings = notes;
    a.label = 'Resume where I stopped';
    a.target = { ...lessonTarget(resumable.lesson.id, resumable.loc.sectionId), loc: resumable.loc };
    a.headline = resumable.lesson.title;
    a.estimatedMinutes = minutesLeft(cur, resumable.lesson.id, resumable.loc.sectionId);
    a.reasons.push(`You saved your place in “${resumable.lesson.title}”${resumable.loc.sectionId ? `, at ${STEP_TITLES[resumable.loc.sectionId]}` : ''}, and its checkpoint is not answered yet.`);
    const extra = found ? [{ kind: ACTION.BRIDGE, label: `Bridge first: ${titleOf(cur, found.bridge.lessonId)} (${found.bridge.minutes} min)`, target: lessonTarget(found.bridge.lessonId, found.bridge.sectionId), estimatedMinutes: found.bridge.minutes }] : [];
    return finish(a, extra, due);
  }

  // 2. Recent wrong answers: a short bridge to what that lesson builds on.
  if (found) {
    const back = resumable && resumable.lesson.id === found.from
      ? { kind: ACTION.RESUME, label: `Back to “${titleOf(cur, found.from)}”`, target: { ...lessonTarget(found.from, resumable.loc.sectionId), loc: resumable.loc }, estimatedMinutes: minutesLeft(cur, found.from, resumable.loc.sectionId) }
      : { kind: ACTION.LESSON, label: `Back to “${titleOf(cur, found.from)}”: Try it`, target: lessonTarget(found.from, 'try'), estimatedMinutes: 10 };
    const { action, extra } = bridgeAction(cur, found, rec, back);
    action.warnings.push(...notes);
    return finish(action, extra, due);
  }

  // 3. The last automatically saved step of an unfinished lesson.
  if (resumable) {
    const a = base(ACTION.RESUME, 'resume-recent', rec);
    a.warnings = notes;
    a.label = 'Continue where I was';
    a.target = { ...lessonTarget(resumable.lesson.id, resumable.loc.sectionId), loc: resumable.loc };
    a.headline = resumable.lesson.title;
    a.estimatedMinutes = minutesLeft(cur, resumable.lesson.id, resumable.loc.sectionId);
    a.reasons.push(`The lesson you studied last, “${resumable.lesson.title}”, is not finished yet.`);
    return finish(a, [rec.target ? { kind: ACTION.LESSON, label: rec.label, target: rec.target } : null], due);
  }

  // 4. What the learning path says, made honest about unwritten lessons.
  const fromCourse = rec.currentCourseId ? cur.courseById[rec.currentCourseId] : null;
  const leavingCourse = [STATUS.TRANSITION, STATUS.BRIDGE, STATUS.END].includes(rec.status)
    && fromCourse && (cur.courseLessons[fromCourse.id] ?? []).length > 0
    && (cur.courseLessons[fromCourse.id] ?? []).every((id) => isDone(state, id) || id === from.lessonId);

  if (leavingCourse && plannedIn(fromCourse) > 0) return finish(...contentGap(cur, state, rec, fromCourse, notes, due), due);

  if (rec.status === STATUS.CONTINUE || rec.status === STATUS.NEXT_UNIT) {
    const lessonId = rec.target.params.lessonId;
    const a = base(ACTION.LESSON, 'next-authored-lesson', rec);
    a.warnings.push(...notes);
    a.label = rec.label;
    a.target = lessonTarget(lessonId);
    a.headline = titleOf(cur, lessonId);
    a.estimatedMinutes = cur.lessonById[lessonId]?.minutes ?? null;
    a.reasons.push(...rec.reasons);
    const extra = rec.alternatives.map((x) => ({ kind: x.kind === 'bridge' ? ACTION.BRIDGE : ACTION.LESSON, label: x.label, target: x.target }));
    if (from.lessonId) {
      const p = problemsFor(from.lessonId)[0];
      if (p) extra.push({ kind: ACTION.TRANSFER, label: `Apply it first: ${p.title}`, target: lessonTarget(from.lessonId, 'use'), estimatedMinutes: 15 });
    }
    return finish(a, extra, due);
  }

  if (rec.status === STATUS.BRIDGE) {
    const a = base(ACTION.BRIDGE, 'prerequisite-bridge', rec);
    a.warnings.push(...notes);
    a.label = rec.label;
    a.target = lessonTarget(rec.target.params.lessonId);
    a.headline = titleOf(cur, rec.target.params.lessonId);
    a.estimatedMinutes = cur.lessonById[rec.target.params.lessonId]?.minutes ?? null;
    a.reasons.push(...rec.reasons);
    a.evidence = { ruleId: 'prerequisite-bridge', prerequisiteIds: [rec.bridgeCourseId] };
    return finish(a, rec.alternatives.map((x) => ({ kind: ACTION.LESSON, label: x.label, target: x.target })), due);
  }

  if (rec.status === STATUS.UNAVAILABLE) {
    const a = base(ACTION.GAP, 'outline-course', rec);
    a.warnings.push(...notes);
    a.headline = `${courseTitle(cur, rec.currentCourseId)}: no lessons written yet`;
    a.label = rec.label;
    a.target = rec.target?.page === 'learn/lesson' ? lessonTarget(rec.target.params.lessonId) : rec.target;
    a.reasons.push(...rec.reasons);
    a.evidence = { ruleId: 'outline-course', gapIds: [rec.currentCourseId] };
    return finish(a, rec.alternatives.map((x) => ({ kind: ACTION.LESSON, label: x.label, target: x.target })), due);
  }

  if (rec.status === STATUS.TRANSITION) {
    const lessonId = rec.target.params.lessonId;
    const a = base(ACTION.TRANSITION, 'next-authored-course', rec);
    a.warnings.push(...notes);
    a.label = rec.label;
    a.target = lessonTarget(lessonId);
    a.headline = `Next course: ${courseTitle(cur, rec.nextCourseId)}`;
    a.estimatedMinutes = cur.lessonById[lessonId]?.minutes ?? null;
    a.reasons.push(...rec.reasons);
    return finish(a, rec.alternatives.map((x) => ({ kind: ACTION.LESSON, label: x.label, target: x.target })), due);
  }

  return finish(...pathFinished(cur, state, rec, notes, due), due);
}

/**
 * The written lessons of `course` are done but more are planned. The next
 * lesson is named as not written; the primary action is to make this
 * course's skills independent (applied problems on its lessons) while any is
 * not yet shown, and otherwise the next written step on the path — stated
 * as a choice, with what it assumes.
 */
function contentGap(cur, state, rec, course, notes, due) {
  const gap = firstGap(course);
  const written = cur.courseLessons[course.id];
  const planned = plannedIn(course);
  const gapReason = `You have done the ${written.length} written lesson${written.length === 1 ? '' : 's'} of ${course.title}. The next one${gap ? `, “${gap.title}” (${gap.unitTitle})` : ''}, is planned but not written yet — ${planned} planned lesson${planned === 1 ? '' : 's'} in all, so the course is not complete.`;
  const notYet = skillsNotYetShown(cur, state, course.id);
  const practiceLesson = written.find((l) => cur.lessonById[l].competencies.some((c) => notYet.includes(c))) ?? null;
  // The end of the path, with nothing left to practise: the finished state, which names the gap too.
  if (!practiceLesson && rec.status === STATUS.END) {
    const [end, extra] = pathFinished(cur, state, rec, notes, due);
    end.reasons.unshift(gapReason);
    end.evidence = { ruleId: 'path-finished', courseId: course.id, gapIds: gap ? [gap.unitId] : [] };
    return [end, extra];
  }
  const a = base(ACTION.GAP, 'content-gap', rec);
  a.warnings = [...notes, ...rec.warnings.filter((w) => !w.includes('full course is not complete'))];
  a.headline = `Next lesson not written yet: ${gap?.title ?? 'more lessons are planned'}`;
  a.evidence = { ruleId: 'content-gap', courseId: course.id, gapIds: gap ? [gap.unitId] : [] };
  a.reasons.push(gapReason);
  const onward = rec.target ? { kind: rec.status === STATUS.END ? ACTION.FINISHED : ACTION.TRANSITION, label: rec.label, target: rec.target.page === 'learn/lesson' ? lessonTarget(rec.target.params.lessonId) : rec.target, estimatedMinutes: rec.target.page === 'learn/lesson' ? cur.lessonById[rec.target.params.lessonId]?.minutes ?? null : null } : null;
  const practice = practiceLesson ? {
    kind: ACTION.PRACTICE,
    label: `Practise ${course.title} skills: “${titleOf(cur, practiceLesson)}” — Use it`,
    target: lessonTarget(practiceLesson, 'use'),
    estimatedMinutes: 15,
  } : null;
  const outline = { kind: ACTION.LESSON, label: `See what is planned in ${course.title}`, target: { page: 'learn/course', params: { courseId: course.id } } };
  if (practice) {
    Object.assign(a, { label: practice.label, target: practice.target, estimatedMinutes: practice.estimatedMinutes });
    a.reasons.push(`Until it is written, the most useful step is to make what you learned work without help: ${notYet.length} of this course’s skills ${notYet.length === 1 ? 'is' : 'are'} not yet shown at proficient (3 different questions right, one of them harder).`);
    if (onward) {
      a.reasons.push(`Or go on: ${onward.label}. It may assume the unwritten lessons, so expect gaps.`);
      a.reasons.push(...rec.reasons.filter((r) => !r.startsWith(`You have answered the checkpoint of every written lesson in ${course.title}`)));
    }
    return [a, [onward, outline]];
  }
  if (onward) {
    Object.assign(a, { label: onward.label, target: onward.target, estimatedMinutes: onward.estimatedMinutes });
    a.reasons.push(`Your answers already show this course’s written skills at proficient or above, so the next written step on your path is: ${onward.label}.`);
    a.reasons.push(...rec.reasons.filter((r) => !r.startsWith(`You have answered the checkpoint of every written lesson in ${course.title}`)));
  } else {
    Object.assign(a, outline);
  }
  return [a, [outline]];
}

/** Nothing written is left on the path: say so, with what is not written and a sensible next action. */
function pathFinished(cur, state, rec, notes, due) {
  const a = base(ACTION.FINISHED, 'path-finished', rec);
  a.warnings.push(...notes);
  a.headline = 'You’ve completed the available lessons';
  a.reasons.push(...rec.reasons);
  const mastered = Object.values(state.status ?? {}).filter((s) => s.level === 'mastered').length;
  const proficient = Object.values(state.status ?? {}).filter((s) => s.level === 'proficient').length;
  a.reasons.push(`So far your answers show ${mastered} skill${mastered === 1 ? '' : 's'} mastered and ${proficient} proficient. Mastery needs answers on different days, so reviews are the way to it now.`);
  const path = pathFor(cur, state.pathId);
  const project = rec.alternatives.find((x) => x.kind === 'project');
  const earlier = rec.alternatives.find((x) => x.kind === 'earlier');
  if (due.length) Object.assign(a, reviewAction(due), { kind: ACTION.FINISHED });
  else if (earlier) Object.assign(a, { label: earlier.label, target: earlier.target, estimatedMinutes: null });
  else Object.assign(a, { label: 'Review your skills in Practice', target: { page: 'practice/review', params: {} }, estimatedMinutes: 10 });
  const extra = [
    project ? { kind: ACTION.PROJECT, label: project.label, target: project.target, estimatedMinutes: 25 } : { kind: ACTION.PROJECT, label: 'Apply what you know: a real-world project', target: { page: 'apply/projects', params: {} }, estimatedMinutes: 25 },
    { kind: ACTION.LESSON, label: `See your whole path: ${path.title}`, target: { page: 'learn/pathway', params: {} } },
  ];
  return [a, extra];
}

/**
 * A course's four completion statuses (the brief's distinctions), never
 * added into one number:
 *   availableContentComplete  every written lesson's checkpoint answered
 *   courseCurriculumComplete  every planned lesson written: nothing outlined is left
 *   courseReady               every exit skill of the course shown at proficient or above
 *   mastered                  every exit skill mastered under the evidence rules
 */
export function courseCompletion(cur, state, courseId) {
  const course = cur.courseById[courseId];
  const written = cur.courseLessons[courseId] ?? [];
  const exit = [...new Set(course?.units.flatMap((u) => u.exitCompetencies) ?? [])];
  const level = (c) => state.status?.[c]?.level;
  const shown = exit.filter((c) => DEMONSTRATED.has(level(c)));
  const masteredSkills = exit.filter((c) => level(c) === 'mastered');
  return {
    written: written.length,
    planned: plannedIn(course),
    checked: written.filter((id) => isDone(state, id)).length,
    exitSkills: exit.length,
    shown: shown.length,
    masteredSkills: masteredSkills.length,
    notYetShown: exit.filter((c) => !DEMONSTRATED.has(level(c))),
    availableContentComplete: written.length > 0 && written.every((id) => isDone(state, id)),
    courseCurriculumComplete: written.length > 0 && plannedIn(course) === 0,
    courseReady: exit.length > 0 && shown.length === exit.length,
    mastered: exit.length > 0 && masteredSkills.length === exit.length,
  };
}
