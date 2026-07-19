import { useMemo, useState } from 'react';
import { generateDataset, fitPolynomial, fitTree, complexityCurve } from '../../../lib/mlSandbox.js';
import { PLAYGROUND_INTRO, MODEL_OPTIONS, FIT_ZONES } from '../../../data/ml/playground.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import ScatterFitChart from './ScatterFitChart.jsx';
import ErrorCurveChart from './ErrorCurveChart.jsx';
import '../mlPageShared.css';
import './PlaygroundPage.css';

export default function PlaygroundPage() {
  const [modelId, setModelId] = useState('poly');
  const [noise, setNoise] = useState(0.8);
  const [complexity, setComplexity] = useState(3);
  const [seed, setSeed] = useState(42);

  const intro = useT(PLAYGROUND_INTRO);
  const model = MODEL_OPTIONS.find((m) => m.id === modelId);
  const modelLabel = useT(model.label);
  const complexityLabel = useT(model.complexityLabel);

  const dataset = useMemo(() => generateDataset(noise, seed), [noise, seed]);
  const fitted = useMemo(
    () => (modelId === 'tree' ? fitTree(dataset.train, complexity) : fitPolynomial(dataset.train, complexity)),
    [modelId, dataset, complexity]
  );
  const curve = useMemo(() => complexityCurve(dataset, modelId, model.max), [dataset, modelId, model.max]);

  const bestComplexity = curve.reduce((best, d) => (d.valError < best.valError ? d : best), curve[0]).complexity;
  const zone = complexity <= bestComplexity - 2 ? 'under' : complexity >= bestComplexity + 2 ? 'over' : 'good';
  const zoneText = useT(FIT_ZONES[zone]);

  const trainErr = curve.find((d) => d.complexity === complexity)?.trainError ?? 0;
  const valErr = curve.find((d) => d.complexity === complexity)?.valError ?? 0;

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title">Model Playground</p>
        <p className="ml-section-sub">{intro}</p>

        <div className="pg-controls">
          <div className="pg-control-group">
            <p className="ml-lbl">Model</p>
            <div className="pg-model-toggle">
              {MODEL_OPTIONS.map((m) => (
                <ModelButton key={m.id} option={m} active={modelId === m.id} onClick={() => setModelId(m.id)} />
              ))}
            </div>
          </div>
          <div className="pg-control-group">
            <p className="ml-lbl">Noise level: {noise.toFixed(1)}</p>
            <input type="range" min="0.1" max="2.5" step="0.1" value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="pg-slider" />
          </div>
          <div className="pg-control-group">
            <p className="ml-lbl">{complexityLabel}: {complexity}</p>
            <input type="range" min="1" max={model.max} step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="pg-slider" />
          </div>
          <button type="button" className="pg-regen-btn" onClick={() => setSeed((s) => s + 1)}>
            <i className="ti ti-refresh" aria-hidden="true" /> New sample
          </button>
        </div>

        <div className="pg-charts">
          <div className="pg-chart-block">
            <p className="ml-lbl">Fit — {modelLabel}</p>
            <ScatterFitChart dataset={dataset} predict={fitted.predict} />
            <div className="pg-chart-legend">
              <span><i className="pg-dot pg-dot-train" /> training points</span>
              <span><i className="pg-dot pg-dot-val" /> validation points</span>
              <span><i className="pg-line pg-line-truth" /> true function</span>
            </div>
          </div>
          <div className="pg-chart-block">
            <p className="ml-lbl">Train vs. validation error across all complexities</p>
            <ErrorCurveChart curve={curve} currentComplexity={complexity} />
            <div className="pg-chart-legend">
              <span><i className="pg-line pg-line-train" /> training error</span>
              <span><i className="pg-line pg-line-val" /> validation error</span>
              <span><i className="pg-line pg-line-best" /> best on validation</span>
            </div>
          </div>
        </div>

        <div className={`pg-zone-banner pg-zone-${zone}`}>
          <p className="pg-zone-title">{zone === 'under' ? 'Underfitting' : zone === 'over' ? 'Overfitting' : 'Good fit'}</p>
          <p className="ml-body-text">{zoneText}</p>
          <p className="pg-zone-numbers">
            train MSE {trainErr.toFixed(3)} · validation MSE {valErr.toFixed(3)}
          </p>
        </div>

        <div className="ml-citation-row">
          <MLCitation synthetic />
        </div>
      </div>
    </div>
  );
}

function ModelButton({ option, active, onClick }) {
  const label = useT(option.label);
  return (
    <button type="button" className={`pg-model-btn${active ? ' active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}
