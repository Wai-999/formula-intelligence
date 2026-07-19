import * as d3 from 'd3';
import { useT } from '../../../lib/mlContent.js';
import { useHorizontalScrollHint } from '../../../lib/useHorizontalScrollHint.js';
import './ForecastBandChart.css';

const W = 640;
const ROW_H = 46;
const MARGIN = { top: 10, right: 16, bottom: 26, left: 150 };

function formatValue(v, unit, unitPosition, decimals) {
  const num = decimals > 0
    ? v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(v).toLocaleString();
  return unitPosition === 'suffix' ? `${num}${unit}` : `${unit}${num}`;
}

// Generic multi-model forecast-band comparison, reused by every domain lab.
// `models` is [{key,name,color,note}]; `forecasts` is the output of
// computeModelForecasts keyed the same way; baseValue/unit/unitPosition/
// decimals control the axis and point labels (defaults match Gold's
// original dollar formatting exactly; Macro needs `unitPosition="suffix"`
// and `decimals` > 0 since whole-point-rounding collapses its percentage-
// point-scale model differences to indistinguishable integers).
export default function ForecastBandChart({
  models, forecasts, baseValue, unit = '$', unitPosition = 'prefix', decimals = 0, domainPadding = 20,
}) {
  // Chart has a legibility-driven min-width (see CSS) that can exceed narrow
  // viewports; it scrolls inside its own container rather than shrinking
  // text to illegible sizes. This hint is the only cue that more of the
  // chart — including the point-value labels — is reachable by scrolling.
  const { ref: wrapRef, canScrollRight, onScroll } = useHorizontalScrollHint();

  const allValues = models.flatMap((m) => {
    const f = forecasts[m.key];
    return [baseValue + f.delta - f.band, baseValue + f.delta + f.band];
  });
  const domain = [Math.min(baseValue, ...allValues) - domainPadding, Math.max(baseValue, ...allValues) + domainPadding];
  const x = d3.scaleLinear().domain(domain).range([MARGIN.left, W - MARGIN.right]);
  const H = MARGIN.top + MARGIN.bottom + models.length * ROW_H;

  return (
    <div className="fbc-outer">
      <div className="fbc-wrap" ref={wrapRef} onScroll={onScroll}>
        <svg viewBox={`0 0 ${W} ${H}`} className="fbc-chart" role="img" aria-label="Forecast bands per model">
          <line x1={x(baseValue)} x2={x(baseValue)} y1={MARGIN.top - 4} y2={H - MARGIN.bottom + 4} className="fbc-base-line" />
          {models.map((m, i) => {
            const f = forecasts[m.key];
            const point = baseValue + f.delta;
            const lo = point - f.band;
            const hi = point + f.band;
            const cy = MARGIN.top + i * ROW_H + ROW_H / 2;
            return (
              <ModelRow
                key={m.key} model={m} x={x} lo={lo} hi={hi} point={point} cy={cy}
                unit={unit} unitPosition={unitPosition} decimals={decimals}
              />
            );
          })}
          {[domain[0], baseValue, domain[1]].map((v, i) => (
            <text key={i} x={x(v)} y={H - 6} textAnchor="middle" className="fbc-axis-label">
              {formatValue(v, unit, unitPosition, decimals)}
            </text>
          ))}
        </svg>
      </div>
      {canScrollRight && (
        <div className="fbc-scroll-hint" aria-hidden="true">
          <i className="ti ti-chevron-right" />
        </div>
      )}
    </div>
  );
}

function ModelRow({ model, x, lo, hi, point, cy, unit, unitPosition, decimals }) {
  const name = useT(model.name);
  return (
    <g>
      <text x={0} y={cy + 4} className="fbc-model-label">{name}</text>
      <line x1={x(lo)} x2={x(hi)} y1={cy} y2={cy} stroke={model.color} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <circle cx={x(point)} cy={cy} r={5} fill={model.color} stroke="var(--surface)" strokeWidth={1.5} />
      <text x={x(point)} y={cy - 10} textAnchor="middle" className="fbc-point-label" fill={model.color}>
        {formatValue(point, unit, unitPosition, decimals)}
      </text>
    </g>
  );
}
