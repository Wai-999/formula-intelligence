import { useEffect, useRef } from 'react';
import { useUIStore } from '../../../store/useUIStore.js';
import {
  BRIDGE_CONTEXT, REG_EXAMPLE_INTRO, REG_STATS_CARD, REG_ML_CARD, REG_STATS_NODES,
  EST_EXAMPLE_INTRO, EST_STATS_CARD, EST_BAYES_CARD, EST_STATS_NODES, EST_TO_POLITICS_LABEL,
  VIEW_ON_STATS_MAP_LABEL, BRIDGE_PAGE_TITLE, REG_SECTION_TITLE, EST_SECTION_TITLE,
  REG_NODES_LABEL, EST_NODES_LABEL,
  CAUSAL_SECTION_TITLE, CAUSAL_EXAMPLE_INTRO, CAUSAL_PREDICTIVE_CARD, CAUSAL_ACTUAL_CARD,
  CAUSAL_PREDICT_Q, CAUSAL_PREDICT_YES, CAUSAL_PREDICT_NOT_SAFE, CAUSAL_PREDICT_EXPLAIN,
  CAUSAL_SPARK_ANALOGY, CAUSAL_MECHANISM_NOTE, CAUSAL_FORMALISM_WORKED, CAUSAL_FORMALISM_FADED,
  CAUSAL_CF_ANALOGY_BREAK, CAUSAL_CF_CAVEAT, CAUSAL_CF_RETRIEVAL_Q, CAUSAL_CF_RETRIEVAL_A,
} from '../../../data/ml/bridge.js';
import {
  UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL,
} from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import '../mlPageShared.css';
import './BridgePage.css';

const NODE_ID = 'bridge-causal';

function CausalSparkLayer() {
  const analogy = useT(CAUSAL_SPARK_ANALOGY);
  return <div className="bridge-depth-layer"><p className="ml-body-text">{analogy}</p></div>;
}
function CausalMechanismLayer() {
  const note = useT(CAUSAL_MECHANISM_NOTE);
  return <div className="bridge-depth-layer"><p className="ml-body-text">{note}</p></div>;
}
function CausalFormalismLayer() {
  const worked = useT(CAUSAL_FORMALISM_WORKED);
  const faded = useT(CAUSAL_FORMALISM_FADED);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="bridge-depth-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}
function CausalCriticalFrontierLayer() {
  const analogyBreak = useT(CAUSAL_CF_ANALOGY_BREAK);
  const caveat = useT(CAUSAL_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="bridge-depth-layer">
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={CAUSAL_CF_RETRIEVAL_Q} answer={CAUSAL_CF_RETRIEVAL_A} />
    </div>
  );
}

function ComparisonCard({ card, accent }) {
  const title = useT(card.title);
  const points = useT(card.points);
  const interpretation = useT(card.interpretation);
  return (
    <div className="bridge-card" style={{ borderTopColor: accent }}>
      <p className="bridge-card-title" style={{ color: accent }}>{title}</p>
      <ul className="bridge-card-points">
        {points.split('\n').filter(Boolean).map((p) => <li key={p}>{p}</li>)}
      </ul>
      <p className="bridge-card-interpretation">{interpretation}</p>
    </div>
  );
}

function StatsNodeLink({ node, onView }) {
  const label = useT(node.label);
  return (
    <button type="button" className="bridge-node-link" onClick={() => onView(node.id)}>
      <i className="ti ti-topology-star-3" aria-hidden="true" /> {label}
    </button>
  );
}

export default function BridgePage() {
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);

  const context = useT(BRIDGE_CONTEXT);
  const regIntro = useT(REG_EXAMPLE_INTRO);
  const estIntro = useT(EST_EXAMPLE_INTRO);
  const toPoliticsLabel = useT(EST_TO_POLITICS_LABEL);
  const viewOnMapLabel = useT(VIEW_ON_STATS_MAP_LABEL);
  const pageTitle = useT(BRIDGE_PAGE_TITLE);
  const regSectionTitle = useT(REG_SECTION_TITLE);
  const estSectionTitle = useT(EST_SECTION_TITLE);
  const regNodesLabel = useT(REG_NODES_LABEL);
  const estNodesLabel = useT(EST_NODES_LABEL);
  const causalSectionTitle = useT(CAUSAL_SECTION_TITLE);
  const causalIntro = useT(CAUSAL_EXAMPLE_INTRO);

  const regRef = useRef(null);
  const estRef = useRef(null);

  // Consumes cross-links into this page: Module 2's Estimation demo sends
  // {from:'pipeline-estimation'}, the Stats Map's DetailPanel (reg node)
  // sends {from:'stats-reg'} — both focus the relevant comparison instead
  // of leaving the learner to scroll and guess which one triggered this.
  // The short delay matters: navigateToLinkedConcept can switch `mode`
  // (hidden → visible pane, display:none → flex) in the same tick this
  // effect runs, and scrollIntoView on a not-yet-laid-out container is a
  // silent no-op — confirmed directly while testing this cross-link.
  // clearLinkedConcept() must run *inside* the timeout, not synchronously
  // in the effect body: calling it there changes `linkedConcept` (this
  // effect's own dependency) immediately, which runs this same effect's
  // cleanup — canceling the timer before it ever fires. `behavior: 'auto'`
  // (not 'smooth') deliberately: confirmed via direct instrumentation that
  // scrollIntoView *was* being called correctly, but a smooth scroll's
  // frame-by-frame animation depends on requestAnimationFrame, which never
  // visibly progressed — an instant jump has no such dependency and suits
  // a "take me there now" button anyway.
  useEffect(() => {
    if (linkedConcept?.tab !== 'bridge') return undefined;
    const target = linkedConcept.payload?.from === 'stats-reg' ? regRef.current : estRef.current;
    const timer = setTimeout(() => {
      target?.scrollIntoView({ behavior: 'auto', block: 'start' });
      clearLinkedConcept();
    }, 80);
    return () => clearTimeout(timer);
  }, [linkedConcept, clearLinkedConcept]);

  const viewOnStatsMap = (nodeId) => navigateToLinkedConcept('stats', 'map', { nodeId });
  const viewPoliticsLab = () => navigateToLinkedConcept('ml', 'politics', {});

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-arrows-right-left" aria-hidden="true" /> {pageTitle}</p>
        <p className="ml-section-sub">{context}</p>
      </div>

      <div className="ml-section" ref={regRef}>
        <p className="ml-section-title">{regSectionTitle}</p>
        <p className="ml-section-sub">{regIntro}</p>
        <div className="bridge-card-row">
          <ComparisonCard card={REG_STATS_CARD} accent="#8b5cf6" />
          <ComparisonCard card={REG_ML_CARD} accent="#22d3ee" />
        </div>
        <p className="ml-lbl bridge-nodes-lbl">{regNodesLabel}</p>
        <div className="bridge-node-row">
          {REG_STATS_NODES.map((n) => <StatsNodeLink key={n.id} node={n} onView={viewOnStatsMap} />)}
        </div>
        <p className="bridge-node-hint">{viewOnMapLabel}</p>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>

      <div className="ml-section" ref={estRef}>
        <p className="ml-section-title">{estSectionTitle}</p>
        <p className="ml-section-sub">{estIntro}</p>
        <div className="bridge-card-row">
          <ComparisonCard card={EST_STATS_CARD} accent="#8b5cf6" />
          <ComparisonCard card={EST_BAYES_CARD} accent="#fbbf24" />
        </div>
        <p className="ml-lbl bridge-nodes-lbl">{estNodesLabel}</p>
        <div className="bridge-node-row">
          {EST_STATS_NODES.map((n) => <StatsNodeLink key={n.id} node={n} onView={viewOnStatsMap} />)}
        </div>
        <p className="bridge-node-hint">{viewOnMapLabel}</p>
        <button type="button" className="bridge-politics-link" onClick={viewPoliticsLab}>
          <i className="ti ti-flag" aria-hidden="true" /> {toPoliticsLabel}
        </button>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{causalSectionTitle}</p>
        <p className="ml-section-sub">{causalIntro}</p>
        <PredictGate
          predictId="bridge-causal-predict" nodeId={NODE_ID} layer="mechanism"
          question={CAUSAL_PREDICT_Q} options={[CAUSAL_PREDICT_YES, CAUSAL_PREDICT_NOT_SAFE]} correctIndex={1}
          explain={CAUSAL_PREDICT_EXPLAIN}
        >
          <div className="bridge-card-row">
            <ComparisonCard card={CAUSAL_PREDICTIVE_CARD} accent="#22d3ee" />
            <ComparisonCard card={CAUSAL_ACTUAL_CARD} accent="#fbbf24" />
          </div>
        </PredictGate>
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>

      <div className="ml-section">
        <DepthLadder
          nodeId={NODE_ID}
          spark={<CausalSparkLayer />}
          mechanism={<CausalMechanismLayer />}
          formalism={<CausalFormalismLayer />}
          criticalFrontier={<CausalCriticalFrontierLayer />}
        />
      </div>
    </div>
  );
}
