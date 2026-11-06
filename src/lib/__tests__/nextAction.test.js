import { describe, it, expect } from 'vitest';
import { CURRICULUM as cur } from '../../data/curriculum/path.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { problemsForLesson } from '../../data/curriculum/problems.js';
import { PAGES } from '../../app/pages.js';
import { makeCurriculum, validateCurriculum } from '../learningPath.js';
import { primaryTarget } from '../studyResume.js';
import { ACTION, getNextLearningAction, lessonErrors, bridgeFor, firstGap, courseCompletion, RECENT_ANSWERS } from '../nextAction.js';

// The hard cases of the 80/20 brief (§7), on the real catalog. Lesson and
// course ids are read from it, so new lessons re-test these rules.

const T = 1793000000000;
const pages = new Set(PAGES.map((p) => p.id));
const done = (ids, from = T) => Object.fromEntries(ids.map((id, i) => [id, { opened: from + i, visited: from + i, completed: from + i, checkpoint: { correct: 3, total: 3, at: from + i } }]));
const S = (over = {}) => ({ lessons: {}, placement: null, pathId: null, weak: [], status: {}, ...over });
const act = (state, extra = {}) => getNextLearningAction(cur, { state, problemsFor: problemsForLesson, ...extra });
const wrong = (lessonId, n, at = T + 100) => Array.from({ length: n }, (_, i) => ({ c: lessonById[lessonId].competencies[0], item: `${lessonId}.x${i}`, ok: false, d: 2, s: 'practice', at: at + i, l: lessonId }));
const right = (lessonId, n, at = T + 200) => Array.from({ length: n }, (_, i) => ({ c: lessonById[lessonId].competencies[0], item: `${lessonId}.y${i}`, ok: true, d: 2, s: 'practice', at: at + i, l: lessonId }));
const proficient = (ids) => Object.fromEntries(ids.map((c) => [c, { level: 'proficient' }]));

/** Every target an action offers must exist: a real page, and a written lesson when it names one. */
function reachable(a) {
  for (const t of [a.target, ...a.alternatives.map((x) => x.target)]) {
    expect(pages.has(t.page), t.page).toBe(true);
    if (t.page === 'learn/lesson') expect(cur.lessonById[t.params.lessonId], t.params.lessonId).toBeTruthy();
    if (t.page === 'learn/course') expect(cur.courseById[t.params.courseId], t.params.courseId).toBeTruthy();
  }
  expect(a.alternatives.length).toBeLessThanOrEqual(2);
  expect(a.reason.length).toBeGreaterThan(10);
  expect(Object.values(ACTION)).toContain(a.kind);
}

const calc1 = cur.courseLessons['calculus-1'];
const calc1Skills = [...new Set(calc1.flatMap((l) => cur.lessonById[l].competencies))];

describe('hard case 1: a first-time learner with no evidence', () => {
  it('starts the first written lesson of the path, with its time and a reason', () => {
    const a = act(S());
    expect(a.kind).toBe(ACTION.LESSON);
    expect(a.evidence.ruleId).toBe('next-authored-lesson');
    expect(a.target.params.lessonId).toBe(cur.courseLessons[cur.pathById[cur.defaultPath].courses[0]][0]);
    expect(a.estimatedMinutes).toBeGreaterThan(0);
    reachable(a);
  });
});

describe('hard case 2: the last written lesson is done but the course has planned lessons', () => {
  const state = S({ lessons: done(calc1), placement: { course: 'calculus-1', source: 'manual', at: T - 1 } });

  // The owner's direction (2026-11-05): a finished course moves on to the next
  // level by itself — never "practise the same course" as the main action.
  it('moves on to the next course, and names the unwritten lessons in a visible notice', () => {
    const a = act(state);
    expect(a.kind).toBe(ACTION.TRANSITION);
    expect(a.evidence.ruleId).toBe('content-gap');
    expect(a.target.page).toBe('learn/lesson');
    expect(cur.courseOf[a.target.params.lessonId]).not.toBe('calculus-1');
    expect(a.headline).toBe(`Next course: ${cur.courseById[cur.courseOf[a.target.params.lessonId]].title}`);
    expect(a.notice).toContain(`“${firstGap(cur.courseById['calculus-1']).title}”`);
    expect(a.notice).toMatch(/not complete/);
    expect(a.reasons.join(' ')).toMatch(/planned but not written yet/);
    reachable(a);
  });

  it('offers practice on the course’s skills as another choice, not the main one', () => {
    const a = act(state);
    const practice = a.alternatives.find((x) => x.kind === ACTION.PRACTICE);
    expect(practice.target).toMatchObject({ page: 'learn/lesson', sectionId: 'use' });
    expect(calc1).toContain(practice.target.params.lessonId);
  });

  it('with the skills already shown, moves on the same way, with no practice offered', () => {
    const a = act({ ...state, status: proficient(calc1Skills) });
    expect(a.kind).toBe(ACTION.TRANSITION);
    expect(cur.courseOf[a.target.params.lessonId]).not.toBe('calculus-1');
    expect(a.alternatives.some((x) => x.kind === ACTION.PRACTICE)).toBe(false);
  });

  it('the end of the last written lesson and the course page say the same', () => {
    const last = calc1.at(-1);
    const a = act(S({ lessons: done(calc1.slice(0, -1)) }), { from: { lessonId: last } });
    expect(a.kind).toBe(ACTION.TRANSITION);
    const c = act(S({ lessons: done(calc1) }), { from: { courseId: 'calculus-1' } });
    expect(c.kind).toBe(ACTION.TRANSITION);
    expect(c.headline).toBe(a.headline);
    expect(c.target).toEqual(a.target);
  });

  it('the course is complete as far as written, and nothing more', () => {
    const c = courseCompletion(cur, state, 'calculus-1');
    expect(c.availableContentComplete).toBe(true);
    expect(c.courseCurriculumComplete).toBe(false);
    expect(c.courseReady).toBe(false);
    expect(c.mastered).toBe(false);
    const ready = courseCompletion(cur, { ...state, status: proficient(cur.courseById['calculus-1'].units.flatMap((u) => u.exitCompetencies)) }, 'calculus-1');
    expect(ready.courseReady).toBe(true);
    expect(ready.mastered).toBe(false);
  });
});

describe('hard case 3: a learner who already knows algebra', () => {
  it('placed at Calculus I, starts it directly: no bridge back through algebra', () => {
    const a = act(S({ placement: { course: 'calculus-1', source: 'diagnostic', at: T } }));
    expect(a.kind).toBe(ACTION.LESSON);
    expect(a.target.params.lessonId).toBe(calc1[0]);
    expect(a.alternatives.find((x) => x.kind === ACTION.BRIDGE)).toBeUndefined();
  });

  it('right answers in a readiness check never trigger a bridge', () => {
    const a = act(S({ placement: { course: 'calculus-1', source: 'diagnostic', at: T } }), { evidence: right('c1-chain-rule', 2) });
    expect(a.kind).not.toBe(ACTION.BRIDGE);
  });
});

describe('hard case 4: failing the chain rule leads to a short composition bridge', () => {
  const state = S({ lessons: { 'c1-chain-rule': { opened: T, visited: T, sections: ['try'] } } });

  it('two misses out of two: a bridge to composite functions, with the reason and a way back', () => {
    const a = act(state, { evidence: wrong('c1-chain-rule', 2) });
    expect(a.kind).toBe(ACTION.BRIDGE);
    expect(a.evidence.ruleId).toBe('bridge-after-errors');
    expect(a.target).toMatchObject({ page: 'learn/lesson', params: { lessonId: 'a2-composition' }, sectionId: 'understand' });
    expect(a.estimatedMinutes).toBeLessThanOrEqual(5);
    expect(a.reasons[0]).toMatch(/2 of your last 2 answers in “The chain rule/);
    expect(a.alternatives[0].target.params.lessonId).toBe('c1-chain-rule');
    reachable(a);
  });

  it('a checkpoint under half right also calls for the bridge', () => {
    const a = act(S({ lessons: { 'c1-chain-rule': { opened: T, completed: T + 5, checkpoint: { correct: 1, total: 4, at: T + 5 } } } }));
    expect(a.kind).toBe(ACTION.BRIDGE);
  });

  it('no loop: once the bridge lesson has been opened since the misses, the path goes on', () => {
    const a = act(S({ lessons: { ...state.lessons, 'a2-composition': { opened: T + 500, visited: T + 500, sections: [] } } }), { evidence: wrong('c1-chain-rule', 2) });
    expect(a.kind).not.toBe(ACTION.BRIDGE);
  });

  it('recovering (the last two answers right) clears it; one slip never triggers it', () => {
    expect(act(state, { evidence: [...wrong('c1-chain-rule', 3), ...right('c1-chain-rule', 2)] }).kind).not.toBe(ACTION.BRIDGE);
    expect(act(state, { evidence: [...right('c1-chain-rule', 3), ...wrong('c1-chain-rule', 1)] }).kind).not.toBe(ACTION.BRIDGE);
  });

  it('counts only the lesson’s recent answers', () => {
    const e = lessonErrors([...wrong('c1-chain-rule', 10, T), ...right('c1-chain-rule', 1, T + 50)], {}, 'c1-chain-rule');
    expect(e.wrong + e.right).toBe(RECENT_ANSWERS);
  });

  it('the end of the chain-rule lesson recommends the same bridge', () => {
    const a = act(state, { from: { lessonId: 'c1-chain-rule' }, evidence: wrong('c1-chain-rule', 3) });
    expect(a.kind).toBe(ACTION.BRIDGE);
    expect(a.target.params.lessonId).toBe('a2-composition');
  });
});

describe('hard case 5 and 7: saved places across an upgrade', () => {
  const pinnedAt = (lessonId, sectionId) => {
    const loc = { courseId: lessonById[lessonId]?.course ?? 'algebra-1', lessonId, sectionId, fraction: 0.3, at: T, source: 'manual' };
    return primaryTarget({ pinned: loc, current: loc, recent: [loc] }, { lessonById, lastLesson: lessonId });
  };

  it('a saved step resumes exactly, ahead of everything else', () => {
    const a = act(S(), { resume: pinnedAt('a1-slope', 'try'), due: ['alg.slope'], evidence: wrong('c1-chain-rule', 3) });
    expect(a.kind).toBe(ACTION.RESUME);
    expect(a.evidence.ruleId).toBe('resume-saved-place');
    expect(a.target).toMatchObject({ params: { lessonId: 'a1-slope' }, sectionId: 'try' });
    expect(a.reasons[0]).toMatch(/at Try it/);
    // The bridge is still offered, as a second choice.
    expect(a.alternatives.map((x) => x.kind)).toContain(ACTION.BRIDGE);
    reachable(a);
  });

  it('a saved place in a renamed or removed lesson falls back to a reachable lesson and says why', () => {
    const resume = pinnedAt('a1-slope-renamed', 'try');
    expect(resume.kind).toBe('missing');
    const a = act(S(), { resume });
    expect(a.kind).not.toBe(ACTION.RESUME);
    expect(a.warnings.join(' ')).toMatch(/no longer in the course list .*a1-slope-renamed/);
    reachable(a);
  });

  it('a finished lesson is not "where you stopped"', () => {
    const a = act(S({ lessons: done(['a1-slope']) }), { resume: pinnedAt('a1-slope', 'check') });
    expect(a.kind).not.toBe(ACTION.RESUME);
  });
});

describe('hard case 6: changing the path', () => {
  it('following a track switches the next action to the track; the route is untouched', () => {
    const track = cur.pathById['track.data-science'];
    const a = act(S({ pathId: track.id }));
    expect(a.target.params.lessonId).toBe(track.steps.find((s) => s.lesson).lesson);
    expect(act(S()).target.params.lessonId).not.toBe(a.target.params.lessonId);
  });

  it('no action ever claims credit, articulation or a course equivalence', () => {
    for (const state of [S(), S({ lessons: done(calc1) }), S({ pathId: 'track.business' })]) {
      const text = JSON.stringify(act(state));
      expect(text).not.toMatch(/college credit|articulat|equivalent to|counts as/i);
    }
  });
});

describe('hard case 8: a review due on the same day as a new lesson', () => {
  it('the lesson stays the primary action; the review is offered beside it, never blocking', () => {
    const a = act(S(), { due: ['arith.ratios', 'alg.slope'] });
    expect(a.kind).toBe(ACTION.LESSON);
    expect(a.alternatives.find((x) => x.kind === ACTION.REVIEW)).toMatchObject({ label: 'Review 2 skills due today', target: { page: 'practice/review' } });
  });
});

describe('hard case 9: an invalid catalog', () => {
  it('the validator rejects circular prerequisites', () => {
    const bad = makeCurriculum({
      courses: [
        { id: 'A', title: 'A', prerequisites: ['B'], units: [{ id: 'u', title: 'U', exitCompetencies: [], lessons: [], planned: ['x'] }] },
        { id: 'B', title: 'B', prerequisites: ['A'], units: [{ id: 'v', title: 'V', exitCompetencies: [], lessons: [], planned: ['y'] }] },
      ],
      lessons: [],
      paths: [{ id: 'r', kind: 'route', title: 'R', courses: ['A', 'B'] }],
      defaultPath: 'r',
    });
    expect(validateCurriculum(bad).join('\n')).toMatch(/cycle/);
  });
});

describe('hard case 10: damaged records', () => {
  it('odd lesson records and answers without lessons still give a reachable action', () => {
    const a = act(S({ lessons: { 'no-such-lesson': { completed: 5 }, 'a1-slope': null } }), {
      evidence: [{ c: 'alg.slope', item: 'x', ok: false, at: 1 }, { c: 'alg.slope', item: 'y', ok: false, at: 2, l: 'no-such-lesson' }],
    });
    reachable(a);
  });
});

describe('properties', () => {
  it('deterministic for a fixed state', () => {
    const state = S({ lessons: done(calc1.slice(0, 1)) });
    expect(JSON.stringify(act(state, { due: ['alg.slope'] }))).toBe(JSON.stringify(act(state, { due: ['alg.slope'] })));
  });

  it('from every lesson, fresh or finished, every target is reachable', () => {
    for (const id of Object.keys(cur.courseOf)) {
      reachable(act(S(), { from: { lessonId: id } }));
      reachable(act(S({ lessons: done([id]) }), { from: { lessonId: id } }));
    }
    for (const c of cur.courses) reachable(act(S(), { from: { courseId: c.id } }));
  });

  it('following the primary action from the start reaches every written lesson and ends honestly, with no loop', () => {
    let state = S();
    const seen = [];
    const visited = new Set();
    for (let n = 0; n < 400; n++) {
      const a = act(state);
      const key = `${a.kind}:${JSON.stringify(a.target)}`;
      expect(seen.at(-1), `repeated ${key}`).not.toBe(key);
      seen.push(key);
      if (a.kind === ACTION.FINISHED) break;
      const id = a.target.page === 'learn/lesson' ? a.target.params.lessonId : null;
      expect(id, key).toBeTruthy();
      if (a.kind === ACTION.PRACTICE || (a.kind === ACTION.GAP && a.target.sectionId === 'use')) {
        // Practising: the course's skills become proficient.
        const course = cur.courseOf[id];
        state = { ...state, status: { ...state.status, ...proficient(cur.courseLessons[course].flatMap((l) => cur.lessonById[l].competencies)) } };
      } else {
        visited.add(id);
        state = { ...state, lessons: { ...state.lessons, ...done([id], T + n * 10) } };
      }
    }
    expect(seen.at(-1)).toMatch(/^path-finished/);
    expect([...visited].sort()).toEqual(Object.keys(cur.courseOf).sort());
  });

  it('every lesson that can go badly has a bridge to an earlier written lesson, or none at all', () => {
    for (const id of Object.keys(cur.courseOf)) {
      const b = bridgeFor(cur, id);
      if (b) {
        expect(b.lessonId).not.toBe(id);
        expect(cur.lessonById[b.lessonId]).toBeTruthy();
        expect(b.minutes).toBeLessThanOrEqual(5);
      }
    }
    expect(bridgeFor(cur, 'c1-chain-rule').lessonId).toBe('a2-composition');
  });
});

// The owner's direction (2026-11-05): "I wanna learn any course and any steps
// I want and after I have finished one course, it should be able to move to
// next level automatically or able to choose manually."
describe('the learner leads', () => {
  const route = cur.pathById[cur.defaultPath].courses.filter((c) => cur.courseLessons[c].length);

  it('finishing course after course, Home always moves on — to the next course, never back, never to practice as the main action', () => {
    route.forEach((c, i) => {
      const lessons = done(route.slice(0, i + 1).flatMap((x) => cur.courseLessons[x]));
      const a = act(S({ lessons }));
      reachable(a);
      if (i === route.length - 1) {
        expect(a.kind, c).toBe(ACTION.FINISHED);
        return;
      }
      expect(a.kind, c).toBe(ACTION.TRANSITION);
      expect(cur.courseOf[a.target.params.lessonId], c).toBe(route[i + 1]);
      expect(a.target.sectionId ?? null, c).toBeNull();
    });
  });

  it('a lesson the learner marked finished counts for moving on, like an answered checkpoint', () => {
    const [first, second] = cur.courseLessons[route[0]];
    const a = act(S({ lessons: { [first]: { opened: T, completed: T, marked: true } } }));
    expect(a.target.params.lessonId).toBe(second);
  });

  it('a lesson skipped in a course never returns as the main action; it is offered', () => {
    const c = route.find((x) => cur.courseLessons[x].length >= 3);
    const [first, ...rest] = cur.courseLessons[c];
    const a = act(S({ lessons: done(rest) }));
    expect(cur.courseOf[a.target.params.lessonId]).not.toBe(c);
    expect(a.alternatives.map((x) => x.target.params?.lessonId)).toContain(first);
  });

  it('an unfinished prerequisite is offered as a bridge, and the next course stays the main action', () => {
    // Every course on the route whose prerequisite is left unfinished when only the course before it is done.
    for (const [i, c] of route.entries()) {
      if (!i) continue;
      const a = act(S({ lessons: done(cur.courseLessons[route[i - 1]]) }), { from: { lessonId: cur.courseLessons[route[i - 1]].at(-1) } });
      if (a.kind === ACTION.FINISHED) continue;
      expect(a.kind, c).toBe(ACTION.TRANSITION);
      expect(cur.courseOf[a.target.params.lessonId], c).toBe(c);
    }
  });

  it('wherever a finished course moves on, the learner can also choose: the courses page is one link away', () => {
    const a = act(S({ lessons: done(cur.courseLessons[route[0]]) }));
    expect(a.kind).toBe(ACTION.TRANSITION);
    expect(pages.has('learn/courses')).toBe(true);
  });
});

describe('resuming a lesson', () => {
  it('never offers the lesson being resumed a second time as “next”', () => {
    const [first, second] = cur.courseLessons[cur.pathById[cur.defaultPath].courses[0]];
    const state = S({ lessons: { ...done([first]), [second]: { opened: T + 10, visited: T + 10 } } });
    const resume = primaryTarget({ pinned: null, current: { courseId: cur.courseOf[second], lessonId: second, sectionId: 'see', fraction: 0, at: T + 20, source: 'auto' }, recent: [] }, { lessonById, lastLesson: second });
    const a = act(state, { resume });
    expect(a.evidence.ruleId).toBe('resume-recent');
    expect(a.alternatives.some((x) => x.target.params?.lessonId === second)).toBe(false);
  });
});
