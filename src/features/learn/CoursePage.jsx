import { courseById, courseStatus, unitStatus } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { LABS } from '../labs/registry.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { hashFor } from '../../app/pages.js';
import StatusChip from './StatusChip.jsx';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';

const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

export default function CoursePage({ courseId }) {
  const course = courseById[courseId];
  const lessons = useLearningStore((s) => s.lessons);
  const placement = useDiagnosticStore((s) => s.placement);
  const setPlacement = useDiagnosticStore((s) => s.setPlacement);

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
  const firstOpen = authored.find((id) => !lessons[id]?.completed) ?? authored[0];

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
              ))}. Not sure you are ready? <a href={hashFor('progress/diagnostic')}>Take the diagnostic</a> — or start here anyway; nothing is locked.
            </p>
          )}
          <div className="studio-row">
            {firstOpen && (
              <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: firstOpen })}>
                {done === 0 ? 'Start' : 'Continue'}: {lessonById[firstOpen].title}
              </a>
            )}
            {placement?.course !== course.id && (
              <button type="button" className="studio-btn" onClick={() => setPlacement(course.id, 'manual')}>Make this my starting point</button>
            )}
            {authored.length > 0 && <span className="studio-muted">{done} of {authored.length} written lessons completed</span>}
          </div>
        </div>

        {course.units.map((u, ui) => {
          const status = unitStatus(u);
          return (
            <section key={u.id} className="course-unit" aria-labelledby={`unit-${u.id}`}>
              <div className="course-unit-head">
                <h2 id={`unit-${u.id}`} className="studio-h2">Unit {ui + 1}. {u.title}</h2>
                <span className={`studio-chip ${status === 'authored' ? 'studio-chip-ok' : status === 'partial' ? 'studio-chip-accent' : ''}`}>
                  {status === 'authored' ? 'Written' : status === 'partial' ? 'Partly written' : 'Outline'}
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
                          <span key={p}>{i > 0 && ', '}<a href={hashFor('maps/concepts', { conceptId: p })}>{conceptById[p]?.title ?? p}</a></span>
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
                        {rec?.completed
                          ? <span className="studio-chip studio-chip-ok"><i className="ti ti-check" aria-hidden="true" /> Checkpoint {rec.checkpoint.correct}/{rec.checkpoint.total}</span>
                          : rec?.opened ? <span className="studio-chip studio-chip-accent">In progress</span> : null}
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
