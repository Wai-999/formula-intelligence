import { useMemo } from 'react';
import { courseById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CURRICULUM } from '../../data/curriculum/path.js';
import { PROJECTS } from '../../data/projects/index.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { dueCards } from '../../lib/reviewSchedule.js';
import { primaryTarget, stepLabel, formatSavedAt } from '../../lib/studyResume.js';
import { STATUS, recommend, routeProgress, trackProgress, nextMilestone, pathFor } from '../../lib/learningPath.js';
import { hashFor } from '../../app/pages.js';
import PathNext from '../learn/PathNext.jsx';
import { usePathState, weakSkills, hrefFor } from '../learn/usePathState.js';
import '../../styles/studio.css';
import './home.css';

// Home (V4 §3): resume learning with ONE clear next action, and a small
// progress summary — nothing to manage here. Reviews live in Practice, gaps
// and notes in My Progress. Deliberately absent: streaks, feeds, badges,
// auto-playing motion. What comes next is the learning-path engine's answer
// (src/lib/learningPath.js), the same one course and lesson pages give.

const LOCAL_NOTE = 'Saved in this browser only. Export a backup to continue on another device.';

const EYEBROW = {
  [STATUS.CONTINUE]: 'Next recommended lesson',
  [STATUS.NEXT_UNIT]: 'Next recommended lesson',
  [STATUS.TRANSITION]: 'Next course on your path',
  [STATUS.BRIDGE]: 'A bridge before the next course',
  [STATUS.UNAVAILABLE]: 'Next recommended lesson',
  [STATUS.END]: 'Your learning path',
};

/** Your path → course → unit → lesson → step, for the place the hero is about. */
function PathTrail({ pathTitle, lessonId, sectionId = null }) {
  const lesson = lessonById[lessonId];
  const course = lesson ? courseById[lesson.course] : null;
  const unit = lesson ? CURRICULUM.unitOf[lessonId] : null;
  return (
    <nav className="home-trail" aria-label="Where this is on your learning path">
      <ol>
        <li><a href={hashFor('learn/pathway')}>{pathTitle}</a></li>
        {course && <li><a href={hashFor('learn/course', { courseId: course.id })}>{course.title}</a></li>}
        {unit && <li>{unit.title}</li>}
        {lesson && <li>{lesson.title}</li>}
        {sectionId && <li>{stepLabel(sectionId)}</li>}
      </ol>
    </nav>
  );
}

/**
 * The returning learner's one action (prompt §4.1). A saved place wins over
 * anything opened since; without one, the last automatically saved step;
 * without that, the last lesson opened. Nothing here invents a step that was
 * never saved.
 */
function ResumeHero({ target, lessons, pathState, pathTitle }) {
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  const removePin = useStudyResumeStore((s) => s.removePin);
  const lessonId = target.kind === 'missing' ? null : target.lesson.id;
  const after = useMemo(() => (lessonId ? recommend(CURRICULUM, pathState, { lessonId }) : null), [lessonId, pathState]);

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
  const pinned = kind === 'pinned';
  return (
    <section className="home-hero" aria-labelledby="home-continue">
      <p className="studio-eyebrow" id="home-continue">{pinned ? 'Continue learning' : 'Continue recent lesson'}</p>
      <h2 className="home-hero-title">{lesson.title}</h2>
      <PathTrail pathTitle={pathTitle} lessonId={lesson.id} sectionId={loc.sectionId} />
      {/* The trail above names course, unit and step; these add when, or that no step was saved. */}
      <dl className="home-place">
        {!step && <div><dt>{pinned ? 'You left off at' : 'You were at'}</dt><dd>You opened this lesson; no step has been saved yet</dd></div>}
        {when && <div><dt>{pinned ? 'Saved' : 'Last studied'}</dt><dd>{when}</dd></div>}
      </dl>
      {done && <p className="studio-muted">You have answered this lesson’s checkpoint. Review it from your saved place, or go on: {after.label}.</p>}
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-primary" onClick={() => requestResume(loc)}>
          {pinned ? 'Resume where I stopped' : 'Continue recent lesson'}
        </button>
        {done
          ? <a className="studio-btn" href={hrefFor(after.target)}>{after.label}</a>
          : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Open course outline</a>}
      </div>
      <p className="studio-muted home-local-note">{LOCAL_NOTE} <a href={hashFor('progress/settings')}>Backup</a></p>
    </section>
  );
}

/** No place to resume: the learning path's next step, with its reasons. */
function NextHero({ rec, pathTitle }) {
  const lessonId = rec.target?.page === 'learn/lesson' ? rec.target.params.lessonId : null;
  const lesson = lessonId ? lessonById[lessonId] : null;
  return (
    <section className="home-hero" aria-labelledby="home-continue">
      <p className="studio-eyebrow" id="home-continue">{EYEBROW[rec.status]}</p>
      {lesson
        ? <h2 className="home-hero-title">{lesson.title}</h2>
        : <h2 className="home-hero-title">{rec.status === STATUS.END ? 'Every written lesson on your path is done' : rec.label}</h2>}
      {lesson && <PathTrail pathTitle={pathTitle} lessonId={lesson.id} />}
      {lesson && <p className="studio-muted">{courseById[lesson.course].title} · about {lesson.minutes} minutes.</p>}
      <PathNext rec={rec} compact={rec.status !== STATUS.END} />
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
  const lastLesson = useLearningStore((s) => s.lastLesson);
  const evidence = useLearningStore((s) => s.evidence);
  const cards = useLearningStore((s) => s.cards);
  const projectState = useWorkStore((s) => s.projects);
  const pinnedPlace = useStudyResumeStore((s) => s.pinned);
  const currentPlace = useStudyResumeStore((s) => s.current);
  const recentPlaces = useStudyResumeStore((s) => s.recent);
  const pathState = usePathState();
  const { lessons, status } = pathState;

  // Anyone with a saved place is not new — including one saved in another tab just now.
  const isNew = firstRun === null && Object.keys(lessons).length === 0 && evidence.length === 0 && !pinnedPlace && !currentPlace;
  const due = useMemo(() => dueCards(cards), [cards]);
  const target = primaryTarget({ pinned: pinnedPlace, current: currentPlace, recent: recentPlaces }, { lessonById, lastLesson });
  // A saved place is always offered. A merely recent lesson whose checkpoint
  // is done is not "where you stopped" any more: recommend what comes next.
  const resume = target && (target.kind === 'pinned' || target.kind === 'missing' || !lessons[target.lesson.id]?.completed) ? target : null;
  const rec = useMemo(() => recommend(CURRICULUM, pathState), [pathState]);
  const path = pathFor(CURRICULUM, pathState.pathId);
  const progress = routeProgress(CURRICULUM, pathState, pathState.pathId);
  // On an applied track, its own lessons; on the route, every written lesson.
  const onPath = path.kind === 'track' ? trackProgress(CURRICULUM, pathState, path.id) : progress;
  const milestone = nextMilestone(CURRICULUM, pathState, rec);
  const levels = Object.values(status);
  const proficient = levels.filter((x) => x.level === 'proficient').length;
  const mastered = levels.filter((x) => x.level === 'mastered').length;
  const weak = weakSkills(status).length;
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
        {resume
          ? <ResumeHero target={resume} lessons={lessons} pathState={pathState} pathTitle={path.title} />
          : <NextHero rec={rec} pathTitle={path.title} />}

        <section className="home-path" aria-labelledby="home-path-h">
          <h2 id="home-path-h" className="studio-eyebrow">Your path</h2>
          <dl className="home-path-facts">
            <div><dt>Following</dt><dd><a href={hashFor('learn/pathway')}>{path.title}</a></dd></div>
            <div><dt>Written lessons checked</dt><dd>{onPath.checked} of {onPath.written} on this path</dd></div>
            {milestone && <div><dt>Next milestone</dt><dd>{milestone}</dd></div>}
          </dl>
        </section>

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
                <strong>{progress.checked} of {progress.written} lessons</strong>
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
