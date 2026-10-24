import { useState } from 'react';
import { PY_EXERCISES, EXERCISE_TYPES } from '../../data/python/exercises.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { hashFor } from '../../app/pages.js';
import CodeExercise from './CodeExercise.jsx';
import '../../styles/studio.css';
import '../learn/learn.css';

const LABEL = {
  implement: 'Implement', 'fill-gap': 'Fill the gap', 'predict-output': 'Predict the output', debug: 'Debug',
  'numpy-compare': 'Compare with NumPy', visualize: 'Visualize', interpret: 'Interpret', analyze: 'Analyze data',
};

export default function CodeExercisesPage() {
  const [type, setType] = useState('all');
  const results = useWorkStore((s) => s.results);
  const list = PY_EXERCISES.filter((e) => !e.project && (type === 'all' || e.type === type));
  const solved = PY_EXERCISES.filter((e) => results[e.id]?.passed).length;

  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <div className="studio-section studio-read">
          <p className="studio-lede">
            Graded Python, run in your browser. Your code is checked by tests that compare numbers with a tolerance —
            never by matching printed digits — and each failing check says what it expected.
          </p>
          <p className="studio-muted">
            {solved} of {PY_EXERCISES.length} solved (including project steps). The first check downloads Python (about 10 MB,
            once); after that it works offline only if your browser kept it cached. Code runs in a background worker and is
            stopped after 20 seconds, so an endless loop cannot freeze the page. Drafts are saved on this device.
          </p>
        </div>
        <div className="studio-row" role="group" aria-label="Exercise type">
          {['all', ...EXERCISE_TYPES].map((t) => (
            <button key={t} type="button" className="studio-btn studio-btn-small" aria-pressed={type === t} onClick={() => setType(t)}>
              {t === 'all' ? 'All' : LABEL[t]}
            </button>
          ))}
        </div>
        {list.length === 0 && <p className="studio-muted">No standalone exercise of this type — see the project steps under Projects.</p>}
        {list.map((ex) => (
          <div key={ex.id} className="studio-section">
            {ex.lesson && <p className="studio-muted">From the lesson <a href={hashFor('learn/lesson', { lessonId: ex.lesson })}>{lessonById[ex.lesson]?.title}</a></p>}
            <CodeExercise ex={ex} />
          </div>
        ))}
      </div>
    </div>
  );
}
