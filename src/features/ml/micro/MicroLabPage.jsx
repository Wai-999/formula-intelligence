import { useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { demandGapContributions, MICRO_REFERENCE } from './demandModel.js';
import {
  MICRO_CONTEXT, MICRO_MODELS, MICRO_SCENARIOS, MICRO_TRACE_INTRO, MICRO_GAP_LABELS,
  MICRO_PRICE_LABEL, MICRO_PROMO_LABEL, MICRO_SEASON_LABEL,
} from '../../../data/ml/domains/micro.js';
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
        <p className="ml-section-title"><i className="ti ti-shopping-cart" aria-hidden="true" /> Micro Economics Lab — Price Elasticity</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.3" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Set the price</p>
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
          <p className="ml-lbl">Scenario presets</p>
          <ScenarioPresets scenarios={MICRO_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
            <i className="ti ti-refresh" aria-hidden="true" /> Reset to baseline
          </button>
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Two models, one price axis</p>
        <p className="ml-section-sub">The dashed line assumes one constant % relationship everywhere. The solid line learns whatever shape the data actually has.</p>
        <DemandCurveChart price={price} promoOn={promoOn} peakSeason={peakSeason} models={MICRO_MODELS} reference={MICRO_REFERENCE} />
        <div className="dl-model-notes">
          {MICRO_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
        </div>
        <div className="ml-citation-row"><MLCitation section="6.3" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Why do the curves disagree here?</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel contributions={contributions} driversByKey={MICRO_GAP_LABELS} unit=" units" unitPosition="suffix" decimals={0} />
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
