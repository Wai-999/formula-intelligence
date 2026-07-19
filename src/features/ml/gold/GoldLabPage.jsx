import { useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { computeModelForecasts, driverContributions } from '../../../lib/domainModel.js';
import {
  GOLD_BASE_PRICE, GOLD_BASE_BAND, GOLD_CONTEXT, GOLD_DRIVERS, GOLD_MODELS, GOLD_SCENARIOS, GOLD_TRACE_INTRO,
} from '../../../data/ml/domains/gold.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import ForecastBandChart from '../../../components/ml/domain/ForecastBandChart.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';

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
  const context = useT(GOLD_CONTEXT);
  const traceIntro = useT(GOLD_TRACE_INTRO);

  const forecasts = useMemo(
    () => computeModelForecasts(GOLD_BASE_PRICE, GOLD_DRIVERS, driverState, GOLD_BASE_BAND),
    [driverState]
  );
  const contributions = useMemo(() => driverContributions(GOLD_DRIVERS, driverState), [driverState]);

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-coin" aria-hidden="true" /> Gold Price Forecasting Lab</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.1" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Drivers</p>
        <DriverPanel drivers={GOLD_DRIVERS} state={driverState} onChange={(key, v) => setDriver(DOMAIN, key, v)} />
        <div className="dl-scenario-row">
          <p className="ml-lbl">Scenario presets</p>
          <ScenarioPresets scenarios={GOLD_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
            <i className="ti ti-refresh" aria-hidden="true" /> Reset to baseline
          </button>
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Four models, one set of drivers</p>
        <p className="ml-section-sub">Move a driver above and watch all four react — differently.</p>
        <ForecastBandChart models={GOLD_MODELS} forecasts={forecasts} baseValue={GOLD_BASE_PRICE} />
        <div className="dl-model-notes">
          {GOLD_MODELS.map((m) => <ModelNote key={m.key} model={m} />)}
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Why did this move?</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel contributions={contributions} driversByKey={driversByKey} />
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
