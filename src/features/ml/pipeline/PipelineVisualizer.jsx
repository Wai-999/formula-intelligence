import { useState } from 'react';
import { PIPELINE_STAGES } from '../../../data/ml/pipeline.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import './PipelineVisualizer.css';

function StageDetail({ stage }) {
  const question = useT(stage.question);
  const what = useT(stage.what);
  const goldExample = useT(stage.goldExample);

  return (
    <div className="pv-detail">
      <p className="pv-detail-q">{question}</p>
      <p className="ml-lbl">What happens</p>
      <p className="ml-body-text">{what}</p>
      <p className="ml-lbl pv-gold-lbl">
        <i className="ti ti-coin" aria-hidden="true" /> Gold worked example
      </p>
      <p className="ml-body-text pv-gold-text">{goldExample}</p>
    </div>
  );
}

export default function PipelineVisualizer() {
  const [openId, setOpenId] = useState(PIPELINE_STAGES[0].id);
  const openStage = PIPELINE_STAGES.find((s) => s.id === openId);

  return (
    <div className="ml-section">
      <p className="ml-section-title">The ML Pipeline: From Data to Decision</p>
      <p className="ml-section-sub">
        Every ML system moves through the same seven stages — click any stage to see what happens there, worked through with gold price forecasting as a running example (previewing Module 6).
      </p>
      <div className="pv-track">
        {PIPELINE_STAGES.map((stage, i) => (
          <div className="pv-track-item" key={stage.id}>
            <button
              type="button"
              className={`pv-node${openId === stage.id ? ' active' : ''}`}
              onClick={() => setOpenId(stage.id)}
              aria-expanded={openId === stage.id}
            >
              <span className="pv-node-num">{stage.n}</span>
              <span className="pv-node-label">{stage.stage}</span>
            </button>
            {i < PIPELINE_STAGES.length - 1 && <span className="pv-connector" aria-hidden="true" />}
          </div>
        ))}
      </div>
      {openStage && <StageDetail stage={openStage} />}
      <div className="ml-citation-row">
        <MLCitation section="1" />
      </div>
    </div>
  );
}
