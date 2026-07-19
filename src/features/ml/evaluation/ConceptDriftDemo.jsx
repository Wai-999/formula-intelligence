import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { generateDriftSeries, fitPolynomial, meanSquaredError } from '../../../lib/mlSandbox.js';
import {
  DRIFT_INTRO, EV_DRIFT_TITLE, EV_RETRAIN_THRESHOLD_LBL, EV_REGIME_CHANGE_LBL,
  EV_TIME_PROGRESS_LBL, EV_DRIFT_ALERT, EV_DRIFT_OK,
} from '../../../data/ml/evaluation.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';

const W = 620;
const H = 220;
const MARGIN = { top: 16, right: 16, bottom: 26, left: 40 };
const THRESHOLD = 3.5;

export default function ConceptDriftDemo() {
  const [progress, setProgress] = useState(24);
  const intro = useT(DRIFT_INTRO);
  const title = useT(EV_DRIFT_TITLE);
  const retrainThresholdLbl = useT(EV_RETRAIN_THRESHOLD_LBL);
  const regimeChangeLbl = useT(EV_REGIME_CHANGE_LBL);
  const timeProgressLbl = useT(EV_TIME_PROGRESS_LBL);
  const driftAlert = useT(EV_DRIFT_ALERT);
  const driftOk = useT(EV_DRIFT_OK);
  const { points, breakAt } = useMemo(() => generateDriftSeries(), []);

  // A model trained ONLY on the pre-break regime — its error against every
  // subsequent point is what the "drift" line tracks.
  const trainSlice = points.slice(0, breakAt).map((p) => ({ x: p.x, y: p.y }));
  const { predict } = useMemo(() => fitPolynomial(trainSlice, 1), [trainSlice]);

  const rollingError = points.map((p, i) => {
    const windowStart = Math.max(0, i - 3);
    const windowPts = points.slice(windowStart, i + 1).map((q) => ({ x: q.x, y: q.y }));
    return { t: p.t, error: windowPts.length ? meanSquaredError(windowPts, predict) : 0 };
  });

  const visible = rollingError.slice(0, progress + 1);
  const driftDetected = visible.some((d, i) => i > breakAt && d.error > THRESHOLD);

  const x = d3.scaleLinear().domain([0, points.length - 1]).range([MARGIN.left, W - MARGIN.right]);
  const maxErr = Math.max(THRESHOLD * 1.6, d3.max(rollingError, (d) => d.error) || 1);
  const y = d3.scaleLinear().domain([0, maxErr]).range([H - MARGIN.bottom, MARGIN.top]);
  const line = d3.line().x((d) => x(d.t)).y((d) => y(d.error));

  return (
    <div className="ml-section">
      <p className="ml-section-title">{title}</p>
      <p className="ml-section-sub">{intro}</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="drift-chart" role="img" aria-label="Rolling model error over time, spiking after a regime change">
        <line x1={MARGIN.left} x2={W - MARGIN.right} y1={y(THRESHOLD)} y2={y(THRESHOLD)} className="drift-threshold-line" />
        <text x={W - MARGIN.right} y={y(THRESHOLD) - 4} textAnchor="end" className="drift-threshold-label">{retrainThresholdLbl}</text>
        <line x1={x(breakAt)} x2={x(breakAt)} y1={MARGIN.top} y2={H - MARGIN.bottom} className="drift-break-line" />
        <text x={x(breakAt) + 4} y={MARGIN.top + 10} className="drift-break-label">{regimeChangeLbl}</text>
        <path d={line(visible)} className="drift-error-line" />
        {visible.length > 0 && (
          <circle cx={x(visible[visible.length - 1].t)} cy={y(visible[visible.length - 1].error)} r={4} className="drift-current-dot" />
        )}
      </svg>

      <input
        type="range" min={breakAt - 4 > 0 ? breakAt - 4 : 0} max={points.length - 1} value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        className="pg-slider drift-scrub"
      />
      <p className="ml-lbl">{timeProgressLbl}: t = {progress}</p>

      {driftDetected ? (
        <div className="drift-flag drift-flag-alert">
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          {driftAlert}
        </div>
      ) : (
        <div className="drift-flag drift-flag-ok">
          <i className="ti ti-circle-check" aria-hidden="true" />
          {driftOk}
        </div>
      )}
      <div className="ml-citation-row"><MLCitation synthetic /></div>
    </div>
  );
}
