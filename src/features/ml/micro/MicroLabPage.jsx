import { useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { demandGapContributions, MICRO_REFERENCE } from './demandModel.js';
import {
  MICRO_CONTEXT, MICRO_MODELS, MICRO_SCENARIOS, MICRO_TRACE_INTRO, MICRO_GAP_LABELS,
  MICRO_PRICE_LABEL, MICRO_PROMO_LABEL, MICRO_SEASON_LABEL, MICRO_PAGE_TITLE, MICRO_PRICE_SECTION_TITLE,
  MICRO_MODELS_TITLE, MICRO_MODELS_SUB, MICRO_TRACE_TITLE,
} from '../../../data/ml/domains/micro.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import DemandCurveChart from './DemandCurveChart.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './MicroLabPage.css';

const DOMAIN = 'micro';

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
        <DemandCurveChart price={price} promoOn={promoOn} peakSeason={peakSeason} models={MICRO_MODELS} reference={MICRO_REFERENCE} />
        <div className="dl-model-notes">
          {MICRO_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
        </div>
        <div className="ml-citation-row"><MLCitation section="6.3" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{traceTitle}</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel contributions={contributions} driversByKey={MICRO_GAP_LABELS} unit=" units" unitPosition="suffix" decimals={0} />
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
