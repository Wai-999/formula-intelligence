import { useMemo } from 'react';
import { courseById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CURRICULUM } from '../../data/curriculum/path.js';
import { CSU_PREP, DEFAULT_PATH } from '../../data/curriculum/pathways.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { recommend, routeProgress, trackProgress, pathFor, nextMilestone } from '../../lib/learningPath.js';
import { hashFor } from '../../app/pages.js';
import PathNext from './PathNext.jsx';
import { usePathState } from './usePathState.js';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';

// Learn → Courses → Your learning path: the whole route with where the
// learner is on it, the optional applied tracks, and an informational CSU
// preparation view. Every "next" here is the learning-path engine's answer
// (src/lib/learningPath.js); docs/LEARNING_PATH_MAP.md is the same data.

const COURSE_STATE = {
  'finished-available': { label: 'Written lessons finished', chip: 'studio-chip-ok' },
  'in-progress': { label: 'In progress', chip: 'studio-chip-accent' },
  'not-started': { label: 'Not started', chip: '' },
  planned: { label: 'Planned — not written yet', chip: 'studio-chip-warn' },
};

function TrackCard({ track, state, following, choose }) {
  const t = trackProgress(CURRICULUM, state, track.id);
  const planned = t.steps.filter((s) => s.planned).length;
  return (
    <article className="studio-card pathway-track" aria-labelledby={`track-${track.id}`}>
      <h3 id={`track-${track.id}`} className="studio-h3">{track.title}</h3>
      <p className="studio-muted">{track.summary}</p>
      <p className="studio-row">
        <span className="studio-chip">{t.checked} of {t.written} written lessons checked</span>
        {planned > 0 && <span className="studio-chip studio-chip-warn">{planned} planned topic{planned === 1 ? '' : 's'}, not written yet</span>}
        {following && <span className="studio-chip studio-chip-accent">You are following this track</span>}
      </p>
      <details className="pathway-steps">
        <summary>See its {t.steps.length} steps</summary>
        <ol>
          {t.steps.map((s) => (
            <li key={s.lesson ?? s.planned} className={s.lesson ? (s.done ? 'step-done' : '') : 'step-planned'}>
              {s.lesson
                ? <><a href={hashFor('learn/lesson', { lessonId: s.lesson })}>{lessonById[s.lesson].title}</a>{s.done ? ' — checked' : ''}</>
                : <><span>{s.planned}</span> <span className="studio-muted">(planned in {courseById[s.course].title}, not written yet)</span></>}
              <span className="studio-muted"> {s.why}</span>
            </li>
          ))}
        </ol>
        <p className="studio-muted">
          {t.project
            ? <>Final project: <a href={hashFor('apply/projects')}>{t.project.title}</a> (Apply → Projects).</>
            : <>Final project: none yet. {track.projectNote}</>}
        </p>
      </details>
      <div className="studio-row">
        {following
          ? <button type="button" className="studio-btn" onClick={() => choose(null)}>Stop following; back to the main path</button>
          : <button type="button" className="studio-btn" onClick={() => choose(track.id)}>Follow this track</button>}
      </div>
    </article>
  );
}

export default function PathwayPage() {
  const state = usePathState();
  const choosePath = useDiagnosticStore((s) => s.choosePath);
  const path = pathFor(CURRICULUM, state.pathId);
  const rec = useMemo(() => recommend(CURRICULUM, state), [state]);
  const route = routeProgress(CURRICULUM, state, DEFAULT_PATH);
  const tracks = CURRICULUM.paths.filter((p) => p.kind === 'track');
  const here = rec.currentCourseId;
  const milestone = nextMilestone(CURRICULUM, state, rec);

  return (
    <div className="studio-scroll">
      <div className="studio-page pathway-page">
        <p className="studio-lede">
          Self-study paths through the lessons that are written so far. They are not degree, transfer or certification
          requirements. Nothing is locked: open any course, and change path at any time.
        </p>

        <section className="studio-section" aria-labelledby="pw-next">
          <h2 id="pw-next" className="studio-h2">Your next step</h2>
          <p>Following: <strong>{path.title}</strong>{milestone ? <span className="studio-muted"> · {milestone}</span> : null}</p>
          <PathNext rec={rec} />
        </section>

        <section className="studio-section" aria-labelledby="pw-route">
          <h2 id="pw-route" className="studio-h2">The main path: {route.route.title}</h2>
          <p className="studio-muted">{route.route.summary} {route.checked} of {route.written} written lessons checked.</p>
          {path.kind === 'track' && (
            <p><button type="button" className="studio-btn" onClick={() => choosePath(null)}>Follow the main path instead</button></p>
          )}
          <ol className="pathway-courses" aria-label="Courses in order">
            {route.courses.map((c) => {
              const course = courseById[c.courseId];
              const st = COURSE_STATE[c.status];
              return (
                <li key={c.courseId} className={`pathway-course${c.courseId === here ? ' here' : ''}`} aria-current={c.courseId === here ? 'step' : undefined}>
                  <div className="pathway-course-head">
                    <a href={hashFor('learn/course', { courseId: c.courseId })} className="studio-h3">{course.title}</a>
                    {c.courseId === here && <span className="studio-chip studio-chip-accent">You are here</span>}
                  </div>
                  <p className="studio-row">
                    <span className={`studio-chip ${st.chip}`}>{st.label}</span>
                    {c.written > 0
                      ? <span className="studio-chip">{c.checked} of {c.written} written lessons checked · {c.planned} planned</span>
                      : <span className="studio-chip">{c.planned} planned lessons, none written</span>}
                  </p>
                  {course.prerequisites.length > 0 && (
                    <p className="studio-muted">Builds on {course.prerequisites.map((p) => courseById[p].title).join(', ')}.</p>
                  )}
                  {c.parallel && <p className="studio-muted">{c.parallel}</p>}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="studio-section" aria-labelledby="pw-tracks">
          <h2 id="pw-tracks" className="studio-h2">Applied tracks (optional)</h2>
          <p className="studio-muted">
            Shorter routes through written lessons from several courses, aimed at one kind of problem, each ending in a project.
            Following one changes what Home and the end of each track lesson recommend; it changes nothing else, and you can stop at any time.
          </p>
          <div className="pathway-tracks">
            {tracks.map((t) => (
              <TrackCard key={t.id} track={t} state={state} following={state.pathId === t.id} choose={choosePath} />
            ))}
          </div>
        </section>

        <section className="studio-section" aria-labelledby="pw-csu">
          <h2 id="pw-csu" className="studio-h2">{CSU_PREP.title}</h2>
          <p className="studio-callout studio-callout-warn">{CSU_PREP.disclaimer}</p>
          <ul className="pathway-csu">
            {CSU_PREP.areas.map((a) => {
              const written = a.courses.reduce((n, c) => n + CURRICULUM.courseLessons[c].length, 0);
              return (
                <li key={a.id}>
                  <strong>{a.title}</strong>
                  {a.courses.length > 0 && (
                    <>: {a.courses.map((c, i) => <span key={c}>{i > 0 && ', '}<a href={hashFor('learn/course', { courseId: c })}>{courseById[c].title}</a></span>)} · {written} written lesson{written === 1 ? '' : 's'} so far</>
                  )}
                  {a.note && <span className="studio-muted"> — {a.note}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
