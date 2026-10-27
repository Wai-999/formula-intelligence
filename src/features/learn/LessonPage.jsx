import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MathText, { MathBlock } from '../../components/math/MathText.jsx';
import LabHost from '../labs/LabHost.jsx';
import ItemCard from './lesson/ItemCard.jsx';
import PredictCard from './lesson/PredictCard.jsx';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { courseById, unitById } from '../../data/curriculum/catalog.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { formulaById } from '../../data/curriculum/formulas.js';
import { nodeById } from '../../data/nodes.js';
import { mlNodeById } from '../../data/ml/models.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { usePyLabStore } from '../../store/usePyLabStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { assessCompetency, LEVEL_LABEL } from '../../lib/mastery.js';
import { hashFor } from '../../app/pages.js';
import { LESSON_STEPS, stepLabel, formatSavedAt } from '../../lib/studyResume.js';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';

const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

// Six steps, one scrollable page (V4 §4): why it matters → understand →
// see it → try it → use it → check understanding. The ten authored elements
// of every lesson (V3.1 §6) are all still here, regrouped: notation, the
// readiness check, worked examples and the result under Understand, with
// the derivation and the assumptions behind "Go deeper" disclosures.
// The section ids are also what a saved place records (src/lib/studyResume.js).
const SECTIONS = LESSON_STEPS;

// The learner's motion setting, or the system's: jumps are instant then.
const reduceMotion = () => document.documentElement.getAttribute('data-motion') === 'reduce'
  || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function scrollToSection(lessonId, id) {
  const el = document.getElementById(`lesson-${lessonId}-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  el.querySelector('h2')?.focus({ preventScroll: true });
}

// Matches the lesson content's scroll-margin-top (learn.css): the sticky
// progress bar's height. A section counts as the one being read once its
// top passes TRACK_LINE below the container's top.
const STICKY = 64;
const TRACK_LINE = 120;
// How long the learner must stay on a step before it is saved automatically:
// long enough that scrolling past a step does not count as studying it.
const AUTOSAVE_MS = 1500;
const DRIFT_CHECKS = [250, 700, 1500];
// When a jump to a step should be over, even a long smooth scroll.
const LAND_CHECKS = [900, 1800];

/**
 * Put the saved place at the top of the lesson, below the sticky bar: the
 * step's start, moved down by the saved fraction of the step's height but
 * never so far that the next step becomes the current one. The step, not a
 * pixel offset, is what is restored, so a different screen size, font or
 * opened disclosure lands in the same step.
 */
function placeTop(root, el, fraction) {
  const offset = Math.min(fraction * el.offsetHeight, Math.max(0, el.offsetHeight - (TRACK_LINE - STICKY) - 24));
  return root.scrollTop + (el.getBoundingClientRect().top - root.getBoundingClientRect().top) - STICKY + offset;
}

// Ids include the lesson id: several lessons can be mounted at once (keep-alive).
function Section({ lessonId, id, title, n, children }) {
  return (
    <section id={`lesson-${lessonId}-${id}`} data-section={id} className="lesson-section" aria-labelledby={`lesson-${lessonId}-${id}-h`}>
      <h2 id={`lesson-${lessonId}-${id}-h`} className="lesson-h2" tabIndex={-1}>
        <span className="lesson-h2-n" aria-hidden="true">{n}</span> {title}
      </h2>
      {children}
    </section>
  );
}

function NotFound({ lessonId }) {
  return (
    <div className="studio-scroll">
      <div className="studio-page studio-read">
        <p className="studio-lede">There is no lesson called “{lessonId}”. It may have been renamed, or the link may be incomplete.</p>
        <p><a className="studio-btn" href={hashFor('learn/courses')}>Browse courses</a></p>
      </div>
    </div>
  );
}

function NotesBox({ lessonId }) {
  const saved = useLearningStore((s) => s.notes[lessonId]?.text ?? '');
  const saveNote = useLearningStore((s) => s.saveNote);
  const [text, setText] = useState(saved);
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onChange = (v) => {
    setText(v);
    setState('typing');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { saveNote(lessonId, v); setState('saved'); }, 600);
  };
  return (
    <div className="lesson-notes">
      <label htmlFor={`notes-${lessonId}`} className="studio-h3">Your notes</label>
      <textarea id={`notes-${lessonId}`} className="studio-textarea" value={text} onChange={(e) => onChange(e.target.value)} placeholder="What clicked? What is still fuzzy? Notes are saved on this device and collected in My Progress → Notebook." />
      <p className="studio-muted" role="status">{state === 'saved' ? 'Saved.' : state === 'typing' ? 'Saving…' : ''}</p>
    </div>
  );
}

/**
 * "See connections" (V4 §3): what this lesson builds on and leads to, its
 * concepts on the concept map, and the statistics formulas and ML models it
 * touches — on demand, at the top of the lesson.
 */
function Connections({ meta, id }) {
  const lists = [
    { title: 'Builds on', items: meta.prerequisites.map((c) => ({ key: c, node: <a href={hashFor('learn/concepts', { conceptId: c })}>{conceptById[c]?.title ?? c}</a> })) },
    { title: 'Teaches', items: meta.concepts.map((c) => ({ key: c, node: <a href={hashFor('learn/concepts', { conceptId: c })}>{conceptById[c]?.title ?? c}</a> })) },
    {
      title: 'Used in statistics and ML',
      items: [
        ...meta.formulaMap.filter((fid) => nodeById[fid]).map((fid) => ({ key: fid, node: <button type="button" className="link-btn" onClick={() => useUIStore.getState().viewOnMap(fid, null)}>{nodeById[fid].name} (formula map)</button> })),
        ...meta.models.filter((m) => mlNodeById[m]).map((m) => ({ key: m, node: <button type="button" className="link-btn" onClick={() => { useUIStore.getState().goTo('learn/models'); useMLUIStore.getState().selectModel(m); }}>{mlNodeById[m].name} (model map)</button> })),
      ],
    },
    { title: 'Leads to', items: meta.next.filter((n) => lessonById[n]).map((n) => ({ key: n, node: <a href={hashFor('learn/lesson', { lessonId: n })}>{lessonById[n].title}</a> })) },
  ].filter((l) => l.items.length);
  return (
    <div id={id} className="lesson-connections" role="region" aria-label="Connections">
      {lists.map((l) => (
        <div key={l.title}>
          <p className="studio-eyebrow">{l.title}</p>
          <ul className="studio-list lesson-builds-on">{l.items.map((x) => <li key={x.key}>{x.node}</li>)}</ul>
        </div>
      ))}
      {meta.concepts[0] && <p><a className="link-btn" href={hashFor('learn/concepts', { conceptId: meta.concepts[0] })}>Open the full concept map here</a></p>}
    </div>
  );
}

function CompetencyStatus({ ids }) {
  const evidence = useLearningStore((s) => s.evidence);
  return (
    <ul className="studio-list">
      {ids.map((id) => {
        const a = assessCompetency(evidence.filter((e) => e.c === id));
        return (
          <li key={id} className="lesson-comp">
            <span>{competencyById[id]?.title ?? id}</span>
            <span className={`studio-chip ${a.level === 'mastered' ? 'studio-chip-ok' : a.level === 'proficient' ? 'studio-chip-accent' : ''}`}>
              {LEVEL_LABEL[a.level]}{a.confidence !== 'none' ? ` · ${a.confidence} confidence` : ''}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function CheckpointSection({ meta, items }) {
  const completeLesson = useLearningStore((s) => s.completeLesson);
  const cards = useLearningStore((s) => s.cards);
  const [results, setResults] = useState({});
  const done = Object.keys(results).length === items.length;
  const correct = Object.values(results).filter(Boolean).length;

  useEffect(() => {
    if (done) completeLesson(meta.id, { correct, total: items.length });
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <p className="studio-muted">These count as evidence for {meta.competencies.map((c) => competencyById[c]?.title).join('; ')}. Your first answer to each is the one recorded; you can keep trying afterwards.</p>
      {items.map((it, i) => (
        <ItemCard key={it.id} item={it} index={i} source="checkpoint" onFirstAttempt={(id, ok) => setResults((r) => ({ ...r, [id]: ok }))} />
      ))}
      {done && (
        <div className={`studio-callout ${correct === items.length ? 'studio-callout-ok' : 'studio-callout-warn'}`} role="status">
          <p><strong>{correct} of {items.length} correct on the first try.</strong></p>
          <p>
            {correct === items.length
              ? 'That is solid evidence for this lesson’s skills — but one sitting is not mastery. A short review is scheduled so you can show it again on another day.'
              : 'Look at the solutions of the ones you missed, then try the Practice items at the same level. A review is scheduled sooner for skills you missed.'}
          </p>
          {correct < items.length && <p><a href={hashFor('practice/review')}>Practise these skills again in Practice → Review</a></p>}
          {meta.competencies.map((c) => cards[c] && (
            <p key={c} className="studio-muted">Next review of “{competencyById[c]?.title}”: {new Date(cards[c].due).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}.</p>
          ))}
        </div>
      )}
    </>
  );
}

export default function LessonPage({ lessonId }) {
  const meta = lessonById[lessonId];
  const [body, setBody] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [current, setCurrent] = useState('matters');
  // Where in the current step, in fifths: enough to resume mid-step, coarse
  // enough that scrolling does not mean saving.
  const [depth, setDepth] = useState(0);
  const [showConnections, setShowConnections] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [note, setNote] = useState(null); // { ok, text } after an explicit save
  // The place to offer at the top ("Resume from Step 4"), as it stood when the
  // learner arrived. Never live: a callout appearing above the text while
  // they read would move the page under them.
  const [offer, setOffer] = useState(null);
  const openLesson = useLearningStore((s) => s.openLesson);
  const markSection = useLearningStore((s) => s.markSection);
  const visited = useLearningStore((s) => s.lessons[lessonId]?.sections);
  const autoSave = useStudyResumeStore((s) => s.autoSave);
  const pinned = useStudyResumeStore((s) => s.pinned);
  const recent = useStudyResumeStore((s) => s.recent);
  const saveState = useStudyResumeStore((s) => s.saveState);
  const pendingResume = useStudyResumeStore((s) => s.pendingResume);
  // Kept-alive lesson pages stay mounted while hidden; only the one on screen
  // may save a place or take a resume request.
  const active = useUIStore((s) => s.page === 'learn/lesson' && s.pageParams.lessonId === lessonId);
  const rootRef = useRef(null);
  const fractionRef = useRef(0);
  const sessionStart = useRef(Date.now());
  const pendingSave = useRef(null);
  const saveTimer = useRef(0);
  const appliedToken = useRef(null);
  const stopResume = useRef(() => {});
  const stopJump = useRef(() => {});
  // Landing at the top of a lesson is not studying it: nothing is saved until
  // the learner scrolls, jumps to a step or resumes. Otherwise opening a
  // lesson from its course would overwrite a deeper place in it with Step 1
  // before they could choose to resume.
  const engaged = useRef(false);

  useEffect(() => {
    if (!meta) return undefined;
    let live = true;
    openLesson(meta.id);
    meta.load().then((m) => { if (live) setBody(m.default); }).catch((e) => { if (live) setLoadError(e); });
    return () => { live = false; };
  }, [meta, openLesson]);

  // Which section is being read: the last one whose top has scrolled past
  // the sticky progress bar. (An IntersectionObserver band picked the wrong
  // section whenever two short sections shared it.) Also how far into it.
  useEffect(() => {
    const root = rootRef.current;
    if (!body || !root) return undefined;
    let timer = 0;
    const update = () => {
      timer = 0;
      const top = root.getBoundingClientRect().top;
      const line = top + TRACK_LINE;
      let cur = 'matters';
      let el = null;
      for (const sec of root.querySelectorAll('.lesson-section')) {
        if (sec.getBoundingClientRect().top <= line) { cur = sec.dataset.section; el = sec; }
      }
      const fraction = el && el.offsetHeight > 0 ? Math.min(1, Math.max(0, (top + STICKY - el.getBoundingClientRect().top) / el.offsetHeight)) : 0;
      fractionRef.current = fraction;
      setCurrent(cur);
      setDepth(Math.round(fraction * 5) / 5);
    };
    // A short timer rather than requestAnimationFrame: rAF is paused in
    // background or unpainted documents, and correctness must not depend on paint.
    const onScroll = () => {
      engaged.current = true;
      if (!timer) timer = setTimeout(update, 60);
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { root.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, [body]);

  // Automatic checkpoints: a step the learner stays on for AUTOSAVE_MS is
  // saved (and marked visited); leaving the lesson or hiding the tab saves
  // at once. Never on unload alone — phones kill pages without that event.
  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = 0;
    const loc = pendingSave.current;
    pendingSave.current = null;
    if (!loc) return;
    autoSave(loc);
    markSection(loc.lessonId, loc.sectionId);
  }, [autoSave, markSection]);

  const queueSave = useCallback((sectionId, fraction, now = false) => {
    if (!meta || !engaged.current) return;
    pendingSave.current = { courseId: meta.course, lessonId: meta.id, sectionId, fraction };
    clearTimeout(saveTimer.current);
    if (now) flush();
    else saveTimer.current = setTimeout(flush, AUTOSAVE_MS);
  }, [meta, flush]);

  // Declared before the resume effect, which consumes the request: arriving
  // through Resume, there is nothing to offer.
  useEffect(() => {
    if (!active) return;
    const { pinned: pin, recent: rec, pendingResume: req } = useStudyResumeStore.getState();
    if (req?.lessonId === lessonId) { setOffer(null); return; }
    const place = (pin?.lessonId === lessonId ? pin : null) ?? rec.find((r) => r.lessonId === lessonId) ?? null;
    setOffer(place?.sectionId && place.sectionId !== 'matters' ? { ...place, pinned: pin?.lessonId === lessonId } : null);
  }, [active, lessonId]);

  useEffect(() => {
    if (!body || !active) return undefined;
    if (engaged.current) {
      queueSave(current, fractionRef.current);
      return undefined;
    }
    // Not a place yet (see `engaged`), but a step read for a while was visited.
    const t = setTimeout(() => markSection(lessonId, current), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [body, active, current, depth, queueSave, markSection, lessonId]);

  useEffect(() => {
    if (!active) { flush(); return undefined; }
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, [active, flush]);

  useEffect(() => () => flush(), [flush]);
  useEffect(() => () => { stopResume.current(); stopJump.current(); }, []);

  // A confirmation is read once and then gets out of the way; a failure stays.
  useEffect(() => {
    if (!note?.ok) return undefined;
    const t = setTimeout(() => setNote(null), 8000);
    return () => clearTimeout(t);
  }, [note]);

  // A resume the learner asked for (Home, a course page, My Progress): once
  // this lesson's content is on screen, go to the saved step, then hand the
  // request back so later visits start where navigation puts them. Late
  // layout (a lab loading above the step) is corrected a few times, unless
  // the learner has started scrolling themselves.
  useEffect(() => {
    const req = pendingResume;
    if (!req || req.lessonId !== lessonId || !active) return undefined;
    if (appliedToken.current === req.token) return undefined;
    if (!meta || loadError) { useStudyResumeStore.getState().consumeResume(req.token); return undefined; }
    const root = rootRef.current;
    if (!body || !root) return undefined;
    appliedToken.current = req.token;
    stopResume.current();
    engaged.current = true;
    const el = req.sectionId ? document.getElementById(`lesson-${lessonId}-${req.sectionId}`) : null;
    const go = () => root.scrollTo({ top: el ? placeTop(root, el, req.fraction) : 0, behavior: 'instant' });
    go();
    if (req.sectionId) setCurrent(req.sectionId);
    // Timers live outside this effect: consuming the request re-runs it, and
    // that must not cancel the focus and drift corrections it just set up.
    const timers = [setTimeout(() => (el?.querySelector('h2') ?? null)?.focus({ preventScroll: true }), 60)];
    let touched = false;
    const touch = () => { touched = true; };
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    events.forEach((e) => root.addEventListener(e, touch, { passive: true }));
    for (const ms of DRIFT_CHECKS) {
      timers.push(setTimeout(() => {
        if (touched || !el) return;
        if (Math.abs(placeTop(root, el, req.fraction) - root.scrollTop) > 24) go();
      }, ms));
    }
    stopResume.current = () => {
      timers.forEach(clearTimeout);
      events.forEach((e) => root.removeEventListener(e, touch));
    };
    useStudyResumeStore.getState().consumeResume(req.token);
    return undefined;
  }, [pendingResume, lessonId, active, body, meta, loadError]);

  const course = meta ? courseById[meta.course] : null;
  const unit = meta ? unitById[meta.unit] : null;
  const neighbours = useMemo(() => {
    if (!unit) return {};
    const i = unit.lessons.indexOf(meta.id);
    return { prev: lessonById[unit.lessons[i - 1]], next: lessonById[unit.lessons[i + 1]] };
  }, [unit, meta]);

  if (!meta) return <NotFound lessonId={lessonId} />;
  if (loadError) {
    return (
      <div className="studio-page studio-read">
        <p className="studio-callout studio-callout-bad">This lesson could not be loaded. Check your connection and reload the page. Your saved place is kept.</p>
        <p className="studio-row">
          <a className="studio-btn" href={hashFor('learn/course', { courseId: meta.course })}>Open the course outline</a>
          <a className="studio-btn" href={hashFor('home')}>Home</a>
        </p>
      </div>
    );
  }
  if (!body) return <div className="page-loading" role="status">Loading the lesson…</div>;

  const idx = Math.max(0, SECTIONS.findIndex((s) => s.id === current));
  const nextSection = SECTIONS[idx + 1];
  const here = { courseId: meta.course, lessonId: meta.id, sectionId: current, fraction: fractionRef.current };
  const pinHere = pinned?.lessonId === meta.id ? pinned : null;
  const lastHere = pinHere ?? recent.find((r) => r.lessonId === meta.id) ?? null;
  const visitedSet = new Set(visited ?? []);
  const answeredHere = () => useLearningStore.getState().evidence
    .filter((e) => e.at >= sessionStart.current && e.item.startsWith(`${meta.id}.`)).length;

  // "Next", the step list and the table of contents. A smooth scroll can be
  // cut short — another scroll starting before it ends, or the page moving
  // under it — which left learners at the top of the step they were leaving.
  // So check where it ended, and settle on the step unless the learner has
  // taken over the scrolling themselves.
  const jump = (id) => {
    setStepsOpen(false);
    engaged.current = true;
    queueSave(id, 0, true);
    scrollToSection(meta.id, id);
    stopJump.current();
    const root = rootRef.current;
    const el = document.getElementById(`lesson-${meta.id}-${id}`);
    if (!root || !el) return;
    let touched = false;
    const touch = () => { touched = true; };
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    events.forEach((e) => root.addEventListener(e, touch, { passive: true }));
    const timers = LAND_CHECKS.map((ms) => setTimeout(() => {
      if (touched) return;
      const off = el.getBoundingClientRect().top - root.getBoundingClientRect().top - STICKY;
      if (Math.abs(off) > 24) root.scrollTo({ top: root.scrollTop + off, behavior: 'instant' });
    }, ms));
    stopJump.current = () => {
      timers.forEach(clearTimeout);
      events.forEach((e) => root.removeEventListener(e, touch));
    };
  };
  const savePlace = () => {
    flush();
    const ok = useStudyResumeStore.getState().savePlace(here);
    setNote(ok
      ? { ok, text: `Saved on this device: ${stepLabel(current)}, ${formatSavedAt(Date.now())}.` }
      : { ok, text: 'Couldn’t save to this browser. Your place is kept until you close this tab; to keep it, allow site storage or export a backup in My Progress → Settings.' });
  };
  const finishSession = () => {
    flush();
    useStudyResumeStore.getState().finishSession({ loc: here, startedAt: sessionStart.current, answered: answeredHere() });
  };
  const resumeHere = () => {
    if (lastHere) useStudyResumeStore.getState().requestResume(lastHere);
  };
  const stepState = (id) => (id === current ? 'You are here' : visitedSet.has(id) ? 'Visited' : 'Not reached');
  const passive = saveState && saveState.ok === false ? 'Couldn’t save to this browser'
    : lastHere ? `${pinHere ? 'Saved place' : 'Saved on this device'}: ${stepLabel(lastHere.sectionId) ?? 'this lesson'}, ${formatSavedAt(lastHere.at)}` : 'Not saved yet in this lesson';
  const tryItems = body.practice.filter((p) => p.level !== 'transfer');
  // Use it: the lesson's real-world task (V4 lessons), then the transfer
  // questions — the idea in settings the lesson did not show.
  const useItems = [...(body.apply?.items ?? []), ...body.practice.filter((p) => p.level === 'transfer')];
  const nextLessonId = meta.next.find((n) => lessonById[n]);

  return (
    <div className="studio-scroll lesson-scroll" ref={rootRef}>
      <div
        className="lesson-progress"
        role="region"
        aria-label="Lesson progress"
        onKeyDown={(e) => {
          if (e.key !== 'Escape' || !stepsOpen) return;
          setStepsOpen(false);
          e.currentTarget.querySelector('.lesson-steps-toggle')?.focus();
        }}
      >
        <div className="lesson-progress-row">
          <button
            type="button"
            className="lesson-steps-toggle"
            aria-expanded={stepsOpen}
            aria-controls={`lesson-${meta.id}-steps`}
            onClick={() => setStepsOpen((v) => !v)}
          >
            <span className="lesson-progress-text">Step {idx + 1} of {SECTIONS.length}<span className="lesson-progress-title"> · {SECTIONS[idx].title}</span></span>
            <i className={`ti ${stepsOpen ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" />
          </button>
          <span className="lesson-progress-bar" aria-hidden="true"><span style={{ width: `${((idx + 1) / SECTIONS.length) * 100}%` }} /></span>
          {nextSection && (
            <button type="button" className="studio-btn studio-btn-small lesson-next-step" onClick={() => jump(nextSection.id)}>
              Next: {nextSection.title}
            </button>
          )}
          <button type="button" className="studio-btn studio-btn-small lesson-save" aria-label="Save my place" onClick={savePlace}>
            <i className="ti ti-device-floppy" aria-hidden="true" /> <span>Save<span className="lesson-save-more"> my place</span></span>
          </button>
          <button type="button" className="studio-btn studio-btn-small lesson-finish" onClick={finishSession}>Finish study session</button>
        </div>
        {/* Overlays under the bar (learn.css), so feedback never moves the text being read. */}
        <p className="lesson-save-note" role="status">{note?.ok && !stepsOpen ? note.text : ''}</p>
        {note && !note.ok && <p className="lesson-save-note lesson-save-error" role="alert">{note.text}</p>}
        {stepsOpen && (
          <div id={`lesson-${meta.id}-steps`} className="lesson-steps-panel">
            <ol className="lesson-trail" aria-label="Steps in this lesson">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className={`trail-${s.id === current ? 'here' : visitedSet.has(s.id) ? 'visited' : 'ahead'}`}>
                  <button type="button" className="trail-btn" aria-current={s.id === current ? 'step' : undefined} onClick={() => jump(s.id)}>
                    <span className="trail-mark" aria-hidden="true" />
                    <span>{i + 1}. {s.title}</span>
                    <span className="trail-state">{stepState(s.id)}{pinHere?.sectionId === s.id ? ' · saved place' : ''}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="studio-row">
              <button type="button" className="studio-btn studio-btn-small" onClick={savePlace}>Save my place</button>
              <button type="button" className="studio-btn studio-btn-small" onClick={finishSession}>Finish study session</button>
              {lastHere?.sectionId && lastHere.sectionId !== current && (
                <button type="button" className="studio-btn studio-btn-small" onClick={() => { setStepsOpen(false); resumeHere(); }}>
                  Back to {pinHere ? 'your saved place' : 'where you were'}: Step {SECTIONS.findIndex((s) => s.id === lastHere.sectionId) + 1}
                </button>
              )}
            </div>
            {pinned && !pinHere && lessonById[pinned.lessonId] && (
              <p className="studio-muted">Saving here replaces your saved place in “{lessonById[pinned.lessonId].title}”.</p>
            )}
            <p className="studio-muted" role="status">{passive}. Stored in this browser only — <a href={hashFor('progress/settings')}>export a backup</a> to continue on another device.</p>
          </div>
        )}
      </div>

      <div className="lesson-layout">
        <article className="lesson-main" aria-label={meta.title}>
          <header className="lesson-intro">
            <p className="studio-eyebrow">{course.title} · {unit.title}</p>
            <MathText as="p" className="studio-lede" text={meta.summary} />
            <div className="studio-row">
              <span className="studio-chip"><i className="ti ti-clock" aria-hidden="true" /> about {meta.minutes} min</span>
              <span className="studio-chip"><i className="ti ti-stairs" aria-hidden="true" /> {meta.difficulty}</span>
              <span className="studio-chip studio-chip-warn" title="See Sources and docs/CONTENT_QA.md"><i className="ti ti-alert-triangle" aria-hidden="true" /> Draft: awaiting independent math review</span>
              <button
                type="button"
                className="studio-btn studio-btn-small"
                aria-expanded={showConnections}
                aria-controls={`lesson-${meta.id}-connections`}
                onClick={() => setShowConnections((v) => !v)}
              >
                <i className="ti ti-share" aria-hidden="true" /> {showConnections ? 'Hide connections' : 'See connections'}
              </button>
            </div>
            {showConnections && <Connections meta={meta} id={`lesson-${meta.id}-connections`} />}
            {offer && (
              <p className="studio-callout lesson-resume-offer">
                {offer.pinned ? 'Your saved place' : 'Last time you were'} here: {stepLabel(offer.sectionId)}{formatSavedAt(offer.at) ? ` (${formatSavedAt(offer.at)})` : ''}.{' '}
                <button type="button" className="studio-btn studio-btn-small" onClick={() => useStudyResumeStore.getState().requestResume(offer)}>
                  Resume from Step {SECTIONS.findIndex((s) => s.id === offer.sectionId) + 1}
                </button>
              </p>
            )}
          </header>

          <Section lessonId={meta.id} id="matters" title="Why it matters" n={1}>
            <div className="studio-callout lesson-question"><MathText as="p" text={body.intuition.question} /></div>
            {body.intuition.body.map((p, i) => <MathText key={i} as="p" className="lesson-p" text={p} />)}
          </Section>

          <Section lessonId={meta.id} id="understand" title="Understand" n={2}>
            <h3 className="studio-h3">Notation</h3>
            <dl className="lesson-glossary">
              {body.glossary.map((g) => (
                <div key={g.term}>
                  <dt><MathText text={g.term} /></dt>
                  <dd><MathText text={g.meaning} /></dd>
                </div>
              ))}
            </dl>
            <details className="lesson-disclosure">
              <summary>Ready? Two quick checks on what this builds on</summary>
              <p className="studio-muted">
                This lesson uses {meta.prerequisites.map((p, i) => (
                  <span key={p}>{i > 0 && ', '}<a href={hashFor('learn/concepts', { conceptId: p })}>{conceptById[p]?.title ?? p}</a></span>
                ))}. If these feel shaky, the linked concepts show where they are taught.
              </p>
              {body.priorCheck.map((it, i) => <ItemCard key={it.id} item={it} index={i} source="prior" />)}
            </details>
            {body.examples.map((ex) => (
              <article key={ex.title} className="lesson-example">
                <h3 className="studio-h3">Worked example: {ex.title}</h3>
                <MathText as="p" text={ex.problem} />
                <ol className="lesson-steps compact">{ex.steps.map((st, i) => <li key={i}><MathText text={st} /></li>)}</ol>
                <p className="lesson-answer"><MathText text={ex.answer} /></p>
              </article>
            ))}
            {meta.formulas.map((fid) => formulaById[fid] && (
              <div key={fid} className="lesson-formula">
                <p className="studio-eyebrow">The result · {formulaById[fid].claim}</p>
                <MathBlock tex={formulaById[fid].latex} label={formulaById[fid].title} />
              </div>
            ))}
            {body.counterexample && (
              <div className="studio-callout studio-callout-warn">
                <p className="studio-eyebrow">Non-example</p>
                <h3 className="studio-h3">{body.counterexample.title}</h3>
                {body.counterexample.body.map((p, i) => <MathText key={i} as="p" text={p} />)}
              </div>
            )}
            <details className="lesson-disclosure">
              <summary>Go deeper: why it works</summary>
              <MathText as="p" className="lesson-p" text={body.derivation.intro} />
              <ol className="lesson-steps">
                {body.derivation.steps.map((st, i) => (
                  <li key={i}>
                    <MathText as="p" text={st.say} />
                    {st.math && <MathBlock tex={st.math} />}
                  </li>
                ))}
              </ol>
            </details>
            <details className="lesson-disclosure">
              <summary>Assumptions and limits</summary>
              <div className="lesson-two">
                <div>
                  <h4 className="studio-h3">Assumptions</h4>
                  <ul className="lesson-ul">{body.derivation.assumptions.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
                </div>
                <div>
                  <h4 className="studio-h3">Domain and restrictions</h4>
                  <ul className="lesson-ul">{body.derivation.domain.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
                </div>
              </div>
            </details>
          </Section>

          <Section lessonId={meta.id} id="see" title="See it" n={3}>
            <MathText as="p" className="lesson-p" text={body.visualization.intro} />
            <LabHost id={body.visualization.lab} config={body.visualization.config} />
            <p className="studio-muted lesson-alt"><strong>Without the picture:</strong> {body.visualization.textAlternative}</p>
            {body.visualization.more?.map((m) => (
              <details key={m.lab} className="lesson-disclosure lesson-more-lab">
                <summary>Go deeper: another view</summary>
                <MathText as="p" className="lesson-p" text={m.intro} />
                <LabHost id={m.lab} config={m.config} />
              </details>
            ))}
          </Section>

          <Section lessonId={meta.id} id="try" title="Try it" n={4}>
            <PredictCard predict={body.predict} />
            <p className="studio-muted">From guided to independent. Hints never cost anything, except that the question then counts as an easier one; every attempt gets an explanation.</p>
            {tryItems.map((it, i) => <ItemCard key={it.id} item={it} index={i} source="practice" />)}
          </Section>

          <Section lessonId={meta.id} id="use" title="Use it" n={5}>
            {body.apply ? (
              <>
                <div className="studio-callout"><MathText as="p" text={body.apply.scenario} /></div>
                {body.apply.steps?.length > 0 && <ol className="lesson-steps compact">{body.apply.steps.map((st, i) => <li key={i}><MathText text={st} /></li>)}</ol>}
              </>
            ) : <p className="studio-muted">The idea in settings the lesson did not show — the real test of understanding it.</p>}
            {useItems.map((it, i) => <ItemCard key={it.id} item={it} index={i} source="practice" />)}
            {body.apply?.limits?.length > 0 && (
              <div className="studio-callout studio-callout-warn">
                <p className="studio-eyebrow">Where this model breaks</p>
                <ul className="lesson-ul">{body.apply.limits.map((l) => <li key={l}><MathText text={l} /></li>)}</ul>
              </div>
            )}
            <details className="lesson-disclosure" open={Boolean(body.apply)}>
              <summary>Optional: the same idea in Python</summary>
              <MathText as="p" className="lesson-p" text={body.python.intro} />
              <pre className="lesson-code" tabIndex={0} aria-label="Python code"><code>{body.python.code}</code></pre>
              <p className="studio-eyebrow">Expected output</p>
              <pre className="lesson-code lesson-output" tabIndex={0} aria-label="Expected output"><code>{body.python.output}</code></pre>
              <MathText as="p" className="studio-muted" text={body.python.explain} />
              <div className="studio-row">
                <button
                  type="button"
                  className="studio-btn studio-btn-small"
                  onClick={() => {
                    usePyLabStore.getState().create(`${meta.title} (lesson)`, body.python.code);
                    useUIStore.getState().goTo('apply/lab');
                  }}
                >
                  <i className="ti ti-player-play" aria-hidden="true" /> Run it in the Python lab
                </button>
                <span className="studio-muted">Runs in your browser; the first run downloads Python (about 10 MB). Not coding yet? The questions above are the whole lesson.</span>
              </div>
            </details>
          </Section>

          <Section lessonId={meta.id} id="check" title="Check understanding" n={6}>
            <CheckpointSection meta={meta} items={body.checkpoint} />
            {nextLessonId && (
              <p className="lesson-next">
                Recommended next: <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: nextLessonId })}>{lessonById[nextLessonId].title} →</a>
              </p>
            )}
            <div className="studio-row lesson-end" role="group" aria-label="When you are done here">
              <button type="button" className="studio-btn" onClick={() => jump('matters')}>Review this lesson from Step 1</button>
              <button type="button" className="studio-btn" onClick={finishSession}>Save &amp; finish for today</button>
              {!nextLessonId && <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Back to the course outline</a>}
            </div>
            <h3 className="studio-h3">Your skills from this lesson</h3>
            <p className="studio-muted">They come back for a short review on an expanding schedule (1, 3, 7, 14, 30, 60 days) under Practice → Review. Missing a day never resets anything.</p>
            <CompetencyStatus ids={meta.competencies} />
            <details className="lesson-disclosure">
              <summary>Further reading</summary>
              <ul className="lesson-ul">
                {body.reading.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a> — {r.source}. <span className="studio-muted">{r.note}</span>
                  </li>
                ))}
              </ul>
            </details>
          </Section>

          <nav className="lesson-pager" aria-label="Lessons in this unit">
            {neighbours.prev ? <a className="studio-btn" href={hashFor('learn/lesson', { lessonId: neighbours.prev.id })}>← {neighbours.prev.title}</a> : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>← {course.title}</a>}
            {neighbours.next ? <a className="studio-btn" href={hashFor('learn/lesson', { lessonId: neighbours.next.id })}>{neighbours.next.title} →</a> : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Back to the course →</a>}
          </nav>
        </article>

        <aside className="lesson-aside" aria-label="Lesson tools">
          <nav aria-label="On this page" className="lesson-toc">
            <p className="studio-eyebrow">On this page</p>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className={`toc-btn${s.id === current ? ' on' : ''}`} aria-current={s.id === current ? 'location' : undefined} onClick={() => jump(s.id)}>
                    {i + 1}. {s.title}
                    <span className="toc-state">{s.id === current ? ' — you are here' : visitedSet.has(s.id) ? ' — visited' : ''}{pinHere?.sectionId === s.id ? ' · saved place' : ''}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <NotesBox lessonId={meta.id} />
        </aside>
      </div>
    </div>
  );
}
