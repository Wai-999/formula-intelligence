import { useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { computeMacroForecasts, driverContributions } from '../../../lib/domainModel.js';
import {
  MACRO_BASE_VALUE, MACRO_BASE_BAND, MACRO_CONTEXT, MACRO_DRIVERS, MACRO_MODELS, MACRO_SCENARIOS,
  MACRO_TRACE_INTRO, MACRO_GAP_INTRO, MACRO_SIMPLICITY_CALLOUT,
} from '../../../data/ml/domains/macro.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import ForecastBandChart from '../../../components/ml/domain/ForecastBandChart.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import InformationGapTimeline from './InformationGapTimeline.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './MacroLabPage.css';

const DOMAIN = 'macro';
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

export default function MacroLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const context = useT(MACRO_CONTEXT);
  const gapIntro = useT(MACRO_GAP_INTRO);
  const traceIntro = useT(MACRO_TRACE_INTRO);
  const simplicityCallout = useT(MACRO_SIMPLICITY_CALLOUT);

  const forecasts = useMemo(
    () => computeMacroForecasts(MACRO_BASE_VALUE, MACRO_DRIVERS, driverState, MACRO_BASE_BAND),
    [driverState]
  );
  const contributions = useMemo(() => driverContributions(MACRO_DRIVERS, driverState), [driverState]);

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-building-bank" aria-hidden="true" /> Macro Economics Lab — Nowcasting</p>
        <p className="ml-section-sub">{context}</p>
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">The information gap</p>
        <p className="ml-section-sub">{gapIntro}</p>
        <InformationGapTimeline />
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">High-frequency signals</p>
        <DriverPanel drivers={MACRO_DRIVERS} state={driverState} onChange={(key, v) => setDriver(DOMAIN, key, v)} />
        <div className="dl-scenario-row">
          <p className="ml-lbl">Scenario presets</p>
          <ScenarioPresets scenarios={MACRO_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
            <i className="ti ti-refresh" aria-hidden="true" /> Reset to baseline
          </button>
        </div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Three models, three different jobs</p>
        <p className="ml-section-sub">Move a signal above and watch the nowcast move — but not by the same amount, or for the same reason.</p>
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
            <p className="macro-simplicity-title">Simplicity can win</p>
            <p className="ml-body-text">{simplicityCallout}</p>
          </div>
        </div>
        <div className="ml-citation-row"><MLCitation section="6.2" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">Why did the nowcast move?</p>
        <p className="ml-section-sub">{traceIntro}</p>
        <TracePanel
          contributions={contributions} driversByKey={driversByKey}
          unit="pp" unitPosition="suffix" decimals={1}
        />
        <div className="ml-citation-row"><MLCitation synthetic /></div>
      </div>
    </div>
  );
}
