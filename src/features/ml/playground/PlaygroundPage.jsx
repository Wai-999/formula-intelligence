import { useEffect, useMemo, useState } from 'react';
import { generateDataset, fitPolynomial, fitTree, complexityCurve } from '../../../lib/mlSandbox.js';
import {
  PLAYGROUND_INTRO, MODEL_OPTIONS, FIT_ZONES,
  PG_TITLE, PG_MODEL_LBL, PG_NOISE_LBL, PG_NEW_SAMPLE_BTN, PG_FIT_LBL,
  PG_TRAINING_POINTS, PG_VALIDATION_POINTS, PG_TRUE_FUNCTION, PG_ERROR_CURVE_LBL,
  PG_TRAINING_ERROR, PG_VALIDATION_ERROR, PG_BEST_ON_VAL,
  PG_UNDERFITTING, PG_OVERFITTING, PG_GOOD_FIT, PG_TRAIN_MSE_LBL, PG_VAL_MSE_LBL,
  PG_SPARK_ANALOGY, PG_SPARK_PREDICT_Q, PG_SPARK_PREDICT_YES, PG_SPARK_PREDICT_NO,
  PG_TRY_FIRST_PROMPT, PG_REVEAL_BTN, PG_REVEAL_INTRO,
  PG_FORMALISM_WORKED, PG_FORMALISM_FADED, PG_MECHANISM_NOTE,
  PG_CF_ANALOGY_BREAK, PG_CF_CAVEAT, PG_CF_RETRIEVAL_Q, PG_CF_RETRIEVAL_A,
} from '../../../data/ml/playground.js';
import { UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import ScatterFitChart from './ScatterFitChart.jsx';
import ErrorCurveChart from './ErrorCurveChart.jsx';
import '../mlPageShared.css';
import './PlaygroundPage.css';

const NODE_ID = 'playground-biasvariance';

function SparkLayer() {
  const analogy = useT(PG_SPARK_ANALOGY);
  return (
    <div className="pg-depth-layer">
      <p className="ml-body-text">{analogy}</p>
      <PredictGate
        predictId="playground-spark" nodeId={NODE_ID} layer="spark" variant="inline"
        question={PG_SPARK_PREDICT_Q} options={[PG_SPARK_PREDICT_YES, PG_SPARK_PREDICT_NO]} correctIndex={0}
        explain={PG_CF_RETRIEVAL_A}
      />
    </div>
  );
}

function MechanismLayer() {
  const note = useT(PG_MECHANISM_NOTE);
  return <div className="pg-depth-layer"><p className="ml-body-text">{note}</p></div>;
}

function FormalismLayer() {
  const worked = useT(PG_FORMALISM_WORKED);
  const faded = useT(PG_FORMALISM_FADED);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="pg-depth-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}

function CriticalFrontierLayer() {
  const analogyBreak = useT(PG_CF_ANALOGY_BREAK);
  const caveat = useT(PG_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="pg-depth-layer">
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={PG_CF_RETRIEVAL_Q} answer={PG_CF_RETRIEVAL_A} />
    </div>
  );
}

export default function PlaygroundPage() {
  const [modelId, setModelId] = useState('poly');
  const [noise, setNoise] = useState(0.8);
  const [complexity, setComplexity] = useState(3);
  const [seed, setSeed] = useState(42);
  const [revealed, setRevealed] = useState(false);

  // Productive Failure (docs/research/ML-Mode-Pedagogy-Research.md §1): a
  // fresh sample or a model switch is a new "try to find the best fit"
  // challenge, so error feedback and the explanation both re-hide until the
  // learner reveals again. Adjusting noise/complexity mid-attempt does not
  // reset — those are the learner's own exploration, not a new challenge.
  useEffect(() => { setRevealed(false); }, [seed, modelId]);

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
  const tryFirstPrompt = useT(PG_TRY_FIRST_PROMPT);
  const revealBtn = useT(PG_REVEAL_BTN);
  const revealIntro = useT(PG_REVEAL_INTRO);

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

        {!revealed && <p className="pg-try-first-prompt"><i className="ti ti-target-arrow" aria-hidden="true" /> {tryFirstPrompt}</p>}

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
          {revealed && (
            <div className="pg-chart-block">
              <p className="ml-lbl">{errorCurveLbl}</p>
              <ErrorCurveChart curve={curve} currentComplexity={complexity} />
              <div className="pg-chart-legend">
                <span><i className="pg-line pg-line-train" /> {trainingError}</span>
                <span><i className="pg-line pg-line-val" /> {validationError}</span>
                <span><i className="pg-line pg-line-best" /> {bestOnVal}</span>
              </div>
            </div>
          )}
        </div>

        {!revealed ? (
          <button type="button" className="pg-reveal-btn" onClick={() => setRevealed(true)}>
            <i className="ti ti-eye" aria-hidden="true" /> {revealBtn}
          </button>
        ) : (
          <>
            <p className="ml-lbl">{revealIntro}</p>
            <div className={`pg-zone-banner pg-zone-${zone}`}>
              <p className="pg-zone-title">{zone === 'under' ? underfittingLbl : zone === 'over' ? overfittingLbl : goodFitLbl}</p>
              <p className="ml-body-text">{zoneText}</p>
              <p className="pg-zone-numbers">
                {trainMseLbl} {trainErr.toFixed(3)} · {valMseLbl} {valErr.toFixed(3)}
              </p>
            </div>
          </>
        )}

        <div className="ml-citation-row">
          <MLCitation synthetic />
        </div>
      </div>

      {revealed && (
        <div className="ml-section">
          <DepthLadder
            nodeId={NODE_ID}
            spark={<SparkLayer />}
            mechanism={<MechanismLayer />}
            formalism={<FormalismLayer />}
            criticalFrontier={<CriticalFrontierLayer />}
          />
        </div>
      )}
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
