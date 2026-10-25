import { hashFor } from '../../app/pages.js';
import './ViewSwitch.css';

/**
 * One page, several views (V4: three formula-practice tabs became Formula
 * drills; two notebook tabs became Notebook). Each view is a real address —
 * "#practice/formulas/quiz" — so it can be bookmarked, Back works, and the
 * keep-alive host keeps each view's own state.
 */
export function ViewSwitch({ label, page, param, views, current }) {
  return (
    <nav className="view-switch" aria-label={label}>
      <ul>
        {views.map((v) => (
          <li key={v.id}>
            <a href={hashFor(page, { [param]: v.id })} className={v.id === current ? 'on' : ''} aria-current={v.id === current ? 'page' : undefined}>
              {v.icon && <i className={`ti ${v.icon}`} aria-hidden="true" />} {v.label}
            </a>
          </li>
        ))}
      </ul>
      {views.find((v) => v.id === current)?.hint && <p className="view-switch-hint">{views.find((v) => v.id === current).hint}</p>}
    </nav>
  );
}

/** A page made of a switch bar above one view that fills the rest. */
export function ViewPage({ switcher, children }) {
  return (
    <div className="view-page">
      {switcher}
      <div className="view-body">{children}</div>
    </div>
  );
}
