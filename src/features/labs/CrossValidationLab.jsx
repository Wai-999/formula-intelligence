import { useMemo, useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';
import { leastSquares } from './fit.js';

// Cross-validation and leakage. Twenty synthetic points (a straight line plus
// fixed, made-up noise — the same numbers as the lesson’s Python). Each
// round fits a least-squares line on the training folds and scores it on the
// held-out fold. “Peek” fits on everything, validation fold included: the
// score improves for the wrong reason — that is leakage.

const X = Array.from({ length: 20 }, (_, i) => i);
const NOISE = [0.5, -1.2, 0.3, 0.8, -0.4, 1.1, -0.9, 0.2, -0.3, 0.7, -1.0, 0.4, 0.9, -0.6, 0.1, -0.8, 1.2, -0.2, 0.6, -0.5];
const Y = X.map((x, i) => 2 * x + 1 + NOISE[i]);

function foldOf(i, k, scheme) {
  return scheme === 'interleaved' ? i % k : Math.floor((i * k) / X.length);
}

function cvScores(k, scheme, peek) {
  const out = [];
  for (let f = 0; f < k; f++) {
    const tr = X.map((_, i) => i).filter((i) => peek || foldOf(i, k, scheme) !== f);
    const va = X.map((_, i) => i).filter((i) => foldOf(i, k, scheme) === f);
    const fit = leastSquares(tr.map((i) => X[i]), tr.map((i) => Y[i]));
    const mse = va.reduce((s, i) => s + (Y[i] - (fit.m * X[i] + fit.b)) ** 2, 0) / va.length;
    out.push({ fit, mse, va });
  }
  return out;
}

export default function CrossValidationLab() {
  const [k, setK] = useState(5);
  const [scheme, setScheme] = useState('interleaved');
  const [peek, setPeek] = useState(false);
  const [round, setRound] = useState(0);
  const rounds = useMemo(() => cvScores(k, scheme, peek), [k, scheme, peek]);
  const honest = useMemo(() => cvScores(k, scheme, false), [k, scheme]);
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const sd = (a) => (a.length > 1 ? Math.sqrt(a.reduce((s, v) => s + (v - mean(a)) ** 2, 0) / (a.length - 1)) : 0);
  const scores = rounds.map((r) => r.mse);
  const r = rounds[Math.min(round, k - 1)];
  const full = leastSquares(X, Y);
  const trainMse = X.reduce((s, x, i) => s + (Y[i] - (full.m * x + full.b)) ** 2, 0) / X.length;

  const readout = `${k}-fold cross-validation (${scheme} folds${peek ? ', PEEKING at the validation fold' : ''}). Round ${round + 1}: validation MSE ${fmt(r.mse, 3)}. `
    + `Across folds: mean ${fmt(mean(scores), 3)}, standard deviation ${fmt(sd(scores), 3)}. `
    + (peek ? `Honest CV gives ${fmt(mean(honest.map((h) => h.mse)), 3)}; peeking makes it look better without the model being any better. ` : '')
    + `Training error on all 20 points: ${fmt(trainMse, 3)} — optimistic, because the line was fitted to those very points.`;

  return (
    <LabFrame
      title="Cross-validation and leakage"
      intro="Filled points train the line; hollow points are held out and scored. Step through the rounds, then switch on “peek” and compare the average score."
      presets={[{ id: 'k5', label: '5 folds' }, { id: 'k10', label: '10 folds' }, { id: 'loo', label: 'Leave-one-out (20)' }]}
      activePreset={k === 5 ? 'k5' : k === 10 ? 'k10' : k === 20 ? 'loo' : null}
      onPreset={(id) => { setK(id === 'k5' ? 5 : id === 'k10' ? 10 : 20); setRound(0); }}
      onReset={() => { setK(5); setScheme('interleaved'); setPeek(false); setRound(0); }}
      figure={(
        <Plot x={[-1, 20]} y={[-2, 42]} xLabel="x" yLabel="y">
          {({ sx, sy }) => (
            <g>
              <line className="lab-curve" x1={sx(-1)} y1={sy(r.fit.m * -1 + r.fit.b)} x2={sx(20)} y2={sy(r.fit.m * 20 + r.fit.b)} />
              {X.map((x, i) => {
                const val = r.va.includes(i);
                return val
                  ? <circle key={i} cx={sx(x)} cy={sy(Y[i])} r={5} fill="none" stroke="var(--warning)" strokeWidth="2" />
                  : <circle key={i} className="lab-point" cx={sx(x)} cy={sy(Y[i])} r={4} />;
              })}
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Round (which fold is held out)" value={round + 1} min={1} max={k} step={1} format={(v) => `${fmt(v, 0)} of ${k}`} onChange={(v) => setRound(v - 1)} />
          <Segmented label="How rows are assigned to folds" value={scheme} onChange={(v) => { setScheme(v); setRound(0); }} options={[{ value: 'interleaved', label: 'Interleaved' }, { value: 'blocked', label: 'Consecutive blocks' }]} />
          <label className="studio-choice">
            <input type="checkbox" checked={peek} onChange={(e) => setPeek(e.target.checked)} />
            <span>Peek: also train on the held-out fold (leakage)</span>
          </label>
          <dl className="lab-stat">
            <dt>Mean validation MSE</dt><dd>{fmt(mean(scores), 3)}</dd>
            <dt>SD across folds</dt><dd>{fmt(sd(scores), 3)}</dd>
            <dt>Training MSE (all data)</dt><dd>{fmt(trainMse, 3)}</dd>
          </dl>
          <p className="studio-muted">Synthetic data: y = 2x + 1 plus fixed, made-up noise.</p>
        </>
      )}
      table={{
        caption: 'Validation error in each round',
        columns: ['Fold', 'Held-out rows', 'Validation MSE'],
        rows: rounds.map((ro, i) => [i + 1, ro.va.map((j) => j).join(', '), fmt(ro.mse, 4)]),
      }}
      annotations={['Every row is held out exactly once, so every row is scored by a model that never saw it.', 'Consecutive blocks make the first and last folds extrapolate — closer to how a time series must be validated.', 'Report the spread across folds, not only the mean: two models whose means differ by less than that spread are not clearly different.']}
      constraints={['A deliberately tiny dataset so every number can be checked by hand.']}
    />
  );
}
