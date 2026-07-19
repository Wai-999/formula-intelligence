import { useState } from 'react';
import { PIPELINE_STAGES, PIPELINE_TITLE, PIPELINE_INTRO, PIPELINE_WHAT_LBL, PIPELINE_GOLD_LBL } from '../../../data/ml/pipeline.js';
import {
  UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL,
} from '../../../data/ml/uiStrings.js';
import { useT, resolveT } from '../../../lib/mlContent.js';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import MechanismWidget from '../../../components/ml/learning/MechanismWidget.jsx';
import MisconceptionCallout from '../../../components/ml/learning/MisconceptionCallout.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import './PipelineVisualizer.css';

function SparkLayer({ stage }) {
  const analogy = useT(stage.spark.analogy);
  return (
    <div className="pv-layer">
      <p className="ml-body-text">{analogy}</p>
      <PredictGate
        predictId={`pipeline-${stage.id}-spark`} nodeId={`pipeline-${stage.id}`} layer="spark"
        question={stage.spark.predict.question} options={stage.spark.predict.options}
        correctIndex={stage.spark.predict.correctIndex}
      />
    </div>
  );
}

function MechanismLayer({ stage }) {
  return (
    <div className="pv-layer">
      <PredictGate
        predictId={`pipeline-${stage.id}-mechanism`} nodeId={`pipeline-${stage.id}`}
        question={stage.mechanism.predict.question} options={stage.mechanism.predict.options}
        correctIndex={stage.mechanism.predict.correctIndex}
      >
        <MechanismWidget
          paramLabel={stage.mechanism.paramLabel} paramMin={stage.mechanism.paramMin} paramMax={stage.mechanism.paramMax}
          paramDefault={stage.mechanism.paramDefault} paramStep={stage.mechanism.paramStep} paramDecimals={stage.mechanism.paramDecimals}
          compute={stage.mechanism.compute} outputLabel={stage.mechanism.outputLabel}
          outputDecimals={stage.mechanism.outputDecimals} outputSuffix={stage.mechanism.outputSuffix}
        />
      </PredictGate>
    </div>
  );
}

function FormalismLayer({ stage }) {
  const worked = useT(stage.formalism.worked);
  const faded = useT(stage.formalism.faded);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="pv-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl pv-faded-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}

function CriticalFrontierLayer({ stage }) {
  const analogyBreakdown = useT(stage.criticalFrontier.analogyBreakdown);
  const caveat = useT(stage.criticalFrontier.caveat);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="pv-layer">
      {stage.criticalFrontier.misconceptionId && <MisconceptionCallout misconceptionId={stage.criticalFrontier.misconceptionId} />}
      <p className="ml-lbl pv-faded-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreakdown}</p>
      <p className="ml-lbl pv-faded-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck
        nodeId={`pipeline-${stage.id}`}
        question={stage.criticalFrontier.retrieval.question} answer={stage.criticalFrontier.retrieval.answer}
      />
    </div>
  );
}

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

      <DepthLadder
        nodeId={`pipeline-${stage.id}`}
        spark={<SparkLayer stage={stage} />}
        mechanism={<MechanismLayer stage={stage} />}
        formalism={<FormalismLayer stage={stage} />}
        criticalFrontier={<CriticalFrontierLayer stage={stage} />}
      />
    </div>
  );
}

export default function PipelineVisualizer() {
  const [openId, setOpenId] = useState(PIPELINE_STAGES[0].id);
  const openStage = PIPELINE_STAGES.find((s) => s.id === openId);
  const title = useT(PIPELINE_TITLE);
  const intro = useT(PIPELINE_INTRO);
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);

  return (
    <div className="ml-section">
      <p className="ml-section-title">{title}</p>
      <p className="ml-section-sub">{intro}</p>
      <div className="pv-track">
        {PIPELINE_STAGES.map((stage, i) => {
          const stageName = resolveT(stage.stageName, level, lang);
          return (
            <div className="pv-track-item" key={stage.id}>
              <button
                type="button"
                className={`pv-node${openId === stage.id ? ' active' : ''}`}
                onClick={() => setOpenId(stage.id)}
                aria-expanded={openId === stage.id}
              >
                <span className="pv-node-num">{stage.n}</span>
                <span className="pv-node-label">{stageName || stage.stage}</span>
              </button>
              {i < PIPELINE_STAGES.length - 1 && <span className="pv-connector" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      {openStage && <StageDetail stage={openStage} />}
      <div className="ml-citation-row">
        <MLCitation section="1" />
      </div>
    </div>
  );
}
