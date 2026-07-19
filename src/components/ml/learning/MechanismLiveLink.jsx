import { useUIStore } from '../../../store/useUIStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { UI_TRY_LIVE_ELSEWHERE } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './MechanismLiveLink.css';

// Mechanism layer for models that already have a real, working interactive
// counterpart elsewhere in ML mode — a cross-link into that existing
// surface rather than a redundant toy widget (see BUILD_LOG.md's Phase 1
// note). Uses a plain tab switch (no payload), since there's nothing to
// hand off beyond "go look at the live version."
export default function MechanismLiveLink({ mechanism, nodeId }) {
  const setMLActiveTab = useUIStore((s) => s.setMLActiveTab);
  const markLayerEngaged = useUnderstandingStore((s) => s.markLayerEngaged);
  const label = useT(mechanism.label);
  const tryLiveText = useT(UI_TRY_LIVE_ELSEWHERE);

  function goToLive() {
    setMLActiveTab(mechanism.module);
    if (nodeId) markLayerEngaged(nodeId, 'mechanism');
  }

  return (
    <div className="mechanism-live-link">
      <p className="ml-body-text">{tryLiveText}</p>
      <button type="button" className="mechanism-live-link-btn" onClick={goToLive}>
        <i className="ti ti-external-link" aria-hidden="true" /> {label}
      </button>
    </div>
  );
}
