import { canSpeak, speak } from '../../lib/notation.js';
import './SayIt.css';

/**
 * How to read a piece of notation aloud — “f of x”, “x bar”, “sigma squared”
 * — so every symbol has a name a learner can say, search for and recognise
 * in a lecture. The speaker button plays the reading in the browser's own
 * voice, and is left out where the browser has none.
 */
export default function SayIt({ text, compact = false, label = true }) {
  if (!text) return null;
  return (
    <span className={`say-it${compact ? ' is-compact' : ''}`}>
      {label && <span className="say-it-label">Say</span>}
      <q className="say-it-text">{text}</q>
      {canSpeak() && (
        <button type="button" className="say-it-btn" onClick={() => speak(text)} aria-label={`Hear it: ${text}`} title="Hear it">
          <i className="ti ti-volume" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
