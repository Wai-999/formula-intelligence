import * as d3 from 'd3';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../../../lib/mlContent.js';
import './ForecastBandChart.css';

const W = 640;
const ROW_H = 46;
const MARGIN = { top: 10, right: 16, bottom: 26, left: 150 };

// Generic multi-model forecast-band comparison, reused by every domain lab.
// `models` is [{key,name,color,note}]; `forecasts` is the output of
// computeModelForecasts keyed the same way; baseValue/unit control the axis.
export default function ForecastBandChart({ models, forecasts, baseValue, unit = '$' }) {
  const wrapRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Chart has a legibility-driven min-width (see CSS) that can exceed narrow
  // viewports; it scrolls inside its own container rather than shrinking
  // text to illegible sizes. This hint is the only cue that more of the
  // chart — including the point-value labels — is reachable by scrolling.
  // useLayoutEffect (not useEffect) so the first measurement happens
  // synchronously against post-commit layout rather than a pre-layout
  // snapshot. A short-delay re-check follows because dev-mode CSS (Vite
  // injects stylesheets via JS) can still land after this fires; the
  // ResizeObserver + resize listener keep it correct after that as the
  // viewport or content changes.
  const updateScrollState = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
  }, []);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    updateScrollState();
    const settleTimer = setTimeout(updateScrollState, 150);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    window.addEventListener('resize', updateScrollState);
    return () => {
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const allValues = models.flatMap((m) => {
    const f = forecasts[m.key];
    return [baseValue + f.delta - f.band, baseValue + f.delta + f.band];
  });
  const domain = [Math.min(baseValue, ...allValues) - 20, Math.max(baseValue, ...allValues) + 20];
  const x = d3.scaleLinear().domain(domain).range([MARGIN.left, W - MARGIN.right]);
  const H = MARGIN.top + MARGIN.bottom + models.length * ROW_H;

  return (
    <div className="fbc-outer">
      <div className="fbc-wrap" ref={wrapRef} onScroll={updateScrollState}>
        <svg viewBox={`0 0 ${W} ${H}`} className="fbc-chart" role="img" aria-label="Forecast bands per model">
          <line x1={x(baseValue)} x2={x(baseValue)} y1={MARGIN.top - 4} y2={H - MARGIN.bottom + 4} className="fbc-base-line" />
          {models.map((m, i) => {
            const f = forecasts[m.key];
            const point = baseValue + f.delta;
            const lo = point - f.band;
            const hi = point + f.band;
            const cy = MARGIN.top + i * ROW_H + ROW_H / 2;
            return (
              <ModelRow key={m.key} model={m} x={x} lo={lo} hi={hi} point={point} cy={cy} />
            );
          })}
          {[domain[0], baseValue, domain[1]].map((v, i) => (
            <text key={i} x={x(v)} y={H - 6} textAnchor="middle" className="fbc-axis-label">
              {unit}{Math.round(v).toLocaleString()}
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

function ModelRow({ model, x, lo, hi, point, cy }) {
  const name = useT(model.name);
  return (
    <g>
      <text x={0} y={cy + 4} className="fbc-model-label">{name}</text>
      <line x1={x(lo)} x2={x(hi)} y1={cy} y2={cy} stroke={model.color} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <circle cx={x(point)} cy={cy} r={5} fill={model.color} stroke="var(--surface)" strokeWidth={1.5} />
      <text x={x(point)} y={cy - 10} textAnchor="middle" className="fbc-point-label" fill={model.color}>
        ${Math.round(point).toLocaleString()}
      </text>
    </g>
  );
}
