import { describe, it, expect } from 'vitest';
import {
  STATUS, makeCurriculum, recommend, validateCurriculum, walkPath, lessonNeighbours, courseNeighbours,
  routeProgress, trackProgress, nextMilestone, anchorCourse, readiness, listText,
} from '../learningPath.js';
import { CURRICULUM as cur } from '../../data/curriculum/path.js';
import { COURSES } from '../../data/curriculum/catalog.js';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { PROJECTS } from '../../data/projects/index.js';
import { PATHS, DEFAULT_PATH, OUTLINE_ALTERNATIVES } from '../../data/curriculum/pathways.js';
import { PAGES } from '../../app/pages.js';

// Everything below derives its course and lesson ids from the real catalog,
// so adding a lesson or a course re-tests the path without editing this file.
const route = cur.pathById[DEFAULT_PATH];
const writtenCourses = route.courses.filter((c) => cur.courseLessons[c].length);
const outlineCourses = route.courses.filter((c) => !cur.courseLessons[c].length);
const allLessons = route.courses.flatMap((c) => cur.courseLessons[c]);
const done = (ids, from = 1) => Object.fromEntries(ids.map((id, i) => [id, { opened: from + i, completed: from + i }]));
const lessonsOf = (...courses) => courses.flatMap((c) => cur.courseLessons[c]);
const STATUSES = new Set(Object.values(STATUS));

describe('the real curriculum is a valid learning path', () => {
  it('passes every structural check (ids, order, cycles, tracks, terminals)', () => {
    expect(validateCurriculum(cur, { pages: new Set(PAGES.map((p) => p.id)) })).toEqual([]);
  });

  it('has written lessons in several courses and outline-only courses, so the cases below are real', () => {
    expect(writtenCourses.length).toBeGreaterThan(3);
    expect(outlineCourses.length).toBeGreaterThan(0);
  });

  it('taking “Continue” from the start visits every written lesson exactly once, course by course in route order', () => {
    const walk = walkPath(cur);
    expect(walk.error).toBeUndefined();
    expect(walk.steps.map((s) => s.lessonId)).toEqual(allLessons);
    expect(walk.end.status).toBe(STATUS.END);
  });

  it('every track walk follows its written steps in order and ends honestly', () => {
    for (const path of PATHS.filter((p) => p.kind === 'track')) {
      const walk = walkPath(cur, { pathId: path.id });
      expect(walk.steps.map((s) => s.lessonId)).toEqual(path.steps.filter((s) => s.lesson).map((s) => s.lesson));
      expect(walk.end.status).toBe(STATUS.END);
    }
  });

  it('is deterministic, and keyed by ids: reordering the catalog array changes nothing', () => {
    const shuffled = makeCurriculum({
      courses: [...COURSES].reverse(), lessons: [...LESSONS].reverse(), paths: PATHS, defaultPath: DEFAULT_PATH,
      projects: PROJECTS, concepts: CONCEPTS, alternatives: OUTLINE_ALTERNATIVES,
    });
    expect(walkPath(shuffled).steps).toEqual(walkPath(cur).steps);
    const state = { lessons: done(lessonsOf(writtenCourses[0], writtenCourses[1])) };
    expect(recommend(shuffled, state)).toEqual(recommend(cur, state));
    expect(recommend(cur, state)).toEqual(recommend(cur, state));
  });
});

describe('Next moves through a course, unit by unit', () => {
  it('from each written lesson, with the earlier ones done, the next is the next written lesson of the same course', () => {
    for (const c of writtenCourses) {
      const order = cur.courseLessons[c];
      order.slice(0, -1).forEach((id, i) => {
        const rec = recommend(cur, { lessons: done(order.slice(0, i + 1)) }, { lessonId: id });
        expect(rec.nextLessonId).toBe(order[i + 1]);
        expect(rec.target).toEqual({ page: 'learn/lesson', params: { lessonId: order[i + 1] } });
        const crosses = cur.unitOf[order[i + 1]].id !== cur.unitOf[id].id;
        expect(rec.status).toBe(crosses ? STATUS.NEXT_UNIT : STATUS.CONTINUE);
        expect(rec.label).toMatch(/^Next lesson: /);
      });
    }
  });

  it('the end of a unit goes on to the next unit’s first written lesson, never back to the course outline', () => {
    const unitEnds = allLessons.filter((id) => lessonNeighbours(cur, id).nextStartsUnit);
    expect(unitEnds.length).toBeGreaterThan(0);
    for (const id of unitEnds) {
      const rec = recommend(cur, { lessons: {} }, { lessonId: id });
      expect(rec.status).toBe(STATUS.NEXT_UNIT);
      expect(rec.target.page).toBe('learn/lesson');
      expect(rec.reasons.join(' ')).toMatch(/starting Unit \d+/);
    }
  });

  it('a skipped earlier lesson is offered before leaving the course', () => {
    const c = writtenCourses.find((x) => cur.courseLessons[x].length >= 3);
    const [first, ...rest] = cur.courseLessons[c];
    const rec = recommend(cur, { lessons: done(rest) }, { lessonId: rest.at(-1) });
    expect(rec.nextLessonId).toBe(first);
    expect(rec.status).toBe(STATUS.CONTINUE);
    expect(rec.courseComplete).toBe(false);
  });

  it('neighbours cross units but not courses', () => {
    for (const c of writtenCourses) {
      const order = cur.courseLessons[c];
      expect(lessonNeighbours(cur, order[0]).prev).toBeNull();
      expect(lessonNeighbours(cur, order.at(-1)).next).toBeNull();
      expect(lessonNeighbours(cur, order.at(-1)).last).toBe(true);
    }
  });
});

describe('finishing a course leads to one concrete next course', () => {
  it('every written course except the last recommends a lesson in the next written course on the route, with reasons', () => {
    writtenCourses.slice(0, -1).forEach((c, i) => {
      const lessons = done(lessonsOf(...writtenCourses.slice(0, i + 1)));
      const last = cur.courseLessons[c].at(-1);
      const rec = recommend(cur, { lessons }, { lessonId: last });
      expect(rec.status).toBe(STATUS.TRANSITION);
      expect(rec.courseComplete).toBe(true);
      expect(rec.nextCourseId).toBe(writtenCourses[i + 1]);
      expect(rec.target).toEqual({ page: 'learn/lesson', params: { lessonId: cur.courseLessons[writtenCourses[i + 1]][0] } });
      expect(rec.target.page).not.toBe('learn/courses'); // never the whole catalog
      expect(rec.label).toContain(cur.courseById[writtenCourses[i + 1]].title);
      expect(rec.reasons.length).toBeGreaterThanOrEqual(2);
      // The course page and Home say the same thing (one source).
      expect(recommend(cur, { lessons }, { courseId: c }).target).toEqual(rec.target);
      expect(recommend(cur, { lessons }).target).toEqual(rec.target);
    });
  });

  it('a planned-only course on the way is named, not skipped silently', () => {
    const i = route.courses.findIndex((c, k) => cur.courseLessons[c].length && !cur.courseLessons[route.courses[k + 1]]?.length && k + 1 < route.courses.length);
    const c = route.courses[i];
    const lessons = done(lessonsOf(...route.courses.slice(0, i + 1)));
    const rec = recommend(cur, { lessons }, { courseId: c });
    expect(rec.skipped).toContain(route.courses[i + 1]);
    expect(rec.warnings.join(' ')).toContain(cur.courseById[route.courses[i + 1]].title);
    expect(rec.warnings.join(' ')).toMatch(/not written yet/);
  });

  it('finished available lessons are never called a finished course while lessons are planned', () => {
    const c = writtenCourses.find((x) => cur.courseById[x].units.some((u) => u.planned.length));
    const rec = recommend(cur, { lessons: done(cur.courseLessons[c]) }, { courseId: c });
    expect(rec.warnings.join(' ')).toMatch(/full course is not complete/);
    expect(JSON.stringify(rec)).not.toMatch(/mastered|mastery/i);
  });

  it('the last written course ends the path honestly, with useful next choices', () => {
    const rec = recommend(cur, { lessons: done(allLessons) }, { lessonId: cur.courseLessons[writtenCourses.at(-1)].at(-1) });
    expect(rec.status).toBe(STATUS.END);
    expect(rec.target).toEqual({ page: 'learn/pathway', params: {} });
    expect(rec.warnings.join(' ')).toMatch(/planned lessons on this path are not written yet/);
    expect(rec.alternatives.map((a) => a.kind)).toContain('review');
  });

  it('a learner who started further along is told about the earlier unfinished lessons at the end', () => {
    const late = writtenCourses.slice(-3);
    const rec = recommend(cur, { lessons: done(lessonsOf(...late)), placement: { course: late[0], source: 'diagnostic', at: 0 } }, { courseId: late.at(-1) });
    expect(rec.status).toBe(STATUS.END);
    expect(rec.reasons.join(' ')).toMatch(/earlier on the path .* unfinished, because you started further along/);
    expect(rec.alternatives.find((a) => a.kind === 'earlier').target.params.lessonId).toBe(allLessons[0]);
  });

  it('every page a recommendation or alternative can lead to exists', () => {
    const pages = new Set(PAGES.map((p) => p.id));
    const states = [{ lessons: {} }, { lessons: done(allLessons) }, { lessons: done(lessonsOf(writtenCourses[0])), weak: ['arith.ratios'] }];
    const froms = [{}, ...route.courses.map((courseId) => ({ courseId })), ...allLessons.map((lessonId) => ({ lessonId }))];
    for (const pathId of [null, ...PATHS.map((p) => p.id)]) {
      for (const s of states) {
        for (const from of froms) {
          const rec = recommend(cur, { ...s, pathId }, from);
          for (const t of [rec.target, ...rec.alternatives.map((a) => a.target)]) expect(pages.has(t.page), t.page).toBe(true);
        }
      }
    }
  });

  it('no recommendation, for any mix of finished lessons, points to a lesson that is not written', () => {
    let seed = 7;
    const rand = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
    for (let n = 0; n < 300; n++) {
      const lessons = done(allLessons.filter(() => rand() < 0.5));
      const from = [{}, { lessonId: allLessons[Math.floor(rand() * allLessons.length)] }, { courseId: route.courses[Math.floor(rand() * route.courses.length)] }][n % 3];
      const pathId = n % 4 === 0 ? PATHS[1 + (n % (PATHS.length - 1))].id : null;
      const rec = recommend(cur, { lessons, pathId }, from);
      expect(STATUSES.has(rec.status)).toBe(true);
      expect(rec.target).not.toBeNull();
      expect(rec.label).not.toBe('');
      if (rec.target.page === 'learn/lesson') expect(cur.lessonById[rec.target.params.lessonId]).toBeDefined();
      if (rec.target.page === 'learn/lesson') expect(lessons[rec.target.params.lessonId]?.completed).toBeUndefined();
    }
  });
});

describe('Home: where the learner stands', () => {
  it('a first-time learner starts at the first written lesson of the route', () => {
    const rec = recommend(cur, { lessons: {} });
    expect(rec.target.params.lessonId).toBe(allLessons[0]);
    expect(rec.label).toMatch(/^Start: /);
  });

  it('a placement at an intermediate course does not send the learner back to the start', () => {
    const c = writtenCourses[3];
    const rec = recommend(cur, { lessons: {}, placement: { course: c, source: 'diagnostic', at: 10 } });
    expect(rec.target.params.lessonId).toBe(cur.courseLessons[c][0]);
    expect(rec.reasons.join(' ')).toMatch(/starting point, from your placement check/);
    expect(rec.alternatives.find((a) => a.kind === 'bridge')).toBeUndefined(); // placed past its prerequisites
  });

  it('a placement in an outline-only course offers the next written course and says why', () => {
    const outline = outlineCourses.find((c) => route.courses.indexOf(c) > 0 && !OUTLINE_ALTERNATIVES[c]);
    const rec = recommend(cur, { lessons: {}, placement: { course: outline, source: 'diagnostic', at: 10 } });
    expect(rec.status).toBe(STATUS.UNAVAILABLE);
    expect(rec.target.page).toBe('learn/lesson');
    expect(rec.reasons[0]).toMatch(/has no written lessons yet/);
  });

  it('after finishing a course, Home continues to the next course instead of returning to the first course', () => {
    const c = writtenCourses[2];
    const rec = recommend(cur, { lessons: done(cur.courseLessons[c]) });
    expect(rec.target.params.lessonId).not.toBe(allLessons[0]);
    expect(rec.nextCourseId).toBe(writtenCourses[3]);
  });

  it('reopening and finishing an old lesson does not drag the recommendation back', () => {
    const late = writtenCourses[3];
    const lessons = { ...done(cur.courseLessons[late].slice(0, 1), 10), ...done(cur.courseLessons[writtenCourses[0]].slice(0, 1), 50) };
    expect(anchorCourse(cur, { lessons }, route).courseId).toBe(late);
    expect(cur.courseOf[recommend(cur, { lessons }).target.params.lessonId]).toBe(late);
  });

  it('a starting point chosen after the latest finished lesson is respected', () => {
    const lessons = done(cur.courseLessons[writtenCourses[3]], 10);
    const choice = writtenCourses[1];
    const rec = recommend(cur, { lessons, placement: { course: choice, source: 'manual', at: 1000 } });
    expect(cur.courseOf[rec.target.params.lessonId]).toBe(choice);
    const older = recommend(cur, { lessons, placement: { course: choice, source: 'manual', at: 1 } });
    expect(cur.courseOf[older.target.params.lessonId]).not.toBe(choice);
  });
});

describe('bridges and readiness', () => {
  const fixture = () => makeCurriculum({
    courses: [
      { id: 'A', title: 'Course A', prerequisites: [], units: [{ id: 'a1', title: 'A one', exitCompetencies: ['s.a'], lessons: ['a-1', 'a-2'], planned: [] }] },
      { id: 'P', title: 'Course P', prerequisites: ['A'], units: [{ id: 'p1', title: 'P one', exitCompetencies: [], lessons: [], planned: ['Planned P'] }] },
      { id: 'B', title: 'Course B', prerequisites: ['P'], units: [{ id: 'b1', title: 'B one', exitCompetencies: ['s.b'], lessons: ['b-1'], planned: ['Later B'] }] },
      { id: 'C', title: 'Course C', prerequisites: ['A', 'B'], units: [{ id: 'c1', title: 'C one', exitCompetencies: [], lessons: ['c-1'], planned: [] }] },
    ],
    lessons: [
      { id: 'a-1', title: 'A first', competencies: ['s.a'], concepts: ['k.a'], prerequisites: [] },
      { id: 'a-2', title: 'A second', competencies: ['s.a'], concepts: [], prerequisites: ['k.a'] },
      { id: 'b-1', title: 'B first', competencies: ['s.b'], concepts: ['k.b'], prerequisites: ['k.a', 'k.missing'] },
      { id: 'c-1', title: 'C first', competencies: [], concepts: [], prerequisites: ['k.b'] },
    ],
    paths: [
      { id: 'r', kind: 'route', title: 'Route', courses: ['A', 'P', 'B', 'C'] },
      { id: 't', kind: 'track', title: 'Track', steps: [{ lesson: 'c-1', why: 'x' }, { lesson: 'a-1', why: 'y' }, { planned: 'Later B', course: 'B', why: 'z' }], project: null, projectNote: 'No project yet.' },
    ],
    defaultPath: 'r',
    concepts: [{ id: 'k.a', title: 'Idea A' }, { id: 'k.b', title: 'Idea B' }, { id: 'k.missing', title: 'Idea nobody teaches' }],
  });

  it('the fixture itself is valid', () => {
    expect(validateCurriculum(fixture())).toEqual([]);
  });

  it('an outline prerequisite is looked through, and named', () => {
    const f = fixture();
    const r = readiness(f, { lessons: {} }, f.pathById.r, 'B');
    expect(r.outline).toEqual(['P']);
    expect(r.bridge).toEqual({ courseId: 'A', lessonId: 'a-1', why: 'unfinished' });
  });

  it('opening a course whose written prerequisite is unfinished offers a bridge, without locking anything', () => {
    const f = fixture();
    const rec = recommend(f, { lessons: {} }, { courseId: 'C' });
    expect(rec.target.params.lessonId).toBe('c-1'); // the learner's choice stays primary
    expect(rec.bridgeCourseId).toBe('A');
    expect(rec.alternatives[0]).toMatchObject({ kind: 'bridge', target: { params: { lessonId: 'a-1' } } });
  });

  it('a placement covers the courses before it, not the placed course itself', () => {
    const f = fixture();
    const atB = recommend(f, { lessons: {}, placement: { course: 'B', source: 'diagnostic', at: 1 } }, { courseId: 'C' });
    expect(atB.bridgeCourseId).toBe('B'); // past A, but B is where they were placed
    const atC = recommend(f, { lessons: {}, placement: { course: 'C', source: 'diagnostic', at: 1 } }, { courseId: 'C' });
    expect(atC.bridgeCourseId).toBeNull();
  });

  it('weak answers on a prerequisite’s skill bridge to an unfinished lesson that teaches it…', () => {
    const f = fixture();
    const rec = recommend(f, { lessons: done(['a-1', 'b-1']), weak: ['s.a'] }, { lessonId: 'b-1' });
    expect(rec.status).toBe(STATUS.BRIDGE);
    expect(rec.target.params.lessonId).toBe('a-2');
    expect(rec.alternatives.find((a) => a.kind === 'skip-ahead').target.params.lessonId).toBe('c-1');
  });

  it('…and to review, not a repeated lesson, when those lessons are done', () => {
    const f = fixture();
    const rec = recommend(f, { lessons: done(['a-1', 'a-2', 'b-1']), weak: ['s.a'] }, { lessonId: 'b-1' });
    expect(rec.status).toBe(STATUS.TRANSITION);
    expect(rec.alternatives.find((a) => a.kind === 'review')).toBeDefined();
  });

  it('names the ideas a next course builds on, and the ones nothing written teaches', () => {
    const f = fixture();
    const rec = recommend(f, { lessons: done(['a-1', 'a-2']) }, { lessonId: 'a-2' });
    expect(rec.nextCourseId).toBe('B');
    expect(rec.skipped).toEqual(['P']);
    expect(rec.reasons.join(' ')).toContain('builds on: Idea A');
    expect(rec.warnings.join(' ')).toContain('Idea nobody teaches');
    expect(rec.warnings.join(' ')).toContain('Course B builds on Course P, which is not written yet');
  });

  it('a track ends with its project note when it has no project', () => {
    const f = fixture();
    const rec = recommend(f, { lessons: done(['c-1', 'a-1']), pathId: 't' });
    expect(rec.status).toBe(STATUS.END);
    expect(rec.warnings).toContain('No project yet.');
    expect(rec.warnings.join(' ')).toContain('Later B');
  });
});

describe('the validator catches broken curricula', () => {
  const base = () => ({
    courses: [
      { id: 'A', title: 'A', prerequisites: [], units: [{ id: 'u', title: 'U', exitCompetencies: [], lessons: ['l'], planned: ['Soon'] }] },
      { id: 'B', title: 'B', prerequisites: ['A'], units: [{ id: 'v', title: 'V', exitCompetencies: [], lessons: [], planned: ['Later'] }] },
    ],
    lessons: [{ id: 'l', title: 'L', competencies: [], concepts: [], prerequisites: [] }],
    paths: [{ id: 'r', kind: 'route', title: 'R', courses: ['A', 'B'] }],
    defaultPath: 'r',
  });
  const errors = (mutate) => { const b = base(); mutate(b); return validateCurriculum(makeCurriculum(b)).join('\n'); };

  it('accepts the base fixture', () => expect(errors(() => {})).toBe(''));
  it('a prerequisite cycle', () => expect(errors((b) => { b.courses[0].prerequisites = ['B']; })).toMatch(/cycle/));
  it('a route that puts a course before its prerequisite', () => expect(errors((b) => { b.paths[0].courses = ['B', 'A']; })).toMatch(/before its prerequisite/));
  it('a route that leaves a course out', () => expect(errors((b) => { b.paths[0].courses = ['A']; })).toMatch(/leaves out course B/));
  it('an unknown prerequisite', () => expect(errors((b) => { b.courses[1].prerequisites = ['Z']; })).toMatch(/unknown prerequisite Z/));
  it('a track step that is not written and not planned', () => expect(errors((b) => { b.paths.push({ id: 't', kind: 'track', title: 'T', steps: [{ planned: 'Imaginary', course: 'B', why: 'x' }], projectNote: 'n' }); })).toMatch(/not a planned lesson of B/));
  it('a track lesson that does not exist', () => expect(errors((b) => { b.paths.push({ id: 't', kind: 'track', title: 'T', steps: [{ lesson: 'ghost', why: 'x' }], projectNote: 'n' }); })).toMatch(/unknown lesson ghost/));
  it('a track with no project and no note', () => expect(errors((b) => { b.paths.push({ id: 't', kind: 'track', title: 'T', steps: [{ lesson: 'l', why: 'x' }] }); })).toMatch(/neither a project nor a note/));
  it('an outline alternative for a course that has lessons', () => expect(errors((b) => { b.alternatives = { A: { page: 'x' } }; })).toMatch(/has written lessons but also an outline alternative/));
});

describe('overviews', () => {
  it('route progress counts written lessons only, and marks outline courses as planned', () => {
    const p = routeProgress(cur, { lessons: done(cur.courseLessons[writtenCourses[0]]) }, null);
    expect(p.written).toBe(allLessons.length);
    expect(p.checked).toBe(cur.courseLessons[writtenCourses[0]].length);
    expect(p.courses.find((c) => c.courseId === outlineCourses[0]).status).toBe('planned');
    expect(p.courses.find((c) => c.courseId === writtenCourses[0]).status).toBe('finished-available');
  });

  it('track progress lists planned steps as unavailable', () => {
    const t = trackProgress(cur, { lessons: {} }, 'track.business');
    expect(t.steps.filter((s) => s.planned).every((s) => !s.available)).toBe(true);
    expect(t.project?.id).toBe('proj.pricing');
  });

  it('course neighbours pass over outline courses to the next written one', () => {
    const i = route.courses.findIndex((c, k) => cur.courseLessons[c].length && !cur.courseLessons[route.courses[k + 1]]?.length && k + 1 < route.courses.length);
    const n = courseNeighbours(cur, null, route.courses[i]);
    expect(n.skipped[0]).toBe(route.courses[i + 1]);
    expect(cur.courseLessons[n.next].length).toBeGreaterThan(0);
  });

  it('the next milestone names a course and what is left', () => {
    const rec = recommend(cur, { lessons: {} });
    expect(nextMilestone(cur, { lessons: {} }, rec)).toMatch(/^Start /);
    const half = { lessons: done(cur.courseLessons[writtenCourses[1]].slice(0, 1)) };
    expect(nextMilestone(cur, half, recommend(cur, half))).toMatch(/left of/);
  });

  it('lists read naturally', () => {
    expect(listText(['A'])).toBe('A');
    expect(listText(['A', 'B'])).toBe('A and B');
    expect(listText(['A', 'B', 'C'])).toBe('A, B and C');
  });
});
