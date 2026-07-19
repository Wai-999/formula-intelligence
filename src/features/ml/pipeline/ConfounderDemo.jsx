import {
  CONF_DEMO_LBL, CONF_DEMO_TEXT, CONF_FED_LABEL, CONF_DXY_LABEL, CONF_GOLD_LABEL,
  CONF_PREDICTS_LABEL, CONF_BUTDOESNT_LABEL,
} from '../../../data/ml/estimationPredictionCausal.js';
import { useT } from '../../../lib/mlContent.js';

// The classic confounder pitfall, made concrete with the gold/DXY pair
// already used throughout this module: a predictive model can lean on DXY
// to predict gold well without DXY actually driving it — both are reacting
// to a shared third factor (Fed policy).
export default function ConfounderDemo() {
  const lbl = useT(CONF_DEMO_LBL);
  const text = useT(CONF_DEMO_TEXT);
  const fedLabel = useT(CONF_FED_LABEL);
  const dxyLabel = useT(CONF_DXY_LABEL);
  const goldLabel = useT(CONF_GOLD_LABEL);
  const predictsLabel = useT(CONF_PREDICTS_LABEL);
  const butDoesntLabel = useT(CONF_BUTDOESNT_LABEL);

  return (
    <div className="epc-demo">
      <p className="ml-lbl">{lbl}</p>
      <svg viewBox="0 0 320 140" className="epc-confounder-svg" role="img" aria-label="Confounder diagram: Fed policy drives both DXY and gold; DXY does not actually drive gold">
        <defs>
          <marker id="epc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-muted)" />
          </marker>
          <marker id="epc-arrow-danger" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--danger)" />
          </marker>
        </defs>
        <text x="160" y="18" textAnchor="middle" className="epc-confounder-label epc-confounder-top">{fedLabel}</text>
        <line x1="145" y1="26" x2="70" y2="55" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#epc-arrow)" />
        <line x1="175" y1="26" x2="250" y2="55" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#epc-arrow)" />
        <rect x="20" y="58" width="100" height="34" rx="8" className="epc-confounder-box" />
        <text x="70" y="79" textAnchor="middle" className="epc-confounder-label">{dxyLabel}</text>
        <rect x="200" y="58" width="100" height="34" rx="8" className="epc-confounder-box" />
        <text x="250" y="79" textAnchor="middle" className="epc-confounder-label">{goldLabel}</text>
        <line x1="120" y1="75" x2="200" y2="75" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#epc-arrow-danger)" />
        <text x="160" y="66" textAnchor="middle" className="epc-confounder-danger-label">{predictsLabel}</text>
        <text x="160" y="112" textAnchor="middle" className="epc-confounder-danger-label">{butDoesntLabel}</text>
      </svg>
      <p className="ml-body-text">{text}</p>
    </div>
  );
}
