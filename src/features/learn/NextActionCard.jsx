import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { hashFor } from '../../app/pages.js';
import './path.css';

/**
 * A link to an action's target. A saved place resumes exactly; a step of a
 * lesson opens at that step (as Resume does, without moving the saved place);
 * anything else is an ordinary link.
 */
export function ActionLink({ target, className, children }) {
  const href = target.page === 'learn/lesson' ? hashFor('learn/lesson', { lessonId: target.params.lessonId }) : hashFor(target.page, target.params);
  const lesson = target.page === 'learn/lesson' ? lessonById[target.params.lessonId] : null;
  const loc = target.loc ?? (lesson && target.sectionId ? { courseId: lesson.course, lessonId: lesson.id, sectionId: target.sectionId, fraction: 0 } : null);
  const go = (e) => {
    if (!loc || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    useStudyResumeStore.getState().requestResume({ ...loc, at: loc.at ?? Date.now() });
  };
  return <a className={className} href={href} onClick={go}>{children}</a>;
}

const minutes = (m) => (m ? <span className="next-minutes">about {m} min</span> : null);

/**
 * One next action, rendered the same way wherever it appears: an optional
 * headline (a gap or a bridge says so before the button), the primary action
 * with its time, at most two other choices, and why — collapsed to "Why
 * this?" when `compact`.
 */
export default function NextActionCard({ action, primary = true, compact = true, headline = true, extra = null }) {
  if (!action?.target) return null;
  const why = (
    <>
      {action.reasons.length > 0 && <ul className="path-reasons">{action.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      {action.warnings.length > 0 && (
        <ul className="path-warnings" aria-label="Not written yet, and other notes">
          {action.warnings.map((w) => <li key={w}><i className="ti ti-alert-triangle" aria-hidden="true" /> {w}</li>)}
        </ul>
      )}
    </>
  );
  const flagged = action.kind === 'content-gap' || action.kind === 'bridge' || action.kind === 'path-finished';
  return (
    <div className="path-next next-action" data-kind={action.kind} data-rule={action.evidence.ruleId}>
      {headline && flagged && action.headline && <p className="next-headline"><strong>{action.headline}</strong></p>}
      {headline && flagged && <p className="next-reason">{action.reason}</p>}
      <div className="studio-row">
        <ActionLink target={action.target} className={`studio-btn${primary ? ' studio-btn-primary' : ''} path-next-go`}>{action.label}</ActionLink>
        {minutes(action.estimatedMinutes)}
      </div>
      {action.alternatives.length > 0 && (
        <div className="studio-row next-alternatives" role="group" aria-label="Other choices">
          {action.alternatives.map((a) => (
            <ActionLink key={`${a.kind}-${a.label}`} target={a.target} className="studio-btn">{a.label}{a.estimatedMinutes ? ` (${a.estimatedMinutes} min)` : ''}</ActionLink>
          ))}
          {extra}
        </div>
      )}
      {!action.alternatives.length && extra && <div className="studio-row">{extra}</div>}
      {compact && (action.reasons.length || action.warnings.length) ? (
        <details className="path-why">
          <summary>Why this?</summary>
          {why}
        </details>
      ) : why}
    </div>
  );
}
