import { describe, it, expect } from 'vitest';
import {
  LESSON_STEPS, RECENT_LIMIT, emptyRecord, sanitizeLocation, sanitizeRecord, withAuto, withPin, withoutPin, mergeForWrite,
  resolveLocation, primaryTarget, courseTarget, stepLabel, samePlace, formatSavedAt, mergeRecent,
} from '../studyResume.js';
import { courseJourney, nextAfterCourse } from '../courseJourney.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { COURSES, courseById } from '../../data/curriculum/catalog.js';

const NOW = Date.UTC(2026, 9, 27, 16, 12);
const at = (minutesAgo) => NOW - minutesAgo * 60_000;
const place = (lessonId, sectionId, minutesAgo = 0, extra = {}) => ({
  courseId: lessonById[lessonId]?.course ?? 'algebra-1', lessonId, sectionId, fraction: 0, at: at(minutesAgo), source: 'auto', ...extra,
});

describe('saved places are validated, never trusted', () => {
  it('keeps a well-formed place, rounding the position within the step', () => {
    expect(sanitizeLocation(place('a1-slope', 'try', 5, { fraction: 0.4567 }), NOW)).toEqual({
      courseId: 'algebra-1', lessonId: 'a1-slope', sectionId: 'try', fraction: 0.46, at: at(5), source: 'auto',
    });
  });

  it('degrades an unknown step to "this lesson, no step", rather than inventing one', () => {
    const p = sanitizeLocation(place('a1-slope', 'chapter-9'), NOW);
    expect(p.sectionId).toBeNull();
    expect(p.fraction).toBe(0);
  });

  it('treats a non-finite or out-of-range position as the start of the step', () => {
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { fraction: Number.NaN }), NOW).fraction).toBe(0);
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { fraction: 7 }), NOW).fraction).toBe(1);
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { fraction: -3 }), NOW).fraction).toBe(0);
  });

  it('rejects impossible times, and keeps a place saved by a clock that ran ahead (at "now")', () => {
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { at: 12 }), NOW)).toBeNull();
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { at: Number.POSITIVE_INFINITY }), NOW)).toBeNull();
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { at: NOW + 3 * 86_400_000 }), NOW).at).toBe(NOW);
    expect(sanitizeLocation(place('a1-slope', 'see', 0, { at: NOW + 3_600_000 }), NOW).at).toBe(NOW + 3_600_000);
  });

  it('rejects ids that are too long or are not plain ids (nothing stored becomes a selector)', () => {
    expect(sanitizeLocation(place('x'.repeat(81), 'see'), NOW)).toBeNull();
    expect(sanitizeLocation({ ...place('a1-slope', 'see'), lessonId: '#lesson"] img' }, NOW)).toBeNull();
    expect(sanitizeLocation({ ...place('a1-slope', 'see'), courseId: 42 }, NOW)).toBeNull();
    expect(sanitizeLocation('a1-slope', NOW)).toBeNull();
  });

  it('cleans a whole record: unknown keys dropped, recent one per course, newest first, capped', () => {
    const recent = COURSES.slice(0, 10).map((c, i) => ({ courseId: c.id, lessonId: 'any-lesson', sectionId: 'see', at: at(i), fraction: 0 }));
    recent.push({ courseId: COURSES[0].id, lessonId: 'older', sectionId: 'try', at: at(100) });
    recent.push({ junk: true });
    const r = sanitizeRecord({ schemaVersion: 1, pinned: 'nope', current: place('a1-slope', 'see'), recent, extra: { evil: 1 } }, NOW);
    expect(Object.keys(r).sort()).toEqual(['current', 'pinned', 'recent', 'schemaVersion']);
    expect(r.pinned).toBeNull();
    expect(r.recent).toHaveLength(RECENT_LIMIT);
    expect(new Set(r.recent.map((x) => x.courseId)).size).toBe(RECENT_LIMIT);
    expect(r.recent.map((x) => x.at)).toEqual([...r.recent.map((x) => x.at)].sort((a, b) => b - a));
    expect(r.recent[0].lessonId).toBe('any-lesson'); // the newer entry for COURSES[0] won
    expect(sanitizeRecord(null)).toEqual(emptyRecord());
    expect(sanitizeRecord({ recent: 'x' }).recent).toEqual([]);
  });
});

describe('a saved place outranks browsing', () => {
  const pinned = place('a1-slope', 'use', 60, { source: 'manual' });

  it('an automatic save moves "current" and the course entry, never the pin', () => {
    const r = withAuto(withPin(emptyRecord(), pinned), place('la-dot-product', 'understand', 1));
    expect(r.pinned.lessonId).toBe('a1-slope');
    expect(r.pinned.sectionId).toBe('use');
    expect(r.current.lessonId).toBe('la-dot-product');
    expect(r.recent.map((x) => x.courseId)).toEqual(['linear-algebra', 'algebra-1']);
  });

  it('Home resumes the saved place even when another lesson was opened since', () => {
    const r = withAuto(withPin(emptyRecord(), pinned), place('la-dot-product', 'understand', 1));
    const t = primaryTarget(r, { lessonById, lastLesson: 'la-dot-product' });
    expect(t.kind).toBe('pinned');
    expect(t.loc.lessonId).toBe('a1-slope');
    expect(t.loc.sectionId).toBe('use');
  });

  it('without a saved place, the latest automatic place; without that, the last opened lesson with no step claimed', () => {
    expect(primaryTarget(withAuto(emptyRecord(), place('c1-derivative', 'see')), { lessonById }).kind).toBe('recent');
    const opened = primaryTarget(emptyRecord(), { lessonById, lastLesson: 'c1-derivative' });
    expect(opened.kind).toBe('opened');
    expect(opened.loc.sectionId).toBeNull();
    expect(primaryTarget(emptyRecord(), { lessonById, lastLesson: 'gone' })).toBeNull();
    expect(primaryTarget(emptyRecord(), { lessonById })).toBeNull();
  });

  it('a saved place whose lesson no longer exists is explained, with the next best place as a fallback', () => {
    const r = withAuto(withPin(emptyRecord(), { ...pinned, lessonId: 'a1-removed' }), place('c1-derivative', 'try'));
    const t = primaryTarget(r, { lessonById });
    expect(t.kind).toBe('missing');
    expect(t.ok).toBe(false);
    expect(t.loc.lessonId).toBe('a1-removed');
    expect(t.fallback.loc.lessonId).toBe('c1-derivative');
  });

  it('a lesson that moved to another course keeps its place under its new course', () => {
    const r = resolveLocation({ ...place('a1-slope', 'see'), courseId: 'prealgebra' }, lessonById);
    expect(r.ok).toBe(true);
    expect(r.loc.courseId).toBe('algebra-1');
  });

  it('removing the saved place removes only the pin', () => {
    const r = withoutPin(withPin(emptyRecord(), pinned));
    expect(r.pinned).toBeNull();
    expect(r.current.lessonId).toBe('a1-slope');
    expect(r.recent).toHaveLength(1);
  });
});

describe('each course resumes into itself', () => {
  const r = withAuto(withAuto(emptyRecord(), place('a1-slope', 'see', 30)), place('la-dot-product', 'try', 2));

  it('uses the course’s own last place, not the newest place in another course', () => {
    expect(courseTarget(r, 'algebra-1', lessonById).loc.lessonId).toBe('a1-slope');
    expect(courseTarget(r, 'linear-algebra', lessonById).loc.lessonId).toBe('la-dot-product');
    expect(courseTarget(r, 'calculus-1', lessonById)).toBeNull();
  });

  it('a saved place in this course wins over a later automatic one here; one in another course is ignored', () => {
    const pinnedHere = withAuto(withPin(r, place('a1-break-even', 'use', 20, { source: 'manual' })), place('a1-slope', 'try', 1));
    expect(courseTarget(pinnedHere, 'algebra-1', lessonById)).toMatchObject({ kind: 'pinned', loc: { lessonId: 'a1-break-even', sectionId: 'use' } });
    expect(courseTarget(pinnedHere, 'linear-algebra', lessonById).loc.lessonId).toBe('la-dot-product');
  });
});

describe('two tabs of the app', () => {
  const stored = withPin(emptyRecord(), place('c1-derivative', 'check', 1, { source: 'manual' }));
  const staleTab = withAuto(emptyRecord(), place('a1-slope', 'see', 0)); // loaded before the pin existed

  it('an automatic save from a stale tab keeps the newer pin made elsewhere', () => {
    const out = mergeForWrite(stored, staleTab, 'auto');
    expect(out.pinned.lessonId).toBe('c1-derivative');
    expect(out.current.lessonId).toBe('a1-slope'); // the newer automatic place wins
  });

  it('nor can it bring back a pin that was removed elsewhere', () => {
    const removedElsewhere = withoutPin(stored);
    const tabThatStillHasIt = withAuto(stored, place('a1-slope', 'see', 0));
    expect(mergeForWrite(removedElsewhere, tabThatStillHasIt, 'auto').pinned).toBeNull();
  });

  it('an explicit save or removal is what changes the pin', () => {
    expect(mergeForWrite(stored, withPin(staleTab, place('a1-slope', 'try', 0)), 'pin').pinned.lessonId).toBe('a1-slope');
    expect(mergeForWrite(stored, withoutPin(stored), 'unpin').pinned).toBeNull();
  });

  it('recent places merge by course, newer first', () => {
    const merged = mergeRecent([place('a1-slope', 'see', 10)], [place('a1-break-even', 'try', 5), place('la-dot-product', 'see', 1)]);
    expect(merged.map((x) => x.lessonId)).toEqual(['la-dot-product', 'a1-break-even']);
  });
});

describe('labels', () => {
  it('names steps the way the lesson does', () => {
    expect(LESSON_STEPS.map((s) => s.id)).toEqual(['matters', 'understand', 'see', 'try', 'use', 'check']);
    expect(stepLabel('see')).toBe('Step 3 of 6 — See it');
    expect(stepLabel(null)).toBeNull();
  });

  it('says today/yesterday in the viewer’s locale, and nothing for an unreadable time', () => {
    const local = new Date(2026, 9, 27, 16, 12).getTime();
    expect(formatSavedAt(local - 60_000, local)).toMatch(/^today, /);
    expect(formatSavedAt(local - 86_400_000, local)).toMatch(/^yesterday, /);
    expect(formatSavedAt(local - 5 * 86_400_000, local)).not.toMatch(/today|yesterday/);
    expect(formatSavedAt(Number.NaN, local)).toBeNull();
    expect(formatSavedAt('4pm', local)).toBeNull();
  });

  it('treats small moves within a step as the same place', () => {
    expect(samePlace(place('a1-slope', 'see', 0, { fraction: 0.3 }), place('a1-slope', 'see', 0, { fraction: 0.35 }))).toBe(true);
    expect(samePlace(place('a1-slope', 'see', 0, { fraction: 0.3 }), place('a1-slope', 'see', 0, { fraction: 0.6 }))).toBe(false);
    expect(samePlace(place('a1-slope', 'see'), place('a1-slope', 'try'))).toBe(false);
  });
});

describe('what a course’s progress means', () => {
  const algebra = courseById['algebra-1'];
  const authored = algebra.units.flatMap((u) => u.lessons);

  it('counts only written lessons whose checkpoint was answered — opening or saving a place is not completion', () => {
    const j = courseJourney(algebra, { [authored[0]]: { opened: 1, completed: 2, checkpoint: { correct: 2, total: 3 } }, [authored[1]]: { opened: 1 } }, {});
    expect(j.checked).toEqual([authored[0]]);
    expect(j.authored).toEqual(authored);
    expect(j.availableFinished).toBe(false);
    expect(j.planned).toBeGreaterThan(0);
  });

  it('“available lessons finished” when every written checkpoint is answered — planned titles never count either way', () => {
    const all = Object.fromEntries(authored.map((id) => [id, { opened: 1, completed: 2 }]));
    const j = courseJourney(algebra, all, {});
    expect(j.availableFinished).toBe(true);
    expect(j.planned).toBeGreaterThan(0); // the course itself is still not complete
    expect(j.units.find((u) => u.unit.lessons.length === 0)?.state ?? 'not-written').toBe('not-written');
  });

  it('a course with no written lessons is never finished', () => {
    const outline = COURSES.find((c) => c.units.every((u) => u.lessons.length === 0));
    expect(courseJourney(outline, {}, {}).availableFinished).toBe(false);
  });

  it('skills count as demonstrated only at proficient or mastered, from the mastery engine', () => {
    const skills = [...new Set(algebra.units.flatMap((u) => u.exitCompetencies))];
    const status = { [skills[0]]: { level: 'mastered' }, [skills[1]]: { level: 'learning' } };
    const j = courseJourney(algebra, {}, status);
    expect(j.skills).toEqual({ total: skills.length, assessed: 2, demonstrated: 1 });
  });

  it('suggests the next written lesson of a course that builds on this one, skipping outlines', () => {
    const next = nextAfterCourse(algebra, COURSES, {});
    expect(next).not.toBeNull();
    expect(next.course.prerequisites).toContain('algebra-1');
    expect(lessonById[next.lessonId].course).toBe(next.course.id);
  });
});
