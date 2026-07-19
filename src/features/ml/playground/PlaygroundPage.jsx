import { useMemo, useState } from 'react';
import { generateDataset, fitPolynomial, fitTree, complexityCurve } from '../../../lib/mlSandbox.js';
import {
  PLAYGROUND_INTRO, MODEL_OPTIONS, FIT_ZONES,
  PG_TITLE, PG_MODEL_LBL, PG_NOISE_LBL, PG_NEW_SAMPLE_BTN, PG_FIT_LBL,
  PG_TRAINING_POINTS, PG_VALIDATION_POINTS, PG_TRUE_FUNCTION, PG_ERROR_CURVE_LBL,
  PG_TRAINING_ERROR, PG_VALIDATION_ERROR, PG_BEST_ON_VAL,
  PG_UNDERFITTING, PG_OVERFITTING, PG_GOOD_FIT, PG_TRAIN_MSE_LBL, PG_VAL_MSE_LBL,
} from '../../../data/ml/playground.js';
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

  const title = useT(PG_TITLE);
  const modelLbl = useT(PG_MODEL_LBL);
  const noiseLbl = useT(PG_NOISE_LBL);
  const newSampleBtn = useT(PG_NEW_SAMPLE_BTN);
  const fitLbl = useT(PG_FIT_LBL);
  const trainingPoints = useT(PG_TRAINING_POINTS);
  const validationPoints = useT(PG_VALIDATION_POINTS);
  const trueFunction = useT(PG_TRUE_FUNCTION);
  const errorCurveLbl = useT(PG_ERROR_CURVE_LBL);
  const trainingError = useT(PG_TRAINING_ERROR);
  const validationError = useT(PG_VALIDATION_ERROR);
  const bestOnVal = useT(PG_BEST_ON_VAL);
  const underfittingLbl = useT(PG_UNDERFITTING);
  const overfittingLbl = useT(PG_OVERFITTING);
  const goodFitLbl = useT(PG_GOOD_FIT);
  const trainMseLbl = useT(PG_TRAIN_MSE_LBL);
  const valMseLbl = useT(PG_VAL_MSE_LBL);

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
        <p className="ml-section-title">{title}</p>
        <p className="ml-section-sub">{intro}</p>

        <div className="pg-controls">
          <div className="pg-control-group">
            <p className="ml-lbl">{modelLbl}</p>
            <div className="pg-model-toggle">
              {MODEL_OPTIONS.map((m) => (
                <ModelButton key={m.id} option={m} active={modelId === m.id} onClick={() => setModelId(m.id)} />
              ))}
            </div>
          </div>
          <div className="pg-control-group">
            <p className="ml-lbl">{noiseLbl}: {noise.toFixed(1)}</p>
            <input type="range" min="0.1" max="2.5" step="0.1" value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="pg-slider" />
          </div>
          <div className="pg-control-group">
            <p className="ml-lbl">{complexityLabel}: {complexity}</p>
            <input type="range" min="1" max={model.max} step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="pg-slider" />
          </div>
          <button type="button" className="pg-regen-btn" onClick={() => setSeed((s) => s + 1)}>
            <i className="ti ti-refresh" aria-hidden="true" /> {newSampleBtn}
          </button>
        </div>

        <div className="pg-charts">
          <div className="pg-chart-block">
            <p className="ml-lbl">{fitLbl} — {modelLabel}</p>
            <ScatterFitChart dataset={dataset} predict={fitted.predict} />
            <div className="pg-chart-legend">
              <span><i className="pg-dot pg-dot-train" /> {trainingPoints}</span>
              <span><i className="pg-dot pg-dot-val" /> {validationPoints}</span>
              <span><i className="pg-line pg-line-truth" /> {trueFunction}</span>
            </div>
          </div>
          <div className="pg-chart-block">
            <p className="ml-lbl">{errorCurveLbl}</p>
            <ErrorCurveChart curve={curve} currentComplexity={complexity} />
            <div className="pg-chart-legend">
              <span><i className="pg-line pg-line-train" /> {trainingError}</span>
              <span><i className="pg-line pg-line-val" /> {validationError}</span>
              <span><i className="pg-line pg-line-best" /> {bestOnVal}</span>
            </div>
          </div>
        </div>

        <div className={`pg-zone-banner pg-zone-${zone}`}>
          <p className="pg-zone-title">{zone === 'under' ? underfittingLbl : zone === 'over' ? overfittingLbl : goodFitLbl}</p>
          <p className="ml-body-text">{zoneText}</p>
          <p className="pg-zone-numbers">
            {trainMseLbl} {trainErr.toFixed(3)} · {valMseLbl} {valErr.toFixed(3)}
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
