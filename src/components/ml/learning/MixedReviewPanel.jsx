import { useState } from 'react';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import { MIXED_REVIEW_QUESTIONS } from '../../../data/ml/mixedReview.js';
import {
  UI_MIXED_REVIEW_LBL, UI_NEXT_QUESTION_BTN, UI_MIXED_REVIEW_COLLAPSE, UI_MIXED_REVIEW_EXPAND,
  UI_PREDICT_COMPARE_TEMPLATE,
} from '../../../data/ml/uiStrings.js';
import { useT, resolveT } from '../../../lib/mlContent.js';
import './MixedReviewPanel.css';

// Interleaving (D.4): a small, recurring cross-domain panel, not a one-time
// end-of-mode quiz — mounted once at the ML shell level (not per-page) so it
// persists across tab switches, surfacing only once the learner has visited
// 2+ of Gold/Macro/Micro/Politics, and only asking questions whose domains
// they've actually seen.
export default function MixedReviewPanel() {
  const domainsVisited = useUnderstandingStore((s) => s.domainsVisited);
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);
  const [collapsed, setCollapsed] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState(null);

  const lbl = useT(UI_MIXED_REVIEW_LBL);
  const nextBtn = useT(UI_NEXT_QUESTION_BTN);
  const collapseLbl = useT(UI_MIXED_REVIEW_COLLAPSE);
  const expandLbl = useT(UI_MIXED_REVIEW_EXPAND);
  const compareTemplate = useT(UI_PREDICT_COMPARE_TEMPLATE);

  const domainCount = ['gold', 'macro', 'micro', 'politics'].filter((d) => domainsVisited.includes(d)).length;
  if (domainCount < 2) return null;

  const eligible = MIXED_REVIEW_QUESTIONS.filter((q) => q.domains.every((d) => domainsVisited.includes(d)));
  if (eligible.length === 0) return null;
  const q = eligible[qIndex % eligible.length];
  const questionText = resolveT(q.question, level, lang);
  const optionTexts = q.options.map((o) => resolveT(o, level, lang));
  const explainText = resolveT(q.explanation, level, lang);

  function choose(i) {
    setAnswered({ guessIndex: i, correct: i === q.correctIndex });
  }
  function nextQuestion() {
    setAnswered(null);
    setQIndex((i) => i + 1);
  }

  if (collapsed) {
    return (
      <button type="button" className="mixed-review-collapsed" onClick={() => setCollapsed(false)}>
        <i className="ti ti-shuffle" aria-hidden="true" /> {expandLbl}
      </button>
    );
  }

  let compareBefore = compareTemplate, compareMiddle = '', compareAfter = '';
  if (answered) {
    const [before, afterGuess] = compareTemplate.split('{guess}');
    const [middle, after] = afterGuess.split('{actual}');
    compareBefore = before; compareMiddle = middle; compareAfter = after;
  }

  return (
    <div className="mixed-review-panel">
      <div className="mixed-review-head">
        <p className="mixed-review-lbl"><i className="ti ti-shuffle" aria-hidden="true" /> {lbl}</p>
        <button type="button" className="mixed-review-collapse-btn" onClick={() => setCollapsed(true)}>{collapseLbl}</button>
      </div>
      <p className="mixed-review-question">{questionText}</p>
      {!answered ? (
        <div className="mixed-review-options">
          {optionTexts.map((text, i) => (
            <button key={i} type="button" className="mixed-review-opt" onClick={() => choose(i)}>{text}</button>
          ))}
        </div>
      ) : (
        <div className={`mixed-review-result${answered.correct ? ' correct' : ' wrong'}`}>
          <span className="mixed-review-result-row">
            <i className={`ti ${answered.correct ? 'ti-check' : 'ti-x'}`} aria-hidden="true" />
            {compareBefore}<strong>{optionTexts[answered.guessIndex]}</strong>{compareMiddle}<strong>{optionTexts[q.correctIndex]}</strong>{compareAfter}
          </span>
          <p className="mixed-review-explain">{explainText}</p>
          <button type="button" className="mixed-review-next-btn" onClick={nextQuestion}>{nextBtn}</button>
        </div>
      )}
    </div>
  );
}
