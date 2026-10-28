import { useMemo } from 'react';
import { courseById, unitById, courseStatus, unitStatus } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { CURRICULUM } from '../../data/curriculum/path.js';
import { PROJECTS } from '../../data/projects/index.js';
import { LABS } from '../labs/registry.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { courseTarget, stepLabel, formatSavedAt, LESSON_STEPS } from '../../lib/studyResume.js';
import { courseJourney } from '../../lib/courseJourney.js';
import { STATUS, recommend, courseNeighbours, courseSuccessor, listText } from '../../lib/learningPath.js';
import { hashFor } from '../../app/pages.js';
import StatusChip from './StatusChip.jsx';
import PathNext from './PathNext.jsx';
import { usePathState } from './usePathState.js';
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
const minutesOf = (courseId) => CURRICULUM.courseLessons[courseId].reduce((m, id) => m + lessonById[id].minutes, 0);

/**
 * Previous course ← this course → next course, on the learner's path. The
 * next one is the next course with written lessons; outline courses between
 * are named, not hidden.
 */
function CourseJourneyLine({ course, pathId }) {
  const n = courseNeighbours(CURRICULUM, pathId, course.id);
  return (
    <nav className="course-journey" aria-label="Where this course is on your learning path">
      <span className="course-journey-end">
        {n.prev
          ? <a href={hashFor('learn/course', { courseId: n.prev })}><span aria-hidden="true">← </span>{courseById[n.prev].title}{n.prevWritten ? '' : ' (planned)'}</a>
          : <span className="studio-muted">Start of the path</span>}
      </span>
      <span className="course-journey-here" aria-current="page">{course.title}</span>
      <span className="course-journey-end">
        {n.next
          ? <a href={hashFor('learn/course', { courseId: n.next })}>{courseById[n.next].title}<span aria-hidden="true"> →</span></a>
          : <span className="studio-muted">End of the written path</span>}
      </span>
      <span className="course-journey-note studio-muted">
        On <a href={hashFor('learn/pathway')}>{n.route.title}</a>
        {n.skipped.length ? `. Between here and the next written course: ${listText(n.skipped.map((c) => courseById[c].title))} (not written yet).` : '.'}
      </span>
    </nav>
  );
}

export default function CoursePage({ courseId }) {
  const course = courseById[courseId];
  const pathState = usePathState();
  const { lessons, status } = pathState;
  const placement = useDiagnosticStore((s) => s.placement);
  const setPlacement = useDiagnosticStore((s) => s.setPlacement);
  const pinned = useStudyResumeStore((s) => s.pinned);
  const current = useStudyResumeStore((s) => s.current);
  const recent = useStudyResumeStore((s) => s.recent);
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  // The one recommendation for this course (src/lib/learningPath.js).
  const rec = useMemo(() => (course ? recommend(CURRICULUM, pathState, { courseId }) : null), [course, pathState, courseId]);

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
  // Their place in THIS course: a saved place elsewhere never takes over here.
  const target = courseTarget({ pinned, current, recent }, course.id, lessonById);
  const journey = courseJourney(course, lessons, status);
  const where = target ? unitById[target.lesson.unit] : null;
  const after = courseSuccessor(CURRICULUM, pathState.pathId, course.id);
  const nextCourse = after.courseId ? courseById[after.courseId] : null;
  const project = PROJECTS.find((p) => p.lessons.some((id) => authored.includes(id)));
  // Said once: when the finish panel already moves on to the same course, its reasons are not repeated below.
  const sameAsFinish = journey.availableFinished && rec.nextCourseId === after.courseId;
  const placementButton = placement?.course !== course.id && (
    <button type="button" className="studio-btn" onClick={() => setPlacement(course.id, 'manual')}>Make this my starting point</button>
  );

  return (
    <div className="studio-scroll">
      <div className="studio-page course-page">
        <CourseJourneyLine course={course} pathId={pathState.pathId} />
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
          {target ? (
            <div className="studio-row">
              <button type="button" className={`studio-btn${journey.availableFinished ? '' : ' studio-btn-primary'}`} onClick={() => requestResume(target.loc)}>
                {target.kind === 'pinned' ? 'Resume saved place' : 'Continue where you were'}
                {target.loc.sectionId ? `: Step ${stepNo(target.loc.sectionId)}` : ''}
              </button>
              {placementButton}
            </div>
          ) : rec.status === STATUS.CONTINUE ? (
            <PathNext rec={rec} compact={rec.warnings.length === 0} extra={placementButton} />
          ) : rec.status === STATUS.UNAVAILABLE ? (
            <div className="studio-callout course-outline-note">
              <p><strong>No lesson of this course is written yet.</strong> Its outline below shows what is planned. Meanwhile:</p>
              <PathNext rec={rec} compact extra={placementButton} />
            </div>
          ) : (
            placementButton && <div className="studio-row">{placementButton}</div>
          )}
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
            <PathNext
              rec={rec}
              extra={(
                <>
                  {project && <a className="studio-btn" href={hashFor('apply/projects')}>Apply what you learned: {project.title}</a>}
                  {!rec.alternatives.some((a) => a.kind === 'review') && <a className="studio-btn" href={hashFor('practice/review')}>Review in Practice</a>}
                  <a className="studio-btn" href={hashFor('learn/courses')}>Browse all courses</a>
                </>
              )}
            />
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

        <section className="studio-section course-after" aria-labelledby="course-after-h">
          <h2 id="course-after-h" className="studio-h2">What comes after this course?</h2>
          {nextCourse ? (
            <div className="studio-card course-after-card">
              <p className="studio-eyebrow">Next on your path</p>
              <h3 className="studio-h3"><a href={hashFor('learn/course', { courseId: nextCourse.id })}>{nextCourse.title}</a></h3>
              <p>{nextCourse.summary}</p>
              {!sameAsFinish && <ul className="path-reasons">{after.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
              <p className="studio-row">
                <StatusChip status={courseStatus(nextCourse)} authored={CURRICULUM.courseLessons[nextCourse.id].length} />
                <span className="studio-chip">{CURRICULUM.courseLessons[nextCourse.id].length} written lessons · about {minutesOf(nextCourse.id)} min</span>
              </p>
              {!sameAsFinish && after.warnings.length > 0 && (
                <ul className="path-warnings" aria-label="Not written yet">
                  {after.warnings.map((w) => <li key={w}><i className="ti ti-alert-triangle" aria-hidden="true" /> {w}</li>)}
                </ul>
              )}
              {after.skipped.length > 0 && (
                <p className="studio-muted">Before it on the path, not written yet: {listText(after.skipped.map((c) => courseById[c].title))}.</p>
              )}
            </div>
          ) : (
            <p className="studio-muted">
              This is the last course with written lessons on <a href={hashFor('learn/pathway')}>your learning path</a>.
              {project ? <> To use what it teaches, try the project <a href={hashFor('apply/projects')}>{project.title}</a>.</> : null}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
