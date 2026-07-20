import {
  mlNodeById, ML_LINKS, mlFamilyColorMap, ML_FAMILIES, MM_EDGE_TYPE_LABEL,
  MM_HOW_IT_WORKS_LBL, MM_ADVANTAGES_LBL, MM_WEAKNESSES_LBL, MM_USAGE_AREAS_LBL, MM_COMPASS_LBL, MM_CONNECTIONS_LBL,
} from '../../data/ml/models.js';
import { MODEL_DEPTH_LADDER } from '../../data/ml/modelDepthLadder.js';
import {
  UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL,
} from '../../data/ml/uiStrings.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { useT } from '../../lib/mlContent.js';
import DepthLadder from '../ml/learning/DepthLadder.jsx';
import PredictGate from '../ml/learning/PredictGate.jsx';
import MechanismWidget from '../ml/learning/MechanismWidget.jsx';
import MechanismLiveLink from '../ml/learning/MechanismLiveLink.jsx';
import MisconceptionCallout from '../ml/learning/MisconceptionCallout.jsx';
import RetrievalCheck from '../ml/learning/RetrievalCheck.jsx';
import CompassMeter from '../ml/CompassMeter.jsx';
import './MLModelDetailPanel.css';

function EdgeTypeLabel({ type }) {
  return <span className="ml-detail-conn-type">{useT(MM_EDGE_TYPE_LABEL[type])}</span>;
}

function SparkLayer({ ladder, nodeId }) {
  const analogy = useT(ladder.spark.analogy);
  return (
    <div className="ml-detail-layer">
      <p className="ml-body-text">{analogy}</p>
      <PredictGate
        predictId={`model-${nodeId}-spark`} nodeId={nodeId} layer="spark" variant="inline"
        question={ladder.spark.predict.question} options={ladder.spark.predict.options}
        correctIndex={ladder.spark.predict.correctIndex}
      />
    </div>
  );
}

function MechanismLayer({ ladder, nodeId }) {
  const m = ladder.mechanism;
  if (m.kind === 'live-link') {
    return <div className="ml-detail-layer"><MechanismLiveLink mechanism={m} nodeId={nodeId} /></div>;
  }
  return (
    <div className="ml-detail-layer">
      <PredictGate
        predictId={`model-${nodeId}-mechanism`} nodeId={nodeId} variant="inline"
        question={m.predict.question} options={m.predict.options} correctIndex={m.predict.correctIndex}
      >
        <MechanismWidget
          paramLabel={m.paramLabel} paramMin={m.paramMin} paramMax={m.paramMax} paramDefault={m.paramDefault}
          paramStep={m.paramStep} paramDecimals={m.paramDecimals} compute={m.compute} outputLabel={m.outputLabel}
          outputDecimals={m.outputDecimals} outputSuffix={m.outputSuffix}
        />
      </PredictGate>
    </div>
  );
}

function FormalismLayer({ ladder }) {
  const worked = useT(ladder.formalism.worked);
  const faded = useT(ladder.formalism.faded);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="ml-detail-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}

function CriticalFrontierLayer({ ladder, nodeId }) {
  const cf = ladder.criticalFrontier;
  const analogyBreakdown = useT(cf.analogyBreakdown);
  const caveat = useT(cf.caveat);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="ml-detail-layer">
      {cf.misconceptionId && <MisconceptionCallout misconceptionId={cf.misconceptionId} />}
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreakdown}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={nodeId} question={cf.retrieval.question} answer={cf.retrieval.answer} />
    </div>
  );
}

export default function MLModelDetailPanel() {
  const selectedModelId = useMLUIStore((s) => s.selectedModelId);
  const selectModel = useMLUIStore((s) => s.selectModel);
  const node = selectedModelId ? mlNodeById[selectedModelId] : null;
  const ladder = node ? MODEL_DEPTH_LADDER[node.id] : null;
  const family = node ? ML_FAMILIES.find((f) => f.id === node.ch) : null;

  const howItWorks = useT(node?.howItWorks);
  const advantages = useT(node?.advantages);
  const weaknesses = useT(node?.weaknesses);
  const usageAreas = useT(node?.usageAreas);
  // family.name is bl()/blSame()-wrapped, same as every other field on this
  // page — it was being rendered raw (`{family?.name}`, no useT()) below,
  // which throws "Objects are not valid as a React child" the instant any
  // node is selected (family is never undefined for a real node — every
  // model has a valid ch), and with no error boundary anywhere in this
  // app, that throw blanks the whole page rather than just this panel.
  // This is why the detail panel appeared to do "nothing" on click: it was
  // never failing to open, it was crashing on every single attempt.
  const familyName = useT(family?.name);
  const howItWorksLbl = useT(MM_HOW_IT_WORKS_LBL);
  const advantagesLbl = useT(MM_ADVANTAGES_LBL);
  const weaknessesLbl = useT(MM_WEAKNESSES_LBL);
  const usageAreasLbl = useT(MM_USAGE_AREAS_LBL);
  const compassLbl = useT(MM_COMPASS_LBL);
  const connectionsLbl = useT(MM_CONNECTIONS_LBL);

  if (!node) return <aside className="ml-detail-panel" />;

  const relatedLinks = ML_LINKS.filter((l) => l.s === node.id || l.t === node.id).map((l) => ({
    type: l.type,
    otherId: l.s === node.id ? l.t : l.s,
    outgoing: l.s === node.id,
  }));

  return (
    <aside className="ml-detail-panel open">
      <button type="button" className="ml-detail-close" onClick={() => selectModel(null)} aria-label="Close detail panel">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      <p className="ml-detail-name">{node.name}</p>
      <span className="ml-detail-family-badge" style={{ background: `${mlFamilyColorMap[node.ch]}22`, color: mlFamilyColorMap[node.ch] }}>
        {familyName}
      </span>
      <div className="ml-detail-formula">{node.short}</div>

      <p className="ml-lbl">{howItWorksLbl}</p>
      <p className="ml-detail-desc">{howItWorks}</p>

      <p className="ml-lbl">{advantagesLbl}</p>
      <p className="ml-detail-desc ml-detail-adv">{advantages}</p>

      <p className="ml-lbl">{weaknessesLbl}</p>
      <p className="ml-detail-desc ml-detail-weak">{weaknesses}</p>

      <p className="ml-lbl">{usageAreasLbl}</p>
      <p className="ml-detail-desc">{usageAreas}</p>

      <p className="ml-lbl">{compassLbl}</p>
      <CompassMeter compass={node.compass} />

      {ladder && (
        <DepthLadder
          nodeId={node.id}
          spark={<SparkLayer ladder={ladder} nodeId={node.id} />}
          mechanism={<MechanismLayer ladder={ladder} nodeId={node.id} />}
          formalism={<FormalismLayer ladder={ladder} />}
          criticalFrontier={<CriticalFrontierLayer ladder={ladder} nodeId={node.id} />}
        />
      )}

      {relatedLinks.length > 0 && (
        <>
          <p className="ml-lbl">{connectionsLbl}</p>
          {relatedLinks.map((rel, i) => {
            const other = mlNodeById[rel.otherId];
            if (!other) return null;
            return (
              <button key={i} type="button" className="ml-detail-conn" onClick={() => selectModel(other.id)}>
                <span className={`ml-detail-conn-dot ml-conn-${rel.type}`} />
                <EdgeTypeLabel type={rel.type} />
                <span>{other.name}</span>
              </button>
            );
          })}
        </>
      )}
    </aside>
  );
}
