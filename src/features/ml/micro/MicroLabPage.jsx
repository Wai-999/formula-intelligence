import { useEffect, useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { demandGapContributions, MICRO_REFERENCE } from './demandModel.js';
import {
  MICRO_CONTEXT, MICRO_MODELS, MICRO_SCENARIOS, MICRO_TRACE_INTRO, MICRO_GAP_LABELS,
  MICRO_PRICE_LABEL, MICRO_PROMO_LABEL, MICRO_SEASON_LABEL, MICRO_PAGE_TITLE, MICRO_PRICE_SECTION_TITLE,
  MICRO_MODELS_TITLE, MICRO_MODELS_SUB, MICRO_TRACE_TITLE,
  MICRO_PREDICT_Q, MICRO_PREDICT_SMOOTH, MICRO_PREDICT_KINK, MICRO_PREDICT_EXPLAIN,
  MICRO_SPARK_ANALOGY, MICRO_MECHANISM_NOTE, MICRO_FORMALISM_WORKED, MICRO_FORMALISM_FADED,
  MICRO_CF_ANALOGY_BREAK, MICRO_CF_CAVEAT, MICRO_CF_RETRIEVAL_Q, MICRO_CF_RETRIEVAL_A,
} from '../../../data/ml/domains/micro.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE, UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL, UI_ANALOGY_BREAKS_LBL, UI_REAL_CAVEAT_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import DemandCurveChart from './DemandCurveChart.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './MicroLabPage.css';

const DOMAIN = 'micro';
const NODE_ID = 'micro-lab';

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
  const analogy = useT(MICRO_SPARK_ANALOGY);
  return <div className="dl-depth-layer"><p className="ml-body-text">{analogy}</p></div>;
}
function MechanismLayer() {
  const note = useT(MICRO_MECHANISM_NOTE);
  return <div className="dl-depth-layer"><p className="ml-body-text">{note}</p></div>;
}
function FormalismLayer() {
  const worked = useT(MICRO_FORMALISM_WORKED);
  const faded = useT(MICRO_FORMALISM_FADED);
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
  const analogyBreak = useT(MICRO_CF_ANALOGY_BREAK);
  const caveat = useT(MICRO_CF_CAVEAT);
  const breaksLbl = useT(UI_ANALOGY_BREAKS_LBL);
  const caveatLbl = useT(UI_REAL_CAVEAT_LBL);
  return (
    <div className="dl-depth-layer">
      <p className="ml-lbl">{breaksLbl}</p>
      <p className="ml-body-text">{analogyBreak}</p>
      <p className="ml-lbl">{caveatLbl}</p>
      <p className="ml-body-text">{caveat}</p>
      <RetrievalCheck nodeId={NODE_ID} question={MICRO_CF_RETRIEVAL_Q} answer={MICRO_CF_RETRIEVAL_A} />
    </div>
  );
}

function ToggleButton({ label, active, onClick }) {
  return (
    <button type="button" className={`micro-toggle${active ? ' active' : ''}`} onClick={onClick} aria-pressed={active}>
      <i className={`ti ${active ? 'ti-square-rounded-check-filled' : 'ti-square-rounded'}`} aria-hidden="true" />
      {label}
    </button>
  );
}

export default function MicroLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const markDomainVisited = useUnderstandingStore((s) => s.markDomainVisited);
  useEffect(() => { markDomainVisited(DOMAIN); }, [markDomainVisited]);
  const context = useT(MICRO_CONTEXT);
  const traceIntro = useT(MICRO_TRACE_INTRO);
  const priceLabel = useT(MICRO_PRICE_LABEL);
  const promoLabel = useT(MICRO_PROMO_LABEL);
  const seasonLabel = useT(MICRO_SEASON_LABEL);
  const pageTitle = useT(MICRO_PAGE_TITLE);
  const priceSectionTitle = useT(MICRO_PRICE_SECTION_TITLE);
  const modelsTitle = useT(MICRO_MODELS_TITLE);
  const modelsSub = useT(MICRO_MODELS_SUB);
  const traceTitle = useT(MICRO_TRACE_TITLE);
  const scenarioPresetsLabel = useT(UI_SCENARIO_PRESETS);
  const resetLabel = useT(UI_RESET_TO_BASELINE);

  const price = driverState.price ?? MICRO_REFERENCE.referencePrice;
  const promoOn = Boolean(driverState.promoOn);
  const peakSeason = Boolean(driverState.peakSeason);

  const contributions = useMemo(
    () => demandGapContributions(price, promoOn, peakSeason, MICRO_REFERENCE),
    [price, promoOn, peakSeason]
  );

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-shopping-cart" aria-hidden="true" /> {pageTitle}</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.3" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{priceSectionTitle}</p>
        <div className="micro-price-row">
          <div className="micro-price-head">
            <span className="dp-driver-label">{priceLabel}</span>
            <span className="dp-driver-value">${price.toFixed(2)}</span>
          </div>
          <input
            type="range" min={MICRO_REFERENCE.priceMin} max={MICRO_REFERENCE.priceMax} step="0.01" value={price}
            onChange={(e) => setDriver(DOMAIN, 'price', Number(e.target.value))}
            className="pg-slider dp-slider"
          />
        </div>
        <div className="micro-toggle-row">
          <ToggleButton label={promoLabel} active={promoOn} onClick={() => setDriver(DOMAIN, 'promoOn', promoOn ? 0 : 1)} />
          <ToggleButton label={seasonLabel} active={peakSeason} onClick={() => setDriver(DOMAIN, 'peakSeason', peakSeason ? 0 : 1)} />
        </div>
        <div className="dl-scenario-row">
          <p className="ml-lbl">{scenarioPresetsLabel}</p>
          <ScenarioPresets scenarios={MICRO_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
            <i className="ti ti-refresh" aria-hidden="true" /> {resetLabel}
          </button>
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{modelsTitle}</p>
        <p className="ml-section-sub">{modelsSub}</p>
        <PredictGate
          predictId="micro-curve-shape-predict" nodeId={NODE_ID} layer="mechanism"
          question={MICRO_PREDICT_Q} options={[MICRO_PREDICT_SMOOTH, MICRO_PREDICT_KINK]} correctIndex={1}
          explain={MICRO_PREDICT_EXPLAIN}
        >
          <DemandCurveChart price={price} promoOn={promoOn} peakSeason={peakSeason} models={MICRO_MODELS} reference={MICRO_REFERENCE} />
          <div className="dl-model-notes">
            {MICRO_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
          </div>
        </PredictGate>
        <div className="ml-citation-row"><MLCitation section="6.3" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{traceTitle}</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel contributions={contributions} driversByKey={MICRO_GAP_LABELS} unit=" units" unitPosition="suffix" decimals={0} />
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
