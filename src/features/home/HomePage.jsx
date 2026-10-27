import { useMemo } from 'react';
import { COURSES, courseById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { PROJECTS } from '../../data/projects/index.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { dueCards } from '../../lib/reviewSchedule.js';
import { assessAll } from '../../lib/mastery.js';
import { primaryTarget, stepLabel, formatSavedAt } from '../../lib/studyResume.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import './home.css';

// Home (V4 §3): resume learning with ONE clear next action, and a small
// progress summary — nothing to manage here. Reviews live in Practice, gaps
// and notes in My Progress. Deliberately absent: streaks, feeds, badges,
// auto-playing motion.

const lessonsInOrder = COURSES.flatMap((c) => c.units.flatMap((u) => u.lessons));

function nextLesson(placementCourse, lessons) {
  const start = placementCourse ? COURSES.findIndex((c) => c.id === placementCourse) : 0;
  const ordered = [...COURSES.slice(Math.max(0, start)), ...COURSES.slice(0, Math.max(0, start))];
  for (const c of ordered) {
    const id = c.units.flatMap((u) => u.lessons).find((l) => !lessons[l]?.completed);
    if (id) return { id, course: c.id, fromPlacement: c.id === placementCourse };
  }
  return null;
}

/** The first unfinished written lesson after `lesson`: what it recommends next, then the rest of its unit. */
function nextAfter(lesson, lessons) {
  const unitLessons = COURSES.flatMap((c) => c.units).find((u) => u.id === lesson.unit)?.lessons ?? [];
  const candidates = [...lesson.next, ...unitLessons.slice(unitLessons.indexOf(lesson.id) + 1)];
  return candidates.map((id) => lessonById[id]).find((l) => l && !lessons[l.id]?.completed) ?? null;
}

const LOCAL_NOTE = 'Saved in this browser only. Export a backup to continue on another device.';

/**
 * The returning learner's one action (prompt §4.1). A saved place wins over
 * anything opened since; without one, the last automatically saved step;
 * without that, the last lesson opened. Nothing here invents a step that was
 * never saved.
 */
function ResumeHero({ target, lessons }) {
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  const removePin = useStudyResumeStore((s) => s.removePin);

  if (target.kind === 'missing') {
    const fallback = target.fallback;
    const course = courseById[target.loc.courseId];
    return (
      <section className="home-hero" aria-labelledby="home-continue">
        <p className="studio-eyebrow" id="home-continue">Your saved place</p>
        <p className="studio-lede">
          Your saved place was in a lesson that is no longer in the course list (“{target.loc.lessonId}”). It may have been renamed.
          Nothing else was lost: your answers, checkpoints and notes are unchanged.
        </p>
        <div className="studio-row">
          {fallback && (
            <button type="button" className="studio-btn studio-btn-primary" onClick={() => requestResume(fallback.loc)}>
              Continue recent lesson: {fallback.lesson.title}
            </button>
          )}
          {course
            ? <a className={`studio-btn${fallback ? '' : ' studio-btn-primary'}`} href={hashFor('learn/course', { courseId: course.id })}>Open {course.title}</a>
            : <a className={`studio-btn${fallback ? '' : ' studio-btn-primary'}`} href={hashFor('learn/courses')}>Browse courses</a>}
          <button type="button" className="studio-btn" onClick={() => removePin()}>Forget that saved place</button>
        </div>
      </section>
    );
  }

  const { lesson, loc, kind } = target;
  const course = courseById[lesson.course];
  const step = stepLabel(loc.sectionId);
  const when = formatSavedAt(loc.at);
  const done = !!lessons[lesson.id]?.completed;
  const next = done ? nextAfter(lesson, lessons) : null;
  const pinned = kind === 'pinned';
  return (
    <section className="home-hero" aria-labelledby="home-continue">
      <p className="studio-eyebrow" id="home-continue">{pinned ? 'Continue learning' : 'Continue recent lesson'}</p>
      <h2 className="home-hero-title">{lesson.title}</h2>
      <dl className="home-place">
        <div><dt>Course</dt><dd>{course.title}</dd></div>
        <div><dt>{pinned ? 'You left off at' : 'You were at'}</dt><dd>{step ?? 'You opened this lesson; no step has been saved yet'}</dd></div>
        {when && <div><dt>{pinned ? 'Saved' : 'Last studied'}</dt><dd>{when}</dd></div>}
      </dl>
      {done && <p className="studio-muted">You have answered this lesson’s checkpoint.{next ? ' Review it from your saved place, or go on to the next lesson.' : ''}</p>}
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-primary" onClick={() => requestResume(loc)}>
          {pinned ? 'Resume where I stopped' : 'Continue recent lesson'}
        </button>
        {next
          ? <a className="studio-btn" href={hashFor('learn/lesson', { lessonId: next.id })}>Next lesson: {next.title}</a>
          : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Open course outline</a>}
      </div>
      <p className="studio-muted home-local-note">{LOCAL_NOTE} <a href={hashFor('progress/settings')}>Backup</a></p>
    </section>
  );
}

function FirstRun() {
  const chooseFirstRun = useDiagnosticStore((s) => s.chooseFirstRun);
  const setPlacement = useDiagnosticStore((s) => s.setPlacement);
  const goTo = useUIStore((s) => s.goTo);
  return (
    <section className="home-first" aria-labelledby="home-first-h">
      <h2 id="home-first-h" className="home-first-title">Where would you like to start?</h2>
      <p className="studio-lede">
        This is a path from uncertain maths to data science — algebra, linear algebra, calculus, statistics, machine learning
        and Python, taught visually and checked with practice. Choose how to begin; you can change it at any time.
      </p>
      <div className="home-first-options">
        <a className="home-option primary" href={hashFor('learn/placement')} onClick={() => chooseFirstRun('diagnostic')}>
          <span className="home-option-title"><i className="ti ti-route" aria-hidden="true" /> Take the placement check</span>
          <span className="home-option-text">About 15 short, low-stakes questions suggest where to start. Skippable, private, and only a suggestion.</span>
        </a>
        <button
          type="button"
          className="home-option"
          onClick={() => { chooseFirstRun('prealgebra'); setPlacement('prealgebra', 'start'); goTo('learn/course', { courseId: 'prealgebra' }); }}
        >
          <span className="home-option-title"><i className="ti ti-stairs-up" aria-hidden="true" /> Start from Prealgebra</span>
          <span className="home-option-text">Begin at the foundations and move up in order. Nothing is skipped, nothing is locked.</span>
        </button>
        <button type="button" className="home-option" onClick={() => { chooseFirstRun('explore'); goTo('learn/courses'); }}>
          <span className="home-option-title"><i className="ti ti-compass" aria-hidden="true" /> Explore first</span>
          <span className="home-option-text">Browse the courses and the maps of how ideas connect before committing to anything.</span>
        </button>
      </div>
    </section>
  );
}

export default function HomePage() {
  const firstRun = useDiagnosticStore((s) => s.firstRun);
  const placement = useDiagnosticStore((s) => s.placement);
  const lessons = useLearningStore((s) => s.lessons);
  const lastLesson = useLearningStore((s) => s.lastLesson);
  const evidence = useLearningStore((s) => s.evidence);
  const cards = useLearningStore((s) => s.cards);
  const projectState = useWorkStore((s) => s.projects);
  const pinnedPlace = useStudyResumeStore((s) => s.pinned);
  const currentPlace = useStudyResumeStore((s) => s.current);
  const recentPlaces = useStudyResumeStore((s) => s.recent);

  // Anyone with a saved place is not new — including one saved in another tab just now.
  const isNew = firstRun === null && Object.keys(lessons).length === 0 && evidence.length === 0 && !pinnedPlace && !currentPlace;
  const due = useMemo(() => dueCards(cards), [cards]);
  const status = useMemo(() => assessAll(evidence), [evidence]);
  const target = primaryTarget({ pinned: pinnedPlace, current: currentPlace, recent: recentPlaces }, { lessonById, lastLesson });
  // A saved place is always offered. A merely recent lesson whose checkpoint
  // is done is not "where you stopped" any more: recommend what comes next.
  const resume = target && (target.kind === 'pinned' || target.kind === 'missing' || !lessons[target.lesson.id]?.completed) ? target : null;
  const next = nextLesson(placement?.course, lessons);
  const primary = next?.id;
  const completed = lessonsInOrder.filter((id) => lessons[id]?.completed).length;
  const levels = Object.values(status);
  const proficient = levels.filter((x) => x.level === 'proficient').length;
  const mastered = levels.filter((x) => x.level === 'mastered').length;
  const weak = levels.filter((x) => x.distinctItems >= 2 && x.accuracy < 0.5).length;
  const activeProject = PROJECTS.find((p) => projectState[p.id]) ?? null;

  if (isNew) {
    return (
      <div className="studio-scroll">
        <div className="studio-page home"><FirstRun /></div>
      </div>
    );
  }

  return (
    <div className="studio-scroll">
      <div className="studio-page home">
        {resume ? <ResumeHero target={resume} lessons={lessons} /> : (
          <section className="home-hero" aria-labelledby="home-continue">
            <p className="studio-eyebrow" id="home-continue">Next recommended lesson</p>
            {primary ? (
              <>
                <h2 className="home-hero-title">{lessonById[primary].title}</h2>
                <p className="studio-muted">
                  {courseById[lessonById[primary].course].title} · about {lessonById[primary].minutes} minutes.{' '}
                  {next?.fromPlacement ? `Next written lesson in your starting point, ${courseById[placement.course].title}.`
                    : placement ? `Your starting point, ${courseById[placement.course].title}, has no unfinished written lessons; this is the nearest one.`
                      : 'The first unfinished written lesson. The placement check can suggest a better starting point.'}
                </p>
                <div className="studio-row">
                  <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: primary })}>Start the lesson</a>
                </div>
              </>
            ) : <p className="studio-lede">You have answered the checkpoint of every written lesson. New lessons will appear in Learn as they are written.</p>}
          </section>
        )}

        <section aria-labelledby="home-summary">
          <h2 id="home-summary" className="studio-eyebrow">At a glance</h2>
          <ul className="home-summary">
            <li>
              <a href={hashFor('practice/review')}>
                <strong>{due.length ? `${due.length} skill${due.length > 1 ? 's' : ''} due` : 'Nothing due'}</strong>
                <span>{due.length ? 'for review in Practice' : 'for review today'}</span>
              </a>
            </li>
            <li>
              <a href={hashFor('progress/overview')}>
                <strong>{completed} of {lessonsInOrder.length} lessons</strong>
                <span>{mastered} skill{mastered === 1 ? '' : 's'} mastered, {proficient} proficient</span>
              </a>
            </li>
            <li>
              <a href={hashFor('progress/overview')}>
                <strong>{weak ? `${weak} weak area${weak > 1 ? 's' : ''}` : 'No weak areas'}</strong>
                <span>{weak ? 'where under half your answers are right' : 'found from your answers so far'}</span>
              </a>
            </li>
            <li>
              <a href={hashFor('apply/projects')}>
                <strong>{activeProject ? activeProject.title : 'Apply it'}</strong>
                <span>{activeProject ? 'project in progress' : 'real-world projects with data'}</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
