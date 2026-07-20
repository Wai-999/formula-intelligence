import { useT } from '../../../lib/mlContent.js';
import { useHorizontalScrollHint } from '../../../lib/useHorizontalScrollHint.js';
import { MACRO_GAP_LABELS } from '../../../data/ml/domains/macro.js';
import './InformationGapTimeline.css';

// FIX_LOG.md Section C: W was 640, with the "Official GDP released (~4
// weeks later)" label centered at RELEASE_X=560 — a getBBox() measurement
// showed that label's right edge at x=656.2, past the viewBox's own right
// boundary, so it clipped silently regardless of the container's rendered
// width (an SVG clips to its viewBox by default; a wider container doesn't
// help since the overflow is relative to viewBox units, not real pixels).
// Widened the viewBox rather than moving RELEASE_X, so every other
// element's position (gap-zone width, baseline) stays pixel-identical.
const W = 700;
const H = 132;
const BASE_Y = 76;
const QUARTER_END_X = 90;
const TODAY_X = 340;
const RELEASE_X = 560;

// Macro-specific (not a generic domain-lab piece — the "official data lags
// the period it describes, nowcasting bridges the gap" structure is
// specific to macro nowcasting, unlike the driver/scenario/chart/trace
// components every domain lab shares). Static diagram, no interactivity:
// the point is the structural fact itself, not something to manipulate.
export default function InformationGapTimeline() {
  const quarterEndLabel = useT(MACRO_GAP_LABELS.quarterEnd);
  const todayLabel = useT(MACRO_GAP_LABELS.today);
  const releaseLabel = useT(MACRO_GAP_LABELS.officialRelease);
  const gapLabel = useT(MACRO_GAP_LABELS.gapZone);
  const nowcastLabel = useT(MACRO_GAP_LABELS.nowcastPin);
  // Same legibility-driven min-width / narrow-viewport overflow as
  // ForecastBandChart (see that component and BUILD_LOG.md Module 6) —
  // this is the second real consumer, which is why the hint logic now
  // lives in a shared hook instead of being duplicated.
  const { ref: wrapRef, canScrollRight, onScroll } = useHorizontalScrollHint();

  return (
    <div className="igt-outer">
      <div className="igt-wrap" ref={wrapRef} onScroll={onScroll}>
        <svg viewBox={`0 0 ${W} ${H}`} className="igt-chart" role="img" aria-label="Information gap timeline">
          <rect x={QUARTER_END_X} y={BASE_Y - 22} width={RELEASE_X - QUARTER_END_X} height={44} className="igt-gap-zone" rx="6" />
          <text x={(QUARTER_END_X + RELEASE_X) / 2} y={BASE_Y - 30} textAnchor="middle" className="igt-gap-label">{gapLabel}</text>

          <line x1={QUARTER_END_X} x2={RELEASE_X} y1={BASE_Y} y2={BASE_Y} className="igt-baseline" />

          {[
            { x: QUARTER_END_X, label: quarterEndLabel, cls: 'igt-point-muted' },
            { x: RELEASE_X, label: releaseLabel, cls: 'igt-point-muted' },
          ].map((p) => (
            <g key={p.x}>
              <circle cx={p.x} cy={BASE_Y} r={5} className={p.cls} />
              <text x={p.x} y={BASE_Y + 24} textAnchor="middle" className="igt-point-text">{p.label}</text>
            </g>
          ))}

          <line x1={TODAY_X} x2={TODAY_X} y1={BASE_Y - 40} y2={BASE_Y + 10} className="igt-today-line" />
          <circle cx={TODAY_X} cy={BASE_Y} r={6} className="igt-point-today" />
          <text x={TODAY_X} y={BASE_Y + 24} textAnchor="middle" className="igt-point-text igt-today-text">{todayLabel}</text>
          <text x={TODAY_X} y={BASE_Y - 46} textAnchor="middle" className="igt-nowcast-label">{nowcastLabel}</text>
        </svg>
      </div>
      {canScrollRight && (
        <div className="igt-scroll-hint" aria-hidden="true">
          <i className="ti ti-chevron-right" />
        </div>
      )}
    </div>
  );
}
