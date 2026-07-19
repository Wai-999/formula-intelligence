import './GeoRiskMeter.css';

// Lightweight CSS meter (see ProbabilityGauge for the same rationale).
// `onSendToGold` is passed in rather than called directly so this
// component stays free of store/navigation knowledge — the page decides
// what the cross-link button actually does.
export default function GeoRiskMeter({ riskScore, label, onSendToGold, buttonLabel }) {
  return (
    <div className="grm">
      <div className="grm-track">
        <div className="grm-fill" style={{ width: `${riskScore}%` }} />
        <div className="grm-marker" style={{ left: `${riskScore}%` }} />
      </div>
      <div className="grm-readout">
        <span>{label}</span>
        <span className="grm-score">{riskScore.toFixed(0)}/100</span>
      </div>
      <button type="button" className="grm-link-btn" onClick={onSendToGold}>
        <i className="ti ti-coin" aria-hidden="true" /> {buttonLabel}
      </button>
    </div>
  );
}
