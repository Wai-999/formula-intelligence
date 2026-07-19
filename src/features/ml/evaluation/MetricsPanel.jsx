import { useMemo, useState } from 'react';
import { generateDataset, fitPolynomial, fitTree, computeMetrics } from '../../../lib/mlSandbox.js';
import {
  METRICS_INTRO, METRIC_DEFS, EV_METRICS_TITLE, EV_POLY_BTN, EV_TREE_BTN, EV_COMPLEXITY_LBL,
  EV_SPARK_ANALOGY, EV_SPARK_PREDICT_Q, EV_SPARK_PREDICT_YES, EV_SPARK_PREDICT_NO,
  EV_FORMALISM_WORKED, EV_FORMALISM_FADED, EV_MECHANISM_NOTE,
  EV_CF_ANALOGY_BREAK, EV_CF_CAVEAT, EV_CF_RETRIEVAL_Q, EV_CF_RETRIEVAL_A,
  EV_METRICS_PREDICT_Q, EV_METRICS_PREDICT_SHRINKS, EV_METRICS_PREDICT_WIDENS, EV_METRICS_PREDICT_EXPLAIN,
} from '../../../data/ml/evaluation.js';
import { UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import MisconceptionCallout from '../../../components/ml/learning/MisconceptionCallout.jsx';

// One consolidated Depth Ladder for the whole Evaluation module (Metrics +
// Backtest + SHAP/LIME + Drift), anchored here where the Exactness fix
// lives, rather than four shallow ladders on four tightly-coupled sub-panels
// of one page — see BUILD_LOG.md Module 5 for the reasoning (mission's own
// "full depth over broad shallow coverage" principle, D.1).
const NODE_ID = 'evaluation-metrics';

function MetricRow({ def, metric }) {
  const name = useT(def.name);
  const note = useT(def.note);
  const hasValue = metric && Number.isFinite(metric.value);
  return (
    <div className="mp-row">
      <div className="mp-row-head">
        <span className="mp-metric-label">{def.label}</span>
        <span className="mp-metric-value">
          {hasValue ? `${metric.value.toFixed(3)} ± ${metric.margin.toFixed(3)}` : '—'}
        </span>
      </div>
      <p className="mp-row-name">{name}</p>
      <p className="mp-row-note">{note}</p>
    </div>
  );
}

function SparkLayer() {
  const analogy = useT(EV_SPARK_ANALOGY);
  return (
    <div className="mp-depth-layer">
      <p className="ml-body-text">{analogy}</p>
      <PredictGate
        predictId="evaluation-spark" nodeId={NODE_ID} layer="spark" variant="inline"
        question={EV_SPARK_PREDICT_Q} options={[EV_SPARK_PREDICT_YES, EV_SPARK_PREDICT_NO]} correctIndex={1}
        explain={EV_CF_RETRIEVAL_A}
      />
    </div>
  );
}

function MechanismLayer() {
  const note = useT(EV_MECHANISM_NOTE);
  return <div className="mp-depth-layer"><p className="ml-body-text">{note}</p></div>;
}

function FormalismLayer() {
  const worked = useT(EV_FORMALISM_WORKED);
  const faded = useT(EV_FORMALISM_FADED);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="mp-depth-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}

function CriticalFrontierLayer() {
  const analogyBreak = useT(EV_CF_ANALOGY_BREAK);
  const caveat = useT(EV_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="mp-depth-layer">
      <MisconceptionCallout misconceptionId="exactness" />
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={EV_CF_RETRIEVAL_Q} answer={EV_CF_RETRIEVAL_A} />
    </div>
  );
}

export default function MetricsPanel() {
  const [modelId, setModelId] = useState('poly');
  const [complexity, setComplexity] = useState(4);
  const intro = useT(METRICS_INTRO);
  const title = useT(EV_METRICS_TITLE);
  const polyBtn = useT(EV_POLY_BTN);
  const treeBtn = useT(EV_TREE_BTN);
  const complexityLbl = useT(EV_COMPLEXITY_LBL);

  const dataset = useMemo(() => generateDataset(0.8, 42), []);
  const fitted = useMemo(
    () => (modelId === 'tree' ? fitTree(dataset.train, complexity) : fitPolynomial(dataset.train, complexity)),
    [modelId, dataset, complexity]
  );
  const metrics = useMemo(() => computeMetrics(dataset.val, fitted.predict, complexity + 1), [dataset, fitted, complexity]);

  return (
    <>
      <div className="ml-section">
        <p className="ml-section-title">{title}</p>
        <p className="ml-section-sub">{intro}</p>
        <PredictGate
          predictId="evaluation-metrics-margin" nodeId={NODE_ID} layer="mechanism"
          question={EV_METRICS_PREDICT_Q}
          options={[EV_METRICS_PREDICT_SHRINKS, EV_METRICS_PREDICT_WIDENS]}
          correctIndex={1}
          explain={EV_METRICS_PREDICT_EXPLAIN}
        >
          <div className="mp-controls">
            <div className="pg-model-toggle">
              <button type="button" className={`pg-model-btn${modelId === 'poly' ? ' active' : ''}`} onClick={() => setModelId('poly')}>{polyBtn}</button>
              <button type="button" className={`pg-model-btn${modelId === 'tree' ? ' active' : ''}`} onClick={() => setModelId('tree')}>{treeBtn}</button>
            </div>
            <div className="mp-complexity">
              <span className="ml-lbl">{complexityLbl}: {complexity}</span>
              <input type="range" min="1" max={modelId === 'tree' ? 8 : 12} value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="pg-slider" />
            </div>
          </div>
          <div className="mp-grid">
            {METRIC_DEFS.map((def) => (
              <MetricRow key={def.key} def={def} metric={metrics[def.key]} />
            ))}
          </div>
        </PredictGate>
        <div className="ml-citation-row"><MLCitation section="5" /></div>
      </div>

      <div className="ml-section">
        <DepthLadder
          nodeId={NODE_ID}
          spark={<SparkLayer />}
          mechanism={<MechanismLayer />}
          formalism={<FormalismLayer />}
          criticalFrontier={<CriticalFrontierLayer />}
        />
      </div>
    </>
  );
}
