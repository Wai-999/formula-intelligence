import {
  SHAP_INTRO, SHAP_FEATURES, LIME_INTRO, LIME_EXAMPLE,
  EV_SHAP_TITLE, EV_LIME_TITLE, EV_BASE_VALUE_LBL, EV_THIS_PREDICTION_LBL,
  EV_LIME_BASE_MARGIN, EV_LIME_FINAL_MARGIN,
} from '../../../data/ml/evaluation.js';
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
  const shapTitle = useT(EV_SHAP_TITLE);
  const limeTitle = useT(EV_LIME_TITLE);
  const baseValueLbl = useT(EV_BASE_VALUE_LBL);
  const thisPredictionLbl = useT(EV_THIS_PREDICTION_LBL);
  const baseMargin = useT(EV_LIME_BASE_MARGIN);
  const finalMargin = useT(EV_LIME_FINAL_MARGIN);
  const maxImportance = Math.max(...SHAP_FEATURES.map((f) => f.importance));
  const maxAbsContrib = Math.max(...LIME_EXAMPLE.contributions.map((c) => Math.abs(c.value)));

  return (
    <div className="sl-grid">
      <div className="ml-section">
        <p className="ml-section-title">{shapTitle}</p>
        <p className="ml-section-sub">{shapIntro}</p>
        <div className="shap-list">
          {SHAP_FEATURES.map((f) => (
            <ShapBar key={f.key} feature={f} maxImportance={maxImportance} />
          ))}
        </div>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
      <div className="ml-section">
        <p className="ml-section-title">{limeTitle}</p>
        <p className="ml-section-sub">{limeIntro}</p>
        <p className="lime-base">{baseValueLbl}: <b>${LIME_EXAMPLE.baseValue.toLocaleString()}</b> <span className="lime-margin">{baseMargin}</span></p>
        <div className="lime-list">
          {LIME_EXAMPLE.contributions.map((c) => (
            <LimeBar key={c.key} contrib={c} scale={maxAbsContrib} />
          ))}
        </div>
        <p className="lime-final">{thisPredictionLbl}: <b>${LIME_EXAMPLE.finalPrediction.toLocaleString()}</b> <span className="lime-margin">{finalMargin}</span></p>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
