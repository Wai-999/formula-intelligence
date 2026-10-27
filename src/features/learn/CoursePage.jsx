import { useMemo } from 'react';
import { COURSES, courseById, unitById, courseStatus, unitStatus } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { LABS } from '../labs/registry.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { assessAll } from '../../lib/mastery.js';
import { courseTarget, stepLabel, formatSavedAt, LESSON_STEPS } from '../../lib/studyResume.js';
import { courseJourney, nextAfterCourse } from '../../lib/courseJourney.js';
import { hashFor } from '../../app/pages.js';
import StatusChip from './StatusChip.jsx';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';

const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

const UNIT_STATE = {
  finished: { label: 'Available lessons finished', chip: 'studio-chip-ok' },
  'in-progress': { label: 'In progress', chip: 'studio-chip-accent' },
  'not-started': { label: 'Not started', chip: '' },
};

const stepNo = (sectionId) => LESSON_STEPS.findIndex((s) => s.id === sectionId) + 1;

export default function CoursePage({ courseId }) {
  const course = courseById[courseId];
  const lessons = useLearningStore((s) => s.lessons);
  const evidence = useLearningStore((s) => s.evidence);
  const placement = useDiagnosticStore((s) => s.placement);
  const setPlacement = useDiagnosticStore((s) => s.setPlacement);
  const pinned = useStudyResumeStore((s) => s.pinned);
  const current = useStudyResumeStore((s) => s.current);
  const recent = useStudyResumeStore((s) => s.recent);
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  const status = useMemo(() => assessAll(evidence), [evidence]);

  if (!course) {
    return (
      <div className="studio-scroll"><div className="studio-page studio-read">
        <p className="studio-lede">There is no course called “{courseId}”.</p>
        <p><a className="studio-btn" href={hashFor('learn/courses')}>Browse courses</a></p>
      </div></div>
    );
  }

  const authored = course.units.flatMap((u) => u.lessons);
  const done = authored.filter((id) => lessons[id]?.completed).length;
  // The fallback when the learner has no place in this course yet.
  const firstOpen = authored.find((id) => !lessons[id]?.completed) ?? authored[0];
  // Their place in THIS course: a saved place elsewhere never takes over here.
  const target = courseTarget({ pinned, current, recent }, course.id, lessonById);
  const journey = courseJourney(course, lessons, status);
  const next = journey.availableFinished ? nextAfterCourse(course, COURSES, lessons) : null;
  const where = target ? unitById[target.lesson.unit] : null;

  return (
    <div className="studio-scroll">
      <div className="studio-page course-page">
        <div className="studio-section">
          <p className="studio-lede">{course.summary}</p>
          <div className="studio-row">
            <StatusChip status={courseStatus(course)} authored={authored.length} />
            <span className="studio-chip">{course.units.length} units</span>
            <span className="studio-chip">about {course.estimatedHours} hours when complete</span>
          </div>
          {course.prerequisites.length > 0 && (
            <p className="studio-muted">
              Comes after: {course.prerequisites.map((p, i) => (
                <span key={p}>{i > 0 && ', '}<a href={hashFor('learn/course', { courseId: p })}>{courseById[p].title}</a></span>
              ))}. Not sure you are ready? <a href={hashFor('learn/placement')}>Take the placement check</a> — or start here anyway; nothing is locked.
            </p>
          )}
          {target && (
            <p className="course-where">
              <span className="studio-muted">{target.kind === 'pinned' ? 'Your saved place' : 'Where you were'}:</span>{' '}
              {where?.title} → {target.lesson.title} → {stepLabel(target.loc.sectionId) ?? 'start of the lesson'}
              {formatSavedAt(target.loc.at) ? <span className="studio-muted"> ({formatSavedAt(target.loc.at)})</span> : null}
            </p>
          )}
          <div className="studio-row">
            {target ? (
              <button type="button" className={`studio-btn${journey.availableFinished ? '' : ' studio-btn-primary'}`} onClick={() => requestResume(target.loc)}>
                {target.kind === 'pinned' ? 'Resume saved place' : 'Continue where you were'}
                {target.loc.sectionId ? `: Step ${stepNo(target.loc.sectionId)}` : ''}
              </button>
            ) : firstOpen && (
              <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: firstOpen })}>
                {done === 0 ? 'Start' : 'Continue'}: {lessonById[firstOpen].title}
              </a>
            )}
            {placement?.course !== course.id && (
              <button type="button" className="studio-btn" onClick={() => setPlacement(course.id, 'manual')}>Make this my starting point</button>
            )}
          </div>
          <dl className="course-signals" aria-label="Your progress in this course">
            <div>
              <dt>Written lessons</dt>
              <dd>{authored.length ? `${done} of ${authored.length} checked (checkpoint answered)` : 'No written lessons available yet'}</dd>
            </div>
            <div>
              <dt>Course content</dt>
              <dd>
                {courseStatus(course) === 'authored' ? `Complete — ${authored.length} written lessons`
                  : courseStatus(course) === 'partial' ? `Partly written — ${authored.length} written, ${journey.planned} planned`
                    : `Outline only — ${journey.planned} planned lessons, none written yet`}
              </dd>
            </div>
            <div>
              <dt>Skills shown in your answers</dt>
              <dd>{journey.skills.assessed ? `${journey.skills.demonstrated} of ${journey.skills.total} exit skills proficient or mastered` : 'Not assessed yet'}</dd>
            </div>
          </dl>
        </div>

        {journey.availableFinished && (
          <section className="studio-callout studio-callout-ok course-finish" aria-labelledby="course-finish-h">
            <h2 id="course-finish-h" className="studio-h3">You finished the available lessons in this course</h2>
            <p>
              All {authored.length} written lesson{authored.length === 1 ? '' : 's'} have their checkpoint answered.{' '}
              {journey.planned > 0
                ? `More lessons are planned (${journey.planned}, listed below as “Not written yet”); the full course is not yet complete.`
                : 'Every planned lesson of this course is written.'}{' '}
              {journey.skills.assessed === 0
                ? 'None of its exit skills has been assessed from your answers yet.'
                : journey.skills.demonstrated < journey.skills.total
                  ? `Your answers show ${journey.skills.demonstrated} of its ${journey.skills.total} exit skills at proficient or better; reviews over the coming weeks are what build the rest.`
                  : 'Your answers show every exit skill at proficient or better.'}
            </p>
            <p className="studio-muted">
              There is no course-wide challenge yet. Mixed review across your lessons is in Practice. This is a self-study app: progress here is not a grade, transcript or credential.
            </p>
            <div className="studio-row">
              <a className="studio-btn" href={hashFor('practice/review')}>Review in Practice</a>
              {next && <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: next.lessonId })}>Next: {next.course.title} — {lessonById[next.lessonId].title}</a>}
              <a className="studio-btn" href={hashFor('learn/courses')}>Choose another course</a>
            </div>
          </section>
        )}

        {course.units.map((u, ui) => {
          const status = unitStatus(u);
          const state = UNIT_STATE[journey.units[ui].state];
          return (
            <section key={u.id} className="course-unit" aria-labelledby={`unit-${u.id}`}>
              <div className="course-unit-head">
                <h2 id={`unit-${u.id}`} className="studio-h2">Unit {ui + 1}. {u.title}</h2>
                <span className="studio-row">
                  <span className={`studio-chip ${status === 'authored' ? 'studio-chip-ok' : status === 'partial' ? 'studio-chip-accent' : ''}`}>
                    {status === 'authored' ? 'Written' : status === 'partial' ? 'Partly written' : 'Outline'}
                  </span>
                  {state && <span className={`studio-chip ${state.chip}`}>{state.label}</span>}
                </span>
              </div>
              <div className="lesson-two">
                <div>
                  <h3 className="studio-h3">You will be able to</h3>
                  <ul className="lesson-ul">{u.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
                </div>
                <div>
                  <h3 className="studio-h3">Exit skills</h3>
                  <ul className="lesson-ul">{u.exitCompetencies.map((c) => <li key={c}>{competencyById[c]?.title ?? c}</li>)}</ul>
                  {u.prerequisites.length > 0 && (
                    <>
                      <h3 className="studio-h3" style={{ marginTop: 10 }}>Builds on</h3>
                      <p className="studio-muted">
                        {u.prerequisites.map((p, i) => (
                          <span key={p}>{i > 0 && ', '}<a href={hashFor('learn/concepts', { conceptId: p })}>{conceptById[p]?.title ?? p}</a></span>
                        ))}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <ol className="course-lessons" aria-label={`Lessons in ${u.title}`}>
                {u.lessons.map((id) => {
                  const l = lessonById[id];
                  const rec = lessons[id];
                  if (!l) return null;
                  return (
                    <li key={id} className="course-lesson">
                      <a href={hashFor('learn/lesson', { lessonId: id })}>{l.title}</a>
                      <span className="studio-row">
                        <span className="studio-chip">{l.minutes} min</span>
                        {target?.loc.lessonId === id && target.loc.sectionId && (
                          <span className="studio-chip studio-chip-accent">
                            {target.kind === 'pinned' ? 'Saved' : 'You stopped'} at Step {stepNo(target.loc.sectionId)}: {LESSON_STEPS[stepNo(target.loc.sectionId) - 1].title}
                          </span>
                        )}
                        {rec?.completed
                          ? <span className="studio-chip studio-chip-ok"><i className="ti ti-check" aria-hidden="true" /> Checkpoint {rec.checkpoint.correct}/{rec.checkpoint.total}</span>
                          : rec?.opened ? (target?.loc.lessonId === id ? null : <span className="studio-chip studio-chip-accent">In progress</span>) : <span className="studio-chip">Not started</span>}
                      </span>
                    </li>
                  );
                })}
                {u.planned.map((t) => (
                  <li key={t} className="course-lesson planned">
                    <span>{t}</span>
                    <span className="studio-chip">Not written yet</span>
                  </li>
                ))}
              </ol>
              {u.labs?.length > 0 && (
                <p className="studio-muted">Visual labs: {u.labs.map((id) => LABS[id]?.title).filter(Boolean).join(', ')}.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
