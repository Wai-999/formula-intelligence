import { useState } from 'react';
import { PIPELINE_STAGES, PIPELINE_TITLE, PIPELINE_INTRO, PIPELINE_WHAT_LBL, PIPELINE_GOLD_LBL } from '../../../data/ml/pipeline.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import './PipelineVisualizer.css';

function StageDetail({ stage }) {
  const question = useT(stage.question);
  const what = useT(stage.what);
  const goldExample = useT(stage.goldExample);

  const whatLbl = useT(PIPELINE_WHAT_LBL);
  const goldLbl = useT(PIPELINE_GOLD_LBL);

  return (
    <div className="pv-detail">
      <p className="pv-detail-q">{question}</p>
      <p className="ml-lbl">{whatLbl}</p>
      <p className="ml-body-text">{what}</p>
      <p className="ml-lbl pv-gold-lbl">
        <i className="ti ti-coin" aria-hidden="true" /> {goldLbl}
      </p>
      <p className="ml-body-text pv-gold-text">{goldExample}</p>
    </div>
  );
}

export default function PipelineVisualizer() {
  const [openId, setOpenId] = useState(PIPELINE_STAGES[0].id);
  const openStage = PIPELINE_STAGES.find((s) => s.id === openId);
  const title = useT(PIPELINE_TITLE);
  const intro = useT(PIPELINE_INTRO);

  return (
    <div className="ml-section">
      <p className="ml-section-title">{title}</p>
      <p className="ml-section-sub">{intro}</p>
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
