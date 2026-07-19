import { SHAP_INTRO, SHAP_FEATURES, LIME_INTRO, LIME_EXAMPLE } from '../../../data/ml/evaluation.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';

function ShapBar({ feature, maxImportance }) {
  const label = useT(feature.label);
  const pct = (feature.importance / maxImportance) * 100;
  return (
    <div className="shap-row">
      <span className="shap-label">{label}</span>
      <div className="shap-bar-track">
        <div className="shap-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="shap-value">{(feature.importance * 100).toFixed(0)}%</span>
    </div>
  );
}

function LimeBar({ contrib, scale }) {
  const label = useT(contrib.label);
  const positive = contrib.value >= 0;
  const width = (Math.abs(contrib.value) / scale) * 100;
  return (
    <div className="lime-row">
      <span className="lime-label">{label}</span>
      <div className="lime-bar-track">
        <div className={`lime-bar-fill ${positive ? 'lime-pos' : 'lime-neg'}`} style={{ width: `${width}%`, marginLeft: positive ? '50%' : `${50 - width}%` }} />
        <div className="lime-bar-mid" />
      </div>
      <span className={`lime-value ${positive ? 'lime-pos-text' : 'lime-neg-text'}`}>{positive ? '+' : ''}{contrib.value}</span>
    </div>
  );
}

export default function ShapLimePanel() {
  const shapIntro = useT(SHAP_INTRO);
  const limeIntro = useT(LIME_INTRO);
  const maxImportance = Math.max(...SHAP_FEATURES.map((f) => f.importance));
  const maxAbsContrib = Math.max(...LIME_EXAMPLE.contributions.map((c) => Math.abs(c.value)));

  return (
    <div className="sl-grid">
      <div className="ml-section">
        <p className="ml-section-title">Global Feature Importance (SHAP-style)</p>
        <p className="ml-section-sub">{shapIntro}</p>
        <div className="shap-list">
          {SHAP_FEATURES.map((f) => (
            <ShapBar key={f.key} feature={f} maxImportance={maxImportance} />
          ))}
        </div>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
      <div className="ml-section">
        <p className="ml-section-title">Local Explanation (LIME-style)</p>
        <p className="ml-section-sub">{limeIntro}</p>
        <p className="lime-base">Base value (average forecast): <b>${LIME_EXAMPLE.baseValue.toLocaleString()}</b></p>
        <div className="lime-list">
          {LIME_EXAMPLE.contributions.map((c) => (
            <LimeBar key={c.key} contrib={c} scale={maxAbsContrib} />
          ))}
        </div>
        <p className="lime-final">This prediction: <b>${LIME_EXAMPLE.finalPrediction.toLocaleString()}</b></p>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
