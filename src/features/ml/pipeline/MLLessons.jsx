import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ML_LESSONS } from '../../../data/ml/lessons.js';
import { useUIStore } from '../../../store/useUIStore.js';
import ErrorBoundary from '../../../components/error/ErrorBoundary.jsx';
import './MLLessons.css';

// Lessons that used to be top-level tabs (src/data/ml/lessons.js). Collapsed
// by default — progressive disclosure, and a lesson's code is not even
// downloaded until it is opened, so the host page costs nothing extra.
const COMPONENTS = {
  'bias-variance': lazy(() => import('../playground/PlaygroundPage.jsx')),
  evaluation: lazy(() => import('../evaluation/EvaluationPage.jsx')),
};

export default function MLLessons({ host }) {
  const lessons = ML_LESSONS.filter((l) => l.host === host);
  const mlLesson = useUIStore((s) => s.mlLesson);
  const clearMLLesson = useUIStore((s) => s.clearMLLesson);
  const [open, setOpen] = useState(() => new Set());
  const refs = useRef({});

  // A link or old bookmark asked for a lesson on this page: open it and
  // bring it into view. The short delay matters — the host pane may have
  // just switched from display:none, and scrollIntoView on a pane that has
  // not been laid out yet is a silent no-op (same finding as BridgePage's
  // cross-links). The request is cleared inside the timer, not before it,
  // or the effect's own cleanup would cancel the timer.
  useEffect(() => {
    if (!mlLesson || !ML_LESSONS.some((l) => l.id === mlLesson && l.host === host)) return undefined;
    const id = mlLesson;
    setOpen((prev) => new Set(prev).add(id));
    const timer = setTimeout(() => {
      const el = refs.current[id];
      el?.scrollIntoView({ behavior: 'auto', block: 'start' });
      el?.querySelector('.ml-lesson-toggle')?.focus({ preventScroll: true });
      clearMLLesson();
    }, 80);
    return () => clearTimeout(timer);
  }, [mlLesson, host, clearMLLesson]);

  function toggle(id) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (lessons.length === 0) return null;

  return (
    <section className="ml-section ml-lessons" aria-labelledby={`ml-lessons-${host}`}>
      <h2 className="ml-section-title" id={`ml-lessons-${host}`}>Lessons in this module</h2>
      <p className="ml-section-sub">Hands-on lessons on choosing model complexity and judging whether a model actually works.</p>
      <div className="ml-lesson-list">
        {lessons.map((l) => {
          const isOpen = open.has(l.id);
          const Lesson = COMPONENTS[l.id];
          return (
            <div key={l.id} className={`ml-lesson${isOpen ? ' open' : ''}`} ref={(el) => { refs.current[l.id] = el; }}>
              <button
                type="button"
                className="ml-lesson-toggle"
                aria-expanded={isOpen}
                aria-controls={`ml-lesson-body-${l.id}`}
                onClick={() => toggle(l.id)}
              >
                <span className="ml-lesson-text">
                  <span className="ml-lesson-title">{l.title}</span>
                  <span className="ml-lesson-summary">{l.summary}</span>
                </span>
                <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" />
              </button>
              {isOpen && Lesson && (
                <div className="ml-lesson-body" id={`ml-lesson-body-${l.id}`}>
                  <ErrorBoundary label={l.title}>
                    <Suspense fallback={<div className="page-loading" role="status">Loading lesson…</div>}>
                      <Lesson />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
