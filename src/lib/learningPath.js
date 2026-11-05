// One answer to "what next?" for Home, course pages, lesson pages and My
// Progress (docs/CONTINUOUS_LEARNING_UPGRADE.md). Before this, five pages had
// five rules of their own, and they disagreed: a finished course could send a
// learner to three different places, or back to Prealgebra.
//
// Pure and deterministic: the same curriculum and the same learner records
// always give the same answer, with the reasons and warnings written out so
// that pages render them instead of deciding again.
//
// The curriculum is injected (makeCurriculum) so tests can use the real
// catalog or a small fixture. Learner state:
//   lessons    fi_lessons_v1 `lessons` ({ [id]: { opened, completed, ... } })
//   placement  fi_diagnostic_v1 `placement` ({ course, source, at }) or null
//   pathId     the learner's chosen path, or null for the default
//   weak       competency ids whose answers are under half right (optional)
//
// "Done" means a lesson's checkpoint was answered: the app's only completion
// signal. Nothing here measures or claims mastery.

export const STATUS = {
  CONTINUE: 'continue-lesson', // the next lesson is in the same unit, or this lesson is unfinished
  NEXT_UNIT: 'finish-unit', // the next lesson starts a later unit of the same course
  TRANSITION: 'transition-course', // this course's written lessons are done; on to the next course
  BRIDGE: 'bridge', // a prerequisite needs attention first (skipping ahead stays possible)
  END: 'pathway-end', // no written lesson left on this path
  UNAVAILABLE: 'content-unavailable', // the course asked about has no written lessons
};

/** Index the catalog, lessons and paths once; every function below takes the result. */
export function makeCurriculum({ courses, lessons, paths, defaultPath, projects = [], concepts = [], alternatives = {} }) {
  const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
  const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
  const courseLessons = {};
  const unitOf = {};
  const courseOf = {};
  for (const c of courses) {
    courseLessons[c.id] = [];
    for (const u of c.units) {
      for (const id of u.lessons) {
        if (!lessonById[id]) continue;
        courseLessons[c.id].push(id);
        unitOf[id] = u;
        courseOf[id] = c.id;
      }
    }
  }
  const taughtBy = {};
  for (const c of courses) {
    for (const id of courseLessons[c.id]) {
      for (const concept of lessonById[id].concepts ?? []) (taughtBy[concept] ??= []).push(id);
    }
  }
  return {
    courses,
    courseById,
    lessonById,
    courseLessons,
    unitOf,
    courseOf,
    taughtBy,
    paths,
    pathById: Object.fromEntries(paths.map((p) => [p.id, p])),
    defaultPath,
    projectById: Object.fromEntries(projects.map((p) => [p.id, p])),
    conceptById: Object.fromEntries(concepts.map((c) => [c.id, c])),
    alternatives,
  };
}

// —— small helpers ——

const isDone = (state, id) => !!state.lessons?.[id]?.completed;
const written = (cur, courseId) => (cur.courseLessons[courseId]?.length ?? 0) > 0;
const courseTitle = (cur, id) => cur.courseById[id]?.title ?? id;
const lessonTitle = (cur, id) => cur.lessonById[id]?.title ?? id;
const lessonTarget = (id) => ({ page: 'learn/lesson', params: { lessonId: id } });

/** "A", "A and B", "A, B and C". */
export function listText(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** The path the learner chose, or the default. */
export function pathFor(cur, pathId) {
  return cur.pathById[pathId] ?? cur.pathById[cur.defaultPath];
}

/** Course-level questions always use a route: the chosen one, or the default. */
function routeFor(cur, path) {
  return path.kind === 'route' ? path : cur.pathById[cur.defaultPath];
}

const routeIndex = (route, courseId) => route.courses.indexOf(courseId);

/** The written lessons of a course, in catalog order (unit by unit). */
export function courseLessonOrder(cur, courseId) {
  return cur.courseLessons[courseId] ?? [];
}

/** Previous and next written lesson in the course's own order, crossing units. */
export function lessonNeighbours(cur, lessonId) {
  const courseId = cur.courseOf[lessonId];
  const order = cur.courseLessons[courseId] ?? [];
  const i = order.indexOf(lessonId);
  if (i < 0) return { courseId: null, unit: null, prev: null, next: null, first: false, last: false };
  const next = order[i + 1] ?? null;
  return {
    courseId,
    unit: cur.unitOf[lessonId],
    prev: order[i - 1] ?? null,
    next,
    nextStartsUnit: !!next && cur.unitOf[next].id !== cur.unitOf[lessonId].id,
    first: i === 0,
    last: i === order.length - 1,
  };
}

/** Every written lesson of the course has its checkpoint answered. */
export function courseFinished(cur, state, courseId) {
  const order = cur.courseLessons[courseId] ?? [];
  return order.length > 0 && order.every((id) => isDone(state, id));
}

const plannedCount = (cur, courseId) => cur.courseById[courseId]?.units.reduce((n, u) => n + u.planned.length, 0) ?? 0;

/**
 * Concepts a lesson builds on, split into those a written lesson teaches and
 * those nothing written teaches yet — the honest answer to "am I ready?".
 */
export function buildsOn(cur, lessonId) {
  const lesson = cur.lessonById[lessonId];
  const taught = [];
  const untaught = [];
  for (const c of lesson?.prerequisites ?? []) {
    const title = cur.conceptById[c]?.title ?? c;
    if (cur.taughtBy[c]?.length) taught.push({ id: c, title, lessons: cur.taughtBy[c] });
    else untaught.push({ id: c, title });
  }
  return { taught, untaught };
}

/**
 * The first written course after `courseId` on the route that still has an
 * unfinished written lesson. Outline-only courses on the way are listed in
 * `skipped` (so they are never passed over silently); finished ones in `passed`.
 */
export function courseAfter(cur, state, route, courseId) {
  const i = routeIndex(route, courseId);
  const skipped = [];
  const passed = [];
  for (const c of route.courses.slice(i + 1)) {
    if (!written(cur, c)) { skipped.push(c); continue; }
    const lessonId = cur.courseLessons[c].find((id) => !isDone(state, id));
    if (lessonId) return { courseId: c, lessonId, skipped, passed };
    passed.push(c);
  }
  return { courseId: null, lessonId: null, skipped, passed };
}

/**
 * Has the learner moved beyond `courseId` on the route: placed past it, or
 * finished a lesson in a later course? Then its unfinished lessons are not a
 * gap to send them back for — only answers that say otherwise are.
 */
function beyond(cur, state, route, courseId) {
  const i = routeIndex(route, courseId);
  if (state.placement && routeIndex(route, state.placement.course) > i) return true;
  return Object.keys(state.lessons ?? {}).some((id) => isDone(state, id) && routeIndex(route, cur.courseOf[id]) > i);
}

/**
 * What stands between the learner and `courseId`: prerequisite courses that
 * are not written (looked through, to their own prerequisites); the earliest
 * written prerequisite with an unfinished lesson that either teaches a skill
 * the learner's answers show as weak, or that they have not moved beyond; and
 * weak prerequisite skills whose lessons are already done (`review`: the
 * remedy is practice, not repeating the lesson).
 */
export function readiness(cur, state, route, courseId) {
  const outline = [];
  const review = [];
  let bridge = null;
  const weak = new Set(state.weak ?? []);
  const seen = new Set();
  const consider = (candidate) => {
    if (!bridge || routeIndex(route, candidate.courseId) < routeIndex(route, bridge.courseId)) bridge = candidate;
  };
  const visit = (id) => {
    for (const p of cur.courseById[id]?.prerequisites ?? []) {
      if (seen.has(p)) continue;
      seen.add(p);
      if (!written(cur, p)) { outline.push(p); visit(p); continue; }
      const course = cur.courseById[p];
      const weakSkills = [...new Set(course.units.flatMap((u) => u.exitCompetencies))].filter((c) => weak.has(c));
      const teaches = (l) => cur.lessonById[l].competencies.some((c) => weakSkills.includes(c));
      const weakLesson = weakSkills.length ? cur.courseLessons[p].find((l) => teaches(l) && !isDone(state, l)) : null;
      if (weakLesson) {
        consider({ courseId: p, lessonId: weakLesson, why: 'weak', skills: weakSkills });
      } else if (weakSkills.length) {
        review.push(...weakSkills.filter((c) => cur.courseLessons[p].some((l) => cur.lessonById[l].competencies.includes(c))));
      } else if (!courseFinished(cur, state, p) && !beyond(cur, state, route, p)) {
        const lessonId = cur.courseLessons[p].find((l) => !isDone(state, l));
        if (lessonId) consider({ courseId: p, lessonId, why: 'unfinished' });
      }
      // Only direct prerequisites are bridges (looking through outlines, above):
      // the bridge course's own page names what it builds on in turn, so a
      // learner is never sent several courses back in one step.
    }
  };
  visit(courseId);
  return { outline, bridge, review: [...new Set(review)] };
}

function blank(pathId) {
  return {
    status: null,
    pathId,
    currentCourseId: null,
    currentUnitId: null,
    currentLessonId: null,
    nextLessonId: null,
    nextCourseId: null,
    bridgeCourseId: null,
    courseComplete: false,
    skipped: [],
    target: null,
    label: '',
    reasons: [],
    warnings: [],
    alternatives: [],
  };
}

/**
 * Moving on from a course whose written lessons are all done — or will be
 * once `pending`, the lesson on screen, has its checkpoint answered.
 */
function fromFinishedCourse(cur, state, path, courseId, rec, pending = null) {
  const route = routeFor(cur, path);
  const course = cur.courseById[courseId];
  rec.courseComplete = !pending;
  const planned = plannedCount(cur, courseId);
  rec.reasons.push(pending
    ? `This is the last written lesson of ${course.title} you have not finished; after its checkpoint, the course moves on.`
    : `You have answered the checkpoint of every written lesson in ${course.title}.`);
  if (planned > 0) {
    rec.warnings.push(`${course.title} has ${planned} more planned lesson${planned === 1 ? '' : 's'} that ${planned === 1 ? 'is' : 'are'} not written yet, so the full course is not complete.`);
  }
  const next = courseAfter(cur, state, route, courseId);
  rec.skipped = next.skipped;
  if (next.skipped.length) {
    const titles = next.skipped.map((c) => courseTitle(cur, c));
    rec.warnings.push(`${listText(titles)} ${titles.length === 1 ? 'is' : 'are'} next on the path but not written yet, so ${titles.length === 1 ? 'it is' : 'they are'} passed over for now.`);
  }
  if (next.passed.length) rec.reasons.push(`Already finished: ${listText(next.passed.map((c) => courseTitle(cur, c)))}.`);
  if (!next.courseId) return pathEnd(cur, state, path, rec);

  const target = cur.courseById[next.courseId];
  rec.nextCourseId = target.id;
  rec.nextLessonId = next.lessonId;
  describeTransition(cur, route, courseId, target.id, next.lessonId, rec);

  const ready = readiness(cur, state, route, target.id);
  if (ready.review.length) {
    rec.reasons.push(`Some answers on skills ${target.title} uses are under half right; a short review in Practice would help first.`);
    rec.alternatives.push({ kind: 'review', target: { page: 'practice/review', params: {} }, label: 'Review weak skills in Practice', skills: ready.review });
  }
  if (ready.bridge) {
    rec.status = STATUS.BRIDGE;
    rec.bridgeCourseId = ready.bridge.courseId;
    rec.target = lessonTarget(ready.bridge.lessonId);
    rec.label = `Bridge: ${lessonTitle(cur, ready.bridge.lessonId)}`;
    rec.reasons.push(ready.bridge.why === 'weak'
      ? `Your answers on ${courseTitle(cur, ready.bridge.courseId)} skills that ${target.title} uses are under half right, so a short bridge comes first.`
      : `${target.title} builds on ${courseTitle(cur, ready.bridge.courseId)}, which still has unfinished written lessons.`);
    rec.alternatives.push({ kind: 'skip-ahead', target: lessonTarget(next.lessonId), label: `Skip ahead to ${target.title}` });
    return rec;
  }
  rec.status = STATUS.TRANSITION;
  rec.target = lessonTarget(next.lessonId);
  rec.label = `Continue to ${target.title}: ${lessonTitle(cur, next.lessonId)}`;
  return rec;
}

function outlineWarning(cur, course, outline, rec) {
  if (!outline.length) return;
  const titles = outline.map((p) => courseTitle(cur, p));
  rec.warnings.push(`${course.title} builds on ${listText(titles)}, which ${titles.length === 1 ? 'is' : 'are'} not written yet.`);
}

/** Prerequisite courses with no written lessons, looked through to their own prerequisites. */
export function outlinePrerequisites(cur, courseId) {
  const out = [];
  const seen = new Set();
  const visit = (id) => {
    for (const p of cur.courseById[id]?.prerequisites ?? []) {
      if (seen.has(p)) continue;
      seen.add(p);
      if (!written(cur, p)) { out.push(p); visit(p); }
    }
  };
  visit(courseId);
  return out;
}

/**
 * Why `toCourseId` follows `fromCourseId` on the route, which ideas its first
 * lesson builds on, and what it assumes that nothing written teaches yet —
 * the same words for a transition and for a course page's "What comes after".
 */
function describeTransition(cur, route, fromCourseId, toCourseId, lessonId, rec) {
  const from = cur.courseById[fromCourseId];
  const target = cur.courseById[toCourseId];
  const prereqLink = target.prerequisites.includes(fromCourseId) ? ` It lists ${from.title} as a prerequisite.` : '';
  rec.reasons.push(`${target.title} comes next on “${route.title}”.${prereqLink}`);
  const uses = buildsOn(cur, lessonId);
  if (uses.taught.length) rec.reasons.push(`Its first lesson, “${lessonTitle(cur, lessonId)}”, builds on: ${listText(uses.taught.map((t) => t.title))}.`);
  if (uses.untaught.length) rec.warnings.push(`“${lessonTitle(cur, lessonId)}” ${uses.taught.length ? 'also ' : ''}assumes: ${listText(uses.untaught.map((t) => t.title))} — not taught in a written lesson here yet.`);
  outlineWarning(cur, target, outlinePrerequisites(cur, toCourseId), rec);
}

/**
 * The course that structurally follows this one on the route — the next
 * course with written lessons, whatever the learner has done — with the
 * reasons it follows. For a course page's "What comes after this course?".
 */
export function courseSuccessor(cur, pathId, courseId) {
  const n = courseNeighbours(cur, pathId, courseId);
  const out = { courseId: n.next, lessonId: null, skipped: n.skipped, reasons: [], warnings: [] };
  if (!n.next) return out;
  out.lessonId = cur.courseLessons[n.next][0];
  describeTransition(cur, n.route, courseId, n.next, out.lessonId, out);
  return out;
}

function pathEnd(cur, state, path, rec) {
  rec.status = STATUS.END;
  rec.target = { page: 'learn/pathway', params: {} };
  rec.label = 'See your whole path';
  const route = routeFor(cur, path);
  // Lessons earlier on the path that the learner placed or jumped past.
  const onPath = path.kind === 'route'
    ? route.courses.flatMap((c) => cur.courseLessons[c] ?? [])
    : path.steps.filter((s) => s.lesson && cur.lessonById[s.lesson]).map((s) => s.lesson);
  const left = onPath.filter((id) => !isDone(state, id) && id !== rec.currentLessonId);
  if (left.length) {
    rec.reasons.push(`Nothing written is left ahead of you on “${path.title}”. ${left.length} written lesson${left.length === 1 ? '' : 's'} earlier on the path ${left.length === 1 ? 'is' : 'are'} unfinished, because you started further along.`);
    rec.alternatives.push({ kind: 'earlier', target: lessonTarget(left[0]), label: `Go back to: ${lessonTitle(cur, left[0])}` });
  } else {
    rec.reasons.push(`You have answered the checkpoint of every written lesson on “${path.title}”.`);
  }
  const courseIds = path.kind === 'route' ? route.courses : [...new Set(path.steps.filter((s) => s.course).map((s) => s.course))];
  const planned = courseIds.reduce((n, c) => n + plannedCount(cur, c), 0);
  if (path.kind === 'route' && planned > 0) rec.warnings.push(`${planned} planned lessons on this path are not written yet; the path is finished only as far as it is written.`);
  if (path.kind === 'track') {
    const missing = path.steps.filter((s) => s.planned).map((s) => s.planned);
    if (missing.length) rec.warnings.push(`Planned for this track, not written yet: ${listText(missing)}.`);
    if (path.project && cur.projectById[path.project]) {
      rec.alternatives.push({ kind: 'project', target: { page: 'apply/projects', params: {} }, label: `Final project: ${cur.projectById[path.project].title}` });
    } else if (path.projectNote) {
      rec.warnings.push(path.projectNote);
    }
  }
  rec.alternatives.push({ kind: 'review', target: { page: 'practice/review', params: {} }, label: 'Review your skills in Practice' });
  return rec;
}

function setCurrent(cur, rec, lessonId) {
  rec.currentLessonId = lessonId;
  rec.currentCourseId = cur.courseOf[lessonId] ?? null;
  rec.currentUnitId = cur.unitOf[lessonId]?.id ?? null;
}

/** Next unfinished written lesson in the same course after `lessonId`, else an earlier unfinished one. */
function withinCourse(cur, state, lessonId) {
  const order = cur.courseLessons[cur.courseOf[lessonId]] ?? [];
  const i = order.indexOf(lessonId);
  const after = order.slice(i + 1).find((id) => !isDone(state, id));
  if (after) return { lessonId: after, earlier: false };
  const before = order.slice(0, Math.max(0, i)).find((id) => !isDone(state, id));
  return before ? { lessonId: before, earlier: true } : null;
}

function sameCourseStep(cur, from, step, rec) {
  const unitChange = cur.unitOf[step.lessonId].id !== cur.unitOf[from].id;
  rec.status = unitChange && !step.earlier ? STATUS.NEXT_UNIT : STATUS.CONTINUE;
  rec.nextLessonId = step.lessonId;
  rec.target = lessonTarget(step.lessonId);
  rec.label = `Next lesson: ${lessonTitle(cur, step.lessonId)}`;
  const course = cur.courseById[cur.courseOf[from]];
  if (step.earlier) {
    rec.reasons.push(`“${lessonTitle(cur, step.lessonId)}” is the written lesson of ${course.title} whose checkpoint you have not answered yet.`);
  } else if (unitChange) {
    const n = course.units.findIndex((u) => u.id === cur.unitOf[step.lessonId].id) + 1;
    rec.reasons.push(`Next written lesson in ${course.title}, starting Unit ${n}: ${cur.unitOf[step.lessonId].title}.`);
  } else {
    rec.reasons.push(`Next written lesson in ${course.title}.`);
  }
  return rec;
}

/** After a lesson (its own page, or its completion summary). */
function afterLesson(cur, state, path, lessonId) {
  const rec = blank(path.id);
  setCurrent(cur, rec, lessonId);
  if (!cur.lessonById[lessonId]) return forStart(cur, state, path, rec);
  // On a track, a lesson in the track continues the track.
  if (path.kind === 'track' && path.steps.some((s) => s.lesson === lessonId)) return trackStep(cur, state, path, rec, lessonId);
  const step = withinCourse(cur, state, lessonId);
  if (step) return sameCourseStep(cur, lessonId, step, rec);
  return fromFinishedCourse(cur, state, path, cur.courseOf[lessonId], rec, isDone(state, lessonId) ? null : lessonId);
}

/** A course page: continue it, move on from it, or offer an alternative to an outline. */
function forCourse(cur, state, path, courseId) {
  const rec = blank(path.id);
  const route = routeFor(cur, path);
  const course = cur.courseById[courseId];
  rec.currentCourseId = courseId;
  if (!course) return forStart(cur, state, path, rec);
  if (!written(cur, courseId)) {
    rec.status = STATUS.UNAVAILABLE;
    rec.reasons.push(`${course.title} is an outline: its lessons are planned but none is written yet.`);
    const alt = cur.alternatives[courseId];
    const next = courseAfter(cur, state, route, courseId);
    if (alt) {
      rec.target = { page: alt.page, params: {} };
      rec.label = alt.label;
      rec.reasons.push(alt.why);
    }
    if (next.courseId) {
      rec.nextCourseId = next.courseId;
      rec.nextLessonId = next.lessonId;
      const option = { target: lessonTarget(next.lessonId), label: `Continue on the path: ${courseTitle(cur, next.courseId)} — ${lessonTitle(cur, next.lessonId)}` };
      if (rec.target) rec.alternatives.push({ kind: 'path', ...option });
      else {
        rec.target = option.target;
        rec.label = option.label;
        rec.reasons.push(`${courseTitle(cur, next.courseId)} is the next course on the path with written lessons.`);
      }
    }
    if (!rec.target) return pathEnd(cur, state, path, rec);
    return rec;
  }
  const order = cur.courseLessons[courseId];
  const first = order.find((id) => !isDone(state, id));
  if (!first) {
    rec.currentLessonId = order[order.length - 1];
    rec.currentUnitId = cur.unitOf[rec.currentLessonId].id;
    return fromFinishedCourse(cur, state, path, courseId, rec);
  }
  setCurrent(cur, rec, first);
  rec.status = STATUS.CONTINUE;
  rec.nextLessonId = first;
  rec.target = lessonTarget(first);
  const started = order.some((id) => isDone(state, id));
  rec.label = `${started ? 'Continue' : 'Start'}: ${lessonTitle(cur, first)}`;
  rec.reasons.push(started ? `The first written lesson of ${course.title} whose checkpoint you have not answered yet.` : `The first written lesson of ${course.title}.`);
  if (!started) {
    const ready = readiness(cur, state, route, courseId);
    outlineWarning(cur, course, ready.outline, rec);
    if (ready.bridge) {
      rec.bridgeCourseId = ready.bridge.courseId;
      rec.alternatives.push({ kind: 'bridge', target: lessonTarget(ready.bridge.lessonId), label: `Bridge first: ${courseTitle(cur, ready.bridge.courseId)} — ${lessonTitle(cur, ready.bridge.lessonId)}` });
      rec.warnings.push(`${course.title} builds on ${courseTitle(cur, ready.bridge.courseId)}, which you have not finished. Nothing is locked: start here if you are ready.`);
    }
  }
  return rec;
}

/** On a track: the next unfinished written step, else an earlier one, else the track's end. */
function trackStep(cur, state, path, rec, fromLessonId = null) {
  const steps = path.steps.filter((s) => s.lesson && cur.lessonById[s.lesson]).map((s) => s.lesson);
  const i = fromLessonId ? steps.indexOf(fromLessonId) : -1;
  const after = steps.slice(i + 1).find((id) => !isDone(state, id));
  const before = after ? null : steps.slice(0, Math.max(0, i)).find((id) => !isDone(state, id));
  const next = after ?? before;
  if (!next) return pathEnd(cur, state, path, rec);
  if (!rec.currentLessonId) setCurrent(cur, rec, next);
  rec.status = STATUS.CONTINUE;
  rec.nextLessonId = next;
  if (cur.courseOf[next] !== rec.currentCourseId) rec.nextCourseId = cur.courseOf[next];
  rec.target = lessonTarget(next);
  rec.label = `${fromLessonId ? 'Next in your track' : 'Continue your track'}: ${lessonTitle(cur, next)}`;
  const why = path.steps.find((s) => s.lesson === next)?.why;
  rec.reasons.push(`Step ${steps.indexOf(next) + 1} of the written lessons in “${path.title}”${why ? `: ${why.charAt(0).toLowerCase()}${why.slice(1)}` : '.'}`);
  if (before) rec.reasons.push('It is the track lesson whose checkpoint you have not answered yet.');
  return rec;
}

/**
 * Where the learner stands on the route, for Home: a starting point chosen or
 * placed more recently than any finished lesson wins (their choice is
 * respected); otherwise the furthest course with a finished lesson, so
 * reviewing an old lesson never drags the recommendation back; otherwise the
 * placement; otherwise the start of the route.
 */
export function anchorCourse(cur, state, route) {
  const latest = Object.values(state.lessons ?? {}).reduce((t, r) => Math.max(t, r?.completed ?? 0), 0);
  const p = state.placement;
  if (p && cur.courseById[p.course] && (!latest || (p.at ?? 0) >= latest)) return { courseId: p.course, why: 'placement' };
  let best = -1;
  for (const id of Object.keys(state.lessons ?? {})) {
    if (isDone(state, id) && cur.courseOf[id]) best = Math.max(best, routeIndex(route, cur.courseOf[id]));
  }
  if (best >= 0) return { courseId: route.courses[best], why: 'progress' };
  return { courseId: route.courses[0], why: 'start' };
}

function forStart(cur, state, path, rec) {
  if (path.kind === 'track') return trackStep(cur, state, path, rec);
  const route = routeFor(cur, path);
  const anchor = anchorCourse(cur, state, route);
  const out = forCourse(cur, state, path, anchor.courseId);
  if (anchor.why === 'placement' && out.status === STATUS.UNAVAILABLE && state.placement) {
    out.reasons.unshift(`Your starting point, ${courseTitle(cur, anchor.courseId)}, has no written lessons yet.`);
  } else if (anchor.why === 'placement' && out.status === STATUS.CONTINUE) {
    out.reasons.push(`${courseTitle(cur, anchor.courseId)} is your starting point${state.placement?.source === 'diagnostic' ? ', from your placement check' : ''}.`);
  }
  out.anchor = anchor;
  return out;
}

/**
 * The single recommendation every page renders.
 *   from = { lessonId }  after this lesson (lesson page, completion summary)
 *   from = { courseId }  for this course (course page)
 *   from = {}            overall (Home, My Progress)
 */
export function recommend(cur, state, from = {}) {
  const path = pathFor(cur, state.pathId);
  if (from.lessonId) return afterLesson(cur, state, path, from.lessonId);
  if (from.courseId) return forCourse(cur, state, path, from.courseId);
  return forStart(cur, state, path, blank(path.id));
}

/**
 * The course before and after this one on the route, for a course page's
 * journey line: the route's previous course (written or not), and the next
 * written course with any outline courses in between.
 */
export function courseNeighbours(cur, pathId, courseId) {
  const route = routeFor(cur, pathFor(cur, pathId));
  const i = routeIndex(route, courseId);
  const prev = i > 0 ? route.courses[i - 1] : null;
  const skipped = [];
  let next = null;
  for (const c of route.courses.slice(i + 1)) {
    if (written(cur, c)) { next = c; break; }
    skipped.push(c);
  }
  return { route, prev, prevWritten: prev ? written(cur, prev) : false, next, skipped };
}

/** Course states along a route, and the totals Home and My Progress show. */
export function routeProgress(cur, state, pathId) {
  const route = routeFor(cur, pathFor(cur, pathId));
  const courses = route.courses.map((id) => {
    const order = cur.courseLessons[id] ?? [];
    const checked = order.filter((l) => isDone(state, l)).length;
    const planned = plannedCount(cur, id);
    const status = !order.length ? 'planned'
      : checked === order.length ? 'finished-available'
        : checked > 0 || order.some((l) => state.lessons?.[l]?.opened) ? 'in-progress' : 'not-started';
    return { courseId: id, written: order.length, checked, planned, status, parallel: route.parallel?.[id] ?? null };
  });
  const writtenTotal = courses.reduce((n, c) => n + c.written, 0);
  const checkedTotal = courses.reduce((n, c) => n + c.checked, 0);
  return { route, courses, written: writtenTotal, checked: checkedTotal };
}

/** A track's steps with their state, for the path page. */
export function trackProgress(cur, state, pathId) {
  const path = cur.pathById[pathId];
  if (!path || path.kind !== 'track') return null;
  const steps = path.steps.map((s) => (s.lesson
    ? { ...s, available: !!cur.lessonById[s.lesson], done: isDone(state, s.lesson), courseId: cur.courseOf[s.lesson] }
    : { ...s, available: false, done: false, courseId: s.course }));
  const lessons = steps.filter((s) => s.lesson && s.available);
  return { path, steps, written: lessons.length, checked: lessons.filter((s) => s.done).length, project: path.project ? cur.projectById[path.project] ?? null : null };
}

/** One line for "next milestone": what finishing the current stretch means. */
export function nextMilestone(cur, state, rec) {
  if (rec.status === STATUS.END) return 'Every written lesson on your path is done. New lessons appear as they are written.';
  const courseId = rec.nextCourseId ?? cur.courseOf[rec.nextLessonId] ?? rec.currentCourseId;
  if (!courseId || !written(cur, courseId)) return null;
  const order = cur.courseLessons[courseId];
  const left = order.filter((id) => !isDone(state, id)).length;
  return left === order.length
    ? `Start ${courseTitle(cur, courseId)} (${order.length} written lesson${order.length === 1 ? '' : 's'})`
    : `Finish the written lessons of ${courseTitle(cur, courseId)}: ${left} left of ${order.length}`;
}

/**
 * Follow the recommendations from a learner's starting state to the end:
 * the lesson sequence a learner who always takes "Continue" would see. Used by
 * the validator and to generate docs/LEARNING_PATH_MAP.md.
 */
export function walkPath(cur, { pathId = null, placement = null, limit = 500 } = {}) {
  const lessons = {};
  const steps = [];
  let t = 1;
  for (let n = 0; n < limit; n++) {
    const state = { lessons, placement, pathId };
    const last = steps.at(-1)?.lessonId;
    const rec = last ? recommend(cur, state, { lessonId: last }) : recommend(cur, state);
    // The primary action, as a learner pressing it would follow it.
    const id = rec.target?.page === 'learn/lesson' ? rec.target.params.lessonId : null;
    if (rec.status === STATUS.END || !id) return { steps, end: rec };
    if (lessons[id]?.completed) return { steps, end: rec, error: `recommended a finished lesson again: ${id}` };
    steps.push({ lessonId: id, status: rec.status, reasons: rec.reasons, warnings: rec.warnings });
    lessons[id] = { opened: t, completed: t };
    t += 1;
  }
  return { steps, end: null, error: 'did not reach the end of the path' };
}

/**
 * Structural checks for the build and the test suite. Returns a list of
 * problems, each a sentence naming what is wrong; empty means valid.
 */
export function validateCurriculum(cur, { pages = null } = {}) {
  const errors = [];
  const route = cur.pathById[cur.defaultPath];
  if (!route || route.kind !== 'route') {
    errors.push(`default path “${cur.defaultPath}” is missing or is not a route`);
    return errors;
  }
  // Course prerequisite graph: known ids, no cycles.
  for (const c of cur.courses) {
    for (const p of c.prerequisites) if (!cur.courseById[p]) errors.push(`course ${c.id} lists unknown prerequisite ${p}`);
  }
  const state = {};
  const cyclic = (id, stack = []) => {
    if (state[id] === 'done') return false;
    if (state[id] === 'open') { errors.push(`course prerequisites form a cycle: ${[...stack, id].join(' → ')}`); return true; }
    state[id] = 'open';
    for (const p of cur.courseById[id]?.prerequisites ?? []) if (cyclic(p, [...stack, id])) return true;
    state[id] = 'done';
    return false;
  };
  cur.courses.forEach((c) => cyclic(c.id));

  for (const path of cur.paths) {
    if (path.kind === 'route') {
      const seen = new Set();
      path.courses.forEach((id, i) => {
        if (!cur.courseById[id]) errors.push(`path ${path.id} lists unknown course ${id}`);
        if (seen.has(id)) errors.push(`path ${path.id} lists ${id} twice`);
        seen.add(id);
        for (const p of cur.courseById[id]?.prerequisites ?? []) {
          if (path.courses.indexOf(p) > i) errors.push(`path ${path.id} puts ${id} before its prerequisite ${p}`);
        }
      });
      for (const c of cur.courses) if (!seen.has(c.id)) errors.push(`path ${path.id} leaves out course ${c.id}`);
      for (const id of Object.keys(path.parallel ?? {})) if (!seen.has(id)) errors.push(`path ${path.id} has a parallel note for ${id}, which it does not list`);
    } else if (path.kind === 'track') {
      const lessons = new Set();
      for (const s of path.steps) {
        if (s.lesson) {
          if (!cur.lessonById[s.lesson]) errors.push(`track ${path.id} lists unknown lesson ${s.lesson}`);
          if (lessons.has(s.lesson)) errors.push(`track ${path.id} lists ${s.lesson} twice`);
          lessons.add(s.lesson);
        } else if (s.planned) {
          const course = cur.courseById[s.course];
          if (!course) errors.push(`track ${path.id}: planned step “${s.planned}” names unknown course ${s.course}`);
          else if (!course.units.some((u) => u.planned.includes(s.planned))) errors.push(`track ${path.id}: “${s.planned}” is not a planned lesson of ${s.course}`);
        } else {
          errors.push(`track ${path.id} has a step that is neither a lesson nor a planned topic`);
        }
        if (!s.why) errors.push(`track ${path.id}: a step has no “why”`);
      }
      if (path.project && !cur.projectById[path.project]) errors.push(`track ${path.id} names unknown project ${path.project}`);
      if (!path.project && !path.projectNote) errors.push(`track ${path.id} has neither a project nor a note saying why not`);
    } else {
      errors.push(`path ${path.id} has unknown kind ${path.kind}`);
    }
  }
  for (const [courseId, alt] of Object.entries(cur.alternatives)) {
    if (!cur.courseById[courseId]) errors.push(`alternative for unknown course ${courseId}`);
    else if (written(cur, courseId)) errors.push(`${courseId} has written lessons but also an outline alternative`);
    if (pages && !pages.has(alt.page)) errors.push(`alternative for ${courseId} points to unknown page ${alt.page}`);
  }

  // Every written lesson has a valid next step or an honest end.
  const all = Object.keys(cur.courseOf);
  for (const id of all) {
    const rec = recommend(cur, { lessons: Object.fromEntries(all.filter((x) => x !== id).map((x) => [x, { completed: 1 }])) }, { lessonId: id });
    if (rec.status !== STATUS.END) errors.push(`with every other lesson done, ${id} should end the path, not ${rec.status}`);
    const fresh = recommend(cur, { lessons: {} }, { lessonId: id });
    if (!fresh.target) errors.push(`lesson ${id} has no next step`);
    if (fresh.nextLessonId && !cur.lessonById[fresh.nextLessonId]) errors.push(`lesson ${id} recommends ${fresh.nextLessonId}, which is not written`);
  }

  // Taking "Continue" from the start reaches every written lesson once, course by course in route order.
  const walk = walkPath(cur);
  if (walk.error) errors.push(`default path walk: ${walk.error}`);
  const visited = walk.steps.map((s) => s.lessonId);
  const expected = route.courses.flatMap((c) => cur.courseLessons[c] ?? []);
  if (visited.join() !== expected.join()) {
    errors.push(`default path walk visits ${visited.length} lessons in a different order from the route: ${visited.join(', ')}`);
  }
  for (const path of cur.paths.filter((p) => p.kind === 'track')) {
    const w = walkPath(cur, { pathId: path.id });
    const want = path.steps.filter((s) => s.lesson).map((s) => s.lesson);
    if (w.error || w.steps.map((s) => s.lessonId).join() !== want.join()) errors.push(`track ${path.id} walk does not follow its steps`);
  }
  return errors;
}
