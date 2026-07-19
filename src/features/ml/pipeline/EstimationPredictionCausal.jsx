import { useState } from 'react';
import { EPC_INTRO, EPC_COLUMNS, EPC_BRIDGE_NOTE } from '../../../data/ml/estimationPredictionCausal.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import EstimationDemo from './EstimationDemo.jsx';
import PredictionIntervalDemo from './PredictionIntervalDemo.jsx';
import ConfounderDemo from './ConfounderDemo.jsx';
import './EstimationPredictionCausal.css';

const DEMOS = {
  estimation: EstimationDemo,
  prediction: PredictionIntervalDemo,
  causal: ConfounderDemo,
};

function ColumnDetail({ column }) {
  const goal = useT(column.goal);
  const output = useT(column.output);
  const example = useT(column.example);
  const methods = useT(column.methods);
  const failure = useT(column.failure);
  const Demo = DEMOS[column.id];

  return (
    <div className="epc-detail">
      <div className="epc-detail-grid">
        <div>
          <p className="ml-lbl">Goal</p>
          <p className="ml-body-text">{goal}</p>
        </div>
        <div>
          <p className="ml-lbl">Typical output</p>
          <p className="ml-body-text">{output}</p>
        </div>
        <div>
          <p className="ml-lbl">Example</p>
          <p className="ml-body-text epc-example">{example}</p>
        </div>
        <div>
          <p className="ml-lbl">Method family</p>
          <p className="ml-body-text">{methods}</p>
        </div>
        <div className="epc-failure">
          <p className="ml-lbl epc-failure-lbl">Failure mode if confused</p>
          <p className="ml-body-text">{failure}</p>
        </div>
      </div>
      {Demo && <Demo />}
    </div>
  );
}

function EPCTabButton({ column, isOpen, onClick }) {
  const label = useT(column.label);
  const territory = useT(column.territory);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isOpen}
      className={`epc-tab${isOpen ? ' active' : ''}`}
      style={isOpen ? { '--epc-accent': `var(${column.accentVar})` } : undefined}
      onClick={onClick}
    >
      <span className="epc-tab-label">{label}</span>
      <span className="epc-tab-territory">{territory}</span>
    </button>
  );
}

export default function EstimationPredictionCausal() {
  const [openId, setOpenId] = useState('estimation');
  const intro = useT(EPC_INTRO);
  const bridgeNote = useT(EPC_BRIDGE_NOTE);
  const openColumn = EPC_COLUMNS.find((c) => c.id === openId);

  return (
    <div className="ml-section epc-section">
      <p className="ml-section-title">Estimation vs. Prediction vs. Causal Inference</p>
      <p className="ml-section-sub">{intro}</p>
      <div className="epc-tabs" role="tablist">
        {EPC_COLUMNS.map((col) => (
          <EPCTabButton key={col.id} column={col} isOpen={openId === col.id} onClick={() => setOpenId(col.id)} />
        ))}
      </div>
      {openColumn && <ColumnDetail column={openColumn} />}
      <p className="epc-bridge-note">{bridgeNote}</p>
      <div className="ml-citation-row">
        <MLCitation section="2" />
      </div>
    </div>
  );
}
