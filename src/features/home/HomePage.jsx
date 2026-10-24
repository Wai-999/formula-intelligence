import { useEffect, useMemo, useState } from 'react';
import { COURSES, courseById } from '../../data/curriculum/catalog.js';
import { LESSONS, lessonById } from '../../data/curriculum/lessons/index.js';
import { competencyById, DOMAINS } from '../../data/curriculum/competencies.js';
import { PROJECTS } from '../../data/projects/index.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { dueCards } from '../../lib/reviewSchedule.js';
import { assessAll } from '../../lib/mastery.js';
import { hashFor } from '../../app/pages.js';
import ItemCard from '../learn/lesson/ItemCard.jsx';
import '../../styles/studio.css';
import '../learn/learn.css';
import './home.css';

// Home (§3): a clear first action and ONE primary call to action; continue
// learning, diagnostic status, the next lesson, due reviews, gaps, progress,
// the current project and recent notes. Deliberately absent: streaks,
// infinite feeds, auto-playing motion, badges.

const domainTitle = Object.fromEntries(DOMAINS.map((d) => [d.id, d.title]));
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
        <a className="home-option primary" href={hashFor('progress/diagnostic')} onClick={() => chooseFirstRun('diagnostic')}>
          <span className="home-option-title"><i className="ti ti-route" aria-hidden="true" /> Take the diagnostic</span>
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
        <button type="button" className="home-option" onClick={() => { chooseFirstRun('explore'); goTo('maps/concepts'); }}>
          <span className="home-option-title"><i className="ti ti-compass" aria-hidden="true" /> Explore first</span>
          <span className="home-option-text">Look around the concept map and the courses before committing to anything.</span>
        </button>
      </div>
    </section>
  );
}

function ReviewSession({ due, onDone }) {
  const evidence = useLearningStore((s) => s.evidence);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState(null);
  const comp = due[index]?.id;

  useEffect(() => {
    if (!comp) return undefined;
    let live = true;
    setItems(null);
    const sources = LESSONS.filter((l) => l.competencies.includes(comp));
    Promise.all(sources.map((l) => l.load())).then((mods) => {
      if (!live) return;
      const pool = mods.flatMap((m) => [...m.default.practice, ...m.default.checkpoint]).filter((it) => it.competency === comp);
      // Prefer the item answered least recently (never-answered first).
      const last = (id) => Math.max(0, ...evidence.filter((e) => e.item === id).map((e) => e.at));
      pool.sort((a, b) => last(a.id) - last(b.id));
      setItems(pool.slice(0, 1));
    });
    return () => { live = false; };
  }, [comp]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!comp) return null;
  return (
    <div className="home-review">
      <p className="studio-eyebrow">Review {index + 1} of {due.length}: {competencyById[comp]?.title}</p>
      {!items && <p className="studio-muted" role="status">Loading a question…</p>}
      {items?.length === 0 && <p className="studio-muted">No review question is available for this skill yet.</p>}
      {items?.map((it) => <ItemCard key={`${comp}-${it.id}`} item={it} source="review" />)}
      <div className="studio-row">
        {index + 1 < due.length
          ? <button type="button" className="studio-btn studio-btn-small" onClick={() => setIndex((i) => i + 1)}>Next skill</button>
          : <button type="button" className="studio-btn studio-btn-small" onClick={onDone}>Finish review</button>}
      </div>
    </div>
  );
}

export default function HomePage() {
  const firstRun = useDiagnosticStore((s) => s.firstRun);
  const attempts = useDiagnosticStore((s) => s.attempts);
  const placement = useDiagnosticStore((s) => s.placement);
  const lessons = useLearningStore((s) => s.lessons);
  const lastLesson = useLearningStore((s) => s.lastLesson);
  const evidence = useLearningStore((s) => s.evidence);
  const cards = useLearningStore((s) => s.cards);
  const notes = useLearningStore((s) => s.notes);
  const projectState = useWorkStore((s) => s.projects);
  const exResults = useWorkStore((s) => s.results);
  const [reviewing, setReviewing] = useState(false);

  const isNew = firstRun === null && Object.keys(lessons).length === 0 && evidence.length === 0;
  const due = useMemo(() => dueCards(cards), [cards]);
  const status = useMemo(() => assessAll(evidence), [evidence]);
  const lastAttempt = attempts[attempts.length - 1];
  const continueId = lastLesson && !lessons[lastLesson]?.completed && lessonById[lastLesson] ? lastLesson : null;
  const next = nextLesson(placement?.course, lessons);
  const primary = continueId ?? next?.id;
  const completed = lessonsInOrder.filter((id) => lessons[id]?.completed).length;
  const levels = Object.values(status);
  const proficient = levels.filter((s) => s.level === 'proficient').length;
  const mastered = levels.filter((s) => s.level === 'mastered').length;
  const struggling = Object.entries(status).filter(([, s]) => s.distinctItems >= 2 && s.accuracy < 0.5).map(([c]) => c);
  const activeProject = PROJECTS.find((p) => projectState[p.id]) ?? null;
  const recentNotes = Object.entries(notes).sort((a, b) => b[1].updated - a[1].updated).slice(0, 3);

  return (
    <div className="studio-scroll">
      <div className="studio-page home">
        {isNew ? <FirstRun /> : (
          <section className="home-hero" aria-labelledby="home-continue">
            <p className="studio-eyebrow" id="home-continue">{continueId ? 'Continue where you left off' : 'Next recommended lesson'}</p>
            {primary ? (
              <>
                <h2 className="home-hero-title">{lessonById[primary].title}</h2>
                <p className="studio-muted">
                  {courseById[lessonById[primary].course].title} · about {lessonById[primary].minutes} minutes.{' '}
                  {continueId ? 'You opened this lesson but have not finished its checkpoint.'
                    : next?.fromPlacement ? `Next written lesson in your starting point, ${courseById[placement.course].title}.`
                      : placement ? `Your starting point, ${courseById[placement.course].title}, has no unfinished written lessons; this is the nearest one.`
                        : 'The first unfinished written lesson. Take the diagnostic for a suggestion that fits you.'}
                </p>
                <div className="studio-row">
                  <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: primary })}>{continueId ? 'Continue' : 'Start'} the lesson</a>
                </div>
              </>
            ) : <p className="studio-lede">You have completed every written lesson. New lessons will appear in Learn as they are written.</p>}
          </section>
        )}

        <div className="home-grid">
          <section className="studio-card" aria-labelledby="home-review">
            <h2 id="home-review" className="studio-h3"><i className="ti ti-repeat" aria-hidden="true" /> Due for review</h2>
            {due.length === 0 ? (
              <p className="studio-muted">Nothing due. Skills you practise come back on an expanding schedule; missed days never reset anything.</p>
            ) : reviewing ? (
              <ReviewSession due={due} onDone={() => setReviewing(false)} />
            ) : (
              <>
                <ul className="studio-list">{due.slice(0, 4).map((c) => <li key={c.id} className="studio-muted">{competencyById[c.id]?.title}</li>)}</ul>
                <button type="button" className="studio-btn studio-btn-small" onClick={() => setReviewing(true)}>Review {due.length} skill{due.length > 1 ? 's' : ''} now</button>
              </>
            )}
          </section>

          <section className="studio-card" aria-labelledby="home-dx">
            <h2 id="home-dx" className="studio-h3"><i className="ti ti-route" aria-hidden="true" /> Diagnostic</h2>
            {lastAttempt ? (
              <>
                <p className="studio-muted">Last taken {new Date(lastAttempt.finishedAt).toLocaleDateString()}: suggested <strong>{courseById[lastAttempt.result.course]?.title}</strong> (provisional).</p>
                <a className="link-btn" href={hashFor('progress/diagnostic')}>See the reasons, retake, or override</a>
              </>
            ) : (
              <>
                <p className="studio-muted">Not taken. A short, skippable screen suggests where to start.</p>
                <a className="link-btn" href={hashFor('progress/diagnostic')}>Take the diagnostic</a>
              </>
            )}
            {placement && <p className="studio-muted">Starting point: {courseById[placement.course]?.title} ({placement.source === 'manual' ? 'your choice' : placement.source === 'diagnostic' ? 'from the diagnostic' : 'chosen at start'}).</p>}
          </section>

          <section className="studio-card" aria-labelledby="home-gaps">
            <h2 id="home-gaps" className="studio-h3"><i className="ti ti-puzzle" aria-hidden="true" /> Gaps to work on</h2>
            {(lastAttempt?.result.gaps.length || struggling.length) ? (
              <ul className="studio-list">
                {lastAttempt?.result.gaps.map((d) => <li key={d} className="studio-muted">{domainTitle[d]} — flagged by the diagnostic</li>)}
                {struggling.map((c) => {
                  const l = LESSONS.find((x) => x.competencies.includes(c));
                  return <li key={c} className="studio-muted">{competencyById[c]?.title}{l && <> — revisit <a href={hashFor('learn/lesson', { lessonId: l.id })}>{l.title}</a></>}</li>;
                })}
              </ul>
            ) : <p className="studio-muted">None found yet. Gaps come from the diagnostic and from skills where fewer than half your answers are right.</p>}
          </section>

          <section className="studio-card" aria-labelledby="home-progress">
            <h2 id="home-progress" className="studio-h3"><i className="ti ti-chart-bar" aria-hidden="true" /> Progress</h2>
            <p className="studio-muted">{completed} of {lessonsInOrder.length} written lessons completed (a lesson is complete when its checkpoint is answered).</p>
            <div className="studio-meter" aria-hidden="true"><span style={{ width: `${(completed / lessonsInOrder.length) * 100}%` }} /></div>
            <p className="studio-muted">{mastered} skill{mastered === 1 ? '' : 's'} mastered, {proficient} proficient — judged from answers on different questions and days, never from time spent.</p>
            <a className="link-btn" href={hashFor('progress/overview')}>Formula-map progress and your data</a>
          </section>

          <section className="studio-card" aria-labelledby="home-project">
            <h2 id="home-project" className="studio-h3"><i className="ti ti-flask-2" aria-hidden="true" /> Project</h2>
            {activeProject ? (
              <>
                <p className="studio-muted"><strong>{activeProject.title}</strong> — {activeProject.steps.filter((st) => (st.exercise ? exResults[st.exercise]?.passed : projectState[activeProject.id]?.steps?.[st.id]?.done)).length} of {activeProject.steps.length} steps done.</p>
                <a className="link-btn" href={hashFor('projects/list')}>Continue the project</a>
              </>
            ) : (
              <>
                <p className="studio-muted">Small end-to-end analyses — real and synthetic data, graded Python.</p>
                <a className="link-btn" href={hashFor('projects/list')}>Browse projects</a>
              </>
            )}
          </section>

          <section className="studio-card" aria-labelledby="home-notes">
            <h2 id="home-notes" className="studio-h3"><i className="ti ti-notebook" aria-hidden="true" /> Recent notes</h2>
            {recentNotes.length ? (
              <ul className="studio-list">
                {recentNotes.map(([id, n]) => (
                  <li key={id} className="studio-muted"><a href={hashFor('learn/lesson', { lessonId: id })}>{lessonById[id]?.title ?? id}</a>: {n.text.slice(0, 90)}{n.text.length > 90 ? '…' : ''}</li>
                ))}
              </ul>
            ) : <p className="studio-muted">Notes you take beside a lesson appear here.</p>}
            <a className="link-btn" href={hashFor('notebook/notes')}>All notes</a>
          </section>
        </div>
      </div>
    </div>
  );
}
