import { useUIStore } from '../../../store/useUIStore.js';

// Clicking Estimation surfaces the direct connection to Stats mode's own
// Gibbs/PGAS estimation content — the research doc's explicit design note
// (§7.5) that this pairing is "the best candidate for a literal shared node
// between Stats mode and ML mode." Full interaction lives in Module 10;
// this is the first cross-link into it.
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
        This is exactly the kind of object Stats mode's Gibbs/PGAS estimation content already produces — a
        parameter with a posterior distribution around it, not a single guess about the future.
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
