import { useEffect, useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { computeMacroForecasts, driverContributions } from '../../../lib/domainModel.js';
import {
  MACRO_BASE_VALUE, MACRO_BASE_BAND, MACRO_CONTEXT, MACRO_DRIVERS, MACRO_MODELS, MACRO_SCENARIOS,
  MACRO_TRACE_INTRO, MACRO_GAP_INTRO, MACRO_SIMPLICITY_CALLOUT, MACRO_PAGE_TITLE, MACRO_GAP_SECTION_TITLE,
  MACRO_SIGNALS_TITLE, MACRO_MODELS_TITLE, MACRO_MODELS_SUB, MACRO_TRACE_TITLE, MACRO_SIMPLICITY_TITLE,
  MACRO_PREDICT_Q, MACRO_PREDICT_FANCY, MACRO_PREDICT_DEPENDS, MACRO_PREDICT_EXPLAIN,
  MACRO_SPARK_ANALOGY, MACRO_MECHANISM_NOTE, MACRO_FORMALISM_WORKED, MACRO_FORMALISM_FADED,
  MACRO_CF_ANALOGY_BREAK, MACRO_CF_CAVEAT, MACRO_CF_RETRIEVAL_Q, MACRO_CF_RETRIEVAL_A,
} from '../../../data/ml/domains/macro.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE, UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import ForecastBandChart from '../../../components/ml/domain/ForecastBandChart.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import InformationGapTimeline from './InformationGapTimeline.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './MacroLabPage.css';

const DOMAIN = 'macro';
const NODE_ID = 'macro-lab';
const driversByKey = Object.fromEntries(MACRO_DRIVERS.map((d) => [d.key, d]));

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
  const analogy = useT(MACRO_SPARK_ANALOGY);
  return <div className="dl-depth-layer"><p className="ml-body-text">{analogy}</p></div>;
}
function MechanismLayer() {
  const note = useT(MACRO_MECHANISM_NOTE);
  return <div className="dl-depth-layer"><p className="ml-body-text">{note}</p></div>;
}
function FormalismLayer() {
  const worked = useT(MACRO_FORMALISM_WORKED);
  const faded = useT(MACRO_FORMALISM_FADED);
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
  const analogyBreak = useT(MACRO_CF_ANALOGY_BREAK);
  const caveat = useT(MACRO_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="dl-depth-layer">
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={MACRO_CF_RETRIEVAL_Q} answer={MACRO_CF_RETRIEVAL_A} />
    </div>
  );
}

export default function MacroLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const markDomainVisited = useUnderstandingStore((s) => s.markDomainVisited);
  useEffect(() => { markDomainVisited(DOMAIN); }, [markDomainVisited]);
  const context = useT(MACRO_CONTEXT);
  const gapIntro = useT(MACRO_GAP_INTRO);
  const traceIntro = useT(MACRO_TRACE_INTRO);
  const simplicityCallout = useT(MACRO_SIMPLICITY_CALLOUT);
  const pageTitle = useT(MACRO_PAGE_TITLE);
  const gapSectionTitle = useT(MACRO_GAP_SECTION_TITLE);
  const signalsTitle = useT(MACRO_SIGNALS_TITLE);
  const modelsTitle = useT(MACRO_MODELS_TITLE);
  const modelsSub = useT(MACRO_MODELS_SUB);
  const traceTitle = useT(MACRO_TRACE_TITLE);
  const simplicityTitle = useT(MACRO_SIMPLICITY_TITLE);
  const scenarioPresetsLabel = useT(UI_SCENARIO_PRESETS);
  const resetLabel = useT(UI_RESET_TO_BASELINE);

  const forecasts = useMemo(
    () => computeMacroForecasts(MACRO_BASE_VALUE, MACRO_DRIVERS, driverState, MACRO_BASE_BAND),
    [driverState]
  );
  const contributions = useMemo(() => driverContributions(MACRO_DRIVERS, driverState), [driverState]);

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-building-bank" aria-hidden="true" /> {pageTitle}</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{gapSectionTitle}</p>
        <p className="ml-section-sub">{gapIntro}</p>
        <InformationGapTimeline />
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{signalsTitle}</p>
        <PredictGate
          predictId="macro-driver-predict" nodeId={NODE_ID} layer="mechanism"
          question={MACRO_PREDICT_Q} options={[MACRO_PREDICT_FANCY, MACRO_PREDICT_DEPENDS]} correctIndex={1}
          explain={MACRO_PREDICT_EXPLAIN}
        >
          <DriverPanel drivers={MACRO_DRIVERS} state={driverState} onChange={(key, v) => setDriver(DOMAIN, key, v)} />
          <div className="dl-scenario-row">
            <p className="ml-lbl">{scenarioPresetsLabel}</p>
            <ScenarioPresets scenarios={MACRO_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
            <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
              <i className="ti ti-refresh" aria-hidden="true" /> {resetLabel}
            </button>
          </div>
        </PredictGate>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{modelsTitle}</p>
        <p className="ml-section-sub">{modelsSub}</p>
        <ForecastBandChart
          models={MACRO_MODELS} forecasts={forecasts} baseValue={MACRO_BASE_VALUE}
          unit="pp" unitPosition="suffix" decimals={1} domainPadding={0.3}
        />
        <div className="dl-model-notes">
          {MACRO_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
        </div>
        <div className="macro-simplicity-callout">
          <i className="ti ti-bulb" aria-hidden="true" />
          <div>
            <p className="macro-simplicity-title">{simplicityTitle}</p>
            <p className="ml-body-text">{simplicityCallout}</p>
          </div>
        </div>
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{traceTitle}</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel
          contributions={contributions} driversByKey={driversByKey}
          unit="pp" unitPosition="suffix" decimals={1}
        />
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
