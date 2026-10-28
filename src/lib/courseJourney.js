// A course's journey, from its catalog entry and the learner's records
// (docs/study-continuity/ARCHITECTURE.md, "What completion means"). Three
// signals that are never added up into one percentage:
//   1. where the learner stopped        — src/lib/studyResume.js
//   2. available lessons checked        — a written lesson whose checkpoint
//      was answered (`completed` in fi_lessons_v1); planned titles never count
//   3. skills demonstrated              — the mastery engine's levels for the
//      course's exit skills, from answers only (src/lib/mastery.js)
// plus how much of the course is written at all, which describes the
// content, not the learner.

const SHOWN_AS_DEMONSTRATED = new Set(['proficient', 'mastered']);

/**
 * course:  a catalog course
 * lessons: fi_lessons_v1 `lessons` ({ [id]: { opened, completed, checkpoint, sections } })
 * status:  assessAll(evidence) ({ [competencyId]: { level, ... } })
 */
export function courseJourney(course, lessons, status = {}) {
  const authored = course.units.flatMap((u) => u.lessons);
  const planned = course.units.reduce((n, u) => n + u.planned.length, 0);
  const checked = authored.filter((id) => lessons[id]?.completed);
  const skills = [...new Set(course.units.flatMap((u) => u.exitCompetencies))];
  const assessed = skills.filter((c) => status[c] && status[c].level !== 'not-started');
  const demonstrated = skills.filter((c) => SHOWN_AS_DEMONSTRATED.has(status[c]?.level));
  const units = course.units.map((u) => {
    if (u.lessons.length === 0) return { unit: u, state: 'not-written' };
    const done = u.lessons.filter((id) => lessons[id]?.completed).length;
    const touched = u.lessons.some((id) => lessons[id]?.opened);
    const state = done === u.lessons.length ? 'finished' : done > 0 || touched ? 'in-progress' : 'not-started';
    return { unit: u, state, done, total: u.lessons.length, morePlanned: u.planned.length > 0 };
  });
  return {
    authored,
    checked,
    planned,
    // Every written lesson's checkpoint answered. Says nothing about planned
    // lessons or about mastery: those are reported separately.
    availableFinished: authored.length > 0 && checked.length === authored.length,
    started: authored.some((id) => lessons[id]?.opened),
    skills: { total: skills.length, assessed: assessed.length, demonstrated: demonstrated.length },
    units,
  };
}
