import { useState } from 'react';
import { useUnderstandingStore, DREYFUS_STAGES } from '../../../store/useUnderstandingStore.js';
import { DREYFUS_LABELS, UI_UNDERSTANDING_TITLE, UI_UNDERSTANDING_STAT_TEMPLATE } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './UnderstandingTrackerBadge.css';

// The Understanding Tracker (docs/research/ML-Mode-Pedagogy-Research.md
// §4.3) as a persistent, unobtrusive header element — a mirror, not a gate:
// it never blocks any content, and clicking it only ever shows more detail,
// never a lock.
export default function UnderstandingTrackerBadge() {
  const [open, setOpen] = useState(false);
  const layersByNode = useUnderstandingStore((s) => s.layersByNode);
  const stage = useUnderstandingStore((s) => s.getStage());
  const title = useT(UI_UNDERSTANDING_TITLE);
  const stageLabel = useT(DREYFUS_LABELS[stage]);
  const statTemplate = useT(UI_UNDERSTANDING_STAT_TEMPLATE);

  const nodeIds = Object.keys(layersByNode);
  const nodesTouched = nodeIds.length;
  const nodesAtFrontier = nodeIds.filter((id) => layersByNode[id].includes('criticalFrontier')).length;
  const stageIndex = DREYFUS_STAGES.indexOf(stage);

  return (
    <div className="understanding-badge-wrap">
      <button type="button" className="understanding-badge" onClick={() => setOpen((o) => !o)}>
        <i className="ti ti-chart-arcs" aria-hidden="true" />
        <span className="understanding-badge-stage">{stageLabel}</span>
      </button>
      {open && (
        <div className="understanding-popover">
          <p className="understanding-popover-title">{title}</p>
          <div className="understanding-popover-track">
            {DREYFUS_STAGES.map((s, i) => (
              <span key={s} className={`understanding-popover-dot${i <= stageIndex ? ' filled' : ''}`} />
            ))}
          </div>
          <p className="understanding-popover-stage">{stageLabel}</p>
          <p className="understanding-popover-stat">
            {statTemplate.replace('{touched}', nodesTouched).replace('{frontier}', nodesAtFrontier)}
          </p>
        </div>
      )}
    </div>
  );
}
