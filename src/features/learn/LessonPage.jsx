import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useUIStore } from '../../store/useUIStore.js';
import { usePyLabStore } from '../../store/usePyLabStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { assessCompetency, LEVEL_LABEL } from '../../lib/mastery.js';
import { hashFor } from '../../app/pages.js';
// Registers course and lesson titles for the page header and breadcrumbs.
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import './learn.css';

const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

// The ten elements of §6, in teaching order: understand → visualize →
// derive → practice → apply → review.
const SECTIONS = [
  { id: 'question', title: 'The question' },
  { id: 'before', title: 'Before you start' },
  { id: 'see', title: 'See it' },
  { id: 'why', title: 'Why it works' },
  { id: 'examples', title: 'Worked examples' },
  { id: 'predict', title: 'Predict first' },
  { id: 'practice', title: 'Practice' },
  { id: 'checkpoint', title: 'Checkpoint' },
  { id: 'python', title: 'In Python' },
  { id: 'next', title: 'Keep going' },
];

function scrollToSection(lessonId, id) {
  const el = document.getElementById(`lesson-${lessonId}-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.querySelector('h2')?.focus({ preventScroll: true });
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
      <textarea id={`notes-${lessonId}`} className="studio-textarea" value={text} onChange={(e) => onChange(e.target.value)} placeholder="What clicked? What is still fuzzy? Notes are saved on this device and collected in Notebook → Lesson notes." />
      <p className="studio-muted" role="status">{state === 'saved' ? 'Saved.' : state === 'typing' ? 'Saving…' : ''}</p>
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
  const [current, setCurrent] = useState('question');
  const openLesson = useLearningStore((s) => s.openLesson);
  const level = useMLUIStore((s) => s.level);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!meta) return undefined;
    let live = true;
    openLesson(meta.id);
    meta.load().then((m) => { if (live) setBody(m.default); }).catch((e) => { if (live) setLoadError(e); });
    return () => { live = false; };
  }, [meta, openLesson]);

  // Which section is being read: the last one whose top has scrolled past
  // the sticky progress bar. (An IntersectionObserver band picked the wrong
  // section whenever two short sections shared it.)
  useEffect(() => {
    const root = rootRef.current;
    if (!body || !root) return undefined;
    let timer = 0;
    const update = () => {
      timer = 0;
      const line = root.getBoundingClientRect().top + 120;
      let cur = 'question';
      for (const sec of root.querySelectorAll('.lesson-section')) {
        if (sec.getBoundingClientRect().top <= line) cur = sec.dataset.section;
      }
      setCurrent(cur);
    };
    // A short timer rather than requestAnimationFrame: rAF is paused in
    // background or unpainted documents, and correctness must not depend on paint.
    const onScroll = () => { if (!timer) timer = setTimeout(update, 60); };
    root.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { root.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, [body]);

  const course = meta ? courseById[meta.course] : null;
  const unit = meta ? unitById[meta.unit] : null;
  const neighbours = useMemo(() => {
    if (!unit) return {};
    const i = unit.lessons.indexOf(meta.id);
    return { prev: lessonById[unit.lessons[i - 1]], next: lessonById[unit.lessons[i + 1]] };
  }, [unit, meta]);

  if (!meta) return <NotFound lessonId={lessonId} />;
  if (loadError) return <div className="studio-page"><p className="studio-callout studio-callout-bad">This lesson could not be loaded. Check your connection and reload the page.</p></div>;
  if (!body) return <div className="page-loading" role="status">Loading the lesson…</div>;

  const idx = SECTIONS.findIndex((s) => s.id === current);
  const nextSection = SECTIONS[idx + 1];
  const levels = ['scaffolded', 'independent', 'transfer'];

  return (
    <div className="studio-scroll lesson-scroll" ref={rootRef}>
      <div className="lesson-progress" aria-label="Lesson progress">
        <span className="lesson-progress-text">Section {idx + 1} of {SECTIONS.length} · {SECTIONS[idx].title}</span>
        <span className="lesson-progress-bar" aria-hidden="true"><span style={{ width: `${((idx + 1) / SECTIONS.length) * 100}%` }} /></span>
        {nextSection && (
          <button type="button" className="studio-btn studio-btn-small" onClick={() => scrollToSection(meta.id, nextSection.id)}>
            Next: {nextSection.title}
          </button>
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
              <span className="studio-chip studio-chip-warn" title="See Sources and docs/CONTENT_QA.md"><i className="ti ti-alert-triangle" aria-hidden="true" /> Awaiting independent math review</span>
            </div>
          </header>

          <Section lessonId={meta.id} id="question" title="The question" n={1}>
            <div className="studio-callout lesson-question"><MathText as="p" text={body.intuition.question} /></div>
            {body.intuition.body.map((p, i) => <MathText key={i} as="p" className="lesson-p" text={p} />)}
          </Section>

          <Section lessonId={meta.id} id="before" title="Before you start" n={2}>
            <h3 className="studio-h3">Notation</h3>
            <dl className="lesson-glossary">
              {body.glossary.map((g) => (
                <div key={g.term}>
                  <dt><MathText text={g.term} /></dt>
                  <dd><MathText text={g.meaning} /></dd>
                </div>
              ))}
            </dl>
            <h3 className="studio-h3">Quick check: do you have what this lesson builds on?</h3>
            <p className="studio-muted">
              It uses {meta.prerequisites.map((p, i) => (
                <span key={p}>{i > 0 && ', '}<a href={hashFor('maps/concepts', { conceptId: p })}>{conceptById[p]?.title ?? p}</a></span>
              ))}. If these two feel shaky, the linked concepts show where they are taught.
            </p>
            {body.priorCheck.map((it, i) => <ItemCard key={it.id} item={it} index={i} source="prior" />)}
          </Section>

          <Section lessonId={meta.id} id="see" title="See it" n={3}>
            <MathText as="p" className="lesson-p" text={body.visualization.intro} />
            <LabHost id={body.visualization.lab} config={body.visualization.config} />
            <p className="studio-muted lesson-alt"><strong>Without the picture:</strong> {body.visualization.textAlternative}</p>
            {body.visualization.more?.map((m) => (
              <div key={m.lab} className="lesson-more-lab">
                <h3 className="studio-h3">Going further</h3>
                <MathText as="p" className="lesson-p" text={m.intro} />
                <LabHost id={m.lab} config={m.config} />
              </div>
            ))}
          </Section>

          <Section lessonId={meta.id} id="why" title="Why it works" n={4}>
            <MathText as="p" className="lesson-p" text={body.derivation.intro} />
            <ol className="lesson-steps">
              {body.derivation.steps.map((s, i) => (
                <li key={i}>
                  <MathText as="p" text={s.say} />
                  {s.math && <MathBlock tex={s.math} />}
                </li>
              ))}
            </ol>
            <div className="lesson-two">
              <div>
                <h3 className="studio-h3">Assumptions</h3>
                <ul className="lesson-ul">{body.derivation.assumptions.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
              </div>
              <div>
                <h3 className="studio-h3">Domain and restrictions</h3>
                <ul className="lesson-ul">{body.derivation.domain.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
              </div>
            </div>
            {meta.formulas.map((fid) => formulaById[fid] && (
              <div key={fid} className="lesson-formula">
                <p className="studio-eyebrow">Result · {formulaById[fid].claim}</p>
                <MathBlock tex={formulaById[fid].latex} label={formulaById[fid].title} />
              </div>
            ))}
          </Section>

          <Section lessonId={meta.id} id="examples" title="Worked examples" n={5}>
            {body.examples.map((ex) => (
              <article key={ex.title} className="lesson-example">
                <h3 className="studio-h3">{ex.title}</h3>
                <MathText as="p" text={ex.problem} />
                <ol className="lesson-steps compact">{ex.steps.map((s, i) => <li key={i}><MathText text={s} /></li>)}</ol>
                <p className="lesson-answer"><MathText text={ex.answer} /></p>
              </article>
            ))}
            {body.counterexample && (
              <div className="studio-callout studio-callout-warn">
                <p className="studio-eyebrow">Non-example</p>
                <h3 className="studio-h3">{body.counterexample.title}</h3>
                {body.counterexample.body.map((p, i) => <MathText key={i} as="p" text={p} />)}
              </div>
            )}
          </Section>

          <Section lessonId={meta.id} id="predict" title="Predict first" n={6}>
            <PredictCard predict={body.predict} />
          </Section>

          <Section lessonId={meta.id} id="practice" title="Practice" n={7}>
            <p className="studio-muted">Three levels: scaffolded (steps given), independent (just the question), and transfer (the idea in a new setting). Hints never cost you anything except that the item then counts as an easier one.</p>
            {levels.map((lv) => {
              const items = body.practice.filter((p) => p.level === lv);
              if (!items.length) return null;
              return (
                <div key={lv} className="lesson-level">
                  <h3 className="studio-h3">{lv[0].toUpperCase() + lv.slice(1)}</h3>
                  {items.map((it, i) => <ItemCard key={it.id} item={it} index={i} source="practice" />)}
                </div>
              );
            })}
          </Section>

          <Section lessonId={meta.id} id="checkpoint" title="Checkpoint" n={8}>
            <CheckpointSection meta={meta} items={body.checkpoint} />
          </Section>

          <Section lessonId={meta.id} id="python" title="In Python" n={9}>
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
                  useUIStore.getState().goTo('projects/lab');
                }}
              >
                <i className="ti ti-player-play" aria-hidden="true" /> Run it in the Python lab
              </button>
              <span className="studio-muted">Runs in your browser; the first run downloads Python (about 10 MB).</span>
            </div>
          </Section>

          <Section lessonId={meta.id} id="next" title="Keep going" n={10}>
            <div className="lesson-two">
              <div>
                <h3 className="studio-h3">Further reading</h3>
                <ul className="lesson-ul">
                  {body.reading.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a> — {r.source}. <span className="studio-muted">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="studio-h3">Connections</h3>
                <ul className="lesson-ul">
                  {meta.concepts.map((c) => <li key={c}>Concept: <a href={hashFor('maps/concepts', { conceptId: c })}>{conceptById[c]?.title}</a> on the concept map</li>)}
                  {meta.formulaMap.map((id) => nodeById[id] && (
                    <li key={id}>Formula map: <button type="button" className="link-btn" onClick={() => useUIStore.getState().viewOnMap(id, null)}>{nodeById[id].name}</button></li>
                  ))}
                  {meta.models.map((id) => mlNodeById[id] && (
                    <li key={id}>Model map: <button type="button" className="link-btn" onClick={() => { useUIStore.getState().goTo('maps/models'); useMLUIStore.getState().selectModel(id); }}>{mlNodeById[id].name}</button></li>
                  ))}
                  {meta.next.map((id) => (lessonById[id]
                    ? <li key={id}>Next: <a href={hashFor('learn/lesson', { lessonId: id })}>{lessonById[id].title}</a></li>
                    : null))}
                </ul>
              </div>
            </div>
            <h3 className="studio-h3">Review</h3>
            <p className="studio-muted">Skills from this lesson come back for a short review on an expanding schedule (1, 3, 7, 14, 30, 60 days). Missing a day never resets anything; due reviews simply wait for you on Home.</p>
            <CompetencyStatus ids={meta.competencies} />
            {level === 'beginner' && <p className="studio-muted">Tip: switch the depth to Researcher in the header for more technical explanations elsewhere in the app.</p>}
          </Section>

          <nav className="lesson-pager" aria-label="Lessons in this unit">
            {neighbours.prev ? <a className="studio-btn" href={hashFor('learn/lesson', { lessonId: neighbours.prev.id })}>← {neighbours.prev.title}</a> : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>← {course.title}</a>}
            {neighbours.next ? <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: neighbours.next.id })}>{neighbours.next.title} →</a> : <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Back to the course →</a>}
          </nav>
        </article>

        <aside className="lesson-aside" aria-label="Lesson tools">
          <nav aria-label="On this page" className="lesson-toc">
            <p className="studio-eyebrow">On this page</p>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className={`toc-btn${s.id === current ? ' on' : ''}`} aria-current={s.id === current ? 'location' : undefined} onClick={() => scrollToSection(meta.id, s.id)}>
                    {i + 1}. {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div>
            <p className="studio-eyebrow">Builds on</p>
            <ul className="studio-list lesson-builds-on">
              {meta.prerequisites.map((p) => <li key={p}><a href={hashFor('maps/concepts', { conceptId: p })}>{conceptById[p]?.title ?? p}</a></li>)}
            </ul>
          </div>
          <NotesBox lessonId={meta.id} />
        </aside>
      </div>
    </div>
  );
}
