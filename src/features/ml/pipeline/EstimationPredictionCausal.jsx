import { useState } from 'react';
import {
  EPC_INTRO, EPC_COLUMNS, EPC_BRIDGE_NOTE, EPC_TITLE,
  EPC_GOAL_LBL, EPC_OUTPUT_LBL, EPC_EXAMPLE_LBL, EPC_METHODS_LBL, EPC_FAILURE_LBL,
} from '../../../data/ml/estimationPredictionCausal.js';
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
  const goalLbl = useT(EPC_GOAL_LBL);
  const outputLbl = useT(EPC_OUTPUT_LBL);
  const exampleLbl = useT(EPC_EXAMPLE_LBL);
  const methodsLbl = useT(EPC_METHODS_LBL);
  const failureLbl = useT(EPC_FAILURE_LBL);

  return (
    <div className="epc-detail">
      <div className="epc-detail-grid">
        <div>
          <p className="ml-lbl">{goalLbl}</p>
          <p className="ml-body-text">{goal}</p>
        </div>
        <div>
          <p className="ml-lbl">{outputLbl}</p>
          <p className="ml-body-text">{output}</p>
        </div>
        <div>
          <p className="ml-lbl">{exampleLbl}</p>
          <p className="ml-body-text epc-example">{example}</p>
        </div>
        <div>
          <p className="ml-lbl">{methodsLbl}</p>
          <p className="ml-body-text">{methods}</p>
        </div>
        <div className="epc-failure">
          <p className="ml-lbl epc-failure-lbl">{failureLbl}</p>
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
  const title = useT(EPC_TITLE);
  const openColumn = EPC_COLUMNS.find((c) => c.id === openId);

  return (
    <div className="ml-section epc-section">
      <p className="ml-section-title">{title}</p>
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
