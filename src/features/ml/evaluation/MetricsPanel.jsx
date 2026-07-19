import { useMemo, useState } from 'react';
import { generateDataset, fitPolynomial, fitTree, computeMetrics } from '../../../lib/mlSandbox.js';
import {
  METRICS_INTRO, METRIC_DEFS, EV_METRICS_TITLE, EV_POLY_BTN, EV_TREE_BTN, EV_COMPLEXITY_LBL,
} from '../../../data/ml/evaluation.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';

function MetricRow({ def, value }) {
  const name = useT(def.name);
  const note = useT(def.note);
  return (
    <div className="mp-row">
      <div className="mp-row-head">
        <span className="mp-metric-label">{def.label}</span>
        <span className="mp-metric-value">{Number.isFinite(value) ? value.toFixed(3) : '—'}</span>
      </div>
      <p className="mp-row-name">{name}</p>
      <p className="mp-row-note">{note}</p>
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
    <div className="ml-section">
      <p className="ml-section-title">{title}</p>
      <p className="ml-section-sub">{intro}</p>
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
          <MetricRow key={def.key} def={def} value={metrics[def.key]} />
        ))}
      </div>
      <div className="ml-citation-row"><MLCitation section="5" /></div>
    </div>
  );
}
