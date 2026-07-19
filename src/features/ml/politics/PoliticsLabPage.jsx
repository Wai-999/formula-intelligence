import { useEffect, useMemo } from 'react';
import { useMLDomainStore } from '../../../store/useMLDomainStore.js';
import { useUIStore } from '../../../store/useUIStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import {
  computeElection, electionContributions, computeGeoRisk, geoRiskToGoldZ, ELECTION_REFERENCE, GEO_REFERENCE,
} from './politicsModel.js';
import {
  POLITICS_CONTEXT, ELECTION_CONTEXT, ELECTION_DRIVERS, ELECTION_SCENARIOS, ELECTION_TRACE_INTRO,
  ELECTION_INCUMBENT_LABEL, ELECTION_CHALLENGER_LABEL, ELECTION_DAYS_LABEL,
  GEO_CONTEXT, GEO_DRIVERS, GEO_SCENARIOS, GEO_TO_GOLD_LABEL,
  POLITICS_PAGE_TITLE, ELECTION_SECTION_TITLE, GEO_SECTION_TITLE, GEO_RISK_METER_LABEL,
  ELECTION_DAYS_RELATION, ELECTION_TRACE_LABEL,
  ELECTION_PREDICT_Q, ELECTION_PREDICT_FUNDAMENTALS, ELECTION_PREDICT_POLLS, ELECTION_PREDICT_EXPLAIN,
  GEO_PREDICT_Q, GEO_PREDICT_YES, GEO_PREDICT_NO, GEO_PREDICT_EXPLAIN,
  POLITICS_SPARK_ANALOGY, POLITICS_MECHANISM_NOTE, POLITICS_FORMALISM_WORKED, POLITICS_FORMALISM_FADED,
  POLITICS_CF_CONCRETE_EXAMPLE, POLITICS_CF_RETRIEVAL_Q, POLITICS_CF_RETRIEVAL_A,
} from '../../../data/ml/domains/politics.js';
import { UI_SCENARIO_PRESETS, UI_RESET_TO_BASELINE, UI_WORKED_EXAMPLE_LBL, UI_NOW_YOU_TRY_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import DriverPanel from '../../../components/ml/domain/DriverPanel.jsx';
import ScenarioPresets from '../../../components/ml/domain/ScenarioPresets.jsx';
import TracePanel from '../../../components/ml/domain/TracePanel.jsx';
import ProbabilityGauge from './ProbabilityGauge.jsx';
import GeoRiskMeter from './GeoRiskMeter.jsx';
import DepthLadder from '../../../components/ml/learning/DepthLadder.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';
import RetrievalCheck from '../../../components/ml/learning/RetrievalCheck.jsx';
import MisconceptionCallout from '../../../components/ml/learning/MisconceptionCallout.jsx';
import '../mlPageShared.css';
import '../domainLabShared.css';
import './PoliticsLabPage.css';

const DOMAIN = 'politics';
const NODE_ID = 'politics-lab';
const electionDriversByKey = Object.fromEntries(ELECTION_DRIVERS.map((d) => [d.key, d]));

function SparkLayer() {
  const analogy = useT(POLITICS_SPARK_ANALOGY);
  return <div className="dl-depth-layer"><p className="ml-body-text">{analogy}</p></div>;
}
function MechanismLayer() {
  const note = useT(POLITICS_MECHANISM_NOTE);
  return <div className="dl-depth-layer"><p className="ml-body-text">{note}</p></div>;
}
function FormalismLayer() {
  const worked = useT(POLITICS_FORMALISM_WORKED);
  const faded = useT(POLITICS_FORMALISM_FADED);
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
  const concrete = useT(POLITICS_CF_CONCRETE_EXAMPLE);
  return (
    <div className="dl-depth-layer">
      <MisconceptionCallout misconceptionId="lessBiasedThanHumans" />
      <p className="ml-body-text">{concrete}</p>
      <RetrievalCheck nodeId={NODE_ID} question={POLITICS_CF_RETRIEVAL_Q} answer={POLITICS_CF_RETRIEVAL_A} />
    </div>
  );
}

export default function PoliticsLabPage() {
  const driverState = useMLDomainStore((s) => s.driverState[DOMAIN]);
  const setDriver = useMLDomainStore((s) => s.setDriver);
  const applyScenario = useMLDomainStore((s) => s.applyScenario);
  const resetDomain = useMLDomainStore((s) => s.resetDomain);
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);
  const markDomainVisited = useUnderstandingStore((s) => s.markDomainVisited);
  useEffect(() => { markDomainVisited(DOMAIN); }, [markDomainVisited]);

  const politicsContext = useT(POLITICS_CONTEXT);
  const electionContext = useT(ELECTION_CONTEXT);
  const electionTraceIntro = useT(ELECTION_TRACE_INTRO);
  const incumbentLabel = useT(ELECTION_INCUMBENT_LABEL);
  const challengerLabel = useT(ELECTION_CHALLENGER_LABEL);
  const daysLabel = useT(ELECTION_DAYS_LABEL);
  const geoContext = useT(GEO_CONTEXT);
  const goldLinkLabel = useT(GEO_TO_GOLD_LABEL);
  const pageTitle = useT(POLITICS_PAGE_TITLE);
  const electionSectionTitle = useT(ELECTION_SECTION_TITLE);
  const geoSectionTitle = useT(GEO_SECTION_TITLE);
  const riskMeterLabel = useT(GEO_RISK_METER_LABEL);
  const daysRelation = useT(ELECTION_DAYS_RELATION);
  const traceLabel = useT(ELECTION_TRACE_LABEL);
  const scenarioPresetsLabel = useT(UI_SCENARIO_PRESETS);
  const resetLabel = useT(UI_RESET_TO_BASELINE);

  const fundamentalsLean = driverState.fundamentalsLean ?? 0;
  const pollsLean = driverState.pollsLean ?? 0;
  const daysUntilElection = driverState.daysUntilElection ?? 90;
  const military = driverState.military ?? 0;
  const diplomatic = driverState.diplomatic ?? 0;
  const sanctions = driverState.sanctions ?? 0;

  const election = useMemo(
    () => computeElection(fundamentalsLean, pollsLean, daysUntilElection, ELECTION_REFERENCE),
    [fundamentalsLean, pollsLean, daysUntilElection]
  );
  const electionContribs = useMemo(
    () => electionContributions(fundamentalsLean, pollsLean, daysUntilElection, ELECTION_REFERENCE),
    [fundamentalsLean, pollsLean, daysUntilElection]
  );
  const riskScore = useMemo(
    () => computeGeoRisk(military, diplomatic, sanctions, GEO_REFERENCE),
    [military, diplomatic, sanctions]
  );

  const handleSendToGold = () => {
    const z = geoRiskToGoldZ(riskScore, GEO_REFERENCE);
    navigateToLinkedConcept('ml', 'gold', { geoRiskValue: z, source: 'politics-georisk' });
  };

  return (
    <div className="ml-page">
      <div className="ml-section">
        <p className="ml-section-title"><i className="ti ti-flag" aria-hidden="true" /> {pageTitle}</p>
        <p className="ml-section-sub">{politicsContext}</p>
        <div className="ml-citation-row"><MLCitation section="6.4" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{electionSectionTitle}</p>
        <p className="ml-section-sub">{electionContext}</p>

        <div className="politics-days-row">
          <div className="politics-days-head">
            <span className="dp-driver-label">{daysLabel}</span>
            <span className="dp-driver-value">{daysUntilElection}</span>
          </div>
          <input
            type="range" min="1" max={ELECTION_REFERENCE.maxDays} step="1" value={daysUntilElection}
            onChange={(e) => setDriver(DOMAIN, 'daysUntilElection', Number(e.target.value))}
            className="pg-slider dp-slider"
          />
          <p className="dp-relation">{daysRelation}</p>
        </div>

        <PredictGate
          predictId="politics-election-predict" nodeId={NODE_ID} layer="mechanism"
          question={ELECTION_PREDICT_Q} options={[ELECTION_PREDICT_FUNDAMENTALS, ELECTION_PREDICT_POLLS]} correctIndex={1}
          explain={ELECTION_PREDICT_EXPLAIN}
        >
          <DriverPanel
            drivers={ELECTION_DRIVERS}
            state={{ fundamentalsLean, pollsLean }}
            onChange={(key, v) => setDriver(DOMAIN, key, v)}
          />

          <ProbabilityGauge
            winProbability={election.winProbability}
            credibleWidth={election.credibleWidth}
            incumbentLabel={incumbentLabel}
            challengerLabel={challengerLabel}
          />

          <div className="dl-scenario-row">
            <p className="ml-lbl">{scenarioPresetsLabel}</p>
            <ScenarioPresets scenarios={ELECTION_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
            <button type="button" className="dl-reset-btn" onClick={() => resetDomain(DOMAIN)}>
              <i className="ti ti-refresh" aria-hidden="true" /> {resetLabel}
            </button>
          </div>
        </PredictGate>

        <p className="ml-lbl politics-trace-lbl">{traceLabel}</p>
        <p className="ml-body-text">{electionTraceIntro}</p>
        <TracePanel contributions={electionContribs} driversByKey={electionDriversByKey} unit="" decimals={2} />
        <div className="ml-citation-row"><MLCitation section="6.4" /></div>
      </div>

      <div className="ml-section">
        <p className="ml-section-title">{geoSectionTitle}</p>
        <p className="ml-section-sub">{geoContext}</p>

        <PredictGate
          predictId="politics-geo-predict" nodeId={NODE_ID} layer="mechanism"
          question={GEO_PREDICT_Q} options={[GEO_PREDICT_YES, GEO_PREDICT_NO]} correctIndex={1}
          explain={GEO_PREDICT_EXPLAIN}
        >
          <DriverPanel drivers={GEO_DRIVERS} state={{ military, diplomatic, sanctions }} onChange={(key, v) => setDriver(DOMAIN, key, v)} />

          <GeoRiskMeter riskScore={riskScore} label={riskMeterLabel} onSendToGold={handleSendToGold} buttonLabel={goldLinkLabel} />

          <div className="dl-scenario-row">
            <p className="ml-lbl">{scenarioPresetsLabel}</p>
            <ScenarioPresets scenarios={GEO_SCENARIOS} onApply={(state) => applyScenario(DOMAIN, state)} />
          </div>
        </PredictGate>
        <div className="ml-citation-row"><MLCitation section="6.4" /></div>
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
