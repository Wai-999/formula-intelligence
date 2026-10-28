import { useMemo } from 'react';
import { SUBJECTS, COURSES, courseStatus } from '../../data/curriculum/catalog.js';
import { CURRICULUM } from '../../data/curriculum/path.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { recommend, pathFor, nextMilestone } from '../../lib/learningPath.js';
import { hashFor } from '../../app/pages.js';
import StatusChip from './StatusChip.jsx';
import PathNext from './PathNext.jsx';
import { usePathState } from './usePathState.js';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';


const authoredCount = (c) => c.units.reduce((n, u) => n + u.lessons.length, 0);

export default function CoursesPage() {
  const lessons = useLearningStore((s) => s.lessons);
  const placement = useDiagnosticStore((s) => s.placement);
  const pathState = usePathState();
  const rec = useMemo(() => recommend(CURRICULUM, pathState), [pathState]);
  const path = pathFor(CURRICULUM, pathState.pathId);
  const milestone = nextMilestone(CURRICULUM, pathState, rec);

  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <section className="studio-card courses-path" aria-labelledby="courses-path-h">
          <p className="studio-eyebrow">Your learning path</p>
          <h2 id="courses-path-h" className="studio-h3"><a href={hashFor('learn/pathway')}>{path.title}</a></h2>
          {milestone && <p className="studio-muted">{milestone}.</p>}
          <PathNext rec={rec} compact extra={<a className="studio-btn" href={hashFor('learn/pathway')}>See the whole path and applied tracks</a>} />
        </section>
        <p className="studio-lede">
          Nine subjects, from prealgebra to machine learning. Courses with written lessons are marked; the others show
          their full outline — objectives, units and prerequisites — so you can see where they lead before they are filled in.
        </p>
        {placement?.course && (
          <p className="studio-callout">
            Your current starting point is <a href={hashFor('learn/course', { courseId: placement.course })}><strong>{COURSES.find((c) => c.id === placement.course)?.title}</strong></a>
            {placement.source === 'diagnostic' ? ' (from your placement check — provisional, change it any time under Learn → Placement).' : ' (your choice).'}
          </p>
        )}
        {SUBJECTS.map((s) => {
          const courses = COURSES.filter((c) => c.subject === s.id);
          return (
            <section key={s.id} className="studio-section" aria-labelledby={`subj-${s.id}`}>
              <div>
                <h2 id={`subj-${s.id}`} className="studio-h2">{s.title}</h2>
                <p className="studio-muted">{s.summary}</p>
              </div>
              {courses.length === 0 && s.id === 'projects' && (
                <a className="studio-card studio-card-link" href={hashFor('apply/projects')}>
                  <span className="studio-h3">Applied projects</span>
                  <span className="studio-muted">Guided, end-to-end analyses live under Projects.</span>
                </a>
              )}
              <div className="studio-grid">
                {courses.map((c) => {
                  const done = c.units.flatMap((u) => u.lessons).filter((id) => lessons[id]?.completed).length;
                  const total = authoredCount(c);
                  return (
                    <a key={c.id} className="studio-card studio-card-link" href={hashFor('learn/course', { courseId: c.id })}>
                      <span className="studio-h3">{c.title}</span>
                      <span className="studio-muted">{c.summary}</span>
                      <span className="studio-row">
                        <StatusChip status={courseStatus(c)} authored={total} />
                        <span className="studio-chip">{c.units.length} units · ~{c.estimatedHours} h</span>
                        {placement?.course === c.id && <span className="studio-chip studio-chip-accent">Your starting point</span>}
                      </span>
                      {total > 0 && (
                        <span className="studio-muted">{done} of {total} written lessons completed</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
