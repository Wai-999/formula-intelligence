import { useUIStore } from '../../../store/useUIStore.js';

// Clicking Estimation surfaces the direct connection to Stats mode's own
// estimation content. The research doc's §7.5 originally cited "your
// existing Stats/Gibbs/PGAS content" for this pairing — checked against
// src/data/nodes.js while building Module 10 and no such content exists in
// Stats mode. What's real is Chapter 7's t-distribution confidence
// interval for the mean (ci_mean_t), which is what this now references.
// Full interaction lives in Module 10; this is the first cross-link into it.
export default function EstimationDemo() {
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);

  return (
    <div className="epc-demo">
      <p className="ml-lbl">Same coefficient, Stats-mode lens</p>
      <div className="epc-coef-card">
        <span className="epc-coef-value">β = −312</span>
        <span className="epc-coef-ci">95% CI [−400, −224]</span>
      </div>
      <p className="ml-body-text">
        A frequentist confidence interval like Stats mode's own t CI for the mean treats the parameter as fixed
        and the interval as random. A posterior distribution flips that: the parameter itself is treated as
        uncertain. Same-looking interval, different meaning underneath.
      </p>
      <button
        type="button"
        className="epc-bridge-btn"
        onClick={() => navigateToLinkedConcept('ml', 'bridge', { from: 'pipeline-estimation' })}
      >
        <i className="ti ti-arrows-right-left" aria-hidden="true" />
        See this compared side-by-side in the Stats ↔ ML Bridge
      </button>
    </div>
  );
}
