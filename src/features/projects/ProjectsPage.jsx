import { useState } from 'react';
import { PROJECTS, datasetById } from '../../data/projects/index.js';
import { pyExerciseById } from '../../data/python/exercises.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { hashFor } from '../../app/pages.js';
import CodeExercise from '../practice/CodeExercise.jsx';
import '../../styles/studio.css';
import '../learn/learn.css';
import './projects.css';

// Applied projects (§5 "real-world project bridges", §9 "small applied
// dataset analysis"). Each step is a graded exercise or a short written
// reflection; progress is saved on this device.

function Dataset({ id }) {
  const d = datasetById[id];
  return (
    <div className="proj-dataset">
      <p className="studio-h3">{d.title} <span className={`studio-chip ${d.kind === 'real' ? 'studio-chip-accent' : ''}`}>{d.kind === 'real' ? 'Real, published data' : 'Synthetic — made up for this course'}</span></p>
      <p className="studio-muted">{d.description}</p>
      <p className="studio-muted">Source: {d.source}{d.url && <> (<a href={d.url} target="_blank" rel="noopener noreferrer">link</a>{d.secondaryUrl && <>, <a href={d.secondaryUrl} target="_blank" rel="noopener noreferrer">overview</a></>})</>}. Licence: {d.license}</p>
    </div>
  );
}

function Project({ p }) {
  const state = useWorkStore((s) => s.projects[p.id]);
  const results = useWorkStore((s) => s.results);
  const updateStep = useWorkStore((s) => s.updateStep);
  const doneCount = p.steps.filter((st) => (st.exercise ? results[st.exercise]?.passed : state?.steps?.[st.id]?.done)).length;

  return (
    <section className="proj" aria-labelledby={`proj-${p.id}`}>
      <div className="proj-head">
        <h2 id={`proj-${p.id}`} className="studio-h2">{p.title}</h2>
        <span className="studio-chip">{doneCount} of {p.steps.length} steps</span>
      </div>
      <p className="studio-lede">{p.summary}</p>
      <p className="studio-muted">Builds on: {p.lessons.map((l, i) => <span key={l}>{i > 0 && ', '}<a href={hashFor('learn/lesson', { lessonId: l })}>{lessonById[l]?.title}</a></span>)}</p>
      {p.datasets.map((d) => <Dataset key={d} id={d} />)}
      <ol className="proj-steps">
        {p.steps.map((st) => (
          <li key={st.id} className="proj-step">
            <p className="studio-h3">{st.title}</p>
            {st.exercise ? <CodeExercise ex={pyExerciseById[st.exercise]} /> : (
              <div className="proj-reflect">
                <label htmlFor={`${p.id}-${st.id}`} className="studio-muted">{st.reflect}</label>
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
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ProjectsPage() {
  const [open, setOpen] = useState(PROJECTS[0].id);
  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <p className="studio-lede studio-read">
          Small end-to-end analyses that join a lesson’s mathematics to a real question. Every dataset says where it comes
          from; invented data are labelled as such. For free-form work, use the <a href={hashFor('projects/lab')}>Python lab</a>.
        </p>
        <div className="studio-row" role="group" aria-label="Choose a project">
          {PROJECTS.map((p) => (
            <button key={p.id} type="button" className="studio-btn studio-btn-small" aria-pressed={open === p.id} onClick={() => setOpen(p.id)}>{p.title}</button>
          ))}
        </div>
        {PROJECTS.filter((p) => p.id === open).map((p) => <Project key={p.id} p={p} />)}
      </div>
    </div>
  );
}
