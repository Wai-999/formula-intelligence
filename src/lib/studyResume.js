// Study continuity: where a learner is in a lesson, and where to send them
// back to (docs/study-continuity/ARCHITECTURE.md). Pure functions; the store
// (src/store/useStudyResumeStore.js) owns persistence.
//
// Three kinds of place, kept apart on purpose:
//   pinned   — "Save my place": chosen by the learner, replaced only when
//              they save again or remove it. Automatic saves never touch it.
//   current  — the last place the app saved automatically, in any course.
//   recent   — the last automatic place per course (newest first, capped),
//              so a course page resumes into its own course.
// `lastLesson` in fi_lessons_v1 is older and coarser (which lesson was last
// opened, no step); it is only a fallback for learners with no saved place.
//
// Saved values are untrusted (they come back from storage and from restored
// backups): every one passes `sanitizeLocation` before use, and nothing
// from it is ever turned into a selector or HTML.

/** The six steps of every lesson, in order (docs/v4/LESSON_TEMPLATE.md). */
export const LESSON_STEPS = [
  { id: 'matters', title: 'Why it matters' },
  { id: 'understand', title: 'Understand' },
  { id: 'see', title: 'See it' },
  { id: 'try', title: 'Try it' },
  { id: 'use', title: 'Use it' },
  { id: 'check', title: 'Check understanding' },
];
const STEP_IDS = new Set(LESSON_STEPS.map((s) => s.id));

export const RESUME_VERSION = 1;
export const RECENT_LIMIT = 6;
const MAX_ID = 80;
const ID = /^[a-z0-9][a-z0-9._-]*$/i;
const DAY = 86_400_000;
// No record of this app predates 2024; anything earlier is not a real time.
const EARLIEST = Date.UTC(2024, 0, 1);

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isId = (v) => typeof v === 'string' && v.length > 0 && v.length <= MAX_ID && ID.test(v);

export function emptyRecord() {
  return { schemaVersion: RESUME_VERSION, pinned: null, current: null, recent: [] };
}

/**
 * A validated place, or null. Shape only — whether the lesson still exists is
 * `resolveLocation`'s job, so a removed lesson can be explained, not hidden.
 * `sectionId` null means "this lesson, no particular step".
 */
export function sanitizeLocation(raw, now = Date.now()) {
  if (!isObj(raw) || !isId(raw.courseId) || !isId(raw.lessonId)) return null;
  if (typeof raw.at !== 'number' || !Number.isFinite(raw.at) || raw.at < EARLIEST) return null;
  const sectionId = STEP_IDS.has(raw.sectionId) ? raw.sectionId : null;
  const f = raw.fraction;
  const fraction = sectionId && typeof f === 'number' && Number.isFinite(f) ? Math.round(Math.min(1, Math.max(0, f)) * 100) / 100 : 0;
  return {
    courseId: raw.courseId,
    lessonId: raw.lessonId,
    sectionId,
    fraction,
    // A clock that was ahead when this was saved: keep the place, not the impossible time.
    at: raw.at > now + DAY ? now : raw.at,
    source: raw.source === 'manual' ? 'manual' : 'auto',
  };
}

function upsertRecent(recent, loc) {
  return [loc, ...recent.filter((r) => r.courseId !== loc.courseId)].slice(0, RECENT_LIMIT);
}

/** Merge two `recent` lists: one entry per course, the newer wins, newest first, capped. */
export function mergeRecent(a, b) {
  const byCourse = new Map();
  for (const loc of [...a, ...b]) {
    const prev = byCourse.get(loc.courseId);
    if (!prev || loc.at > prev.at) byCourse.set(loc.courseId, loc);
  }
  return [...byCourse.values()].sort((x, y) => y.at - x.at).slice(0, RECENT_LIMIT);
}

/** A stored record made safe: invalid places dropped, `recent` deduplicated, ordered and capped. */
export function sanitizeRecord(raw, now = Date.now()) {
  if (!isObj(raw)) return emptyRecord();
  const recent = Array.isArray(raw.recent) ? raw.recent.slice(0, 50).map((r) => sanitizeLocation(r, now)).filter(Boolean) : [];
  return {
    schemaVersion: RESUME_VERSION,
    pinned: sanitizeLocation(raw.pinned, now),
    current: sanitizeLocation(raw.current, now),
    recent: mergeRecent(recent, []),
  };
}

/** An automatic save: moves `current` and the course's `recent` entry; the pin is untouched. */
export function withAuto(record, loc) {
  const place = { ...loc, source: 'auto' };
  return { ...record, current: place, recent: upsertRecent(record.recent, place) };
}

/** "Save my place": the pin, and the same place as the latest automatic one. */
export function withPin(record, loc) {
  const place = { ...loc, source: 'manual' };
  return { ...record, pinned: place, current: { ...place, source: 'auto' }, recent: upsertRecent(record.recent, { ...place, source: 'auto' }) };
}

/** "Remove saved place": the pin only. Answers, notes, lessons and reviews live elsewhere and are not touched. */
export function withoutPin(record) {
  return { ...record, pinned: null };
}

const newer = (a, b) => (!a ? b : !b ? a : b.at > a.at ? b : a);

/**
 * What to write, given what is stored now (another tab may have written
 * since this one read) and what this tab wants. An automatic save keeps the
 * STORED pin, so a stale tab can never undo a newer "Save my place" or
 * "Remove saved place"; only an explicit pin or unpin changes it. Automatic
 * places merge by recency.
 */
export function mergeForWrite(stored, mine, kind) {
  return {
    schemaVersion: RESUME_VERSION,
    pinned: kind === 'auto' ? stored.pinned : mine.pinned,
    current: newer(stored.current, mine.current),
    recent: mergeRecent(stored.recent, mine.recent),
  };
}

/**
 * A place checked against the lessons that exist now. A lesson that moved to
 * another course keeps its place under its new course.
 *   { ok: true, loc, lesson }  or  { ok: false, reason: 'missing-lesson', loc }
 */
export function resolveLocation(loc, lessonById) {
  if (!loc) return null;
  const lesson = Object.hasOwn(lessonById, loc.lessonId) ? lessonById[loc.lessonId] : null;
  if (!lesson) return { ok: false, reason: 'missing-lesson', loc };
  return { ok: true, loc: lesson.course === loc.courseId ? loc : { ...loc, courseId: lesson.course }, lesson };
}

/**
 * The one place Home and My Progress send a learner back to:
 *   pinned   their saved place (wins over anything opened since)
 *   missing  their saved place points at a lesson that no longer exists
 *            (`fallback` is the next best target, or null)
 *   recent   the last automatically saved place
 *   opened   the last lesson opened, from before places were saved (no step)
 * or null when there is nothing to resume.
 */
export function primaryTarget(record, { lessonById, lastLesson = null }) {
  const recent = () => {
    const cur = resolveLocation(record.current, lessonById);
    if (cur?.ok) return { kind: 'recent', ...cur };
    if (lastLesson && Object.hasOwn(lessonById, lastLesson)) {
      const lesson = lessonById[lastLesson];
      return { kind: 'opened', ok: true, lesson, loc: { courseId: lesson.course, lessonId: lesson.id, sectionId: null, fraction: 0, at: null, source: 'auto' } };
    }
    return null;
  };
  const pin = resolveLocation(record.pinned, lessonById);
  if (pin?.ok) return { kind: 'pinned', ...pin };
  if (pin) return { kind: 'missing', ...pin, fallback: recent() };
  return recent();
}

/**
 * Where a course page resumes: the learner's saved place if it is in this
 * course, else this course's last automatic place, else null (the page then
 * falls back to its first unfinished lesson). A place saved in another
 * course never takes over this one.
 */
export function courseTarget(record, courseId, lessonById) {
  const pin = resolveLocation(record.pinned, lessonById);
  if (pin?.ok && pin.loc.courseId === courseId) return { kind: 'pinned', ...pin };
  for (const loc of record.recent) {
    const r = resolveLocation(loc, lessonById);
    if (r?.ok && r.loc.courseId === courseId) return { kind: 'recent', ...r };
  }
  return null;
}

/** "Step 3 of 6 — See it", or null for a place with no step. */
export function stepLabel(sectionId) {
  const i = LESSON_STEPS.findIndex((s) => s.id === sectionId);
  return i === -1 ? null : `Step ${i + 1} of ${LESSON_STEPS.length} — ${LESSON_STEPS[i].title}`;
}

/** Two places name the same spot (same lesson and step, fraction within `tolerance`). */
export function samePlace(a, b, tolerance = 0.1) {
  return !!a && !!b && a.lessonId === b.lessonId && a.sectionId === b.sectionId && Math.abs((a.fraction ?? 0) - (b.fraction ?? 0)) < tolerance;
}

/**
 * When a place was saved, in the viewer's locale: "today, 4:12 PM",
 * "yesterday, 8:45 PM", "Mon, Oct 26, 8:45 PM". Null for an unusable time —
 * never "just now" for a time that cannot be read.
 */
export function formatSavedAt(at, now = Date.now()) {
  if (typeof at !== 'number' || !Number.isFinite(at)) return null;
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return null;
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const startOfDay = (t) => new Date(new Date(t).getFullYear(), new Date(t).getMonth(), new Date(t).getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(at)) / DAY);
  if (days === 0) return `today, ${time}`;
  if (days === 1) return `yesterday, ${time}`;
  return `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', ...(new Date(now).getFullYear() !== d.getFullYear() ? { year: 'numeric' } : {}) })}, ${time}`;
}
