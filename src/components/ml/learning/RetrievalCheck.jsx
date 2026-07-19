import { useState } from 'react';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { UI_RETRIEVAL_LBL, UI_SHOW_ANSWER_BTN } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './RetrievalCheck.css';

// The Critical Frontier layer's retrieval-practice question (Testing Effect,
// docs/research/ML-Mode-Pedagogy-Research.md §1) — the learner is asked to
// recall the answer themselves before it's revealed, not shown it directly.
export default function RetrievalCheck({ nodeId, question, answer }) {
  const [revealed, setRevealed] = useState(false);
  const markLayerEngaged = useUnderstandingStore((s) => s.markLayerEngaged);
  const lbl = useT(UI_RETRIEVAL_LBL);
  const q = useT(question);
  const a = useT(answer);
  const showBtn = useT(UI_SHOW_ANSWER_BTN);

  return (
    <div className="retrieval-check">
      <p className="retrieval-check-lbl"><i className="ti ti-brain" aria-hidden="true" /> {lbl}</p>
      <p className="retrieval-check-question">{q}</p>
      {!revealed ? (
        <button
          type="button" className="retrieval-check-btn"
          onClick={() => { setRevealed(true); if (nodeId) markLayerEngaged(nodeId, 'criticalFrontier'); }}
        >
          {showBtn}
        </button>
      ) : (
        <p className="retrieval-check-answer"><i className="ti ti-check" aria-hidden="true" /> {a}</p>
      )}
    </div>
  );
}
