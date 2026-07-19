import * as d3 from 'd3';

const W = 460;
const H = 200;
const MARGIN = { top: 12, right: 12, bottom: 28, left: 40 };

// The classic bias-variance diagram: training error falls monotonically as
// complexity grows, validation error is U-shaped — the gap between them
// past the minimum IS overfitting, made visible rather than asserted.
export default function ErrorCurveChart({ curve, currentComplexity }) {
  const x = d3.scaleLinear().domain(d3.extent(curve, (d) => d.complexity)).range([MARGIN.left, W - MARGIN.right]);
  const maxErr = d3.max(curve, (d) => Math.max(d.trainError, d.valError));
  const y = d3.scaleLinear().domain([0, maxErr * 1.08]).range([H - MARGIN.bottom, MARGIN.top]);

  const trainLine = d3.line().x((d) => x(d.complexity)).y((d) => y(d.trainError));
  const valLine = d3.line().x((d) => x(d.complexity)).y((d) => y(d.valError));
  const bestComplexity = curve.reduce((best, d) => (d.valError < best.valError ? d : best), curve[0]).complexity;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ec-chart" role="img" aria-label="Training and validation error as model complexity increases">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={MARGIN.left} x2={W - MARGIN.right} y1={y(maxErr * t)} y2={y(maxErr * t)} className="ec-gridline" />
      ))}
      <line x1={x(bestComplexity)} x2={x(bestComplexity)} y1={MARGIN.top} y2={H - MARGIN.bottom} className="ec-best-line" />
      <path d={trainLine(curve)} className="ec-train-line" />
      <path d={valLine(curve)} className="ec-val-line" />
      <line
        x1={x(currentComplexity)} x2={x(currentComplexity)}
        y1={MARGIN.top} y2={H - MARGIN.bottom}
        className="ec-current-line"
      />
      <circle cx={x(currentComplexity)} cy={y(curve.find((d) => d.complexity === currentComplexity)?.valError ?? 0)} r={4} className="ec-current-dot" />
      <text x={MARGIN.left} y={H - 6} className="ec-axis-label">low complexity</text>
      <text x={W - MARGIN.right} y={H - 6} textAnchor="end" className="ec-axis-label">high complexity</text>
    </svg>
  );
}
