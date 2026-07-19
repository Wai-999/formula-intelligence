import { useState } from 'react';
import {
  EPC_SORT_TITLE, EPC_SORT_INTRO, EPC_SORT_ITEMS, EPC_SORT_CHECK_BTN, EPC_SORT_CORRECT_LBL, EPC_SORT_ACTUAL_TEMPLATE,
  EPC_COLUMNS,
} from '../../../data/ml/estimationPredictionCausal.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import { useT, resolveT } from '../../../lib/mlContent.js';
import './EstimationPredictionSort.css';

const BUCKETS = ['estimation', 'prediction', 'causal'];

// The mission's required Predict step for this panel: sort six example
// questions into Estimation/Prediction/Causal Inference before revealing
// which bucket each actually belongs to — the Constructive Thought Loop
// (D.2) applied to a classification exercise rather than a single guess.
export default function EstimationPredictionSort() {
  const [assignments, setAssignments] = useState({});
  const [checked, setChecked] = useState(false);
  const markLayerEngaged = useUnderstandingStore((s) => s.markLayerEngaged);
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);

  const title = useT(EPC_SORT_TITLE);
  const intro = useT(EPC_SORT_INTRO);
  const checkBtn = useT(EPC_SORT_CHECK_BTN);
  const correctLbl = useT(EPC_SORT_CORRECT_LBL);
  const actualTemplate = useT(EPC_SORT_ACTUAL_TEMPLATE);
  const bucketLabels = Object.fromEntries(EPC_COLUMNS.map((c) => [c.id, resolveT(c.label, level, lang)]));

  const allAssigned = EPC_SORT_ITEMS.every((item) => assignments[item.id]);
  const correctCount = EPC_SORT_ITEMS.filter((item) => assignments[item.id] === item.correctBucket).length;

  function assign(itemId, bucket) {
    setAssignments((a) => ({ ...a, [itemId]: bucket }));
  }

  function check() {
    setChecked(true);
    markLayerEngaged('pipeline-epc', 'mechanism');
  }

  return (
    <div className="epc-sort">
      <p className="ml-lbl">{title}</p>
      <p className="ml-body-text">{intro}</p>
      <div className="epc-sort-items">
        {EPC_SORT_ITEMS.map((item) => {
          const text = resolveT(item.text, level, lang);
          const picked = assignments[item.id];
          const isCorrect = picked === item.correctBucket;
          return (
            <div key={item.id} className="epc-sort-item">
              <p className="epc-sort-item-text">{text}</p>
              <div className="epc-sort-buckets">
                {BUCKETS.map((b) => (
                  <button
                    key={b} type="button"
                    className={`epc-sort-bucket-btn${picked === b ? ' selected' : ''}${checked && picked === b ? (isCorrect ? ' correct' : ' wrong') : ''}`}
                    onClick={() => !checked && assign(item.id, b)}
                    disabled={checked}
                  >
                    {bucketLabels[b]}
                  </button>
                ))}
              </div>
              {checked && (
                <p className={`epc-sort-result${isCorrect ? ' correct' : ' wrong'}`}>
                  <i className={`ti ${isCorrect ? 'ti-check' : 'ti-x'}`} aria-hidden="true" />
                  {isCorrect ? correctLbl : actualTemplate.replace('{bucket}', bucketLabels[item.correctBucket])}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button type="button" className="epc-sort-check-btn" disabled={!allAssigned} onClick={check}>{checkBtn}</button>
      ) : (
        <p className="epc-sort-score">{correctCount} / {EPC_SORT_ITEMS.length}</p>
      )}
    </div>
  );
}
