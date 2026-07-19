import * as d3 from 'd3';
import { useT } from '../../../lib/mlContent.js';
import { useHorizontalScrollHint } from '../../../lib/useHorizontalScrollHint.js';
import { logLogQuantity, mlQuantity } from './demandModel.js';
import { MICRO_UNITS_LABEL } from '../../../data/ml/domains/micro.js';
import './DemandCurveChart.css';

const W = 640;
const H = 300;
const MARGIN = { top: 16, right: 20, bottom: 30, left: 56 };
const SAMPLES = 50;
const Y_MAX = 1600;

function samplePrices(min, max, n) {
  return Array.from({ length: n }, (_, i) => min + ((max - min) * i) / (n - 1));
}

// Bespoke chart, not a ForecastBandChart reuse: Micro's headline concept is
// a continuous price→quantity curve, not N discrete drivers compared at one
// output point (Gold/Macro's shape). Two curves sweep the full price range;
// the ML curve is drawn as two segments (not one path) so the charm-price
// threshold renders as a genuine step, not a smoothed diagonal — the doc's
// "non-monotonic relationships traditional econometrics assumes away" made
// visible rather than described.
export default function DemandCurveChart({ price, promoOn, peakSeason, models, reference }) {
  const { ref: wrapRef, canScrollRight, onScroll } = useHorizontalScrollHint();
  const [econModel, mlModel] = models;
  const econName = useT(econModel.name);
  const mlName = useT(mlModel.name);
  const unitsLabel = useT(MICRO_UNITS_LABEL);

  const x = d3.scaleLinear().domain([reference.priceMin, reference.priceMax]).range([MARGIN.left, W - MARGIN.right]);
  const y = d3.scaleLinear().domain([0, Y_MAX]).range([H - MARGIN.bottom, MARGIN.top]);

  const logLogPrices = samplePrices(reference.priceMin, reference.priceMax, SAMPLES);
  const mlBelowPrices = samplePrices(reference.priceMin, reference.charmThreshold, Math.round(SAMPLES * 0.6));
  const mlAbovePrices = samplePrices(reference.charmThreshold, reference.priceMax, Math.round(SAMPLES * 0.4));

  const lineGen = d3.line().x((d) => x(d.p)).y((d) => y(d.q)).curve(d3.curveMonotoneX);
  const logLogPath = lineGen(logLogPrices.map((p) => ({ p, q: logLogQuantity(p, reference) })));
  const mlBelowPath = lineGen(mlBelowPrices.map((p) => ({ p, q: mlQuantity(p, promoOn, peakSeason, reference) })));
  const mlAbovePath = lineGen(mlAbovePrices.map((p) => ({ p, q: mlQuantity(p, promoOn, peakSeason, reference) })));

  const currentLogLogQ = logLogQuantity(price, reference);
  const currentMlQ = mlQuantity(price, promoOn, peakSeason, reference);
  const priceTicks = [reference.priceMin, reference.referencePrice, reference.priceMax];
  const qTicks = [0, 400, 800, 1200, 1600];

  return (
    <div className="dcc-outer">
      <div className="dcc-wrap" ref={wrapRef} onScroll={onScroll}>
        <svg viewBox={`0 0 ${W} ${H}`} className="dcc-chart" role="img" aria-label="Price vs. quantity demanded, two models">
          {qTicks.map((q) => (
            <g key={q}>
              <line x1={MARGIN.left} x2={W - MARGIN.right} y1={y(q)} y2={y(q)} className="dcc-gridline" />
              <text x={MARGIN.left - 8} y={y(q) + 3} textAnchor="end" className="dcc-axis-label">{q}</text>
            </g>
          ))}
          {priceTicks.map((p) => (
            <text key={p} x={x(p)} y={H - MARGIN.bottom + 18} textAnchor="middle" className="dcc-axis-label">${p.toFixed(2)}</text>
          ))}

          <path d={logLogPath} className="dcc-curve" stroke={econModel.color} strokeDasharray="5,4" />
          <path d={mlBelowPath} className="dcc-curve" stroke={mlModel.color} />
          <path d={mlAbovePath} className="dcc-curve" stroke={mlModel.color} />

          <line x1={x(price)} x2={x(price)} y1={MARGIN.top} y2={H - MARGIN.bottom} className="dcc-price-marker" />

          <circle cx={x(price)} cy={y(currentLogLogQ)} r={5} fill={econModel.color} className="dcc-dot" />
          <circle cx={x(price)} cy={y(currentMlQ)} r={5} fill={mlModel.color} className="dcc-dot" />

          <text x={MARGIN.left + 4} y={MARGIN.top + 2} className="dcc-y-title">{unitsLabel}</text>
        </svg>
      </div>
      {canScrollRight && (
        <div className="dcc-scroll-hint" aria-hidden="true">
          <i className="ti ti-chevron-right" />
        </div>
      )}
      <div className="dcc-legend">
        <div className="dcc-legend-item">
          <span className="dcc-swatch dcc-swatch-dashed" style={{ borderColor: econModel.color }} />
          {econName}: <strong>{Math.round(currentLogLogQ).toLocaleString()}</strong>
        </div>
        <div className="dcc-legend-item">
          <span className="dcc-swatch" style={{ background: mlModel.color }} />
          {mlName}: <strong>{Math.round(currentMlQ).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}
