import { useId, useState } from 'react';
import MathText from '../../../components/math/MathText.jsx';
import { toPlainText } from '../../../lib/mathFormat.js';

/**
 * Predict before reveal (§6.6): commit to an answer first, then see the
 * explanation and the misconception it targets. A prediction is not graded
 * as evidence — its job is to make the explanation land, and penalising a
 * wrong guess would teach learners not to guess.
 */
export default function PredictCard({ predict }) {
  const [choice, setChoice] = useState(null);
  const [locked, setLocked] = useState(false);
  const id = useId();
  const right = locked && choice === predict.answer;

  return (
    <div className="predict-card">
      <MathText as="p" className="predict-prompt" text={predict.prompt} />
      <fieldset className="item-choices" disabled={locked}>
        <legend className="visually-hidden">Your prediction</legend>
        {predict.choices.map((c, i) => (
          <label key={i} className={`item-choice${choice === i ? ' on' : ''}${locked && i === predict.answer ? ' answer' : ''}`}>
            <input type="radio" name={`${id}-p`} aria-label={toPlainText(c)} checked={choice === i} onChange={() => setChoice(i)} />
            <MathText text={c} />
          </label>
        ))}
      </fieldset>
      {!locked && (
        <button type="button" className="studio-btn studio-btn-small" disabled={choice === null} onClick={() => setLocked(true)}>
          Lock in my prediction
        </button>
      )}
      <div role="status" aria-live="polite">
        {locked && (
          <div className="predict-reveal">
            <p className="item-verdict">{right ? 'Your prediction was right.' : 'Not what you predicted — which is exactly when this matters.'}</p>
            <MathText as="p" text={predict.reveal} />
            {predict.misconception && (
              <div className="studio-callout studio-callout-warn predict-misconception">
                <p className="studio-eyebrow">Common misconception</p>
                <MathText as="p" text={`“${predict.misconception.belief}”`} />
                <MathText as="p" text={predict.misconception.correction} />
              </div>
            )}
            <button type="button" className="studio-btn studio-btn-small" onClick={() => { setLocked(false); setChoice(null); }}>Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
