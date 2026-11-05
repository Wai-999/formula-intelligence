import { hrefFor } from './usePathState.js';
import './path.css';

/**
 * One learning-path recommendation (src/lib/learningPath.js), rendered the
 * same way wherever it appears: the primary action, why it was chosen, what
 * is honestly missing, and the other choices. Pages pass the engine's answer;
 * none of them decides what comes next.
 *
 *   primary   false when the page already has a primary action
 *   compact   reasons collapse into a "Why this?" disclosure
 */
export default function PathNext({ rec, primary = true, compact = false, showAlternatives = true, extra = null }) {
  if (!rec?.target) return null;
  const why = (
    <>
      {rec.reasons.length > 0 && <ul className="path-reasons">{rec.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      {rec.warnings.length > 0 && (
        <ul className="path-warnings" aria-label="Not written yet, and other notes">
          {rec.warnings.map((w) => <li key={w}><i className="ti ti-alert-triangle" aria-hidden="true" /> {w}</li>)}
        </ul>
      )}
    </>
  );
  return (
    <div className="path-next" data-status={rec.status}>
      <div className="studio-row">
        <a className={`studio-btn${primary ? ' studio-btn-primary' : ''} path-next-go`} href={hrefFor(rec.target)}>{rec.label}</a>
        {showAlternatives && rec.alternatives.map((a) => (
          <a key={`${a.kind}-${a.label}`} className="studio-btn" href={hrefFor(a.target)} data-kind={a.kind}>{a.label}</a>
        ))}
        {extra}
      </div>
      {compact && (rec.reasons.length || rec.warnings.length) ? (
        <details className="path-why">
          <summary>Why this?</summary>
          {why}
        </details>
      ) : why}
    </div>
  );
}
