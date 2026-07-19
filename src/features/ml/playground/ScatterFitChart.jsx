import * as d3 from 'd3';
import { trueFunction } from '../../../lib/mlSandbox.js';

const W = 460;
const H = 260;
const MARGIN = { top: 12, right: 12, bottom: 28, left: 36 };

export default function ScatterFitChart({ dataset, predict }) {
  const x = d3.scaleLinear().domain([dataset.xMin, dataset.xMax]).range([MARGIN.left, W - MARGIN.right]);
  const allY = [...dataset.train, ...dataset.val].map((p) => p.y);
  const yExtent = d3.extent(allY);
  const yPad = (yExtent[1] - yExtent[0]) * 0.2 || 1;
  const y = d3.scaleLinear().domain([yExtent[0] - yPad, yExtent[1] + yPad]).range([H - MARGIN.bottom, MARGIN.top]);

  const lineGen = d3.line().x((d) => x(d)).y((d) => y(predict(d))).curve(d3.curveBasis);
  const truthGen = d3.line().x((d) => x(d)).y((d) => y(trueFunction(d))).curve(d3.curveBasis);
  const xs = d3.range(dataset.xMin, dataset.xMax, (dataset.xMax - dataset.xMin) / 100);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sf-chart" role="img" aria-label="Scatter plot of training and validation points with the fitted curve">
      <line x1={MARGIN.left} x2={W - MARGIN.right} y1={y(0)} y2={y(0)} className="sf-axis-zero" />
      <path d={truthGen(xs)} className="sf-truth-line" />
      <path d={lineGen(xs)} className="sf-fit-line" />
      {dataset.train.map((p, i) => (
        <circle key={`t${i}`} cx={x(p.x)} cy={y(p.y)} r={2.6} className="sf-point sf-point-train" />
      ))}
      {dataset.val.map((p, i) => (
        <circle key={`v${i}`} cx={x(p.x)} cy={y(p.y)} r={2.6} className="sf-point sf-point-val" />
      ))}
      <text x={W - MARGIN.right} y={MARGIN.top + 8} textAnchor="end" className="sf-legend-text">
        <tspan className="sf-legend-truth">— true function</tspan>
      </text>
    </svg>
  );
}
