import { useEffect, useMemo, useState } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { useUIStore } from '../../../store/useUIStore.js';
import { computeModelForecasts, driverContributions } from '../../../lib/domainModel.js';
import {
  GOLD_BASE_PRICE, GOLD_BASE_BAND, GOLD_CONTEXT, GOLD_DRIVERS, GOLD_MODELS, GOLD_SCENARIOS, GOLD_TRACE_INTRO,
  GOLD_LINK_BANNER, GOLD_PAGE_TITLE, GOLD_DRIVERS_TITLE, GOLD_MODELS_TITLE, GOLD_MODELS_SUB, GOLD_TRACE_TITLE,
} from '../../../data/ml/domains/gold.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import ForecastBandChart from '../../../components/ml/domain/ForecastBandChart.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './GoldLabPage.css';

const DOMAIN = 'gold';
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

export default function GoldLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
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
        <DriverPanel drivers={GOLD_DRIVERS} state={driverState} onChange={(key, v) => setDriver(DOMAIN, key, v)} />
        <div className="dl-scenario-row">
          <p className="ml-lbl">{scenarioPresetsLabel}</p>
          <ScenarioPresets scenarios={GOLD_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
            <i className="ti ti-refresh" aria-hidden="true" /> {resetLabel}
          </button>
        </div>
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
    </div>
  );
}
