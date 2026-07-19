import { useState } from 'react';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { UI_PREDICT_FIRST_LBL, UI_PREDICT_COMPARE_TEMPLATE } from '../../../data/ml/uiStrings.js';
import { useT, resolveT } from '../../../lib/mlContent.js';
import './PredictGate.css';

// The Constructive Thought Loop (docs/research/ML-Mode-Pedagogy-Research.md
// §4.2), as one reusable component: Predict (question + options, gates the
// content below) -> Explore (children become interactive once answered) ->
// Compare (guess vs. actual, shown immediately since the correct direction
// is static/known) -> Explain (one line tying the gap, if any, to why).
// children are always mounted (never unmount/remount on answer) so any
// slider/chart state underneath survives the reveal.
export default function PredictGate({
  predictId, nodeId, layer = 'mechanism', question, options, correctIndex, explain, variant = 'card', children,
}) {
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);
  const recordPrediction = useUnderstandingStore((s) => s.recordPrediction);
  const markLayerEngaged = useUnderstandingStore((s) => s.markLayerEngaged);
  const existing = useUnderstandingStore((s) => s.predictions[predictId]);
  const [justAnswered, setJustAnswered] = useState(null);

  const questionText = useT(question);
  const explainText = useT(explain);
  const predictFirstLbl = useT(UI_PREDICT_FIRST_LBL);
  const compareTemplate = useT(UI_PREDICT_COMPARE_TEMPLATE);
  const optionTexts = options.map((o) => resolveT(o, level, lang));

  const resolved = existing || justAnswered;

  function choose(index) {
    const correct = index === correctIndex;
    recordPrediction(predictId, index, correct);
    if (nodeId) markLayerEngaged(nodeId, layer);
    setJustAnswered({ guessIndex: index, correct });
  }

  let compareBefore = compareTemplate, compareMiddle = '', compareAfter = '';
  if (resolved) {
    const [before, afterGuess] = compareTemplate.split('{guess}');
    const [middle, after] = afterGuess.split('{actual}');
    compareBefore = before;
    compareMiddle = middle;
    compareAfter = after;
  }

  return (
    <div className={`predict-gate predict-gate-${variant}`}>
      {!resolved && (
        <div className="predict-gate-scrim">
          <div className="predict-gate-card">
            <p className="predict-gate-lbl"><i className="ti ti-bulb" aria-hidden="true" /> {predictFirstLbl}</p>
            <p className="predict-gate-question">{questionText}</p>
            <div className="predict-gate-options">
              {optionTexts.map((text, i) => (
                <button key={i} type="button" className="predict-gate-opt" onClick={() => choose(i)}>{text}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={`predict-gate-body${resolved ? '' : ' predict-gate-body-dimmed'}`}>
        {children}
      </div>
      {resolved && (
        <div className={`predict-gate-compare${resolved.correct ? ' predict-gate-correct' : ' predict-gate-wrong'}`}>
          <span className="predict-gate-compare-row">
            <i className={`ti ${resolved.correct ? 'ti-check' : 'ti-x'}`} aria-hidden="true" />
            {compareBefore}<strong>{optionTexts[resolved.guessIndex]}</strong>{compareMiddle}<strong>{optionTexts[correctIndex]}</strong>{compareAfter}
          </span>
          {explainText && <span className="predict-gate-explain">{explainText}</span>}
        </div>
      )}
    </div>
  );
}
