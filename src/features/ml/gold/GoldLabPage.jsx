import { useEffect, useMemo, useState } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { useUIStore } from '../../../store/useUIStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { computeModelForecasts, driverContributions } from '../../../lib/domainModel.js';
import {
  GOLD_BASE_PRICE, GOLD_BASE_BAND, GOLD_CONTEXT, GOLD_DRIVERS, GOLD_MODELS, GOLD_SCENARIOS, GOLD_TRACE_INTRO,
  GOLD_LINK_BANNER, GOLD_PAGE_TITLE, GOLD_DRIVERS_TITLE, GOLD_MODELS_TITLE, GOLD_MODELS_SUB, GOLD_TRACE_TITLE,
  GOLD_PREDICT_Q, GOLD_PREDICT_SAME, GOLD_PREDICT_DIFFERENT, GOLD_PREDICT_EXPLAIN,
  GOLD_SPARK_ANALOGY, GOLD_MECHANISM_NOTE, GOLD_FORMALISM_WORKED, GOLD_FORMALISM_FADED,
  GOLD_CF_ANALOGY_BREAK, GOLD_CF_CAVEAT, GOLD_CF_RETRIEVAL_Q, GOLD_CF_RETRIEVAL_A,
} from '../../../data/ml/domains/gold.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE, UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import ForecastBandChart from '../../../components/ml/domain/ForecastBandChart.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './GoldLabPage.css';

const DOMAIN = 'gold';
const NODE_ID = 'gold-lab';
const driversByKey = Object.fromEntries(GOLD_DRIVERS.map((d) => [d.key, d]));

function ModelNote({ model }) {
  const name = useT(model.name);
  const note = useT(model.note);
  return (
    <div className="dl-model-note" style={{ borderLeftColor: model.color }}>
      <p className="dl-model-note-name" style={{ color: model.color }}>{name}</p>
      <p className="ml-body-text">{note}</p>
    </div>
  );
}

function SparkLayer() {
  const analogy = useT(GOLD_SPARK_ANALOGY);
  return <div className="dl-depth-layer"><p className="ml-body-text">{analogy}</p></div>;
}
function MechanismLayer() {
  const note = useT(GOLD_MECHANISM_NOTE);
  return <div className="dl-depth-layer"><p className="ml-body-text">{note}</p></div>;
}
function FormalismLayer() {
  const worked = useT(GOLD_FORMALISM_WORKED);
  const faded = useT(GOLD_FORMALISM_FADED);
  const workedLbl = useT(UI_WORKED_EXAMPLE_LBL);
  const nowYouTryLbl = useT(UI_NOW_YOU_TRY_LBL);
  return (
    <div className="dl-depth-layer">
      <p className="ml-lbl">{workedLbl}</p>
      <p className="ml-body-text">{worked}</p>
      <p className="ml-lbl">{nowYouTryLbl}</p>
      <p className="ml-body-text">{faded}</p>
    </div>
  );
}
function CriticalFrontierLayer() {
  const analogyBreak = useT(GOLD_CF_ANALOGY_BREAK);
  const caveat = useT(GOLD_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="dl-depth-layer">
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={GOLD_CF_RETRIEVAL_Q} answer={GOLD_CF_RETRIEVAL_A} />
    </div>
  );
}

export default function GoldLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
  const markDomainVisited = useUnderstandingStore((s) => s.markDomainVisited);
  useEffect(() => { markDomainVisited(DOMAIN); }, [markDomainVisited]);
  const context = useT(GOLD_CONTEXT);
  const traceIntro = useT(GOLD_TRACE_INTRO);
  const linkBannerText = useT(GOLD_LINK_BANNER);
  const pageTitle = useT(GOLD_PAGE_TITLE);
  const driversTitle = useT(GOLD_DRIVERS_TITLE);
  const modelsTitle = useT(GOLD_MODELS_TITLE);
  const modelsSub = useT(GOLD_MODELS_SUB);
  const traceTitle = useT(GOLD_TRACE_TITLE);
  const scenarioPresetsLabel = useT(UI_SCENARIO_PRESETS);
  const resetLabel = useT(UI_RESET_TO_BASELINE);
  const [showLinkBanner, setShowLinkBanner] = useState(false);

  // Consumes Module 9's Politics → Gold cross-link. All ML pages mount
  // simultaneously (keep-alive), so this checks `linkedConcept.tab` itself
  // rather than assuming "this effect ran" means "this payload was for us."
  useEffect(() => {
    if (linkedConcept?.tab !== 'gold' || linkedConcept.payload?.geoRiskValue === undefined) return;
    setDriver(DOMAIN, 'geoRisk', linkedConcept.payload.geoRiskValue);
    setShowLinkBanner(true);
    clearLinkedConcept();
  }, [linkedConcept, setDriver, clearLinkedConcept]);

  const forecasts = useMemo(
    () => computeModelForecasts(GOLD_BASE_PRICE, GOLD_DRIVERS, driverState, GOLD_BASE_BAND),
    [driverState]
  );
  const contributions = useMemo(() => driverContributions(GOLD_DRIVERS, driverState), [driverState]);

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-coin" aria-hidden="true" /> {pageTitle}</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.1" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{driversTitle}</p>
        {showLinkBanner && (
          <div className="gold-link-banner">
            <i className="ti ti-arrow-bear-right-2" aria-hidden="true" />
            <span>{linkBannerText}</span>
            <button type="button" onClick={() => setShowLinkBanner(false)} aria-label="Dismiss">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          </div>
        )}
        <PredictGate
          predictId="gold-driver-predict" nodeId={NODE_ID} layer="mechanism"
          question={GOLD_PREDICT_Q} options={[GOLD_PREDICT_SAME, GOLD_PREDICT_DIFFERENT]} correctIndex={1}
          explain={GOLD_PREDICT_EXPLAIN}
        >
          <DriverPanel drivers={GOLD_DRIVERS} state={driverState} onChange={(key, v) => setDriver(DOMAIN, key, v)} />
          <div className="dl-scenario-row">
            <p className="ml-lbl">{scenarioPresetsLabel}</p>
            <ScenarioPresets scenarios={GOLD_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
            <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
              <i className="ti ti-refresh" aria-hidden="true" /> {resetLabel}
            </button>
          </div>
        </PredictGate>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{modelsTitle}</p>
        <p className="ml-section-sub">{modelsSub}</p>
        <ForecastBandChart models={GOLD_MODELS} forecasts={forecasts} baseValue={GOLD_BASE_PRICE} />
        <div className="dl-model-notes">
          {GOLD_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{traceTitle}</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel contributions={contributions} driversByKey={driversByKey} />
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>

      <div className="ml-section">
        <DepthLadder
          nodeId={NODE_ID}
          spark={<SparkLayer />}
          mechanism={<MechanismLayer />}
          formalism={<FormalismLayer />}
          criticalFrontier={<CriticalFrontierLayer />}
        />
      </div>
    </div>
  );
}
