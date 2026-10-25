import { useState } from 'react';
import MathText from '../../components/math/MathText.jsx';
import { PROJECTS, datasetById } from '../../data/projects/index.js';
import { pyExerciseById } from '../../data/python/exercises.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { hashFor } from '../../app/pages.js';
import CodeExercise from '../practice/CodeExercise.jsx';
import '../../styles/studio.css';
import '../learn/learn.css';
import './projects.css';

// Apply → Projects (V4 §7). Each project follows one chain: the question,
// where the data come from, what is assumed, the method, the calculation
// (graded Python, each with a no-code path), then interpretation, a decision
// and the limits of the answer. Progress is saved on this device.

const STEP_KIND = { interpret: 'Interpret', decide: 'Decide' };

function Dataset({ id }) {
  const d = datasetById[id];
  return (
    <div className="proj-dataset">
      <p className="studio-h3">
        {d.title}{' '}
        <span className={`studio-chip ${d.kind === 'real' ? 'studio-chip-accent' : 'studio-chip-warn'}`}>
          {d.kind === 'real' ? 'Real, published data' : 'Synthetic — invented for this course'}
        </span>
      </p>
      <MathText as="p" className="studio-muted" text={d.description} />
      <p className="studio-muted">
        Source: <MathText text={d.source} />
        {d.url && <> (<a href={d.url} target="_blank" rel="noopener noreferrer">source page</a>{d.secondaryUrl && <>, <a href={d.secondaryUrl} target="_blank" rel="noopener noreferrer">paper</a></>})</>}.
        {' '}Licence: {d.license}
      </p>
    </div>
  );
}

function Reflect({ p, st }) {
  const state = useWorkStore((s) => s.projects[p.id]);
  const updateStep = useWorkStore((s) => s.updateStep);
  return (
    <div className="proj-reflect">
      <label htmlFor={`${p.id}-${st.id}`} className="studio-muted"><MathText text={st.reflect} /></label>
      <textarea
        id={`${p.id}-${st.id}`}
        className="studio-textarea"
        defaultValue={state?.steps?.[st.id]?.text ?? ''}
        onBlur={(e) => updateStep(p.id, st.id, { text: e.target.value })}
      />
      <label className="studio-choice">
        <input type="checkbox" checked={!!state?.steps?.[st.id]?.done} onChange={(e) => updateStep(p.id, st.id, { done: e.target.checked })} />
        <span>Done with this step</span>
      </label>
    </div>
  );
}

function Project({ p }) {
  const state = useWorkStore((s) => s.projects[p.id]);
  const results = useWorkStore((s) => s.results);
  const doneCount = p.steps.filter((st) => (st.exercise ? results[st.exercise]?.passed : state?.steps?.[st.id]?.done)).length;
  const calc = p.steps.filter((st) => st.exercise);
  const after = p.steps.filter((st) => !st.exercise);

  return (
    <section className="proj" aria-labelledby={`proj-${p.id}`}>
      <div className="proj-head">
        <h2 id={`proj-${p.id}`} className="studio-h2">{p.title}</h2>
        <span className="studio-chip">{doneCount} of {p.steps.length} steps</span>
      </div>
      <div className="studio-callout"><p className="studio-eyebrow">The question</p><MathText as="p" text={p.question ?? p.summary} /></div>
      <p className="studio-muted">Builds on: {p.lessons.map((l, i) => <span key={l}>{i > 0 && ', '}<a href={hashFor('learn/lesson', { lessonId: l })}>{lessonById[l]?.title}</a></span>)}</p>

      <h3 className="studio-h3">The data</h3>
      {p.datasets.map((d) => <Dataset key={d} id={d} />)}

      {(p.assumptions || p.method) && (
        <div className="lesson-two">
          {p.assumptions && (
            <div>
              <h3 className="studio-h3">Assumptions</h3>
              <ul className="lesson-ul">{p.assumptions.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
            </div>
          )}
          {p.method && (
            <div>
              <h3 className="studio-h3">Method</h3>
              <ol className="lesson-ul">{p.method.map((m) => <li key={m}><MathText text={m} /></li>)}</ol>
            </div>
          )}
        </div>
      )}

      <h3 className="studio-h3">Calculate</h3>
      <ol className="proj-steps">
        {calc.map((st) => (
          <li key={st.id} className="proj-step">
            <p className="studio-h3">{st.title}</p>
            <CodeExercise ex={pyExerciseById[st.exercise]} />
          </li>
        ))}
      </ol>

      {after.map((st) => (
        <div key={st.id} className="proj-step">
          <h3 className="studio-h3">{STEP_KIND[st.kind] ?? st.title}</h3>
          <Reflect p={p} st={st} />
        </div>
      ))}

      {p.limitations && (
        <div className="studio-callout studio-callout-warn">
          <p className="studio-eyebrow">Limits of this answer</p>
          <ul className="lesson-ul">{p.limitations.map((l) => <li key={l}><MathText text={l} /></li>)}</ul>
        </div>
      )}
    </section>
  );
}

const FEATURED = PROJECTS.filter((p) => p.featured);
const MORE = PROJECTS.filter((p) => !p.featured);

export default function ProjectsPage() {
  const [open, setOpen] = useState(FEATURED[0].id);
  const pick = (list, label) => (
    <div className="studio-row" role="group" aria-label={label}>
      {list.map((p) => (
        <button key={p.id} type="button" className="studio-btn studio-btn-small" aria-pressed={open === p.id} onClick={() => setOpen(p.id)}>{p.title}</button>
      ))}
    </div>
  );
  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <p className="studio-lede studio-read">
          Real questions, small datasets you can inspect, and an answer you could defend. Each project goes from the question,
          through where the data come from and what is assumed, to the calculation, an interpretation, a decision — and the
          limits of that decision. Real data are cited; invented data are labelled. Every coding step has a no-code version.
        </p>
        {pick(FEATURED, 'Choose a project')}
        <details className="lesson-disclosure">
          <summary>More projects</summary>
          {pick(MORE, 'More projects')}
        </details>
        {PROJECTS.filter((p) => p.id === open).map((p) => <Project key={p.id} p={p} />)}
        <p className="studio-muted">
          For your own analyses, use the <a href={hashFor('apply/lab')}>Python lab</a>; snippets for common tasks are in the <a href={hashFor('apply/library')}>Python library</a>.
        </p>
      </div>
    </div>
  );
}
